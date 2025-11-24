import { Controller } from '@nestjs/common';
import { DevolucaoService } from './devolucao.service';

@Controller('devolucao')
export class DevolucaoController {
  constructor(private readonly devolucaoService: DevolucaoService) {}
}
