import { type DrizzleClient } from 'src/_shared/infra/drizzle/drizzle.provider';
import { and, eq } from 'drizzle-orm';
import { configuracaoImpressaoMapa } from 'src/_shared/infra/drizzle/migrations/schema';
import { ConfiguracaoImpressaoMapaDto } from 'src/center/dto/center/configuracaoImpressaoMapa.dto';
import { NotFoundException } from '@nestjs/common';

// 1. Defina o DTO (interface) dos filtros que esta query aceita
export interface GetConfigMapaQueryDto {
  centerId: string;
  empresa: string;
}

/**
 * Esta é a sua função de query, isolada.
 * Ela não é uma classe, não é injetável.
 * Ela recebe as dependências (db, filtros) como argumentos.
 */
export async function getConfigMapaQuery(
  db: DrizzleClient, // 2. Recebe o cliente Drizzle
  params: GetConfigMapaQueryDto, // 3. Recebe os filtros
): Promise<ConfiguracaoImpressaoMapaDto> {
  // 4. Toda a lógica da query vive aqui
  const info = await db.query.configuracaoImpressaoMapa.findFirst({
    where: and(
      eq(configuracaoImpressaoMapa.centerId, params.centerId),
      eq(configuracaoImpressaoMapa.empresa, params.empresa),
    ),
  });
  if (!info) {
    throw new NotFoundException(
      'Configuração de impressão de mapa não encontrada para o centro e empresa informados',
    );
  }
  return info;
}
