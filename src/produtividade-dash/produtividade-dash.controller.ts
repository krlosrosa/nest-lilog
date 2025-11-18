import { Controller } from '@nestjs/common';
import { ProdutividadeDashService } from './produtividade-dash.service';

@Controller('produtividade-dash')
export class ProdutividadeDashController {
  constructor(
    private readonly produtividadeDashService: ProdutividadeDashService,
  ) {}
}
