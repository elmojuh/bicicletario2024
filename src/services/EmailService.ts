import { FuncionarioService } from './FuncionarioService';
import { Constantes } from '../entities/constants/Constantes';
import {NovoEmailDTO} from "../entities/dto/NovoEmailDTO";

export class EmailService {
    async enviarEmail(dto: NovoEmailDTO): Promise<boolean> {
        console.log(`Email enviado para: ${dto.email} com assunto: ${dto.assunto} e mensagem: ${dto.mensagem}`);
        return true;
    }

    async enviarEmailParaReparador(idFuncionario: number): Promise<boolean> {
        const funcionarioService = new FuncionarioService();
        const funcionario = await funcionarioService.getById(idFuncionario);
        const emailDTO = new NovoEmailDTO(funcionario.email, Constantes.ASSUNTO_EMAIL_REPARADOR, Constantes.EMAIL_ENVIADO_PARA_O_REPARADOR);
        return this.enviarEmail(emailDTO);
    }
}
