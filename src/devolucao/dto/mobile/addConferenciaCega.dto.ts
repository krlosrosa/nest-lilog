import { ApiProperty } from '@nestjs/swagger';

export class AddConferenciaCegaDto {
  @ApiProperty({
    example: 'SKU001',
    description: 'Código SKU do produto',
  })
  sku: string;

  @ApiProperty({
    example: 'Produto Exemplo',
    description: 'Descrição do produto',
  })
  descricao: string;

  @ApiProperty({
    example: 'LOTE-2024-A',
    description: 'Lote do produto',
    required: false,
  })
  lote?: string | null;

  @ApiProperty({
    example: '2024-01-15',
    description: 'Data de fabricação do produto',
    required: false,
  })
  fabricacao?: string | null;

  @ApiProperty({
    example: 'SIF-12345',
    description: 'Número SIF do produto',
    required: false,
  })
  sif?: string | null;

  @ApiProperty({
    example: 10,
    description: 'Quantidade de caixas',
    required: false,
  })
  quantidadeCaixas?: number | null;

  @ApiProperty({
    example: 100,
    description: 'Quantidade de unidades',
    required: false,
  })
  quantidadeUnidades?: number | null;

  @ApiProperty({
    example: 2,
    description: 'Quantidade de caixas com avaria',
    required: false,
  })
  avariaCaixas?: number | null;

  @ApiProperty({
    example: 20,
    description: 'Quantidade de unidades com avaria',
    required: false,
  })
  avariaUnidades?: number | null;

  @ApiProperty({
    example: 'nota-123',
    description: 'ID da nota de devolução',
    required: false,
  })
  devolucaoNotasId?: string | null;

  @ApiProperty({
    example: 456,
    description: 'ID da nota fiscal',
    required: false,
  })
  notaId?: number | null;
}
