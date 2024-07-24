export class Error {
    private codigo: string;
    private mensagem: string;

    constructor(codigo: string, mensagem: string) {
        this.codigo = codigo;
        this.mensagem = mensagem;
    }

    public getCodigo(): string {
        return this.codigo;
    }

    public setCodigo(codigo: string): void {
        this.codigo = codigo;
    }

    public getMensagem(): string {
        return this.mensagem;
    }

    public setMensagem(mensagem: string): void {
        this.mensagem = mensagem;
    }
}
