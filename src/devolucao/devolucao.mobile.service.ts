import { Inject, Injectable } from '@nestjs/common';
import { and, eq, or } from 'drizzle-orm';

import {
  devolucaoDemanda,
  devolucaoItens,
  devolucaoNotas,
} from 'src/_shared/infra/drizzle';
import { DRIZZLE_PROVIDER } from 'src/_shared/infra/drizzle/drizzle.constants';
import { type DrizzleClient } from 'src/_shared/infra/drizzle/drizzle.provider';
import { MinioService } from 'src/_shared/infra/minio/minio.service';
import { ListarDemandasDto } from './dto/demanda/listar-demandas.dto';
import { EntradaDto, ItensContabilDto } from './dto/mobile/itensContabil.dto';
import { agruparPorTipoSkuEDevolucao } from './utils/agruparESomarItens';
import { StartDemandaDto } from './dto/mobile/startDemanda.dto';
import { AddConferenciaCegaDto } from './dto/mobile/addConferenciaCega.dto';

@Injectable()
export class DevolucaoMobileService {
  constructor(
    @Inject(MinioService)
    private readonly minioService: MinioService,
    @Inject(DRIZZLE_PROVIDER) private readonly db: DrizzleClient,
  ) {}

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
    return await this.db
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
}
