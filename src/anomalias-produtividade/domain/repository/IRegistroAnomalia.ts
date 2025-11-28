import { AnomaliaProdutividadeCreateData } from 'src/anomalias-produtividade/dto/anomaliaProdutividade.create.dto';
import { AnomaliaProdutividadeGetData } from 'src/anomalias-produtividade/dto/anomaliaProdutividade.get.dto';
import { AnomaliaProdutividadeUpdateDataWithDateStartAndEnd } from 'src/anomalias-produtividade/dto/anomaliaProdutividade.update.dto';
import { DemandaGetDataForAnomaliaDto } from 'src/anomalias-produtividade/dto/demanda/getDemanda.get.dto';
import { TransporteAnomaliaCreateData } from 'src/anomalias-produtividade/dto/transporte/createAnomalia.dtos';
import { GetTransporteDto } from 'src/transporte/dto/transporte.get.dto';

export interface IRegistroAnomaliaProdutividadeRepository {
  create(registroAnomalia: AnomaliaProdutividadeCreateData): Promise<void>;
  getAllAnomalias(
    centerId: string,
    params: AnomaliaProdutividadeUpdateDataWithDateStartAndEnd,
  ): Promise<AnomaliaProdutividadeGetData[]>;
  getDemandaById(id: string): Promise<DemandaGetDataForAnomaliaDto | undefined>;
  getTransporteById(id: string): Promise<GetTransporteDto | undefined>;
  createTransporteAnomalia(
    transporteAnomalia: TransporteAnomaliaCreateData,
  ): Promise<void>;
}
