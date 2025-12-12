import { Module } from '@nestjs/common';
import { MovimentacaoService } from './movimentacao.service';
import { MovimentacaoController } from './movimentacao.controller';
import { ContagemService } from './contagem.service';

@Module({
  controllers: [MovimentacaoController],
  providers: [MovimentacaoService, ContagemService],
})
export class MovimentacaoModule {}
