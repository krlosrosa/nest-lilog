import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { liteAnomalia, liteValidacao } from 'src/_shared/infra/drizzle';
import { DRIZZLE_PROVIDER } from 'src/_shared/infra/drizzle/drizzle.constants';
import { type DrizzleClient } from 'src/_shared/infra/drizzle/drizzle.provider';
import { CreateContagemDto } from './dto/contagem/create-contagem.dto';
import { GetContagemDto } from './dto/contagem/get-contagem.dto';
import { and, eq, ilike, sql } from 'drizzle-orm';
import { ResumoContagemLiteDto } from './dto/contagem/resumo-contamge.dto';
import { GetAnomaliaContagemDto } from './dto/contagem/get-anomalia-contagem.dto';

@Injectable()
export class ContagemService {
  constructor(@Inject(DRIZZLE_PROVIDER) private readonly db: DrizzleClient) {}

  async create(createContagemDto: CreateContagemDto[]): Promise<void> {
    await this.db.insert(liteValidacao).values(createContagemDto);
  }

  async getEndereco(endereco: string): Promise<GetContagemDto[]> {
    if (!endereco) {
      throw new BadRequestException('Endereço é obrigatório');
    }
    if (endereco.length < 10) {
      throw new BadRequestException(
        'Endereço deve ter pelo menos 10 caracteres',
      );
    }

    const search = `%${endereco}%`;

    const enderecoResult = await this.db
      .select()
      .from(liteValidacao)
      .where(ilike(liteValidacao.endereco, search))
      .orderBy(
        sql`SUBSTRING(${liteValidacao.endereco}, LENGTH(${liteValidacao.endereco}) - 1)`,
      );
    return enderecoResult;
  }

  async validarEndereco(
    endereco: string,
    centerId: string,
    contadoPor: string,
  ): Promise<boolean> {
    await this.db
      .update(liteValidacao)
      .set({
        validado: true,
        contadoPor: contadoPor,
        horaRegistro: new Date().toISOString(),
      })
      .where(
        and(
          eq(liteValidacao.endereco, endereco),
          eq(liteValidacao.centroId, centerId),
        ),
      );
    return true;
  }

  async resumoContagemLite(centerId: string): Promise<ResumoContagemLiteDto[]> {
    const query = await this.db
      .select({
        endereco_base: sql<string>`split_part(${liteValidacao.endereco}, ' ', 1) || ' ' || split_part(${liteValidacao.endereco}, ' ', 2)`,
        total_enderecos: sql<number>`count(*)`,
        enderecos_validados: sql<number>`count(*) FILTER (WHERE ${liteValidacao.validado} = true)`,
      })
      .from(liteValidacao)
      .where(eq(liteValidacao.centroId, centerId))
      .groupBy(
        sql<string>`split_part(${liteValidacao.endereco}, ' ', 1) || ' ' || split_part(${liteValidacao.endereco}, ' ', 2)`,
      )
      .orderBy(
        sql<string>`split_part(${liteValidacao.endereco}, ' ', 1) || ' ' || split_part(${liteValidacao.endereco}, ' ', 2)`,
      );

    return query;
  }

  async deleteContagemLite(centerId: string): Promise<void> {
    await this.db
      .delete(liteValidacao)
      .where(eq(liteValidacao.centroId, centerId));
  }

  async relatorioAnomaliasContagemLite(
    centerId: string,
    dataReferencia: string,
  ): Promise<GetAnomaliaContagemDto[]> {
    const query = await this.db
      .select()
      .from(liteAnomalia)
      .where(
        and(
          eq(liteAnomalia.centroId, centerId),
          eq(liteAnomalia.dataReferencia, sql`${dataReferencia}::date`),
        ),
      );
    return query;
  }
}
