import { Engine, Event, Rule, RuleProperties } from 'json-rules-engine';
import { Inject, Injectable } from '@nestjs/common';
import { type IEngineRulesRepository } from 'src/center/domain/repositories/engine-rules.repository';
import { Demanda } from 'src/gestao-produtividade/domain/entities/demanda.entity';
import { type IRegistroAnomaliaProdutividadeRepository } from './domain/repository/IRegistroAnomalia';
import { AnomaliaProdutividadeUpdateDataWithDateStartAndEnd } from './dto/anomaliaProdutividade.update.dto';
import { AnomaliaProdutividadeGetData } from './dto/anomaliaProdutividade.get.dto';

@Injectable()
export class AnomaliasProdutividadeService {
  constructor(
    @Inject('IEngineRulesRepository')
    private readonly engineRulesRepo: IEngineRulesRepository,
    @Inject('IRegistroAnomaliaProdutividadeRepository')
    private readonly registroAnomaliaProdutividadeRepo: IRegistroAnomaliaProdutividadeRepository,
  ) {}

  async verificarAnomalias(demanda: Demanda): Promise<void> {
    const engineRules = await this.engineRulesRepo.findAll(demanda.centerId);
    const engine = new Engine();
    engineRules.forEach((rule) => {
      engine.addRule(new Rule(rule.conditions as RuleProperties));
    });

    const facts = {
      tempoPorVisitaEmSegundos: demanda.tempoPorVisitaEmSegundos(), // Tempo médio gasto por visita em milissegundos
      tempoTrabalhadoDemandaEmSegundos:
        demanda.calcularTempoTrabalhado() / 1000, // Tempo total trabalhado dividido pela quantidade de visitas
      tempoTotalDemandaEmSegundos: demanda.calcularTempoTotal() / 1000, // Quantidade de Caixas
      tempoTotalPausasEmSegundos: demanda.calcularTempoPausas() / 1000, // Quantidade de Caixas
      quantidadeCaixas: demanda.quantidadeCaixas(), // Quantidade de Caixas
      quantidadeVisitas: demanda.quantidadeVisitas(), // Quantidade de Endereços Visitados
      quantidadeUnidades: demanda.quantidadeUnidades(), // Quantidade de Unidades
      quantidadePaletes: demanda.quantidadePaletesDemanda(), // Quantidade de Paletes
      statusDemanda: demanda.status, // Status da Demanda
      produtividade: demanda.calcularProdutividade(), // Produtividade
      inicio: demanda.inicio, // Início da Demanda
      fim: demanda.fim, // Fim da Demanda
    };

    const result = await engine.run(facts);
    if (result.events) {
      for (const event of result.events) {
        await this.registroAnomaliaProdutividadeRepo.create({
          criadoPorId: demanda.cadastradoPorId,
          demandaId: demanda.id,
          centerId: demanda.centerId,
          funcionarioId: demanda.funcionarioId,
          inicio: demanda.inicio,
          fim: demanda.fim,
          caixas: demanda.quantidadeCaixas(),
          unidades: demanda.quantidadeUnidades(),
          paletes: demanda.quantidadePaletesDemanda(),
          paletesNaDemanda: demanda.quantidadePaletesDemanda(),
          enderecosVisitado: demanda.quantidadeVisitas(),
          produtividade: demanda.calcularProdutividade(),
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
}
