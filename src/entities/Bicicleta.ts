import { StatusBicicleta } from './enums/StatusBicicleta';
import { Tranca } from './Tranca';

export class Bicicleta{
  private _id?: number;
  private _marca: string;
  private _modelo: string;
  private _ano: string;
  private _numero: number;
  private _statusBicicleta: StatusBicicleta;
  private _dataInsercaoTranca?: string;
  private _tranca?: Tranca | null;

  constructor(marca: string, modelo: string, ano: string, numero: number, statusBicicleta: StatusBicicleta) {
    this._marca = marca;
    this._modelo = modelo;
    this._ano = ano;
    this._numero = numero;
    this._statusBicicleta = statusBicicleta;
  }

    get id(): number | undefined {
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
        return <StatusBicicleta>this._statusBicicleta;
    }
    set statusBicicleta(value: StatusBicicleta) {
        this._statusBicicleta = value;
    }
    get dataInsercaoTranca(): string {
        return <string>this._dataInsercaoTranca;
    }
    set dataInsercaoTranca(value: string) {
        this._dataInsercaoTranca = value;
    }
    get tranca(): Tranca | null | undefined {
        return this._tranca;
    }
    set tranca(value: Tranca ) {
        this._tranca = value;
    }
    toJSON() {
        return {
            id: (this.id),
            marca: this.marca,
            modelo: this.modelo,
            ano: this.ano,
            numero: this.numero,
            statusBicicleta: this.statusBicicleta,
            dataInsercaoTranca: this.dataInsercaoTranca,
            tranca: this.tranca
        };
    }

}
