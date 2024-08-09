export class Error {
    private codigo: string;
    private mensagem: string;

    constructor(codigo: string, mensagem: string) {
        this.codigo = codigo;
        this.mensagem = mensagem;
    }

    getCodigo(): string {
        return this.codigo;
    }

    getMensagem(): string {
        return this.mensagem;
    }
}
