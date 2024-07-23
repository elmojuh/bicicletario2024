export class Totem {
    private _id : number | undefined;
    private _localizacao : string;
    private _descricao : string;
    constructor(localizacao: string, descricao: string) {
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
}
