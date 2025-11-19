import {
  PaleteGetData,
  getPaleteSchema,
} from 'src/gestao-produtividade/dtos/palete/palete.get.dto';
import {
  PaleteCreateData,
  createPaleteSchema,
} from 'src/gestao-produtividade/dtos/palete/palete.create.dto';
import { DemandaProcesso } from 'src/_shared/enums';
import { StatusPalete } from 'src/_shared/enums/palete-status.enum';
import { BadRequestException } from '@nestjs/common';

export class Palete {
  private props: PaleteGetData;
  private _isNew: boolean = false; // Flag para o repositório

  private constructor(props: PaleteGetData) {
    this.props = props;
  }

  public static fromData(props: PaleteGetData): Palete {
    getPaleteSchema.parse(props);
    return new Palete(props);
  }

  public static create(props: PaleteCreateData): Palete {
    createPaleteSchema.parse(props);
    const palete = new Palete({
      ...props,
      id: '', // ID Temporário
      criadoEm: new Date().toISOString(), // Valor padrão
      atualizadoEm: new Date().toISOString(), // Valor padrão
      status: StatusPalete.NAO_INICIADO, // Valor padrão
      validado: false, // Valor padrão
      tipoProcesso: DemandaProcesso.SEPARACAO, // Valor padrão
      demandaId: null, // Valor padrão
      inicio: null,
      fim: null,
      totalCaixas: 0,
      pesoLiquido: 0,
    });
    palete._isNew = true;
    return palete;
  }

  public validarSePodeSerFinalizado(): void {
    if (this.props.status !== 'EM_PROGRESSO') {
      throw new BadRequestException(
        `Palete ${this.props.id} não pode ser finalizada pois não foi concluída. Status Atual: ${this.props.status}`,
      );
    }
  }

  // --- Getters ---
  public get id(): string {
    return this.props.id;
  }

  public get empresa(): string {
    return this.props.empresa;
  }

  public get quantidadeCaixas(): number {
    return this.props.quantidadeCaixas;
  }

  public get quantidadeUnidades(): number {
    return this.props.quantidadeUnidades;
  }

  public get quantidadePaletes(): number {
    return this.props.quantidadePaletes;
  }

  public get enderecoVisitado(): number {
    return this.props.enderecoVisitado;
  }

  public get segmento(): string {
    return this.props.segmento;
  }

  public get transporteId(): string {
    return this.props.transporteId;
  }

  public get tipoProcesso(): DemandaProcesso {
    return this.props.tipoProcesso as DemandaProcesso;
  }

  public get criadoEm(): string {
    return this.props.criadoEm;
  }

  public get atualizadoEm(): string {
    return this.props.atualizadoEm;
  }

  public get status(): StatusPalete {
    return this.props.status as StatusPalete;
  }

  public get validado(): boolean {
    return this.props.validado;
  }

  public get demandaId(): number | null {
    return this.props.demandaId;
  }

  public get inicio(): string | null {
    return this.props.inicio;
  }

  public get fim(): string | null {
    return this.props.fim;
  }

  public get criadoPorId(): string {
    return this.props.criadoPorId;
  }
}
