import {Bicicleta} from "../Bicicleta";
import {StatusBicicleta} from "../enums/StatusBicicleta";

export class BicicletaDTO {
    public id?: number;
    public marca: string;
    public modelo: string;
    public ano: string;
    public numero: number;
    public status: string;

    constructor(marca: string, modelo: string, ano: string, numero: number, status: string, id?: number) {
        this.id = id;
        this.marca = marca;
        this.modelo = modelo;
        this.ano = ano;
        this.numero = numero;
        this.status = status;
    }

    static toEntity(dto: BicicletaDTO): Bicicleta {
        return new Bicicleta(
            dto.marca,
            dto.modelo,
            dto.ano,
            dto.numero,
            StatusBicicleta[dto.status as keyof typeof StatusBicicleta],
            '', // Supondo que dataInsercaoTranca é gerada automaticamente ou não necessária aqui
            undefined, // tranca não é especificada no DTO
            dto.id
        );
    }
}
