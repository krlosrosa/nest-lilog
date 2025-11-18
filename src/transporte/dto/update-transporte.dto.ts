import { PartialType } from '@nestjs/swagger';
import { ResultTransporteDto } from './findAll-transporte.dto';

export class UpdateTransporteDto extends PartialType(ResultTransporteDto) {}
