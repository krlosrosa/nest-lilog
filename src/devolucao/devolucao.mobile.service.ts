import { Inject, Injectable } from '@nestjs/common';
import { and, eq, or } from 'drizzle-orm';

// Tipo para arquivos Multer compatível com Express 5
type MulterFile = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
  destination?: string;
  filename?: string;
  path?: string;
};
import {
  devolucaImagens,
  devolucaoAnomalias,
  devolucaoCheckList,
  devolucaoDemanda,
  devolucaoItens,
  devolucaoNotas,
} from 'src/_shared/infra/drizzle';
import { DRIZZLE_PROVIDER } from 'src/_shared/infra/drizzle/drizzle.constants';
import { type DrizzleClient } from 'src/_shared/infra/drizzle/drizzle.provider';
import { MinioService } from 'src/_shared/infra/minio/minio.service';
import { ListarDemandasDto } from './dto/demanda/listar-demandas.dto';
import { AddCheckListDto } from './dto/mobile/checkList.dto';
import { EntradaDto, ItensContabilDto } from './dto/mobile/itensContabil.dto';
import { agruparPorTipoSkuEDevolucao } from './utils/agruparESomarItens';
import { StartDemandaDto } from './dto/mobile/startDemanda.dto';
import { AddConferenciaCegaDto } from './dto/mobile/addConferenciaCega.dto';
import { AnomaliaDevolucaoDto } from './dto/mobile/anomaliaDevolucao.dto';

@Injectable()
export class DevolucaoMobileService {
  constructor(
    @Inject(MinioService)
    private readonly minioService: MinioService,
    @Inject(DRIZZLE_PROVIDER) private readonly db: DrizzleClient,
  ) {}

  async addCheckList(
    info: AddCheckListDto,
    demandaId: string,
    fotoAberto: MulterFile,
    fotoFechado: MulterFile,
  ): Promise<void> {
    const bauAbertoUrl = await this.minioService.upload(
      'devolucaochecklist',
      `${demandaId}-bau-aberto.${fotoAberto.mimetype.split('/')[1]}`,
      fotoAberto.buffer,
      fotoAberto.mimetype,
    );

    const bauFechadoUrl = await this.minioService.upload(
      'devolucaochecklist',
      `${demandaId}-bau-fechado.${fotoFechado.mimetype.split('/')[1]}`,
      fotoFechado.buffer,
      fotoFechado.mimetype,
    );

    const urls = [bauAbertoUrl.etag, bauFechadoUrl.etag];

    const inserImgs = urls.map((url) => ({
      demandaId: Number(demandaId),
      processo: 'devolucao-checklist',
      tag: url,
    }));

    await this.db.transaction(async (tx) => {
      await tx.insert(devolucaoCheckList).values({
        demandaId: Number(demandaId),
        temperaturaBau: Number(info.temperaturaBau),
        temperaturaProduto: Number(info.temperaturaProduto),
        anomalias: [],
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString(),
      });
      await tx.insert(devolucaImagens).values(inserImgs);
    });
  }

  async startDemanda(
    demanda: StartDemandaDto,
    accountId: string,
  ): Promise<ItensContabilDto[]> {
    await this.db
      .update(devolucaoDemanda)
      .set({
        status: 'EM_CONFERENCIA',
        inicioConferenciaEm: new Date().toISOString(),
        conferenteId: accountId,
        doca: demanda.doca,
      })
      .where(eq(devolucaoDemanda.id, Number(demanda.demandaId)));

    const itensContabeis = await this.getItensContabilizados(
      demanda.demandaId.toString(),
    );

    return itensContabeis;
  }

  async listarDemandasEmAberto(
    centerId: string,
    accountId: string,
  ): Promise<ListarDemandasDto[]> {
    return this.db
      .select()
      .from(devolucaoDemanda)
      .where(
        and(
          eq(devolucaoDemanda.centerId, centerId),
          or(
            and(
              eq(devolucaoDemanda.status, 'EM_CONFERENCIA'),
              eq(devolucaoDemanda.conferenteId, accountId),
            ),
            eq(devolucaoDemanda.status, 'AGUARDANDO_CONFERENCIA'),
          ),
        ),
      );
  }

  async getItensContabilizados(demandaId: string): Promise<ItensContabilDto[]> {
    const itens = await this.db.query.devolucaoNotas.findMany({
      where: eq(devolucaoNotas.devolucaoDemandaId, Number(demandaId)),
      with: {
        devolucaoItens: true,
      },
    });

    const subItens: EntradaDto[] = itens.flatMap((d) => {
      return d.devolucaoItens.map((i) => {
        return {
          ...i,
          tipoDevolucao: d.tipo === 'REENTREGA' ? 'REENTREGA' : 'RETORNO',
        };
      });
    });
    const itensAgrupados = agruparPorTipoSkuEDevolucao(subItens);

    return itensAgrupados;
  }

  async addConferenciaFisica(
    demandaId: string,
    conferencia: AddConferenciaCegaDto[],
  ) {
    const withTipo = conferencia.map((item) => ({
      ...item,
      tipo: 'FISICO' as 'CONTABIL' | 'FISICO',
      demandaId: Number(demandaId),
    }));
    await this.db.transaction(async (tx) => {
      await tx
        .delete(devolucaoItens)
        .where(
          and(
            eq(devolucaoItens.demandaId, Number(demandaId)),
            eq(devolucaoItens.tipo, 'FISICO'),
          ),
        );
      await tx.insert(devolucaoItens).values(withTipo);
    });
  }

  async finalizarDemanda(demandaId: string): Promise<void> {
    await this.db
      .update(devolucaoDemanda)
      .set({
        status: 'CONFERENCIA_FINALIZADA',
        finalizadoEm: new Date().toISOString(),
      })
      .where(eq(devolucaoDemanda.id, Number(demandaId)));
  }

  async getDemandaById(demandaId: string): Promise<string> {
    const data = await this.db.query.devolucaoDemanda.findFirst({
      where: eq(devolucaoDemanda.id, Number(demandaId)),
    });

    return data?.status || '';
  }

  async addAnomaliaDevolucao(
    anomalia: AnomaliaDevolucaoDto,
    imagens: MulterFile[],
  ): Promise<void> {
    await this.db.transaction(async (tx) => {
      const fotosUrls = await Promise.all(
        imagens.map(async (foto, index) => {
          return await this.minioService.upload(
            'devolucaoanomalias',
            `${anomalia.demandaId}-${anomalia.sku}-${index}.${foto.mimetype.split('/')[1]}`,
            foto.buffer,
            foto.mimetype,
          );
        }),
      );

      const urls = fotosUrls.map((url) => url.etag);

      await tx.insert(devolucaoAnomalias).values({
        demandaId: anomalia.demandaId,
        sku: anomalia.sku,
        descricao: anomalia.descricao,
        lote: anomalia.lote,
        tipo: anomalia.tipo,
        natureza: anomalia.natureza,
        causa: anomalia.causa,
        quantidadeCaixas: anomalia.quantidadeCaixas,
        quantidadeUnidades: anomalia.quantidadeUnidades,
        atualizadoEm: new Date().toISOString(),
        criadoEm: new Date().toISOString(),
      });

      await tx.insert(devolucaImagens).values(
        urls.map((url) => ({
          demandaId: anomalia.demandaId,
          processo: 'devolucao-anomalias',
          tag: url,
        })),
      );
    });
  }
}
