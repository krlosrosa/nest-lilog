import { ApiProperty } from '@nestjs/swagger';

export class AddCheckListDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Foto do baú fechado',
  })
  fotoBauAberto: any;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Foto do baú fechado',
  })
  fotoBauFechado: any;

  @ApiProperty({ example: '123' })
  demandaId: string;

  @ApiProperty({ example: 5.5, description: 'Temperatura do Baú' })
  temperaturaBau: string; // Vem como string no FormData

  @ApiProperty({ example: 4.0, description: 'Temperatura do Produto' })
  temperaturaProduto: string;

  @ApiProperty({ example: 'Rachadura na caixa', required: false })
  anomalias?: string;
}
