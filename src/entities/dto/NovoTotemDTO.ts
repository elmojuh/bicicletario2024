export class NovoTotemDTO {
    public localizacao: string;
    public descricao: string;
    constructor(localizacao: string, descricao: string) {
        this.localizacao = localizacao;
        this.descricao = descricao;
    }
}
