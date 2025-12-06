import { Engine, Event, Rule, RuleProperties } from 'json-rules-engine';
import { Inject, Injectable } from '@nestjs/common';
import { type IEngineRulesRepository } from 'src/center/domain/repositories/engine-rules.repository';
import { Demanda } from 'src/gestao-produtividade/domain/entities/demanda.entity';
import { type IRegistroAnomaliaProdutividadeRepository } from './domain/repository/IRegistroAnomalia';
import { AnomaliaProdutividadeUpdateDataWithDateStartAndEnd } from './dto/anomaliaProdutividade.update.dto';
import { AnomaliaProdutividadeGetData } from './dto/anomaliaProdutividade.get.dto';
import { timeToSecondsLuxon } from 'src/_shared/utils/convert';

@Injectable()
export class AnomaliasProdutividadeService {
  constructor(
    @Inject('IEngineRulesRepository')
    private readonly engineRulesRepo: IEngineRulesRepository,
    @Inject('IRegistroAnomaliaProdutividadeRepository')
    private readonly registroAnomaliaProdutividadeRepo: IRegistroAnomaliaProdutividadeRepository,
  ) {}

  async verificarAnomalias(demanda: Demanda): Promise<void> {
    const demandaData =
      await this.registroAnomaliaProdutividadeRepo.getDemandaById(
        demanda.id.toString(),
      );
    if (!demandaData) {
      return;
    }
    const engineRules = await this.engineRulesRepo.findAll(demanda.centerId);
    const engineFilter = engineRules.filter(
      (rule) => rule.processo === 'ANOMALIA_PRODUTIVIDADE',
    );
    const engine = new Engine();
    engineFilter.forEach((rule) => {
      engine.addRule(new Rule(rule.conditions as RuleProperties));
    });

    const facts = {
      tempoPorVisitaEmSegundos:
        timeToSecondsLuxon(demandaData.tempoTrabalhado ?? '') /
        (Number(demandaData.totalEnderecosVisitado ?? 0) || 1), // Tempo médio gasto por visita em milissegundos
      tempoTotalDemandaEmSegundos: timeToSecondsLuxon(
        demandaData.tempoTrabalhado ?? '',
      ), // Quantidade de Caixas
      tempoTotalPausasEmSegundos: timeToSecondsLuxon(
        demandaData.tempoTotal ?? '',
      ), // Quantidade de Caixas
      quantidadeCaixas: demandaData.totalCaixas ?? 0, // Quantidade de Caixas
      quantidadeVisitas: demandaData.totalEnderecosVisitado ?? 0, // Quantidade de Endereços Visitados
      quantidadeUnidades: demandaData.totalUnidades ?? 0, // Quantidade de Unidades
      quantidadePaletes: demandaData.qtdPaletes ?? 0, // Quantidade de Paletes
      statusDemanda: demandaData.status ?? '', // Status da Demanda
      produtividade: Number(demandaData.produtividadeCaixaPorHora ?? 0), // Produtividade
      inicio: demandaData.inicio ?? '', // Início da Demanda
      fim: demandaData.fim ?? '', // Fim da Demanda
      processo: demandaData.processo ?? '', // Processo da Demanda
      turno: demandaData.turno ?? '', // Turno da Demanda
      status: demandaData.status ?? '', // Status da Demanda
    };

    const result = await engine.run(facts);
    if (result.events) {
      for (const event of result.events) {
        await this.registroAnomaliaProdutividadeRepo.create({
          criadoPorId: demandaData.criadoporid ?? '',
          demandaId: demandaData.demandaid ?? 0,
          centerId: demandaData.centerid ?? '',
          funcionarioId: demandaData.funcionarioid ?? '',
          inicio: demandaData.inicio ?? '',
          fim: demandaData.fim ?? '',
          caixas: demandaData.totalCaixas ?? 0,
          unidades: demandaData.totalUnidades ?? 0,
          paletes: demandaData.totalPaletes ?? 0,
          paletesNaDemanda: demandaData.qtdPaletes ?? 0,
          enderecosVisitado: demandaData.totalEnderecosVisitado ?? 0,
          produtividade: Number(demandaData.produtividadeCaixaPorHora ?? 0),
          motivoAnomalia: event.type.toString(),
          motivoAnomaliaDescricao: event?.params?.message,
        });
      }
    }
  }

  async getAllAnomalias(
    centerId: string,
    params: AnomaliaProdutividadeUpdateDataWithDateStartAndEnd,
  ): Promise<AnomaliaProdutividadeGetData[]> {
    return this.registroAnomaliaProdutividadeRepo.getAllAnomalias(
      centerId,
      params,
    );
  }

  async verificarAnomaliasTransporte(
    transporteId: string,
    centerId: string,
  ): Promise<void> {
    const transporte =
      await this.registroAnomaliaProdutividadeRepo.getTransporteById(
        transporteId,
      );
    if (!transporte) {
      return;
    }
    const engineRules = await this.engineRulesRepo.findAll(centerId);
    const engineFilter = engineRules.filter(
      (rule) => rule.processo === 'TRANSPORTE',
    );
    const engine = new Engine();
    engine.addOperator('greaterThan', (a: Date, b: Date) => a > b);
    engine.addOperator('lessThan', (a: Date, b: Date) => a < b);

    engineFilter.forEach((rule) => {
      engine.addRule(new Rule(rule.conditions as unknown as RuleProperties));
    });

    const facts = {
      nomeTransportadora: transporte.nomeTransportadora ?? '',
      placa: transporte.placa ?? '',
      prioridade: transporte.prioridade ?? 0,
      carregamento: transporte.carregamento ?? '',
      conferencia: transporte.conferencia ?? '',
      separacao: transporte.separacao ?? '',
      cargaParada: transporte.cargaParada ?? false,
    };
    const result = await engine.run(facts);
    if (result.events) {
      for (const event of result.events) {
        await this.registroAnomaliaProdutividadeRepo.createTransporteAnomalia({
          anomalia: event.type.toString(),
          transporteId: transporteId,
          anomaliaPersonalizada: event.params?.message ?? '',
          createdAt: new Date().toISOString(),
        });
      }
    }
  }
}
