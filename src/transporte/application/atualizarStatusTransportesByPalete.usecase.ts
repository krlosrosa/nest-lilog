import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TransporteUpdatedEventData } from '../events/events/transporte-update.event';
import { type ITransporteRepository } from '../domain/repository/ITransporte.interface';
import { DemandaProcesso } from 'src/_shared/enums';
import { StatusPalete } from 'src/_shared/enums/palete-status.enum';
import { TransporteStatus } from 'src/_shared/enums/transporte-status.enum';
import { UpdateTransporteSeparacao } from './updateTransporte/separacao';
import { UpdateTransporteCarregamento } from './updateTransporte/carregamento';
import { UpdateTransporteConferencia } from './updateTransporte/conferencia';

@Injectable()
export class AtualizarStatusTransportesByPalete {
  constructor(
    @Inject('ITransporteRepository')
    private readonly transporteRepository: ITransporteRepository,
    private readonly updateTransporteSeparacao: UpdateTransporteSeparacao,
    private readonly updateTransporteConferencia: UpdateTransporteConferencia,
    private readonly updateTransporteCarregamento: UpdateTransporteCarregamento,
  ) {}

  async execute(data: TransporteUpdatedEventData): Promise<void> {
    // Busca as paletes relacionadas aos transportes
    const transportes =
      await this.transporteRepository.findTransportesByTransporteIdsAll(
        data.transporteIds,
      );
    // Valida se os transportes foram encontrados
    if (transportes.length === 0) {
      throw new NotFoundException(`Transportes não encontrados`);
    }
    // Valida se os transportes estão em andamento
    await Promise.all(
      transportes.map(async (transporte) => {
        let statusTransporte = TransporteStatus.NAO_INICIADO;
        const paletesProcesso = transporte.paletes.filter(
          (palete) => palete.tipoProcesso === data.processo,
        );
        if (paletesProcesso.length > 0) {
          const allFinished = paletesProcesso.every(
            (palete) => palete.status === StatusPalete.CONCLUIDO,
          );
          if (allFinished) {
            statusTransporte = TransporteStatus.CONCLUIDO;
          }
          const inProgress = paletesProcesso.some(
            (palete) => palete.status === StatusPalete.EM_PROGRESSO,
          );
          if (inProgress) {
            statusTransporte = TransporteStatus.EM_PROGRESSO;
          }

          if (data.processo === DemandaProcesso.SEPARACAO) {
            await this.updateTransporteSeparacao.execute(
              transporte,
              statusTransporte,
            );
          }
          if (data.processo === DemandaProcesso.CONFERENCIA) {
            await this.updateTransporteConferencia.execute(
              transporte,
              statusTransporte,
            );
          }
          if (data.processo === DemandaProcesso.CARREGAMENTO) {
            await this.updateTransporteCarregamento.execute(
              transporte,
              statusTransporte,
            );
          }
        }
      }),
    );
  }
}
