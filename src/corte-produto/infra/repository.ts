import { Inject } from '@nestjs/common';
import { ICorteProdutoRepository } from '../domain/repositories/ICorteProduto.repository';
import { DRIZZLE_PROVIDER } from 'src/_shared/infra/drizzle/drizzle.constants';
import { type DrizzleClient } from 'src/_shared/infra/drizzle/drizzle.provider';
import { corteMercadoria, palete } from 'src/_shared/infra/drizzle';
import { and, desc, eq, exists, gte, inArray, lte, SQL } from 'drizzle-orm';
import { CorteMercadoriaDto } from '../dto/corte.create.dto';
import { FindAllMercadoriaUpdateDto } from '../dto/corte.update.dto';
import { CorteMercadoriaGetDto } from '../dto/corte.get.dto';

export class CorteProdutoRepositoryDrizzle implements ICorteProdutoRepository {
  constructor(@Inject(DRIZZLE_PROVIDER) private readonly db: DrizzleClient) {}

  async findTransporteByPaleteId(
    paleteId: string,
  ): Promise<string | undefined> {
    const transporteId = await this.db
      .select()
      .from(palete)
      .where(eq(palete.id, paleteId));
    return transporteId[0]?.transporteId;
  }

  async create(
    corteProduto: CorteMercadoriaDto[],
    criadoPorId: string,
    centerId: string,
  ): Promise<void> {
    const corteProdutoData = corteProduto.map((corte) => ({
      ...corte,
      atualizadoEm: new Date().toISOString(),
      criadoPorId: criadoPorId,
      centerId: centerId,
    }));
    await this.db.insert(corteMercadoria).values(corteProdutoData);
  }

  async findAll(
    centerId: string,
    params: FindAllMercadoriaUpdateDto,
  ): Promise<CorteMercadoriaGetDto[]> {
    const conditions: (SQL<unknown> | undefined)[] = [];

    conditions.push(eq(corteMercadoria.centerId, centerId));

    if (params?.transporteId) {
      conditions.push(eq(corteMercadoria.transporteId, params.transporteId));
    }

    if (params?.produto) {
      conditions.push(eq(corteMercadoria.produto, params.produto));
    }

    if (params?.lote) {
      conditions.push(eq(corteMercadoria.lote, params.lote));
    }

    if (params?.motivo) {
      conditions.push(eq(corteMercadoria.motivo, params.motivo));
    }

    if (params?.realizado) {
      conditions.push(eq(corteMercadoria.realizado, params.realizado));
    }

    if (params?.direcao) {
      conditions.push(eq(corteMercadoria.direcao, params.direcao));
    }

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
            .from(corteMercadoria)
            .where(
              and(
                gte(corteMercadoria.criadoEm, dataInicio.toISOString()),
                lte(corteMercadoria.criadoEm, dataFim.toISOString()),
              ),
            ),
        ),
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const info = await this.db
      .select()
      .from(corteMercadoria)
      .where(whereClause);

    return info;
  }

  async confirmarCorte(id: string, confirmadoPorId: string): Promise<void> {
    await this.db
      .update(corteMercadoria)
      .set({ realizado: true, realizadoPorId: confirmadoPorId })
      .where(eq(corteMercadoria.id, Number(id)));
  }

  async confirmarCortePorTransporte(
    transporteId: string,
    confirmadoPorId: string,
  ): Promise<void> {
    await this.db
      .update(corteMercadoria)
      .set({ realizado: true, realizadoPorId: confirmadoPorId })
      .where(
        and(
          eq(corteMercadoria.transporteId, transporteId),
          eq(corteMercadoria.realizado, false),
        ),
      );
  }

  async findByTransporteId(
    transporteIds: string[],
  ): Promise<CorteMercadoriaGetDto[]> {
    return await this.db
      .select()
      .from(corteMercadoria)
      .where(inArray(corteMercadoria.transporteId, transporteIds))
      .orderBy(desc(corteMercadoria.criadoEm));
  }
}
