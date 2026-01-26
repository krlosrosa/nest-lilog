import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DevolucaoMobileService } from './devolucao.mobile.service';
import { ListarDemandasDto } from './dto/demanda/listar-demandas.dto';
import { AddCheckListDto } from './dto/mobile/checkList.dto';
import { ItensContabilDto } from './dto/mobile/itensContabil.dto';
import { StartDemandaDto } from './dto/mobile/startDemanda.dto';
import { AddConferenciaCegaDto } from './dto/mobile/addConferenciaCega.dto';
import { AuthGuard } from 'src/_shared/guard/auth.guard';
import { AccountId } from 'src/_shared/decorators/account-id.decorator';
import { AnomaliaDevolucaoDto } from './dto/mobile/anomaliaDevolucao.dto';
import { memoryStorage } from 'multer';
import {
  FileFieldsInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';

// Tipo para arquivos Multer compatível com Express 5
type MulterFile = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
  destination?: string;
  filename?: string;
  path?: string;
};

@ApiTags('devolucao-mobile')
@UseGuards(AuthGuard)
@Controller('devolucao-mobile')
export class DevolucaoMobileController {
  constructor(
    private readonly devolucaoMobileService: DevolucaoMobileService,
  ) {}

  @Post('add-check-list/:demandaId')
  @ApiOperation({
    summary: 'Adicionar check list',
    operationId: 'addCheckListDevolucaoMobile',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: AddCheckListDto })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'fotoBauAberto', maxCount: 1 },
        { name: 'fotoBauFechado', maxCount: 1 },
      ],
      {
        storage: memoryStorage(), // Mantém como Buffer para não lixar o container
        limits: { fileSize: 10 * 1024 * 1024 }, // Limite de 10MB por foto
      },
    ),
  )
  @ApiResponse({
    status: 200,
    description: 'Check list adicionado com sucesso',
    type: String,
  })
  async addCheckList(
    @Param('demandaId') demandaId: string,
    @UploadedFiles()
    files: {
      fotoBauAberto?: MulterFile[];
      fotoBauFechado?: MulterFile[];
    },
    @Body() addCheckListDto: AddCheckListDto,
  ): Promise<void> {
    const fotoAberto = files.fotoBauAberto?.[0];
    const fotoFechado = files.fotoBauFechado?.[0];
    return this.devolucaoMobileService.addCheckList(
      addCheckListDto,
      demandaId,
      fotoAberto as MulterFile,
      fotoFechado as MulterFile,
    );
  }

  @Get('listar-demandas-em-aberto/:centerId')
  @ApiOperation({
    summary: 'Listar demandas em aberto',
    operationId: 'listarDemandasEmAbertoDevolucaoMobile',
  })
  @ApiResponse({
    status: 200,
    description: 'Demandas em aberto listadas com sucesso',
    type: [ListarDemandasDto],
  })
  async listarDemandasEmAberto(
    @Param('centerId') centerId: string,
    @AccountId() accountId: string, // ✅ direto aqui
  ): Promise<ListarDemandasDto[]> {
    return this.devolucaoMobileService.listarDemandasEmAberto(
      centerId,
      accountId,
    );
  }

  @Post('start-demanda/')
  @ApiOperation({
    summary: 'Iniciar conferência',
    operationId: 'startDemandaDevolucaoMobile',
  })
  @ApiResponse({
    status: 200,
    description: 'Conferência iniciada com sucesso',
    type: [ItensContabilDto],
  })
  @ApiBody({ type: StartDemandaDto })
  async startDemanda(
    @Body() demanda: StartDemandaDto,
    @AccountId() accountId: string, // ✅ direto aqui
  ): Promise<ItensContabilDto[]> {
    return this.devolucaoMobileService.startDemanda(demanda, accountId);
  }

  @Post('add-contagem-cega/:demandaId')
  @ApiOperation({
    summary: 'Iniciar conferência',
    operationId: 'addContagemCega',
  })
  @ApiResponse({
    status: 200,
    description: 'Conferência iniciada com sucesso',
  })
  @ApiBody({ type: [AddConferenciaCegaDto] })
  async addContagemCega(
    @Param('demandaId') demandaId: string,
    @Body() conferencia: AddConferenciaCegaDto[],
  ): Promise<void> {
    return this.devolucaoMobileService.addConferenciaFisica(
      demandaId,
      conferencia,
    );
  }

  @Post('finalizar-demanda/:demandaId')
  @ApiOperation({
    summary: 'Finalizar demanda',
    operationId: 'finalizarDemandaDevolucaoMobile',
  })
  @ApiResponse({
    status: 200,
    description: 'Demanda finalizada com sucesso',
  })
  async finalizarDemanda(@Param('demandaId') demandaId: string): Promise<void> {
    return this.devolucaoMobileService.finalizarDemanda(demandaId);
  }

  @Get('get-itens-contabil/:demandaId')
  @ApiOperation({
    summary: 'Listar itens contabilizados',
    operationId: 'getItensContabilDevolucaoMobile',
  })
  @ApiResponse({
    status: 200,
    description: 'Itens contabilizados listados com sucesso',
    type: [ItensContabilDto],
  })
  async getItensContabilizados(
    @Param('demandaId') demandaId: string,
  ): Promise<ItensContabilDto[]> {
    return this.devolucaoMobileService.getItensContabilizados(demandaId);
  }

  @Get('get-status-by-id/:demandaId')
  @ApiOperation({
    summary: 'Pegar Status pelo ID',
    operationId: 'getStatusById',
  })
  @ApiResponse({
    status: 200,
    description: 'get status by ID',
    type: String,
  })
  async getDemandaById(@Param('demandaId') demandaId: string): Promise<string> {
    return this.devolucaoMobileService.getDemandaById(demandaId);
  }

  @Post('add-anomalia-devolucao')
  @ApiOperation({
    summary: 'Adicionar anomalia de devolução',
    operationId: 'addAnomaliaDevolucao',
  })
  @ApiConsumes('multipart/form-data') // Necessário para arquivos
  @ApiBody({ type: AnomaliaDevolucaoDto })
  @ApiResponse({
    status: 200,
    description: 'Anomalia de devolução adicionada com sucesso',
  })
  @UseInterceptors(
    FilesInterceptor('imagens', 10, {
      // Nome do campo deve ser 'imagens'
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB por foto
    }),
  )
  async addAnomaliaDevolucao(
    @Body() anomalia: AnomaliaDevolucaoDto,
    @UploadedFiles() imagens: MulterFile[], // Captura o array de arquivos
  ): Promise<void> {
    // Passamos o DTO e o array de arquivos para o Service
    return this.devolucaoMobileService.addAnomaliaDevolucao(anomalia, imagens);
  }
}
