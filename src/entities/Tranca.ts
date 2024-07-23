import {StatusTranca} from "./enums/StatusTranca";
import {Bicicleta} from "./Bicicleta";
import {Totem} from "./Totem";

export class Tranca {
    private _id?: number;
    private _bicicleta?: Bicicleta;
    private _numero: number;
    private _localizacao: string;
    private _anoDeFabricacao: string;
    private _modelo: string;
    private _statusTranca: StatusTranca;
    private _dataInsercaoTotem?: string;
    private _totem?: Totem;
    constructor(numero: number, localizacao: string, anoDeFabricacao: string, modelo: string, statusTranca: StatusTranca) {
        this._numero = numero;
        this._localizacao = localizacao;
        this._anoDeFabricacao = anoDeFabricacao;
        this._modelo = modelo;
        this._statusTranca = statusTranca;
    }
    get id(): number | undefined{
        return this._id;
    }
    set id(value: number | undefined) {
        this._id = value;
    }
    get bicicleta(): Bicicleta | undefined {
        return this._bicicleta;
    }
    set bicicleta(value: Bicicleta | undefined) {
        this._bicicleta = value;
    }
    get numero(): number {
        return this._numero;
    }
    set numero(value: number) {
        this._numero = value;
    }
    get statusTranca(): StatusTranca {
        return <StatusTranca>this._statusTranca;
    }
    set statusTranca(value: StatusTranca) {
        this._statusTranca = value;
    }
    get dataInsercaoTotem(): string | undefined {
        return this._dataInsercaoTotem;
    }
    set dataInsercaoTotem(value: string | undefined) {
        this._dataInsercaoTotem = value;
    }
    get totem(): Totem | undefined {
        return this._totem;
    }
    set totem(value: Totem | undefined) {
        this._totem = value;
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
    toJSON() {
        return {
            id: this._id,
            bicicleta: this._bicicleta,
            numero: this._numero,
            localizacao: this._localizacao,
            anoDeFabricacao: this._anoDeFabricacao,
            modelo: this._modelo,
            statusTranca: this._statusTranca,
            dataInsercaoTotem: this._dataInsercaoTotem,
            totem: this._totem
        }
    }
}
