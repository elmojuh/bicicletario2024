export class Funcionario {
    id: number;
    nome: string;
    email: string;
    cpf: string;
    senha: string;
    confirmacaoSenha: string;
    idade: number;
    funcao: string;

    constructor(id: number, nome: string, email: string, cpf: string, senha: string, confirmacaoSenha: string, idade: number, funcao: string) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.cpf = cpf;
        this.senha = senha;
        this.confirmacaoSenha = confirmacaoSenha;
        this.idade = idade;
        this.funcao = funcao;
    }
}
