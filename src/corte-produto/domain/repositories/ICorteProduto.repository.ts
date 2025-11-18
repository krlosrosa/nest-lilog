import { CorteMercadoriaDto } from 'src/corte-produto/dto/corte.create.dto';
import { CorteMercadoriaGetDto } from 'src/corte-produto/dto/corte.get.dto';
import { FindAllMercadoriaUpdateDto } from 'src/corte-produto/dto/corte.update.dto';

export interface ICorteProdutoRepository {
  findTransporteByPaleteId(paleteId: string): Promise<string | undefined>;
  create(
    corteProduto: CorteMercadoriaDto[],
    criadoPorId: string,
    centerId: string,
  ): Promise<void>;
  findAll(
    centerId: string,
    params: FindAllMercadoriaUpdateDto,
  ): Promise<CorteMercadoriaGetDto[]>;
  confirmarCorte(id: string, confirmadoPorId: string): Promise<void>;
  confirmarCortePorTransporte(
    transporteId: string,
    confirmadoPorId: string,
  ): Promise<void>;
  findByTransporteId(transporteIds: string[]): Promise<CorteMercadoriaGetDto[]>;
}
