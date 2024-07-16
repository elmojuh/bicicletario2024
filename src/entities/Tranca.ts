import {StatusTranca} from "./enums/StatusTranca";
import {Bicicleta} from "./Bicicleta";

export class Tranca {
    private _id?: number;
    private _bicicleta?: number;
    private _numero: number;
    private _statusTranca: StatusTranca;
    private _localizacao: string;
    private _anoDeFabricacao: string;
    private _modelo: string;
    constructor(numero: number, statusTranca: StatusTranca, localizacao: string, anoDeFabricacao: string, modelo: string, id?: number | undefined, bicicleta?: number) {
        this._id = id;
        this._bicicleta = bicicleta;
        this._numero = numero;
        this._statusTranca = statusTranca;
        this._localizacao = localizacao;
        this._anoDeFabricacao = anoDeFabricacao;
        this._modelo = modelo;
    }
    get id(): number | undefined{
        return this._id;
    }
    set id(value: number | undefined) {
        this._id = value;
    }
    get bicicleta(): number | undefined {
        return this._bicicleta;
    }
    set bicicleta(value: number) {
        this._bicicleta = value;
    }
    get numero(): number {
        return this._numero;
    }
    set numero(value: number) {
        this._numero = value;
    }
    get statusTranca(): StatusTranca {
        return this._statusTranca;
    }
    set statusTranca(value: StatusTranca) {
        this._statusTranca = value;
    }
    get localizacao(): string {
        return this._localizacao;
    }
    set localizacao(value: string) {
        this._localizacao = value;
    }
    get anoDeFabricacao(): string {
        return this._anoDeFabricacao;
    }
    set anoDeFabricacao(value: string) {
        this._anoDeFabricacao = value;
    }
    get modelo(): string {
        return this._modelo;
    }
    set modelo(value: string) {
        this._modelo = value;
    }
}
