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

    setCodigo(codigo: string) {
        this.codigo = codigo;
    }

    setMensagem(mensagem: string) {
        this.mensagem = mensagem;
    }

    toJson() {
        return {
            codigo: this.codigo,
            mensagem: this.mensagem
        }
    }
}
