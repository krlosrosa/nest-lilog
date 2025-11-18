import { PausaCreateData } from 'src/gestao-produtividade/dtos/pausa/pausa.create.dto';
import {
  FindPausaGeral,
  PausaGeralCreateDataDto,
} from 'src/gestao-produtividade/dtos/pausaGeral/pausaGeral.create.dto';
import { PausaGeralGetDataDto } from 'src/gestao-produtividade/dtos/pausaGeral/pausaGeral.get.dto';
import { PausaGeralSearchParamsDto } from 'src/gestao-produtividade/dtos/pausaGeral/pausaGeral.update.dto';

export interface IPausaRepository {
  findAll(
    centerId: string,
    params: PausaGeralSearchParamsDto,
  ): Promise<PausaGeralGetDataDto[]>;
  create(paramas: PausaCreateData): Promise<void>;
  finalizar(demandaId: number): Promise<void>;
  criarPausaGeral(
    regitradoPorId: string,
    paramas: PausaGeralCreateDataDto,
    demandaIds: number[],
  ): Promise<void>;
  finalizarPausaGeral(ids: number[]): Promise<void>;
  findPausaGeralByParams(
    paramas: FindPausaGeral,
  ): Promise<PausaGeralGetDataDto | undefined>;
}
