import { DRIZZLE_PROVIDER } from 'src/_shared/infra/drizzle/drizzle.constants';
import { ICargaParadaRepository } from '../domain/repository/ICargaParadaInterface';
import { type DrizzleClient } from 'src/_shared/infra/drizzle/drizzle.provider';
import { Inject, NotFoundException } from '@nestjs/common';
import {
  palete,
  transporte,
  transporteCargaParada,
} from 'src/_shared/infra/drizzle';
import { CreateCargaParadaDto } from '../dto/cargaParada/createCargaParada.dto';
import { eq } from 'drizzle-orm';
import { GetTransporteDto } from '../dto/transporte.get.dto';

export class CargaParadaRepositoryDrizzle implements ICargaParadaRepository {
  constructor(@Inject(DRIZZLE_PROVIDER) private readonly db: DrizzleClient) {}

  async createCargaParada(cargaParada: CreateCargaParadaDto): Promise<void> {
    const infoTransporte = await this.db
      .select()
      .from(transporte)
      .where(
        eq(transporte.numeroTransporte, cargaParada.transportId as string),
      );
    if (!infoTransporte) {
      throw new NotFoundException('Transporte não encontrado');
    }
    await this.db
      .update(transporte)
      .set({
        cargaParada: true,
      })
      .where(
        eq(transporte.numeroTransporte, cargaParada.transportId as string),
      );

    await this.db.insert(transporteCargaParada).values({
      ...cargaParada,
      dataExpedicao: infoTransporte[0].dataExpedicao,
    });
  }

  async getInfoTransporteByTransportId(
    transportId: string,
  ): Promise<GetTransporteDto | null> {
    if (transportId.length > 11) {
      const result = await this.db
        .select()
        .from(transporte)
        .leftJoin(palete, eq(palete.transporteId, transporte.numeroTransporte))
        .where(eq(palete.id, transportId)); // <-- filtrar por paleteId

      if (!result || result.length === 0) {
        return null;
      }

      return result[0].Transporte;
    }

    const infoTransporte = await this.db
      .select()
      .from(transporte)
      .where(eq(transporte.numeroTransporte, transportId));
    return infoTransporte[0];
  }
}
