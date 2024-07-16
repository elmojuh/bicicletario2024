export class NovaTrancaDTO {
    public numero: number;
    public localizacao: string;
    public anoDeFabricacao: string;
    public modelo: string;
    public status: string;
    constructor(numero: number, localizacao: string, anoDeFabricacao: string, modelo: string, status: string) {
        this.numero = numero;
        this.localizacao = localizacao;
        this.anoDeFabricacao = anoDeFabricacao;
        this.modelo = modelo;
        this.status = status;
    }
}
