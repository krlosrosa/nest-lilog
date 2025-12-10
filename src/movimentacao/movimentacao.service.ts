import { Inject, Injectable } from '@nestjs/common';
import { CreateMovimentacaoDto } from './dto/create-movimentacao.dto';
import { UpdateMovimentacaoDto } from './dto/update-movimentacao.dto';
import { type DrizzleClient } from 'src/_shared/infra/drizzle/drizzle.provider';
import { DRIZZLE_PROVIDER } from 'src/_shared/infra/drizzle/drizzle.constants';
import { movimentacao } from 'src/_shared/infra/drizzle';
import { and, asc, eq } from 'drizzle-orm';
import { GetMovimentacaoDto } from './dto/get-movimentacao.dto';

@Injectable()
export class MovimentacaoService {
  constructor(@Inject(DRIZZLE_PROVIDER) private readonly db: DrizzleClient) {}

  async create(
    createMovimentacaoDto: CreateMovimentacaoDto[],
  ): Promise<GetMovimentacaoDto> {
    console.log({ createMovimentacaoDto });

    const movimentacoes = createMovimentacaoDto.map((movimentacaoItem) => ({
      ...movimentacaoItem,
      status: 'pendente',
      idUsuario: '421931',
    }));
    const movimentacaoResult = await this.db
      .insert(movimentacao)
      .values(movimentacoes)
      .returning();
    return movimentacaoResult[0];
  }

  async findAllPeding(centerId: string): Promise<GetMovimentacaoDto[]> {
    const listResult = await this.db
      .select()
      .from(movimentacao)
      .where(
        and(
          eq(movimentacao.idCentro, centerId),
          eq(movimentacao.status, 'pendente'),
        ),
      );
    return listResult;
  }

  async getNextMovimentacao(centerId: string): Promise<GetMovimentacaoDto> {
    const nextMovimentacaoResult = await this.db
      .select()
      .from(movimentacao)
      .where(
        and(
          eq(movimentacao.idCentro, centerId),
          eq(movimentacao.status, 'pendente'),
        ),
      )
      .orderBy(asc(movimentacao.prioridade))
      .limit(1);
    return nextMovimentacaoResult[0];
  }

  async findOne(id: number): Promise<GetMovimentacaoDto> {
    const movimentacaoResult = await this.db
      .select()
      .from(movimentacao)
      .where(eq(movimentacao.idMov, id));
    return movimentacaoResult[0];
  }

  async update(id: number, updateMovimentacaoDto: UpdateMovimentacaoDto) {
    await this.db
      .update(movimentacao)
      .set({
        ...updateMovimentacaoDto,
      })
      .where(eq(movimentacao.idMov, id));
    return `This action updates a #${id} movimentacao`;
  }

  async remove(id: number) {
    await this.db.delete(movimentacao).where(eq(movimentacao.idMov, id));
  }

  async validateMovimentacao(id: number, userId: string): Promise<boolean> {
    const movimentacaoResult = await this.db
      .update(movimentacao)
      .set({
        status: 'executada',
        dataExecucao: new Date().toISOString(),
        executadoPor: userId,
      })
      .where(eq(movimentacao.idMov, id))
      .returning();
    return movimentacaoResult.length > 0;
  }

  async cadastrarAnomalia(id: number, userId: string): Promise<boolean> {
    const anomaliaResult = await this.db
      .update(movimentacao)
      .set({
        status: 'anomalia',
        dataExecucao: new Date().toISOString(),
        executadoPor: userId,
      })
      .where(eq(movimentacao.idMov, id))
      .returning();
    return anomaliaResult.length > 0;
  }
}
