
export class NovoFuncionarioDTO{
    public senha: string;
    public confirmacaoSenha: string;
    public email: string;
    public nome: string;
    public idade: number;
    public funcao: string;
    public cpf: string;
    constructor(senha: string, confirmacaoSenha: string, email: string, nome: string, idade: number, funcao: string, cpf: string) {
        this.senha = senha;
        this.confirmacaoSenha = confirmacaoSenha;
        this.email = email;
        this.nome = nome;
        this.idade = idade;
        this.funcao = funcao;
        this.cpf = cpf;
    }

}
