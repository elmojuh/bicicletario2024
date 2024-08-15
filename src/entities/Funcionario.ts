interface FuncionarioProps {
    id: number;
    nome: string;
    email: string;
    cpf: string;
    senha: string;
    confirmacaoSenha: string;
    idade: number;
    funcao: string;
}

export class Funcionario {
    private _id: number;
    private _nome: string;
    private _email: string;
    private _cpf: string;
    private _senha: string;
    private _confirmacaoSenha: string;
    private _idade: number;
    private _funcao: string;

    constructor({ id, nome, email, cpf, senha, confirmacaoSenha, idade, funcao }: FuncionarioProps) {
        this._id = id;
        this._nome = nome;
        this._email = email;
        this._cpf = cpf;
        this._senha = senha;
        this._confirmacaoSenha = confirmacaoSenha;
        this._idade = idade;
        this._funcao = funcao;
    }

    get id(): number {
        return this._id;
    }
    set id(value: number) {
        this._id = value;
    }
    get nome(): string {
        return this._nome;
    }
    set nome(value: string) {
        this._nome = value;
    }
    get email(): string {
        return this._email;
    }
    set email(value: string) {
        this._email = value;
    }
    get cpf(): string {
        return this._cpf;
    }
    set cpf(value: string) {
        this._cpf = value;
    }
    get senha(): string {
        return this._senha;
    }
    set senha(value: string) {
        this._senha = value;
    }
    get confirmacaoSenha(): string {
        return this._confirmacaoSenha;
    }
    set confirmacaoSenha(value: string) {
        this._confirmacaoSenha = value;
    }
    get idade(): number {
        return this._idade;
    }
    set idade(value: number) {
        this._idade = value;
    }
    get funcao(): string {
        return this._funcao;
    }
    set funcao(value: string) {
        this._funcao = value;
    }
    toResponseJSON() {
        return {
            id: this.id,
            nome: this.nome,
            email: this.email,
            cpf: this.cpf,
            idade: this.idade,
            funcao: this.funcao
        }
    }
}
