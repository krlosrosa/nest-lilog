import { RavexResponseDto } from '../dto/infoAnomalia.dto';
import { RavexResponseViagemDtoResponse } from '../dto/infoViagem.dto';
import { TokenRavexDto } from '../dto/tokenRavex.dto';

export interface IRavexRepository {
  getRavexByViagemId(
    viagemId: string,
    token: string,
  ): Promise<RavexResponseDto | undefined>;
  authRavex(login: string, senha: string): Promise<TokenRavexDto | undefined>;
  getRavexViagemId(
    viagemId: string,
    token: string,
  ): Promise<RavexResponseViagemDtoResponse | undefined>;
}
