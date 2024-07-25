export class Error {
    private codigo: string;
    private mensagem: string;

    constructor(codigo: string, mensagem: string) {
        this.codigo = codigo;
        this.mensagem = mensagem;
    }
}
