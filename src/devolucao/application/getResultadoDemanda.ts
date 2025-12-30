import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE_PROVIDER } from 'src/_shared/infra/drizzle/drizzle.constants';
import { type DrizzleClient } from 'src/_shared/infra/drizzle/drizzle.provider';
import {
  ItensDto,
  NotasDto,
  ResultadoDemandaDto,
} from '../dto/demanda/resultado-demanda.dto';
import { eq } from 'drizzle-orm';
import {
  devolucaoDemanda,
  devolucaoItens,
  devolucaoNotas,
} from 'src/_shared/infra/drizzle';
import { TipoDevolucaoNotas } from 'src/_shared/enums/devolucao/devolucao.type';
import { GetItensDto } from '../dto/demanda/listar-items.dto';

@Injectable()
export class GetResultadoDemanda {
  constructor(@Inject(DRIZZLE_PROVIDER) private readonly db: DrizzleClient) {}

  async execute(demandaId: number): Promise<ResultadoDemandaDto> {
    const demanda = await this.db.query.devolucaoDemanda.findFirst({
      where: eq(devolucaoDemanda.id, demandaId),
      with: {
        user_conferenteId: true,
        user_adicionadoPorId: true,
      },
    });

    const notasBanco = await this.db.query.devolucaoNotas.findMany({
      where: eq(devolucaoNotas.devolucaoDemandaId, demandaId),
    });

    const itensBanco = await this.db.query.devolucaoItens.findMany({
      where: eq(devolucaoItens.demandaId, demandaId),
    });

    const itens: ItensDto[] = resumirItens(itensBanco);

    const notas: NotasDto[] = notasBanco.map((nota) => ({
      notaFiscal: nota.notaFiscal,
      notaFiscalParcial: nota.nfParcial ?? '',
      descMotivoDevolucao: nota.descMotivoDevolucao ?? '',
      viagemId: nota.idViagemRavex ?? '',
      tipo: nota.tipo as TipoDevolucaoNotas,
    }));

    return {
      demandaId: demandaId,
      placa: demanda?.placa ?? '',
      motorista: demanda?.motorista ?? '',
      transportadora: demanda?.idTransportadora ?? '',
      doca: demanda?.doca ?? '',
      criadoPor: demanda?.user_adicionadoPorId?.name ?? '',
      conferente: demanda?.user_conferenteId?.name ?? '',
      criadoEm: demanda?.criadoEm ?? '',
      LiberadoParaConferenciaEm: demanda?.liberadoParaConferenciaEm ?? '',
      InicioConferenciaEm: demanda?.inicioConferenciaEm ?? '',
      FimConferenciaEm: demanda?.fimConferenciaEm ?? '',
      FinalizadoEm: demanda?.finalizadoEm ?? '',
      Status: demanda?.status ?? '',
      FechouComAnomalia: demanda?.fechouComAnomalia ?? false,
      notas: notas,
      itens: itens,
    };
  }
}

function resumirItens(itens: GetItensDto[]): ItensDto[] {
  const agrupadoPorSku = new Map<
    string,
    {
      sku: string;
      descricao: string;
      quantidadeCaixasContabil: number;
      quantidadeUnidadesContabil: number;
      quantidadeCaixasFisico: number;
      quantidadeUnidadesFisico: number;
      avariaCaixas: number;
      avariaUnidades: number;
    }
  >();

  for (const item of itens) {
    const sku = item.sku;
    const tipo = item.tipo;
    const quantidadeCaixas = item.quantidadeCaixas ?? 0;
    const quantidadeUnidades = item.quantidadeUnidades ?? 0;
    const avariaCaixas = item.avariaCaixas ?? 0;
    const avariaUnidades = item.avariaUnidades ?? 0;

    if (!agrupadoPorSku.has(sku)) {
      agrupadoPorSku.set(sku, {
        sku,
        descricao: item.descricao,
        quantidadeCaixasContabil: 0,
        quantidadeUnidadesContabil: 0,
        quantidadeCaixasFisico: 0,
        quantidadeUnidadesFisico: 0,
        avariaCaixas: 0,
        avariaUnidades: 0,
      });
    }

    const itemAgrupado = agrupadoPorSku.get(sku)!;

    if (tipo === 'CONTABIL') {
      itemAgrupado.quantidadeCaixasContabil += quantidadeCaixas;
      itemAgrupado.quantidadeUnidadesContabil += quantidadeUnidades;
    } else if (tipo === 'FISICO') {
      itemAgrupado.quantidadeCaixasFisico += quantidadeCaixas;
      itemAgrupado.quantidadeUnidadesFisico += quantidadeUnidades;
    }

    itemAgrupado.avariaCaixas += avariaCaixas;
    itemAgrupado.avariaUnidades += avariaUnidades;
  }

  return Array.from(agrupadoPorSku.values()).map((item) => ({
    sku: item.sku,
    descricao: item.descricao,
    quantidadeCaixasContabil: item.quantidadeCaixasContabil,
    quantidadeUnidadesContabil: item.quantidadeUnidadesContabil,
    quantidadeCaixasFisico: item.quantidadeCaixasFisico,
    quantidadeUnidadesFisico: item.quantidadeUnidadesFisico,
    saldoCaixas: item.quantidadeCaixasFisico - item.quantidadeCaixasContabil,
    saldoUnidades:
      item.quantidadeUnidadesFisico - item.quantidadeUnidadesContabil,
    avariaCaixas: item.avariaCaixas,
    avariaUnidades: item.avariaUnidades,
  }));
}
