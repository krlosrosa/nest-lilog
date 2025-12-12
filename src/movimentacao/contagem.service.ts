import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { liteValidacao } from 'src/_shared/infra/drizzle';
import { DRIZZLE_PROVIDER } from 'src/_shared/infra/drizzle/drizzle.constants';
import { type DrizzleClient } from 'src/_shared/infra/drizzle/drizzle.provider';
import { CreateContagemDto } from './dto/contagem/create-contagem.dto';
import { GetContagemDto } from './dto/contagem/get-contagem.dto';
import { and, eq, ilike } from 'drizzle-orm';

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
      .where(ilike(liteValidacao.endereco, search));
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
}
