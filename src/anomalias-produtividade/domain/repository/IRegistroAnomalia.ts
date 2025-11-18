import { AnomaliaProdutividadeCreateData } from 'src/anomalias-produtividade/dto/anomaliaProdutividade.create.dto';
import { AnomaliaProdutividadeGetData } from 'src/anomalias-produtividade/dto/anomaliaProdutividade.get.dto';
import { AnomaliaProdutividadeUpdateDataWithDateStartAndEnd } from 'src/anomalias-produtividade/dto/anomaliaProdutividade.update.dto';

export interface IRegistroAnomaliaProdutividadeRepository {
  create(registroAnomalia: AnomaliaProdutividadeCreateData): Promise<void>;
  getAllAnomalias(
    centerId: string,
    params: AnomaliaProdutividadeUpdateDataWithDateStartAndEnd,
  ): Promise<AnomaliaProdutividadeGetData[]>;
}
