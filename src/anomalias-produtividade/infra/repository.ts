import { DRIZZLE_PROVIDER } from 'src/_shared/infra/drizzle/drizzle.constants';
import { IRegistroAnomaliaProdutividadeRepository } from '../domain/repository/IRegistroAnomalia';
import { type DrizzleClient } from 'src/_shared/infra/drizzle/drizzle.provider';
import { AnomaliaProdutividadeCreateData } from '../dto/anomaliaProdutividade.create.dto';
import { anomaliaProdutividade } from 'src/_shared/infra/drizzle';
import { Inject } from '@nestjs/common';
import { AnomaliaProdutividadeUpdateDataWithDateStartAndEnd } from '../dto/anomaliaProdutividade.update.dto';
import { AnomaliaProdutividadeGetData } from '../dto/anomaliaProdutividade.get.dto';
import { and, eq, exists, gte, ilike, lte, SQL } from 'drizzle-orm';

export class AnomaliaProdutividadeRepositoryDrizzle
  implements IRegistroAnomaliaProdutividadeRepository
{
  constructor(@Inject(DRIZZLE_PROVIDER) private readonly db: DrizzleClient) {}

  async create(
    registroAnomalia: AnomaliaProdutividadeCreateData,
  ): Promise<void> {
    await this.db.insert(anomaliaProdutividade).values(registroAnomalia);
  }

  async getAllAnomalias(
    centerId: string,
    params: AnomaliaProdutividadeUpdateDataWithDateStartAndEnd,
  ): Promise<AnomaliaProdutividadeGetData[]> {
    const conditions: (SQL<unknown> | undefined)[] = [];

    conditions.push(eq(anomaliaProdutividade.centerId, centerId));

    if (params?.inicio && params?.fim) {
      // Converte a data recebida para o início do dia (00:00:00.000)
      const dataInicio = new Date(params.inicio);
      dataInicio.setHours(0, 0, 0, 0);

      // Converte a data recebida para o final do dia (23:59:59.999)
      const dataFim = new Date(params.fim);
      dataFim.setHours(23, 59, 59, 999);
      conditions.push(
        exists(
          this.db
            .select()
            .from(anomaliaProdutividade)
            .where(
              and(
                gte(anomaliaProdutividade.inicio, dataInicio.toISOString()),
                lte(anomaliaProdutividade.inicio, dataFim.toISOString()),
              ),
            ),
        ),
      );
    }

    if (params?.motivoAnomalia) {
      conditions.push(
        ilike(
          anomaliaProdutividade.motivoAnomalia,
          `%${params.motivoAnomalia}%`,
        ),
      );
    }

    if (params?.funcionarioId) {
      conditions.push(
        eq(anomaliaProdutividade.funcionarioId, params.funcionarioId),
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const anomalias = await this.db
      .select()
      .from(anomaliaProdutividade)
      .where(whereClause);
    return anomalias;
  }
}
