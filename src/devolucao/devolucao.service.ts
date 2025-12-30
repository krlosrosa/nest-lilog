import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { GetInfoByViagemIdRavex } from './application/getInfoByViagemIdRavex';
import { ReturnInfoGeralRavex } from './dto/returnInfoGeralRavex';
import { DRIZZLE_PROVIDER } from 'src/_shared/infra/drizzle/drizzle.constants';
import { type DrizzleClient } from 'src/_shared/infra/drizzle/drizzle.provider';
import {
  devolucaoDemanda,
  devolucaoItens,
  devolucaoNotas,
} from 'src/_shared/infra/drizzle';
import { AddDemandaDto } from './dto/demanda/add-demanda.dto';
import { gerarSenha } from './utils/gerarSenha';
import { ListarDemandasDto } from './dto/demanda/listar-demandas.dto';
import { and, eq, sql } from 'drizzle-orm';
import { AddNotaDto } from './dto/demanda/add-nota.dto';
import { GetNotasDto } from './dto/demanda/get-notas.dto';
import { GetResultadoDemanda } from './application/getResultadoDemanda';
import { ResultadoDemandaDto } from './dto/demanda/resultado-demanda.dto';

@Injectable()
export class DevolucaoService {
  constructor(
    @Inject(GetInfoByViagemIdRavex)
    private readonly getInfoByViagemIdRavex: GetInfoByViagemIdRavex,
    @Inject(GetResultadoDemanda)
    private readonly getResultadoDemandaService: GetResultadoDemanda,
    @Inject(DRIZZLE_PROVIDER) private readonly db: DrizzleClient,
  ) {}

  async getInfoByViagemId(viagemId: string): Promise<ReturnInfoGeralRavex> {
    return this.getInfoByViagemIdRavex.execute(viagemId);
  }

  async addDemanda(
    addDemandaDto: AddDemandaDto,
    centerId: string,
    adicionadoPorId: string,
  ): Promise<string> {
    const demandaId = await this.db
      .insert(devolucaoDemanda)
      .values({
        placa: addDemandaDto.placa,
        motorista: addDemandaDto.motorista,
        idTransportadora: addDemandaDto.idTransportadora,
        viagemId: addDemandaDto.viagemId,
        telefone: addDemandaDto.telefone,
        cargaSegregada: addDemandaDto.cargaSegregada,
        quantidadePaletes: addDemandaDto.paletesRetorno,
        doca: addDemandaDto.doca,
        senha: gerarSenha(),
        centerId,
        adicionadoPorId,
        atualizadoEm: new Date().toISOString(),
      })
      .returning({ id: devolucaoDemanda.id });

    return demandaId[0].id.toString();
  }

  async listarDemandas(
    centerId: string,
    data: string,
  ): Promise<ListarDemandasDto[]> {
    return this.db
      .select()
      .from(devolucaoDemanda)
      .where(
        and(
          eq(devolucaoDemanda.centerId, centerId),
          sql`${devolucaoDemanda.criadoEm}::date = ${data}`,
        ),
      )
      .orderBy(devolucaoDemanda.criadoEm);
  }

  async getDemandaById(id: string): Promise<ListarDemandasDto> {
    const demanda = await this.db
      .select()
      .from(devolucaoDemanda)
      .where(eq(devolucaoDemanda.id, Number(id)));
    if (!demanda) {
      throw new NotFoundException('Demanda não encontrada');
    }
    return demanda[0];
  }

  async addNota(addNotaDto: AddNotaDto): Promise<void> {
    const addDemanda = {
      empresa: addNotaDto.empresa,
      devolucaoDemandaId: addNotaDto.devolucaoDemandaId,
      notaFiscal: addNotaDto.notaFiscal,
      motivoDevolucao: addNotaDto.motivoDevolucao,
      descMotivoDevolucao: addNotaDto.descMotivoDevolucao,
      nfParcial: addNotaDto.nfParcial,
      idViagemRavex: addNotaDto.idViagemRavex,
      tipo: addNotaDto.tipo,
      atualizadoEm: new Date().toISOString(),
      criadoEm: new Date().toISOString(),
    };
    await this.db.transaction(async (tx) => {
      const notaId = await tx
        .insert(devolucaoNotas)
        .values({
          ...addDemanda,
        })
        .returning({ id: devolucaoNotas.id });
      const ItensNota = addNotaDto.itens.map((item) => ({
        ...item,
        devolucaoNotasId: addNotaDto.notaFiscal,
        demandaId: addNotaDto.devolucaoDemandaId,
        atualizadoEm: new Date().toISOString(),
        criadoEm: new Date().toISOString(),
        tipo: 'CONTABIL' as const,
        sku: item.sku,
        descricao: item.descricao,
        lote: item.lote,
        fabricacao: item.fabricacao?.toString(),
        sif: item.sif,
        quantidadeCaixas: item.quantidadeCaixas,
        quantidadeUnidades: item.quantidadeUnidades,
        avariaCaixas: item.avariaCaixas,
        notaId: notaId[0].id,
      }));
      await tx.insert(devolucaoItens).values(ItensNota);
    });
  }

  async getNotaByNfAndIdViagem(
    nf: string,
    idViagem: string,
  ): Promise<string | null> {
    const nota = await this.db
      .select()
      .from(devolucaoNotas)
      .where(
        and(
          eq(devolucaoNotas.notaFiscal, nf),
          eq(devolucaoNotas.idViagemRavex, idViagem),
        ),
      );
    if (!nota) {
      return null;
    }
    return nota[0].id.toString();
  }

  async getNotasByDemandaId(demandaId: string): Promise<GetNotasDto[]> {
    const notas = await this.db
      .select()
      .from(devolucaoNotas)
      .where(eq(devolucaoNotas.devolucaoDemandaId, Number(demandaId)));
    return notas;
  }

  async liberarDemanda(demandaId: string): Promise<void> {
    await this.db
      .update(devolucaoDemanda)
      .set({
        status: 'AGUARDANDO_CONFERENCIA',
        liberadoParaConferenciaEm: new Date().toISOString(),
      })
      .where(eq(devolucaoDemanda.id, Number(demandaId)));
  }

  async removerNota(id: string): Promise<void> {
    await this.db.transaction(async (tx) => {
      await tx.delete(devolucaoNotas).where(eq(devolucaoNotas.id, Number(id)));
      await tx
        .delete(devolucaoItens)
        .where(eq(devolucaoItens.notaId, Number(id)));
    });
  }

  async deletarDemanda(id: string): Promise<void> {
    await this.db
      .delete(devolucaoDemanda)
      .where(eq(devolucaoDemanda.id, Number(id)));
  }

  async reabrirDemanda(id: string): Promise<void> {
    await this.db
      .update(devolucaoDemanda)
      .set({
        status: 'EM_CONFERENCIA',
      })
      .where(eq(devolucaoDemanda.id, Number(id)));
  }

  async finalizarDemanda(id: string): Promise<void> {
    await this.db
      .update(devolucaoDemanda)
      .set({
        status: 'FINALIZADO',
        finalizadoEm: new Date().toISOString(),
      })
      .where(eq(devolucaoDemanda.id, Number(id)));
  }

  async getResultadoDemanda(id: string): Promise<ResultadoDemandaDto> {
    return this.getResultadoDemandaService.execute(Number(id));
  }
}
