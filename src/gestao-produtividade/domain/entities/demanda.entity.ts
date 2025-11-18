import { DemandaGetData } from 'src/gestao-produtividade/dtos/demanda/demanda.get.dto';
import { DemandaCreateData } from 'src/gestao-produtividade/dtos/demanda/demanda.create.dto';
import {
  DemandaProcesso,
  DemandaStatus,
  DemandaTurno,
} from 'src/_shared/enums';
import { Pausa } from './pausa.entity';
import { Palete } from './palete.entity';
import { BadRequestException } from '@nestjs/common';
import { StatusPalete } from 'src/_shared/enums/palete-status.enum';
import { User } from 'src/user/domain/repository/user.repository';

export class Demanda {
  private props: DemandaGetData;
  private _isNew: boolean = false; // Flag para o repositório
  private _pausas: Pausa[]; // Lista de ENTIDADES Pausa
  private _paletes: Palete[]; // Lista de ENTIDADES Palete
  private _funcionario?: User | null; // Lista de ENTIDADES User
  private constructor(
    props: DemandaGetData,
    pausas: Pausa[],
    paletes: Palete[],
    funcionario?: User | null,
  ) {
    this.props = props;
    this._pausas = pausas || [];
    this._paletes = paletes || [];
    this._funcionario = funcionario || null;
  }

  public static fromData(props: DemandaGetData): Demanda {
    const pausas =
      props.pausas?.map((pausaData) => Pausa.fromData(pausaData)) || [];
    const paletes =
      props.paletes?.map((paleteData) => Palete.fromData(paleteData)) || [];
    const funcionario = props.funcionario
      ? User.fromData(props.funcionario)
      : null;
    return new Demanda(props, pausas, paletes, funcionario);
  }

  public static create(props: DemandaCreateData): Demanda {
    // 1. Valida os dados de ENTRADA (sem id)

    // 2. Cria a entidade completa com valores padrão
    const demandaCompleta: DemandaGetData = {
      ...props,
      inicio: new Date().toISOString(),
      id: 0, // Um ID temporário para indicar que é novo
      fim: null, // Valor padrão
      criadoEm: new Date().toISOString(), // Valor padrão
      status: DemandaStatus.EM_PROGRESSO, // Valor padrão
      obs: null,
      dataExpedicao: new Date().toISOString(),
      pausas: [], // Começa sem pausas
      paletes: [], // Começa sem paletes
    };

    const demanda = new Demanda(demandaCompleta, [], []);
    demanda._isNew = true; // Seta a flag
    return demanda;
  }

  public validarPausas(): boolean {
    const listarPausas = this._pausas.filter((pausa) => !pausa.fim);
    if (listarPausas.length > 0) {
      if (listarPausas.every((pausa) => pausa.motivo === 'FALTA_PRODUTO')) {
        return true;
      }
      throw new BadRequestException(
        `Ação não permitida pois está pausado na demanda ${this.id}.`,
      );
    }
    return true;
  }

  public tempoPorVisitaEmSegundos(): number {
    return this.calcularTempoTrabalhado() / 1000 / this.quantidadeVisitas();
  }

  public validarRestricoesPorFuncionario(): boolean {
    if (this.status === DemandaStatus.PAUSA) {
      this.validarPausas();
    }
    if (this.status === DemandaStatus.EM_PROGRESSO) {
      throw new BadRequestException(
        `Funcionário não pode iniciar nova demanda pois já ta alocado na demanda ${this.id}.`,
      );
    }
    return true;
  }

  public validarRestricoesPorPalete(paletesIds: string[]): boolean {
    for (const palete of this._paletes) {
      if (!paletesIds.includes(palete.id)) {
        throw new BadRequestException(`Palete ${palete.id} não encontrada.`);
      }
      if (palete.demandaId) {
        throw new BadRequestException(
          `Palete ${palete.id} já está alocado na demanda ${palete.demandaId}.`,
        );
      }
    }
    return true;
  }

  public validarSePodePausarIndividual(): boolean {
    if (this.status === DemandaStatus.PAUSA) {
      this.validarPausas();
    }
    if (this.status === DemandaStatus.FINALIZADA) {
      throw new BadRequestException(
        `Demanda não pode ser pausada pois a demanda já foi finalizada`,
      );
    }
    if (this.status === DemandaStatus.CANCELADA) {
      throw new BadRequestException(
        `Demanda não pode ser pausada pois a demanda já foi cancelada`,
      );
    }
    return true;
  }

  public validarSePodeFinalizarPausaIndividual(): boolean {
    const listarPausas = this._pausas.filter((pausa) => !pausa.fim);
    if (listarPausas.length > 0) {
      listarPausas.forEach((pausa) => {
        pausa.validarSePodeFinalizarPausaIndividual();
      });
    }
    if (this.status !== DemandaStatus.PAUSA) {
      throw new BadRequestException(
        `Ação não permitida pois a demanda não está pausada`,
      );
    }
    return true;
  }

  public adicionarPalete(palete: Palete): void {
    this._paletes.push(palete);
  }

  public validarSePaletesFinalizados(): boolean {
    return this._paletes.every(
      (palete) => palete.status === StatusPalete.CONCLUIDO,
    );
  }

  // --- Getters ---

  public quantidadePaletesDemanda(): number {
    return this._paletes?.length ?? 0;
  }

  public calcularTempoTotal(): number {
    return this.fim
      ? new Date(this.fim).getTime() - new Date(this.inicio).getTime()
      : new Date().getTime() - new Date(this.inicio).getTime();
  }

  public finalizarDemanda(): void {
    this.props.fim = new Date().toISOString();
    this.props.status = DemandaStatus.FINALIZADA;
  }

  public calcularTempoPausas(): number {
    return (
      this._pausas?.reduce(
        (acc, pausa) =>
          acc +
          (pausa.fim
            ? new Date(pausa.fim).getTime() - new Date(pausa.inicio).getTime()
            : new Date().getTime() - new Date(pausa.inicio).getTime()),
        0,
      ) ?? 0
    );
  }

  public quantidadeCaixas(): number {
    return (
      this._paletes?.reduce(
        (acc, palete) => acc + palete.quantidadeCaixas,
        0,
      ) ?? 0
    );
  }

  public quantidadeUnidades(): number {
    return (
      this._paletes?.reduce(
        (acc, palete) => acc + palete.quantidadeUnidades,
        0,
      ) ?? 0
    );
  }

  public quantidadePausas(): number {
    return this._pausas?.length ?? 0;
  }

  public calcularTempoTrabalhado(): number {
    const tempototal = this.calcularTempoTotal();
    const tempoPausas = this.calcularTempoPausas();
    return tempototal - tempoPausas;
  }

  public calcularProdutividade(): number {
    const tempototal = this.calcularTempoTrabalhado();
    const horas = tempototal / 3600000;
    return this.quantidadeCaixas() / horas;
  }

  public quantidadePaletes(): number {
    return (
      this._paletes?.reduce(
        (acc, palete) => acc + palete.quantidadePaletes,
        0,
      ) ?? 0
    );
  }

  public quantidadeVisitas(): number {
    return (
      this._paletes?.reduce(
        (acc, palete) => acc + palete.enderecoVisitado,
        0,
      ) ?? 0
    );
  }

  public get listaPausas(): Pausa[] {
    return this._pausas;
  }

  public get listaPaletes(): Palete[] {
    return this._paletes;
  }

  public get id(): number {
    return this.props.id;
  }

  public get funcionarioId(): string {
    return this.props.funcionarioId;
  }

  public get status(): DemandaStatus {
    return this.props.status as DemandaStatus;
  }

  public get pausas(): Pausa[] {
    return this._pausas;
  }

  public get paletes(): Palete[] {
    return this._paletes;
  }

  public get criadoEm(): string {
    return this.props.criadoEm;
  }

  public get obs(): string | null {
    return this.props.obs;
  }

  public get segmento(): string {
    return this._paletes?.[0]?.segmento ?? '';
  }

  public get empresa(): string {
    return this._paletes?.[0]?.empresa ?? '';
  }

  get centerId(): string {
    return this.props.centerId;
  }

  public get processo(): DemandaProcesso {
    return this.props.processo as DemandaProcesso;
  }

  public get inicio(): string {
    return this.props.inicio;
  }

  public get fim(): string | null {
    return this.props.fim;
  }

  public get cadastradoPorId(): string {
    return this.props.cadastradoPorId;
  }

  public get turno(): DemandaTurno {
    return this.props.turno as DemandaTurno;
  }

  public get nomeFuncionario(): string {
    return this._funcionario?.name ?? '';
  }

  public get dataExpedicao(): string {
    return this.props.dataExpedicao;
  }
}
