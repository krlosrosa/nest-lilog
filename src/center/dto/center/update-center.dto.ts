import { PartialType } from '@nestjs/mapped-types';
import { CenterDto } from './create-center.dto';

export class UpdateCenterDto extends PartialType(CenterDto) {}
