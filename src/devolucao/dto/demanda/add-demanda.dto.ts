import { ApiProperty } from '@nestjs/swagger';

export class AddDemandaDto {
  @ApiProperty({ description: 'Placa do veiculo' })
  placa: string;
  @ApiProperty({ description: 'Nome Motorista' })
  motorista: string;
  @ApiProperty({ description: 'Nome Transportadora' })
  idTransportadora: string;
  @ApiProperty({ description: 'Id Viagem Ravex' })
  viagemId: string;
  @ApiProperty({ description: 'Telefone Motorista' })
  telefone: string;
  @ApiProperty({ description: 'Existe carga segregada' })
  cargaSegregada: boolean;
  @ApiProperty({ description: 'Quantos paletes estão sendo retornados' })
  paletesRetorno: number;
  @ApiProperty({ description: 'Qual doca o carro vai ser descarregado' })
  doca: string;
}
