import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AnomaliasProdutividadeService } from './anomalias-produtividade.service';
import { type AnomaliaProdutividadeUpdateDataWithDateStartAndEnd } from './dto/anomaliaProdutividade.update.dto';
import {
  AnomaliaProdutividadeGetData,
  AnomaliaProdutividadeGetDataDto,
} from './dto/anomaliaProdutividade.get.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/_shared/guard/auth.guard';
import { ApiStandardResponses } from 'src/_shared/decorators/api-response.decorator';

@Controller('anomalias-produtividade')
@ApiTags('anomalias-produtividade')
@UseGuards(AuthGuard)
@ApiStandardResponses()
export class AnomaliasProdutividadeController {
  constructor(
    private readonly anomaliasProdutividadeService: AnomaliasProdutividadeService,
  ) {}

  @Get(':centerId')
  @ApiOperation({
    summary: 'Buscar todas as anomalias de produtividade',
    operationId: 'getAnomalias',
  })
  @ApiResponse({
    status: 200,
    description: 'Anomalias encontradas com sucesso',
    type: [AnomaliaProdutividadeGetDataDto],
  })
  async getAllAnomalias(
    @Param('centerId') centerId: string,
    @Query() params: AnomaliaProdutividadeUpdateDataWithDateStartAndEnd,
  ): Promise<AnomaliaProdutividadeGetData[]> {
    return this.anomaliasProdutividadeService.getAllAnomalias(centerId, params);
  }
}
