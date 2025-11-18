import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiStandardResponses } from 'src/_shared/decorators/api-response.decorator';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountId } from 'src/_shared/decorators/account-id.decorator';
import { AuthGuard } from 'src/_shared/guard/auth.guard';
import { EngineRulesService } from './engineRules.service';
import { EngineRuleCreateDto } from './dto/engine-rules/enginerule.create.dto';
import { EngineRuleGetDto } from './dto/engine-rules/enginerule.get.dto';
import {
  EngineRuleUpdateDto,
  type EngineRuleUpdateData,
} from './dto/engine-rules/enginerule.update.dto';

@Controller('center')
@ApiTags('center')
@UseGuards(AuthGuard)
@ApiStandardResponses()
export class EngineRulesController {
  constructor(private readonly engineRulesService: EngineRulesService) {}

  @Post('engine-rules')
  @ApiOperation({
    summary: 'Cria nova regra de motor',
    operationId: 'criarNovaRegraDeMotor',
  })
  @ApiResponse({ type: EngineRuleCreateDto, status: HttpStatus.OK })
  create(
    @Body() engineRuleDto: EngineRuleCreateDto,
    @AccountId() accountId: string,
  ) {
    return this.engineRulesService.create(engineRuleDto, accountId);
  }

  @Get(':centerId/engine-rules')
  @ApiOperation({
    summary: 'Busca todas as regras de motor',
    operationId: 'buscarTodasRegrasDeMotor',
  })
  @ApiResponse({ type: [EngineRuleGetDto], status: HttpStatus.OK })
  findAll(@Param('centerId') centerId: string): Promise<EngineRuleGetDto[]> {
    return this.engineRulesService.findAll(centerId);
  }

  @Patch('/engine-rules/update/:id')
  @ApiOperation({
    summary: 'Atualiza uma regra de motor',
    operationId: 'atualizarRegraDeMotor',
  })
  @ApiBody({ type: EngineRuleUpdateDto })
  update(
    @Param('id') id: string,
    @Body() engineRuleDto: EngineRuleUpdateData,
  ): Promise<void> {
    return this.engineRulesService.update(id, engineRuleDto);
  }

  @Delete('/engine-rules/delete/:id')
  @ApiOperation({
    summary: 'Deleta uma regra de motor',
    operationId: 'deletarRegraDeMotor',
  })
  delete(@Param('id') id: string): Promise<void> {
    return this.engineRulesService.delete(id);
  }
}
