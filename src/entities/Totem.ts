export class Totem {
    private _id : number;
    private _localizacao : string;
    private _descricao : string;
    constructor(id: number, localizacao: string, descricao: string) {
        this._id = id;
        this._localizacao = localizacao;
        this._descricao = descricao;
    }
    get id(): number{
        return this._id;
    }
    set id(value: number) {
        this._id = value;
    }
    get localizacao(): string {
        return this._localizacao;
    }
    set localizacao(value: string) {
        this._localizacao = value;
    }
    get descricao(): string {
        return this._descricao;
    }
    set descricao(value: string) {
        this._descricao = value;
    }
    toResponseJSON() {
        return {
            id: this.id,
            localizacao: this.localizacao,
            descricao: this.descricao
        }
    }
    atualizar(dados: Partial<Totem>): void{
        if (dados.localizacao !== undefined) {
            this.localizacao = dados.localizacao;
        }
        if (dados.descricao !== undefined) {
            this.descricao = dados.descricao;
        }
    }
}
