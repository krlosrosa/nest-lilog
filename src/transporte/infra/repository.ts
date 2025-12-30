import { Inject } from '@nestjs/common';
import { DRIZZLE_PROVIDER } from 'src/_shared/infra/drizzle/drizzle.constants';
import { type DrizzleClient } from 'src/_shared/infra/drizzle/drizzle.provider';
import { ITransporteRepository } from '../domain/repository/ITransporte.interface';
import { Transporte } from '../domain/entities/transporte.entity';
import { TransporteUpdateData } from '../dto/transporte.update.dto';
import { palete, transporte } from 'src/_shared/infra/drizzle';
import { and, eq, inArray } from 'drizzle-orm';
import { agruparTransportesComRelacionamentos } from '../utils/agruparTransporteComRelacionamentos';
import { agruparTransporteComTodosRelacionamentos } from '../utils/agruparTransporteComTodosRelacionamentos';
import { DemandaProcesso } from 'src/_shared/enums';
import {
  corteMercadoria,
  historicoImpressaoMapa,
  historicoStatusTransporte,
} from 'src/_shared/infra/drizzle/migrations/schema';
import { HistoricoStatusTransporteCreateData } from '../dto/historicoTransporte/historicoTransporte.create.dto';
import { TransporteComRelacionamentosGetDto } from '../dto/transporte.get.dto';

export class TransporteRepositoryDrizzle implements ITransporteRepository {
  constructor(@Inject(DRIZZLE_PROVIDER) private readonly db: DrizzleClient) {}

  async findTransportesByTransporteIds(
    transporteIds: string[],
    processo: DemandaProcesso,
  ): Promise<Transporte[]> {
    const transportes = await this.db
      .select()
      .from(transporte)
      .where(
        and(
          inArray(transporte.numeroTransporte, transporteIds),
          eq(palete.tipoProcesso, processo),
        ),
      )
      .leftJoin(palete, eq(transporte.numeroTransporte, palete.transporteId));

    const transportesData = agruparTransportesComRelacionamentos(transportes);
    return transportesData.map((transporte) => Transporte.fromData(transporte));
  }
  async findTransportesByTransporteIdsAll(
    transporteIds: string[],
  ): Promise<Transporte[]> {
    const transportes = await this.db
      .select()
      .from(transporte)
      .where(and(inArray(transporte.numeroTransporte, transporteIds)))
      .leftJoin(palete, eq(transporte.numeroTransporte, palete.transporteId));

    const transportesData = agruparTransportesComRelacionamentos(transportes);
    return transportesData.map((transporte) => Transporte.fromData(transporte));
  }

  async updateTransporte(
    transporteId: string,
    transporteParams: TransporteUpdateData,
  ): Promise<void> {
    if (transporteParams.carregamento === 'CONCLUIDO') {
      transporteParams.cargaParada = false;
    }

    await this.db
      .update(transporte)
      .set(transporteParams)
      .where(eq(transporte.numeroTransporte, transporteId));
  }

  async createHistoricoTransporte(
    historicoTransporte: HistoricoStatusTransporteCreateData,
  ): Promise<void> {
    await this.db
      .insert(historicoStatusTransporte)
      .values({ ...historicoTransporte, alteradoEm: new Date().toISOString() });
  }

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

    return agruparTransporteComTodosRelacionamentos(transporteData);
  }

  async trocarDataExpedicaoTransportes(
    transporteIds: string[],
    dataExpedicao: string,
  ): Promise<void> {
    await this.db
      .update(transporte)
      .set({ dataExpedicao: dataExpedicao, cargaParada: false })
      .where(inArray(transporte.numeroTransporte, transporteIds));
  }
}
