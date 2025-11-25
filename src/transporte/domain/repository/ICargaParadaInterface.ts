import { CreateCargaParadaDto } from 'src/transporte/dto/cargaParada/createCargaParada.dto';
import { GetTransporteDto } from 'src/transporte/dto/transporte.get.dto';

export interface ICargaParadaRepository {
  createCargaParada(cargaParada: CreateCargaParadaDto): Promise<void>;
  getInfoTransporteByTransportId(
    transportId: string,
  ): Promise<GetTransporteDto | null>;
}
