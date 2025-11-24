import { Module } from '@nestjs/common';
import { DevolucaoService } from './devolucao.service';
import { DevolucaoController } from './devolucao.controller';

@Module({
  controllers: [DevolucaoController],
  providers: [DevolucaoService],
})
export class DevolucaoModule {}
