import { Inject, Injectable } from '@nestjs/common';
import { UpdateTransporteDto } from './dto/update-transporte.dto';
import { findAllTransportesWithPaletesQuery } from './infra/queries/find-all-transportes-withPaletes.query';
import { DRIZZLE_PROVIDER } from 'src/_shared/infra/drizzle/drizzle.constants';
import { type DrizzleClient } from 'src/_shared/infra/drizzle/drizzle.provider';
import { GetAllTransportesDto } from './dto/getAllTransportes.dto';
import { createTransporteBatchQuery } from './infra/queries/create-transporte-batch';
import { CreateTransporteDto } from './dto/create-transporte.dto';
import { RedisService } from 'src/_shared/infra/redis/redis.service';
import { AddItemsTransporteDto } from './dto/add-items-transporte.dto';
import { findAllTransportesQuery } from './infra/queries/find-all-transportes.query';
import {
  corteMercadoria,
  historicoImpressaoMapa,
  historicoStatusTransporte,
  palete,
  transporte,
} from 'src/_shared/infra/drizzle/migrations/schema';
import { and, count, eq, gte, inArray, lte, sql } from 'drizzle-orm';
import { PaleteCreateDataDto } from 'src/gestao-produtividade/dtos/palete/palete.create.dto';
import { ResultadoHoraHoraDto } from './dto/historicoTransporte/resultadoHoraHora.dto';
import { DemandaProcesso } from 'src/_shared/enums';
import { agruparTransporteComTodosRelacionamentos } from './utils/agruparTransporteComTodosRelacionamentos';
import { TransporteComRelacionamentosGetDto } from './dto/transporte.get.dto';
import { ListarClientesDto } from './dto/listarClientes.dto';

@Injectable()
export class TransporteService {
  constructor(
    @Inject(DRIZZLE_PROVIDER) private readonly db: DrizzleClient,
    private readonly redis: RedisService,
  ) {}

  async findTransporteByNumeroTransporte(
    numeroTransporte: string,
  ): Promise<TransporteComRelacionamentosGetDto | null> {
    const transporteData = await this.db
      .select()
      .from(transporte)
      .where(eq(transporte.numeroTransporte, numeroTransporte))
      .leftJoin(palete, eq(transporte.numeroTransporte, palete.transporteId))
      .leftJoin(
        corteMercadoria,
        eq(transporte.numeroTransporte, corteMercadoria.transporteId),
      )
      .leftJoin(
        historicoStatusTransporte,
        eq(transporte.numeroTransporte, historicoStatusTransporte.transporteId),
      )
      .leftJoin(
        historicoImpressaoMapa,
        eq(transporte.numeroTransporte, historicoImpressaoMapa.transporteId),
      );

    if (!transporteData || transporteData.length === 0) {
      return null;
    }
    const clientes = await this.getClientesByTransporte(numeroTransporte);
    const transportes =
      agruparTransporteComTodosRelacionamentos(transporteData);
    if (!transportes) {
      return null;
    }
    return {
      ...transportes,
      clientes: clientes,
    };
  }

  create(createTransporteDto: CreateTransporteDto, accountId: string) {
    return createTransporteBatchQuery(this.db, createTransporteDto, accountId);
  }

  async getClientesByTransporte(
    transporteId: string,
  ): Promise<ListarClientesDto[]> {
    const items = await this.redis.get(`transporte:${transporteId}`);
    const itemsArray = items ? JSON.parse(items) : [];

    const clientesMap = new Map<
      string,
      { cliente: string; nomeCliente: string }
    >();

    itemsArray.forEach((item: any) => {
      const cliente = item?.cliente;
      const nomeCliente = item?.nomeCliente;

      if (!cliente || !nomeCliente) {
        return;
      }

      const chave = `${cliente}-${nomeCliente}`.toLowerCase();
      if (!clientesMap.has(chave)) {
        clientesMap.set(chave, { cliente, nomeCliente });
      }
    });

    return Array.from(clientesMap.values());
  }

  findAllWithTransporte(
    body: GetAllTransportesDto,
    query: UpdateTransporteDto,
  ) {
    return findAllTransportesWithPaletesQuery(this.db, query, body.transportes);
  }

  findAllWithoutTransporte(query: UpdateTransporteDto, centerId: string) {
    return findAllTransportesQuery(this.db, query, centerId);
  }

  async addItemsToTransporte(itens: AddItemsTransporteDto[]) {
    const pipeline = this.redis.pipeline();
    pipeline.flushdb();
    itens.forEach((item) => {
      pipeline.set(
        `transporte:${item.key}`,
        item.value,
        'EX',
        1 * 24 * 60 * 60,
      );
    });
    await pipeline.exec();
  }

  async horaAHoraTransporte(
    data: string,
    centerId: string,
  ): Promise<ResultadoHoraHoraDto> {
    // Cria a data no formato UTC para evitar problemas de timezone
    const dataObj = new Date(data + 'T00:00:00.000Z');

    const inicioDia = new Date(dataObj);
    inicioDia.setUTCHours(0, 0, 0, 0);

    const fimDia = new Date(dataObj);
    fimDia.setUTCHours(23, 59, 59, 999);

    const inicioDiaISO = inicioDia.toISOString();
    const fimDiaISO = fimDia.toISOString();
    // 1. Total de carros COM EXPEDIÇÃO para o dia
    const totalTransportesQuery = await this.db
      .select({
        total: count(transporte.id),
      })
      .from(transporte)
      .where(
        and(
          eq(transporte.centerId, centerId),
          gte(transporte.dataExpedicao, inicioDiaISO),
          lte(transporte.dataExpedicao, fimDiaISO),
        ),
      );

    const totalTransportesDia = totalTransportesQuery[0]?.total || 0;

    // 2. Total de carros CARREGADOS POR HORA nesse dia
    // (Apenas de transportes com dataExpedicao nesse dia)
    const campoHora =
      sql<number>`extract(hour from ${historicoStatusTransporte.alteradoEm}::timestamp AT TIME ZONE 'UTC' AT TIME ZONE 'America/Sao_Paulo')`.as(
        'hora',
      );

    const carregadosPorHora = await this.db
      .select({
        hora: campoHora,
        totalCarregados: count(historicoStatusTransporte.id),
      })
      .from(historicoStatusTransporte)
      // Usamos innerJoin para já filtrar pelos transportes que nos interessam
      .innerJoin(
        transporte,
        and(
          eq(
            historicoStatusTransporte.transporteId,
            transporte.numeroTransporte,
          ),
          eq(transporte.centerId, centerId),
        ),
      )
      .where(
        and(
          // Filtra pelo evento que nos interessa
          eq(historicoStatusTransporte.tipoEvento, 'TERMINO_CARREGAMENTO'),
          eq(transporte.centerId, centerId),

          // Filtra o TRANSPORTE pela data de expedição (o "dia" principal)
          gte(transporte.dataExpedicao, inicioDiaISO),
          lte(transporte.dataExpedicao, fimDiaISO),
        ),
      )
      // Agrupa os resultados pelo campo "hora" que criamos
      .groupBy(campoHora)
      // Opcional: ordena pela hora para o gráfico vir pronto
      .orderBy(campoHora); // Corrigido de "campoHopscara" para "campoHora"

    // --- Início da Modificação ---

    console.log(totalTransportesDia, carregadosPorHora);
    // Retorna o array formatado
    return {
      totalTransportes: totalTransportesDia,
      horaHora: carregadosPorHora,
    };

    // --- Fim da Modificação ---

    /* Bloco anterior removido:
    // Retorna um objeto com as duas informações
    return {
      totalTransportesDia,
      carregadosPorHora,
    };
    */
  }

  async addPaletesInTransporte(
    paletes: PaleteCreateDataDto[],
    accountId: string,
  ) {
    await this.db.transaction(async (tx) => {
      const transportesIds = paletes.map((palete) => palete.transporteId);
      const paletesEmTransporte = await tx
        .select()
        .from(palete)
        .where(
          and(
            inArray(palete.transporteId, transportesIds),
            eq(palete.tipoProcesso, paletes[0].tipoProcesso as DemandaProcesso),
          ),
        );
      if (paletesEmTransporte.length > 0) {
        const paletesIds = paletesEmTransporte.map((palete) => palete.id);
        await tx.delete(palete).where(inArray(palete.id, paletesIds));
      }
      const paletesWithAccountId = paletes.map((palete) => ({
        ...palete,
        criadoPorId: accountId,
        atualizadoEm: new Date().toISOString(),
      }));

      const historicoImpressaoMapaValues = paletesWithAccountId.map(
        (palete) => ({
          tipoImpressao: palete.tipoProcesso as DemandaProcesso,
          transporteId: palete.transporteId,
          impressoPorId: accountId,
          impressoEm: new Date().toISOString(),
        }),
      );

      // Remove duplicatas considerando transporteId e tipoImpressao
      const historicoUnico = new Map<
        string,
        (typeof historicoImpressaoMapaValues)[0]
      >();
      historicoImpressaoMapaValues.forEach((item) => {
        const chave = `${item.transporteId}-${item.tipoImpressao}`;
        if (!historicoUnico.has(chave)) {
          historicoUnico.set(chave, item);
        }
      });

      await tx
        .insert(historicoImpressaoMapa)
        .values(Array.from(historicoUnico.values()));
      await tx.insert(palete).values(paletesWithAccountId);
    });
  }
}
