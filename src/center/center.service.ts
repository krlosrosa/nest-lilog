import { Inject, Injectable } from '@nestjs/common';
import { CenterDto } from './dto/center/create-center.dto';
import { UpdateCenterDto } from './dto/center/update-center.dto';
import { type ICenterRepository } from './domain/repositories/center.respository';
import { GetConfigMapaQueryDto } from './infra/drizzle/queries/get-config-mapa.query';
import { ConfiguracaoImpressaoMapaDto } from './dto/center/configuracaoImpressaoMapa.dto';

@Injectable()
export class CenterService {
  constructor(
    @Inject('ICenterRepository')
    private readonly centerRepo: ICenterRepository,
  ) {}

  async create(centerDto: CenterDto, userId: string): Promise<CenterDto> {
    return this.centerRepo.create(centerDto, userId);
  }

  async findAll(query: UpdateCenterDto): Promise<CenterDto[]> {
    return this.centerRepo.findAll(query);
  }

  async getConfigMapaByCenter(
    params: GetConfigMapaQueryDto,
  ): Promise<ConfiguracaoImpressaoMapaDto> {
    return this.centerRepo.getConfigMapaByCenter(params);
  }

  async findOne(id: string): Promise<CenterDto> {
    const center = await this.centerRepo.findOne(id);
    if (!center) {
      throw new Error('Centro não encontrado');
    }
    return center;
  }

  async configImpressaoMapaCenter(
    centerId: string,
    configMapaDto: ConfiguracaoImpressaoMapaDto,
  ): Promise<ConfiguracaoImpressaoMapaDto> {
    return this.centerRepo.configurarImpressaoMapaCenter(
      centerId,
      configMapaDto,
    );
  }

  async update(id: string, data: UpdateCenterDto) {
    return this.centerRepo.update(id, data);
  }

  async remove(id: string) {
    return this.centerRepo.remove(id);
  }
}
