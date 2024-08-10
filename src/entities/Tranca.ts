import {StatusTranca} from "./enums/StatusTranca";
import {Bicicleta} from "./Bicicleta";
import {Totem} from "./Totem";

export class Tranca {
    private _id: number;
    private _bicicleta: Bicicleta | null;
    private _numero: number;
    private _localizacao: string;
    private _anoDeFabricacao: string;
    private _modelo: string;
    private _statusTranca: StatusTranca;
    private _dataInsercaoTotem: string;
    private _totem: Totem | null;
    constructor(id: number, numero: number, localizacao: string, anoDeFabricacao: string, modelo: string, statusTranca: StatusTranca) {
        this._id = id;
        this._bicicleta = null
        this._numero = numero;
        this._localizacao = localizacao;
        this._anoDeFabricacao = anoDeFabricacao;
        this._modelo = modelo;
        this._statusTranca = statusTranca;
        this._dataInsercaoTotem = '';
        this._totem = null;
    }
    get id(): number{
        return this._id;
    }
    set id(value: number) {
        this._id = value;
    }
    get bicicleta(): Bicicleta | null {
        return this._bicicleta;
    }
    set bicicleta(value: Bicicleta) {
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
    get dataInsercaoTotem(): string {
        return this._dataInsercaoTotem;
    }
    set dataInsercaoTotem(value: string) {
        this._dataInsercaoTotem = value;
    }
    get totem(): Totem | null{
        return this._totem;
    }
    set totem(value: Totem) {
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
    toResponseJSON(){
        return {
            id: this.id,
            bicicleta: this.bicicleta?.id,
            numero: this.numero,
            localizacao: this.localizacao,
            anoDeFabricacao: this.anoDeFabricacao,
            modelo: this.modelo,
            statusTranca: this.statusTranca
        }

    }
    atualizar(dados: Partial<Tranca>): void{
        if (dados.numero) {
            this.numero = dados.numero;
        }
        if (dados.localizacao) {
            this.localizacao = dados.localizacao;
        }
        if (dados.anoDeFabricacao) {
            this.anoDeFabricacao = dados.anoDeFabricacao;
        }
        if (dados.modelo) {
            this.modelo = dados.modelo;
        }
        if (dados.statusTranca) {
            this.statusTranca = dados.statusTranca;
        }
    }
}
