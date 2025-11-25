import { BadRequestException } from '@nestjs/common';
import { transporte } from 'src/_shared/infra/drizzle/migrations/schema';
import { DrizzleClient } from 'src/_shared/infra/drizzle/drizzle.provider';
import { CreateTransporteDto } from 'src/transporte/dto/create-transporte.dto';
import { inArray } from 'drizzle-orm';

export async function createTransporteBatchQuery(
  db: DrizzleClient,
  transportes: CreateTransporteDto,
  cadastradoPorId: string,
) {
  if (!transportes || transportes.length === 0) {
    throw new BadRequestException('Array de transportes não pode estar vazio');
  }

  // Busca transportes já existentes pelos numeroTransporte
  const numerosTransporte = transportes.map((t) => t.numeroTransporte);
  const transportesExistentes = await db
    .select({ numeroTransporte: transporte.numeroTransporte })
    .from(transporte)
    .where(inArray(transporte.numeroTransporte, numerosTransporte));

  // Cria um Set com os números de transporte já existentes para busca rápida
  const numerosExistentes = new Set(
    transportesExistentes.map((t) => t.numeroTransporte),
  );

  // Filtra apenas os transportes que não existem
  const transportesNovos = transportes.filter(
    (t) => !numerosExistentes.has(t.numeroTransporte),
  );

  // Se não houver transportes novos, retorna sem inserir
  if (transportesNovos.length === 0) {
    return [];
  }

  // Prepara os transportes para inserção
  const transportesToInsert = transportesNovos.map((transporteDto) => ({
    ...transporteDto,
    cadastradoPorId: cadastradoPorId,
    atualizadoEm: new Date().toISOString(),
  }));

  return await db.insert(transporte).values(transportesToInsert);
}
