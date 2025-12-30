import {
  StatusTransporte,
  TransporteStatus,
} from 'src/_shared/enums/transporte-status.enum';
import {
  getTransporteSchema,
  TransporteGetData,
} from 'src/transporte/dto/transporte.get.dto';
import { TransporteCreateData } from 'src/transporte/dto/transporte.create.dto';
import { createTransporteSchema } from 'src/transporte/dto/transporte.create.dto';
import { Palete } from 'src/gestao-produtividade/domain/entities/palete.entity';
import { StatusPalete } from 'src/_shared/enums/palete-status.enum';
import { DemandaProcesso } from 'src/_shared/enums';
import { type TransporteUpdateData } from 'src/transporte/dto/transporte.update.dto';

export class Transporte {
  private props: TransporteGetData;
  private _paletes: Palete[];
  private _isNew: boolean = false; // Flag para o repositório

  private constructor(props: TransporteGetData, paletes: Palete[]) {
    this.props = props;
    this._paletes = paletes;
  }

  public static fromData(props: TransporteGetData): Transporte {
    const paletes =
      props.paletes?.map((palete) => Palete.fromData(palete)) || [];
    getTransporteSchema.parse(props);
    return new Transporte(props, paletes);
  }

  public static create(props: TransporteCreateData): Transporte {
    // 1. Valida os dados de ENTRADA (sem id)
    createTransporteSchema.parse(props);

    // 2. Cria a entidade completa com valores padrão
    const transporteCompleta: TransporteGetData = {
      ...props,
      id: 0, // Um ID temporário para indicar que é novo
      criadoEm: new Date().toISOString(), // Valor padrão
      status: StatusTransporte.AGUARDANDO_SEPARACAO, // Valor padrão
      obs: null,
      dataExpedicao: new Date().toISOString(), // Valor padrão
      prioridade: 0, // Valor padrão
      carregamento: TransporteStatus.NAO_INICIADO, // Valor padrão
      conferencia: TransporteStatus.NAO_INICIADO, // Valor padrão
      separacao: TransporteStatus.NAO_INICIADO, // Valor padrão
      paletes: [],
      cargaParada: false,
    };

    const transporte = new Transporte(transporteCompleta, []);
    transporte._isNew = true; // Seta a flag
    return transporte;
  }

  // --- Methods ---

  public updateStatus(
    processo: DemandaProcesso,
  ): TransporteUpdateData | undefined {
    const allFinished = this.allFinished();
    if (allFinished) {
      if (processo === DemandaProcesso.SEPARACAO) {
        this.props.separacao = TransporteStatus.CONCLUIDO;
        return {
          separacao: this.props.separacao as TransporteStatus,
          numeroTransporte: this.props.numeroTransporte,
        };
      }
      if (processo === DemandaProcesso.CONFERENCIA) {
        this.props.conferencia = TransporteStatus.CONCLUIDO;
        return {
          conferencia: this.props.conferencia as TransporteStatus,
          numeroTransporte: this.props.numeroTransporte,
        };
      }
      if (processo === DemandaProcesso.CARREGAMENTO) {
        this.props.carregamento = TransporteStatus.CONCLUIDO;
        return {
          carregamento: this.props.carregamento as TransporteStatus,
          numeroTransporte: this.props.numeroTransporte,
        };
      }
    }
    const oneInProgress = this.oneInProgress();
    if (oneInProgress) {
      if (
        processo === DemandaProcesso.SEPARACAO &&
        this.props.separacao === 'NAO_INICIADO'
      ) {
        this.props.separacao = TransporteStatus.EM_PROGRESSO;
        return {
          separacao: this.props.separacao as TransporteStatus,
          numeroTransporte: this.props.numeroTransporte,
        };
      }
      if (
        processo === DemandaProcesso.CONFERENCIA &&
        this.props.conferencia === 'NAO_INICIADO'
      ) {
        this.props.conferencia = TransporteStatus.EM_PROGRESSO;
        return {
          conferencia: this.props.conferencia as TransporteStatus,
          numeroTransporte: this.props.numeroTransporte,
        };
      }
      if (
        processo === DemandaProcesso.CARREGAMENTO &&
        this.props.carregamento === 'NAO_INICIADO'
      ) {
        this.props.carregamento = TransporteStatus.EM_PROGRESSO;
        return {
          carregamento: this.props.carregamento as TransporteStatus,
          numeroTransporte: this.props.numeroTransporte,
        };
      }
    }
  }

  public allFinished(): boolean {
    return this._paletes.every(
      (palete) => palete.status === StatusPalete.CONCLUIDO,
    );
  }

  public oneInProgress(): boolean {
    return this._paletes.some(
      (palete) => palete.status === StatusPalete.EM_PROGRESSO,
    );
  }

  // --- Saves ---
  public get dataInput(): TransporteCreateData {
    const data = createTransporteSchema.omit({ id: true }).parse(this.props);
    return data;
  }

  public get statusSeparacao(): TransporteStatus {
    return this.props.separacao as TransporteStatus;
  }

  public get statusConferencia(): TransporteStatus {
    return this.props.conferencia as TransporteStatus;
  }

  public get statusCarregamento(): TransporteStatus {
    return this.props.carregamento as TransporteStatus;
  }

  public get numeroTransporte(): string {
    return this.props.numeroTransporte;
  }

  // --- Getters ---
  public get id(): number {
    return this.props.id;
  }

  public get paletes(): Palete[] {
    return this._paletes;
  }

  public get status(): TransporteStatus {
    return this.props.status as TransporteStatus;
  }

  public get criadoEm(): string {
    return this.props.criadoEm;
  }

  public get obs(): string | null {
    return this.props.obs;
  }

  public get alteradoPorId(): string | null {
    return this.props.cadastradoPorId;
  }
}
