import { TransporteUpdateData } from 'src/transporte/dto/transporte.update.dto';
import { Transporte } from '../entities/transporte.entity';
import { DemandaProcesso } from 'src/_shared/enums';
import { HistoricoStatusTransporteCreateData } from 'src/transporte/dto/historicoTransporte/historicoTransporte.create.dto';
import { TransporteComRelacionamentosGetDto } from 'src/transporte/dto/transporte.get.dto';

export interface ITransporteRepository {
  findTransportesByTransporteIds(
    transporteIds: string[],
    processo: DemandaProcesso,
  ): Promise<Transporte[]>;
  updateTransporte(
    transporteId: string,
    transporte: TransporteUpdateData,
  ): Promise<void>;
  createHistoricoTransporte(
    historicoTransporte: HistoricoStatusTransporteCreateData,
  ): Promise<void>;
  findTransporteByNumeroTransporte(
    numeroTransporte: string,
  ): Promise<TransporteComRelacionamentosGetDto | null>;
  trocarDataExpedicaoTransportes(
    transporteIds: string[],
    dataExpedicao: string,
  ): Promise<void>;
}
