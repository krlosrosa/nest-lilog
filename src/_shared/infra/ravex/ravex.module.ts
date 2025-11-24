import { Global, Module } from '@nestjs/common';
import { RavexService } from './ravex.service';

@Global()
@Module({
  providers: [RavexService],
})
export class RavexModule {}
