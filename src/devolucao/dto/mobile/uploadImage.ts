import { ApiProperty } from '@nestjs/swagger';

export class MultipleFilesDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Foto do baú aberto',
  })
  fotoAberto: any;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Foto do baú fechado',
  })
  fotoFechado: any;
}
