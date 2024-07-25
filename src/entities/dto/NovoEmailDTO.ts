export class NovoEmailDTO {
    public email: string;
    public assunto: string;
    public mensagem: string;
    constructor(email: string, assunto: string, mensagem: string) {
        this.email = email;
        this.assunto = assunto;
        this.mensagem = mensagem;
    }

}
