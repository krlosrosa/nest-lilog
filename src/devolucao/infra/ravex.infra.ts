import { Injectable } from '@nestjs/common';
import { IRavexRepository } from '../repositories/ravex.repository';
import { HttpService } from '@nestjs/axios';
import FormData from 'form-data';
import { TokenRavexDto } from '../dto/tokenRavex.dto';
import { RavexResponseDto } from '../dto/infoAnomalia.dto';
import { RavexResponseViagemDtoResponse } from '../dto/infoViagem.dto';

@Injectable()
export class Ravex implements IRavexRepository {
  constructor(private readonly axios: HttpService) {}

  async authRavex(
    login: string,
    senha: string,
  ): Promise<TokenRavexDto | undefined> {
    const formData = new FormData();
    formData.append('grant_type', 'password');
    formData.append('username', login);
    formData.append('password', senha);
    const response = this.axios.post<TokenRavexDto>(
      `/usuario/autenticar`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.toPromise().then((res) => res?.data);
  }

  async getRavexByViagemId(
    viagemId: string,
    token: string,
  ): Promise<RavexResponseDto | undefined> {
    const response = this.axios.get<RavexResponseDto>(
      `/api/viagem-faturada/${viagemId}/anomalias-registradas`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );
    return response.toPromise().then((res) => res?.data);
  }

  async getRavexViagemId(
    viagemId: string,
    token: string,
  ): Promise<RavexResponseViagemDtoResponse | undefined> {
    const response = this.axios.get<RavexResponseViagemDtoResponse>(
      `/api/viagem-faturada/${viagemId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );
    return response.toPromise().then((res) => res?.data);
  }
}
