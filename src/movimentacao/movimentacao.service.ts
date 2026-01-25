import { Inject, Injectable } from '@nestjs/common';
import { CreateMovimentacaoDto } from './dto/create-movimentacao.dto';
import { UpdateMovimentacaoDto } from './dto/update-movimentacao.dto';
import { type DrizzleClient } from 'src/_shared/infra/drizzle/drizzle.provider';
import { DRIZZLE_PROVIDER } from 'src/_shared/infra/drizzle/drizzle.constants';
import {
  liteAnomalia,
  liteValidacao,
  movimentacao,
} from 'src/_shared/infra/drizzle';
import { and, asc, desc, eq, or } from 'drizzle-orm';
import { GetMovimentacaoDto } from './dto/get-movimentacao.dto';
import { CreateAnomaliaContagemLiteDto } from './dto/contagem/create-anomalia-validacao.dto';

@Injectable()
export class MovimentacaoService {
  constructor(@Inject(DRIZZLE_PROVIDER) private readonly db: DrizzleClient) {}

  async create(
    createMovimentacaoDto: CreateMovimentacaoDto[],
  ): Promise<GetMovimentacaoDto> {
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

  async getNextMovimentacao(
    centerId: string,
    userId: string,
  ): Promise<GetMovimentacaoDto> {
    const nextMovimentacaoResult = await this.db
      .select()
      .from(movimentacao)
      .where(
        and(
          eq(movimentacao.idCentro, centerId),
          eq(movimentacao.executadoPor, userId),
          or(
            eq(movimentacao.status, 'pendente'),
            eq(movimentacao.status, 'iniciada'),
          ),
        ),
      )
      .orderBy(desc(movimentacao.status), asc(movimentacao.prioridade))
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
        idMov: id,
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

  async registerStartMovement(id: number): Promise<boolean> {
    const startMovementResult = await this.db
      .update(movimentacao)
      .set({
        status: 'iniciada',
        iniciado: new Date().toISOString(),
      })
      .where(eq(movimentacao.idMov, id))
      .returning();
    return startMovementResult.length > 0;
  }

  async addAnomaliaContagemLite(
    centerId: string,
    endereco: string,
    cadastradoPor: string,
    createAnomaliaContagemLiteDto: CreateAnomaliaContagemLiteDto,
  ): Promise<boolean> {
    await this.db.transaction(async (tx) => {
      await tx.insert(liteAnomalia).values({
        centroId: centerId,
        endereco: endereco,
        addPor: cadastradoPor,
        dataReferencia: createAnomaliaContagemLiteDto?.dataReferencia,
        lote: createAnomaliaContagemLiteDto?.lote || '',
        sku: createAnomaliaContagemLiteDto?.sku || '',
        quantidade: createAnomaliaContagemLiteDto?.quantidade || 0,
        peso: createAnomaliaContagemLiteDto?.peso?.toString() || '0',
      });

      await tx
        .update(liteValidacao)
        .set({
          validado: true,
          contadoPor: cadastradoPor,
          horaRegistro: new Date().toISOString(),
        })
        .where(eq(liteValidacao.endereco, endereco));
    });

    await this.db.insert(liteAnomalia).values({
      centroId: centerId,
      endereco: endereco,
      addPor: cadastradoPor,
      dataReferencia: new Date().toISOString(),
      lote: createAnomaliaContagemLiteDto?.lote || '',
      sku: createAnomaliaContagemLiteDto?.sku || '',
      quantidade: createAnomaliaContagemLiteDto?.quantidade || 0,
      peso: createAnomaliaContagemLiteDto?.peso?.toString() || '0',
    });
    return true;
  }
}
