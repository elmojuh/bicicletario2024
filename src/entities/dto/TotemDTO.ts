export class TotemDTO {
    public id?: number;
    public localizacao: string;
    public descricao: string;
    constructor(localizacao: string, descricao: string, id?: number) {
        this.id = id;
        this.localizacao = localizacao;
        this.descricao = descricao;
    }
}
