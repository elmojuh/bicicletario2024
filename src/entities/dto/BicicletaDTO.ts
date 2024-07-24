import {StatusBicicleta} from "../enums/StatusBicicleta";

export class BicicletaDTO {
    public id?: number;
    public marca: string;
    public modelo: string;
    public ano: string;
    public numero: number;
    public status: StatusBicicleta;

    constructor(marca: string, modelo: string, ano: string, numero: number, status: StatusBicicleta, id?: number) {
        this.id = id;
        this.marca = marca;
        this.modelo = modelo;
        this.ano = ano;
        this.numero = numero;
        this.status = status;
    }
}
