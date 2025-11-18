import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CenterService } from './center.service';
import { CenterDto } from './dto/center/create-center.dto';
import { UpdateCenterDto } from './dto/center/update-center.dto';
import { ApiStandardResponses } from 'src/_shared/decorators/api-response.decorator';
import { ZodResponse } from 'nestjs-zod';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccountId } from 'src/_shared/decorators/account-id.decorator';
import { AuthGuard } from 'src/_shared/guard/auth.guard';
import { ConfiguracaoImpressaoMapaDto } from './dto/center/configuracaoImpressaoMapa.dto';

@Controller('center')
@ApiTags('center')
@UseGuards(AuthGuard)
@ApiStandardResponses()
export class CenterController {
  constructor(private readonly centerService: CenterService) {}

  @Post()
  @ApiOperation({ summary: 'Cria novo centro', operationId: 'criarNovoCentro' })
  @ZodResponse({ type: CenterDto, status: HttpStatus.OK })
  create(
    @Body() centerDto: CenterDto,
    @AccountId() accountId: string, // ✅ direto aqui
  ): Promise<CenterDto> {
    return this.centerService.create(centerDto, accountId);
  }

  @Get()
  @ApiOperation({
    summary: 'Buscar todos os centros',
    operationId: 'buscarTodosCentros',
  })
  @ZodResponse({ type: [CenterDto], status: HttpStatus.OK })
  findAll(@Query() query: UpdateCenterDto) {
    return this.centerService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um centro' })
  @ZodResponse({ type: CenterDto, status: HttpStatus.OK })
  findOne(@Param('id') id: string): Promise<CenterDto> {
    return this.centerService.findOne(id);
  }

  @Get(':centerId/config/mapa/:empresa')
  @ApiOperation({
    summary: 'Buscar configuração de impressão de mapa por centro e empresa',
    operationId: 'buscarConfiguracaoPorCentro',
  })
  @ZodResponse({ type: ConfiguracaoImpressaoMapaDto, status: HttpStatus.OK })
  findConfigCenter(
    @Param('centerId') centerId: string,
    @Param('empresa') empresa: string,
  ) {
    return this.centerService.getConfigMapaByCenter({ centerId, empresa });
  }

  @Post(':centerId/config/mapa')
  @ApiOperation({
    summary: 'Configurar impressão de mapa por centro e empresa',
    operationId: 'criarConfiguracaoImpressao',
  })
  @ZodResponse({ type: ConfiguracaoImpressaoMapaDto, status: HttpStatus.OK })
  configImpressaoMapaCenter(
    @Param('centerId') centerId: string,
    @Body() configMapaDto: ConfiguracaoImpressaoMapaDto,
  ) {
    return this.centerService.configImpressaoMapaCenter(
      centerId,
      configMapaDto,
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um centro' })
  update(@Param('id') id: string, @Body() updateCenterDto: UpdateCenterDto) {
    return this.centerService.update(id, updateCenterDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar um centro' })
  remove(@Param('id') id: string) {
    return this.centerService.remove(id);
  }
}
