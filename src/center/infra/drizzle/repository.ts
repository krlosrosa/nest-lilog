import { Inject } from '@nestjs/common';
import { ICenterRepository } from 'src/center/domain/repositories/center.respository';
import { DRIZZLE_PROVIDER } from 'src/_shared/infra/drizzle/drizzle.constants';
import { type DrizzleClient } from 'src/_shared/infra/drizzle/drizzle.provider';
import { createCenterCommand } from './commands/create-center.command';
import { CenterDto } from 'src/center/dto/center/create-center.dto';
import { findAllCentersQuery } from './queries/find-all-centers.query';
import { UpdateCenterDto } from 'src/center/dto/center/update-center.dto';
import { findOneCenterQuery } from './queries/find-one-centers.query';
import { updateCenterCommand } from './commands/update-center.command';
import { removeCenterCommand } from './commands/remove-center-command';
import {
  getConfigMapaQuery,
  GetConfigMapaQueryDto,
} from './queries/get-config-mapa.query';
import { ConfiguracaoImpressaoMapaDto } from 'src/center/dto/center/configuracaoImpressaoMapa.dto';
import { configCenterCommand } from './commands/config-center.command';

export class CenterRepositoryDrizzle implements ICenterRepository {
  constructor(@Inject(DRIZZLE_PROVIDER) private readonly db: DrizzleClient) {}

  async create(centerDto: CenterDto, userId: string): Promise<CenterDto> {
    return createCenterCommand(this.db, centerDto, userId);
  }

  async findAll(query: UpdateCenterDto): Promise<CenterDto[]> {
    return findAllCentersQuery(this.db, query);
  }

  async findOne(id: string): Promise<CenterDto | undefined> {
    return findOneCenterQuery(this.db, id);
  }

  async getConfigMapaByCenter(
    params: GetConfigMapaQueryDto,
  ): Promise<ConfiguracaoImpressaoMapaDto> {
    return getConfigMapaQuery(this.db, params);
  }

  async configurarImpressaoMapaCenter(
    centerId: string,
    configMapaDto: ConfiguracaoImpressaoMapaDto,
  ): Promise<ConfiguracaoImpressaoMapaDto> {
    return configCenterCommand(this.db, centerId, configMapaDto);
  }

  async update(
    id: string,
    data: UpdateCenterDto,
  ): Promise<CenterDto | undefined> {
    return updateCenterCommand(this.db, id, data);
  }
  async remove(id: string): Promise<CenterDto | undefined> {
    return removeCenterCommand(this.db, id);
  }
}
