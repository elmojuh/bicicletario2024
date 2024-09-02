import {StatusBicicleta} from './enums/StatusBicicleta';
import {Tranca} from './Tranca';

export class Bicicleta{
  private _id: number;
  private _marca: string;
  private _modelo: string;
  private _ano: string;
  private _numero: number;
  private _statusBicicleta: StatusBicicleta;
  private _dataInsercaoTranca: string | null;
  private _tranca: Tranca | null;

  constructor(id: number, marca: string, modelo: string, ano: string, numero: number, statusBicicleta: StatusBicicleta) {
    this._id = id;
    this._marca = marca;
    this._modelo = modelo;
    this._ano = ano;
    this._numero = numero;
    this._statusBicicleta = StatusBicicleta.NOVA;
    this._dataInsercaoTranca = '';
    this._tranca = null;
  }

    get id(): number {
      return this._id;
    }
    set id(value: number) {
        this._id = value;
    }
    get marca(): string {
        return this._marca;
    }
    set marca(value: string) {
        this._marca = value;
    }
    get modelo(): string {
        return this._modelo;
    }
    set modelo(value: string) {
        this._modelo = value;
    }
    get ano(): string {
        return this._ano;
    }
    set ano(value: string) {
        this._ano = value;
    }
    get numero(): number {
        return this._numero;
    }
    set numero(value: number) {
        this._numero = value;
    }
    get statusBicicleta(): StatusBicicleta {
        return this._statusBicicleta;
    }
    set statusBicicleta(value: StatusBicicleta) {
        this._statusBicicleta = value;
    }
    get dataInsercaoTranca(): string | null{
        return this._dataInsercaoTranca;
    }
    set dataInsercaoTranca(value: string) {
        this._dataInsercaoTranca = value;
    }
    get tranca(): Tranca | null {
        return this._tranca;
    }
    set tranca(value: Tranca | null ) {
        this._tranca = value;
    }

    toResponseJSON() {
        return {
            id: this.id,
            marca: this.marca,
            modelo: this.modelo,
            ano: this.ano,
            numero: this.numero,
            status: this.statusBicicleta
        };
    }

    atualizar(dados: Partial<Bicicleta>): void {
        if (dados.marca !== undefined) {
            this._marca = dados.marca;
        }
        if (dados.modelo !== undefined) {
            this._modelo = dados.modelo;
        }
        if (dados.ano !== undefined) {
            this._ano = dados.ano;
        }
        if (dados.numero !== undefined) {
            this._numero = dados.numero;
        }
        if (dados.statusBicicleta !== undefined) {
            this._statusBicicleta = dados.statusBicicleta;
        }
        if (dados.dataInsercaoTranca !== undefined) {
            this._dataInsercaoTranca = dados.dataInsercaoTranca;
        }
        if (dados.tranca !== undefined) {
            this._tranca = dados.tranca;
        }
    }

}
