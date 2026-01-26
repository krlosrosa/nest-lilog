import { ApiProperty } from '@nestjs/swagger';

export class AnomaliaDevolucaoDto {
  @ApiProperty({
    example: 123,
    description: 'ID da demanda de devolução',
  })
  demandaId: number;

  @ApiProperty({
    example: 'SKU001',
    description: 'Código SKU do produto',
  })
  sku: string;

  @ApiProperty({
    example: 'Caixa amassada',
    description: 'Descrição da anomalia',
  })
  descricao: string;

  @ApiProperty({
    example: 'LOTE-2024-A',
    description: 'Lote do produto',
  })
  lote: string;

  @ApiProperty({
    example: 'Avaria',
    description: 'Tipo da anomalia',
  })
  tipo: string;

  @ApiProperty({
    example: 'Física',
    description: 'Natureza da anomalia',
  })
  natureza: string;

  @ApiProperty({
    example: 'Transporte',
    description: 'Causa da anomalia',
  })
  causa: string;

  @ApiProperty({
    example: false,
    required: false,
    description: 'Indica se a anomalia já foi tratada',
  })
  tratado?: boolean;

  @ApiProperty({
    example: 10,
    description: 'Quantidade de caixas afetadas',
  })
  quantidadeCaixas: number;

  @ApiProperty({
    example: 50,
    description: 'Quantidade de unidades afetadas',
  })
  quantidadeUnidades: number;

  @ApiProperty({
    type: [String],
    description: 'Lista de URLs ou identificadores das imagens',
    example: ['https://storage.com/foto1.jpg', 'https://storage.com/foto2.jpg'],
  })
  imagens: string[];
}
/* import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const anomaliaDevolucaoDtoSchema = z.object({
  demandaId: z.number(),
  sku: z.string(),
  descricao: z.string(),
  lote: z.string(),
  tipo: z.string(),
  natureza: z.string(),
  causa: z.string(),
  tratado: z.boolean().optional(),
  quantidadeCaixas: z.number(),
  quantidadeUnidades: z.number(),
  imagens: z.array(z.string()),
});

export class AnomaliaDevolucaoDto extends createZodDto(
  anomaliaDevolucaoDtoSchema,
) {}
*/
