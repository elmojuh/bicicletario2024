export class TrancaDTO {
    public id?: number;
    public statusTranca: string;
    public localizacao: string;
    public anoDeFabricacao: string;
    public modelo: string;
    constructor(statusTranca: string, localizacao: string, anoDeFabricacao: string, modelo: string, id?: number) {
        this.id = id;
        this.statusTranca = statusTranca;
        this.localizacao = localizacao;
        this.anoDeFabricacao = anoDeFabricacao;
        this.modelo = modelo
    }
}
