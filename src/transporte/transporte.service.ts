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
import {
  GetTransporteDto,
  TransporteComRelacionamentosGetDto,
} from './dto/transporte.get.dto';
import { ListarClientesDto } from './dto/listarClientes.dto';
import { TipoEvento } from 'src/_shared/enums/tipoEvento.enum';
import { type ICargaParadaRepository } from './domain/repository/ICargaParadaInterface';
import { CreateCargaParadaDto } from './dto/cargaParada/createCargaParada.dto';
import { type ITransporteRepository } from './domain/repository/ITransporte.interface';

interface HoraHoraResult {
  hora: number;
  totalCarregados: number;
}

@Injectable()
export class TransporteService {
  constructor(
    @Inject(DRIZZLE_PROVIDER) private readonly db: DrizzleClient,
    private readonly redis: RedisService,
    @Inject('ICargaParadaRepository')
    private readonly cargaParadaRepository: ICargaParadaRepository,
    @Inject('ITransporteRepository')
    private readonly transporteRepository: ITransporteRepository,
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
    itens.forEach((item) => {
      pipeline.set(
        `transporte:${item.key}`,
        item.value,
        'EX',
        14 * 24 * 60 * 60,
      );
    });
    await pipeline.exec();
  }

  async horaAHoraTransporte(
    data: string,
    centerId: string,
    tipoEvento: TipoEvento = TipoEvento.TERMINO_CARREGAMENTO,
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

    // 2. Total de carros CARREGADOS POR HORA nesse dia (Resultado Esparso)
    // O campo 'hora' será um número (0 a 23)
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
          eq(historicoStatusTransporte.tipoEvento, tipoEvento),

          // Filtra o TRANSPORTE pela data de expedição (o "dia" principal)
          gte(transporte.dataExpedicao, inicioDiaISO),
          lte(transporte.dataExpedicao, fimDiaISO),
        ),
      )
      // Agrupa os resultados pelo campo "hora" que criamos
      .groupBy(campoHora)
      // A ordenação aqui não é estritamente necessária, mas ajuda na depuração
      .orderBy(campoHora);

    // ---------------------------------------------------------------------
    // 3. PÓS-PROCESSAMENTO EM TYPESCRIPT: Definir Range, Preencher Gaps e Ordenar
    // ---------------------------------------------------------------------

    const countsMap = new Map<number, number>();
    carregadosPorHora.forEach((item) => {
      // Garante que 'hora' seja tratado como número
      countsMap.set(Number(item.hora), item.totalCarregados);
    });

    // 3a. Determinar o intervalo de horas ou usar a hora atual como fallback
    if (carregadosPorHora.length === 0) {
      // Caso 1: Nenhuma informação registrada. Retorna a hora atual com 0.

      // Determina a hora atual no fuso 'America/Sao_Paulo'
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        hourCycle: 'h23', // Garante o formato 0-23
        timeZone: 'America/Sao_Paulo',
      });
      const spHourString = formatter.format(now);
      const currentHourSP = parseInt(spHourString, 10);

      // Retorno com apenas a hora atual e total 0
      return {
        totalTransportes: totalTransportesDia,
        horaHora: [{ hora: currentHourSP, totalCarregados: 0 }],
      } as ResultadoHoraHoraDto;
    } else {
      // Caso 2: Registros encontrados. Definir min e max baseados nos dados.

      const hours = carregadosPorHora.map((item) => Number(item.hora));

      // Determinar o menor e maior valor de hora *registrados*
      const minRegisteredHour = Math.min(...hours);
      const maxRegisteredHour = Math.max(...hours);

      // Heurística para detectar o "wrap-around" (operação noturna que cruza meia-noite)
      // Se houver registros muito próximos de 23h (>= 20) E registros muito próximos de 0h (<= 5),
      // assumimos que é uma operação que cruza a meia-noite e precisa de ordenação especial.
      const hasLateNight = hours.some((h) => h >= 20); // Ex: 20, 21, 22, 23
      const hasEarlyMorning = hours.some((h) => h <= 12); // Ex: 0, 1, 2, 3, 4, 5

      const hoursSequence: number[] = [];

      if (hasLateNight && hasEarlyMorning) {
        // Cenário 2: O intervalo atravessa a meia-noite (Exemplo: 22h a 4h)

        // Encontra a primeira hora "alta" que marca o início do ciclo noturno
        const startHour = Math.min(...hours.filter((h) => h >= 20));

        // Encontra a última hora "baixa" que marca o fim do ciclo matinal
        const endHour = Math.max(...hours.filter((h) => h <= 12));

        // 1. Horas do dia anterior (startHour até 23h)
        for (let h = startHour; h <= 23; h++) {
          hoursSequence.push(h);
        }
        // 2. Horas do dia atual (0h até endHour)
        for (let h = 0; h <= endHour; h++) {
          hoursSequence.push(h);
        }
      } else {
        // Cenário 1: O intervalo é contínuo (ex: 8h a 17h, OU 20h a 23h, OU 0h a 4h)
        // A ordem é simplesmente minRegisteredHour até maxRegisteredHour
        for (let h = minRegisteredHour; h <= maxRegisteredHour; h++) {
          hoursSequence.push(h);
        }
      }

      // 3c. Preencher a sequência com os totais ou 0.
      const fullDayData: HoraHoraResult[] = hoursSequence.map((hour) => ({
        hora: hour,
        totalCarregados: countsMap.get(hour) || 0,
      }));

      // Retorna o objeto formatado com o range dinâmico e preenchido
      return {
        totalTransportes: totalTransportesDia,
        horaHora: fullDayData,
      } as ResultadoHoraHoraDto;
    }
  }

  async addPaletesInTransporte(
    paletes: PaleteCreateDataDto[],
    accountId: string,
  ) {
    const transportesIds = paletes.map((palete) => palete.transporteId);
    const tiposProcessos: DemandaProcesso[] = [
      ...new Set(paletes.map((item) => item.tipoProcesso as DemandaProcesso)),
    ];
    const paletesEmTransporte = await this.db
      .select()
      .from(palete)
      .where(
        and(
          inArray(palete.transporteId, transportesIds),
          inArray(palete.tipoProcesso, tiposProcessos),
        ),
      );
    if (paletesEmTransporte.length > 0) {
      const paletesIds = paletesEmTransporte.map((palete) => palete.id);
      await this.db.delete(palete).where(inArray(palete.id, paletesIds));
    }
    const paletesWithAccountId = paletes.map((palete) => ({
      ...palete,
      criadoPorId: accountId,
      atualizadoEm: new Date().toISOString(),
    }));

    const historicoImpressaoMapaValues = paletesWithAccountId.map((palete) => ({
      tipoImpressao: palete.tipoProcesso as DemandaProcesso,
      transporteId: palete.transporteId,
      impressoPorId: accountId,
      impressoEm: new Date().toISOString(),
    }));

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

    await this.db
      .insert(historicoImpressaoMapa)
      .values(Array.from(historicoUnico.values()));
    await this.db.insert(palete).values(paletesWithAccountId);
  }

  async createCargaParada(cargaParada: CreateCargaParadaDto) {
    await this.cargaParadaRepository.createCargaParada(cargaParada);
  }

  async getInfoTransporteByTransportId(
    transportId: string,
  ): Promise<GetTransporteDto | null> {
    return this.cargaParadaRepository.getInfoTransporteByTransportId(
      transportId,
    );
  }

  async trocarDataExpedicaoTransporte(
    transporteIds: string[],
    dataExpedicao: string,
  ) {
    await this.transporteRepository.trocarDataExpedicaoTransportes(
      transporteIds,
      dataExpedicao,
    );
  }
}
