import { Inject } from '@nestjs/common';
import { type IPausaRepository } from '../../domain/repository/IPausa.repository';
import { PausaGeralSearchParamsDto } from '../../dtos/pausaGeral/pausaGeral.update.dto';
import { PausaGeralGetDataDto } from '../../dtos/pausaGeral/pausaGeral.get.dto';

export class BuscarPausasAtivas {
  constructor(
    @Inject('IPausaRepository')
    private readonly pausaRepository: IPausaRepository,
  ) {}

  async execute(
    centerId: string,
    params: PausaGeralSearchParamsDto,
  ): Promise<PausaGeralGetDataDto[]> {
    return this.pausaRepository.findAll(centerId, params);
  }
}
