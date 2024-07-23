import { FuncionarioService } from './FuncionarioService';
import { Constantes } from '../entities/constants/Constantes';

export class EmailService {
    async enviarEmail(email: string, assunto: string, mensagem: string): Promise<boolean> {
        console.log(`Email enviado para: ${email} com assunto: ${assunto} e mensagem: ${mensagem}`);
        return true;
    }

    async enviarEmailParaReparador(idFuncionario: number): Promise<boolean> {
        const funcionarioService = new FuncionarioService();
        const funcionario = await funcionarioService.getById(idFuncionario);
        return this.enviarEmail(funcionario.email, Constantes.ASSUNTO_EMAIL_REPARADOR, Constantes.EMAIL_ENVIADO_PARA_O_REPARADOR);
    }
}
