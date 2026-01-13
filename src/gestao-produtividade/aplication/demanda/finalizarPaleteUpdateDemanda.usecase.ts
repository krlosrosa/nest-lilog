import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { type IDemandaProdutividadeRepository } from '../../domain/repository/IDemandaProdutividade.repository';
import { StatusPalete } from 'src/_shared/enums/palete-status.enum';
import { type ITransporteRepository } from 'src/transporte/domain/repository/ITransporte.interface';
import { DemandaProcesso } from 'src/_shared/enums';
import { type DrizzleClient } from 'src/_shared/infra/drizzle/drizzle.provider';
import { DRIZZLE_PROVIDER } from 'src/_shared/infra/drizzle/drizzle.constants';

export class FinalizarPaleteUpdateDemanda {
  constructor(
    @Inject('IDemandaProdutividadeRepository')
    private readonly demandaRepository: IDemandaProdutividadeRepository,
    @Inject('ITransporteRepository')
    private readonly transporteRepository: ITransporteRepository,
    @Inject(DRIZZLE_PROVIDER) private readonly db: DrizzleClient,
  ) {}

  async execute(paleteIds: string[], atualizadoPor: string): Promise<void> {
    await this.db.transaction(async (tx) => {
      // 1️⃣ Buscar paletes
      const paletes = await this.demandaRepository.findPaletes(paleteIds);
      if (paletes.length === 0) {
        throw new NotFoundException(`Paletes não encontrados`);
      }

      paletes.forEach((palete) => {
        if (palete.status !== StatusPalete.EM_PROGRESSO) {
          throw new BadRequestException(
            `Palete ${palete.id} não pode ser finalizada pois não está em progresso.`,
          );
        }
      });

      // 2️⃣ Finalizar paletes
      await this.demandaRepository.finalizarPalete(paletes);

      // 3️⃣ Atualizar demandas
      const demandas = await this.demandaRepository.findAll({
        paleteIds: paletes.map((p) => p.id),
      });

      for (const d of demandas) {
        const pendentes = await this.demandaRepository.countPaletesDemanda(
          d.id,
        );
        if (pendentes === 0) {
          await this.demandaRepository.finalizarDemandas([d]);
        }
      }

      // 4️⃣ Montar chaves transporte + processo
      const chaves = new Set(
        paletes.map((p) => `${p.transporteId}|${p.tipoProcesso}`),
      );

      // 5️⃣ Para cada transporte + processo
      for (const chave of chaves) {
        const [transporteId, processo] = chave.split('|');
        const restantes = await this.transporteRepository.countPaletesPendentes(
          transporteId,
          processo as DemandaProcesso,
          tx,
        );

        if (restantes === 0) {
          await this.transporteRepository.concluirTransporte(
            transporteId,
            processo as DemandaProcesso,
            atualizadoPor,
            tx,
          );
        }
      }
    });
  }
}
