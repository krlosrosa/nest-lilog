import { ApiProperty } from '@nestjs/swagger';

export class StartDemandaDto {
  @ApiProperty({
    example: '123',
    description: 'ID da demanda de devolução',
  })
  demandaId: string;

  @ApiProperty({
    example: 'DOCA-01',
    description: 'Número da doca onde será realizada a conferência',
  })
  doca: string;
}
