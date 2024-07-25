export class Email {
    private id: number;
    private email: string;
    private assunto: string;
    private mensagem: string;
    constructor(id: number, email: string, assunto: string, mensagem: string) {
        this.id = id;
        this.email = email;
        this.assunto = assunto;
        this.mensagem = mensagem
    }
}
