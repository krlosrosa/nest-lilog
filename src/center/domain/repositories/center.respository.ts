import { CenterDto } from 'src/center/dto/center/create-center.dto';
import { UpdateCenterDto } from 'src/center/dto/center/update-center.dto';
import { GetConfigMapaQueryDto } from 'src/center/infra/drizzle/queries/get-config-mapa.query';
import { ConfiguracaoImpressaoMapaDto } from 'src/center/dto/center/configuracaoImpressaoMapa.dto';

export interface ICenterRepository {
  create(centerDto: CenterDto, userId: string): Promise<CenterDto>;
  findAll(query: UpdateCenterDto): Promise<CenterDto[]>;
  findOne(id: string): Promise<CenterDto | undefined>;
  update(
    id: string,
    updateCenterDto: UpdateCenterDto,
  ): Promise<CenterDto | undefined>;
  remove(id: string): Promise<CenterDto | undefined>;
  getConfigMapaByCenter(
    params: GetConfigMapaQueryDto,
  ): Promise<ConfiguracaoImpressaoMapaDto>;
  configurarImpressaoMapaCenter(
    centerId: string,
    configMapaDto: ConfiguracaoImpressaoMapaDto,
  ): Promise<ConfiguracaoImpressaoMapaDto>;
}
