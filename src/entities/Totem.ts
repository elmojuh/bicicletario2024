export class Totem {
    private _id : number | undefined;
    private _localizacao : string;
    private _descricao : string;
    constructor(id: number, localizacao: string, descricao: string) {
        this._id = id;
        this._localizacao = localizacao;
        this._descricao = descricao;
    }
    get id(): number | undefined{
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
    toJSON() {
        return {
            id: this._id,
            localizacao: this._localizacao,
            descricao: this._descricao
        }
    }
    toResponseJSON() {
        return {
            id: this._id,
            localizacao: this._localizacao,
            descricao: this._descricao
        }
    }
    atualizar(dados: Partial<Totem>): void{
        if (dados.localizacao) {
            this.localizacao = dados.localizacao;
        }
        if (dados.descricao) {
            this.descricao = dados.descricao;
        }
    }
}
