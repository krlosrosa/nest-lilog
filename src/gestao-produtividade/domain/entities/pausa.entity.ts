import {
  PausaGetData,
  getPausaSchema,
} from 'src/gestao-produtividade/dtos/pausa/pausa.get.dto';
import {
  PausaCreateData,
  createPausaSchema,
} from 'src/gestao-produtividade/dtos/pausa/pausa.create.dto';
import { BadRequestException } from '@nestjs/common';

export class Pausa {
  private props: PausaGetData;
  private _isNew: boolean = false; // Flag para o repositório

  private constructor(props: PausaGetData) {
    this.props = props;
  }

  public static fromData(props: PausaGetData): Pausa {
    getPausaSchema.parse(props);
    return new Pausa(props);
  }

  public static create(props: PausaCreateData): Pausa {
    createPausaSchema.parse(props);
    const pausa = new Pausa({
      ...props,
      id: 0, // ID Temporário
      fim: null, // Default
      motivo: props.motivo,
      descricao: props.descricao || null,
      pausaGeralId: props.pausaGeralId || null,
    });
    pausa._isNew = true;
    return pausa;
  }

  // -- métodos --

  public validarSePodeFinalizarPausaIndividual(): boolean {
    if (this.pausaGeralId !== null) {
      throw new BadRequestException(
        `Ação não permitida pois a pausa é uma pausa geral`,
      );
    }
    return true;
  }

  public dataInput(): PausaCreateData {
    const data = createPausaSchema
      .omit({ id: true, fim: true })
      .parse(this.props);
    return data;
  }

  // --- Getters ---
  public get id(): number {
    return this.props.id;
  }

  public get inicio(): string {
    return this.props.inicio;
  }

  public get fim(): string | null {
    return this.props.fim;
  }

  public get motivo(): string | null {
    return this.props.motivo;
  }

  public get descricao(): string | null {
    return this.props.descricao;
  }

  public get pausaGeralId(): number | null {
    return this.props.pausaGeralId;
  }

  public get cadastradoPorId(): string {
    return this.props.registradoPorId;
  }

  public get demandaId(): number {
    return this.props.demandaId;
  }
}
