import { Module } from '@nestjs/common';
import { CorteProdutoService } from './corte-produto.service';
import { CorteProdutoController } from './corte-produto.controller';
import { CorteProdutoRepositoryDrizzle } from './infra/repository';

@Module({
  controllers: [CorteProdutoController],
  providers: [
    CorteProdutoService,
    {
      provide: 'ICorteProdutoRepository',
      useClass: CorteProdutoRepositoryDrizzle,
    },
  ],
})
export class CorteProdutoModule {}
