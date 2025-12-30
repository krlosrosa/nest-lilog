import { Module } from '@nestjs/common';
import { DevolucaoService } from './devolucao.service';
import { DevolucaoController } from './devolucao.controller';
import { GetInfoByViagemIdRavex } from './application/getInfoByViagemIdRavex';
import { ProdutoService } from 'src/produto/produto.service';
import { Ravex } from './infra/ravex.infra';
import { GetResultadoDemanda } from './application/getResultadoDemanda';
import { DevolucaoMobileController } from './devolucao.mobile.controller';
import { DevolucaoMobileService } from './devolucao.mobile.service';

@Module({
  providers: [
    DevolucaoService,
    DevolucaoMobileService,
    GetInfoByViagemIdRavex,
    ProdutoService,
    GetResultadoDemanda,
    {
      provide: 'IRavexRepository',
      useClass: Ravex,
    },
  ],
  controllers: [DevolucaoController, DevolucaoMobileController],
})
export class DevolucaoModule {}
