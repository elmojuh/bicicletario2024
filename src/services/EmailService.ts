import { FuncionarioService } from './FuncionarioService';
import { Constantes } from '../entities/constants/Constantes';
import {Error} from "../entities/Error";
import {NovoEmailDTO} from "../entities/dto/NovoEmailDTO";
import axios from "axios";
import {Tranca} from "../entities/Tranca";
import {Bicicleta} from "../entities/Bicicleta";

export class EmailService {

    private readonly baseUrlDeExterno = 'https://ec2-54-225-108-79.compute-1.amazonaws.com/api';
    private readonly baseUrlEnviarEmail = this.baseUrlDeExterno + '/enviarEmail';

    async enviarEmail(dto: NovoEmailDTO): Promise<void> {
        try {
            const response = await axios.post(`${this.baseUrlEnviarEmail}`, dto, {
                headers: { 'Content-Type': 'application/json' }
            });
            console.log('URL EXTERNO: ',this.baseUrlEnviarEmail);
            console.log('RESPONSE: ',response.data);
            //teste de enviar email fake:
        } catch (error: Error | unknown) {
            throw new Error('422', Constantes.ERROR_ENVIAR_EMAIL);
        }
    }

    async enviarEmailParaReparador(idFuncionario: number, assunto: string, mensagem: string): Promise<void> {
        const funcionario = await new FuncionarioService().getById(idFuncionario);
        if (!funcionario) {
            throw new Error('422', "Funcionário não encontrado");
        }
        const emailDTO = new NovoEmailDTO(funcionario.email, assunto, mensagem);
        await this.enviarEmail(emailDTO);
    }

    async enviarEmailParaBicicleta(idFuncionario: number, bicicleta: Bicicleta, tranca: Tranca, acao: string): Promise<void> {
        const assunto = `${acao} de Bicicleta na Rede`;
        const mensagem = `
            Bicicleta ${acao.toLowerCase()} da rede:
            Número: ${bicicleta.numero}
            Marca: ${bicicleta.marca}
            Modelo: ${bicicleta.modelo}
            Ano: ${bicicleta.ano}
            Tranca: ${tranca.id}
            Data de ${acao.toLowerCase()}
            Status após ${acao.toLowerCase()}: ${bicicleta.statusBicicleta}
            Funcionário Responsável: ${idFuncionario}
        `;
        await this.enviarEmailParaReparador(idFuncionario, assunto, mensagem);
    }

    async enviarEmailParaTranca(idFuncionario: number, tranca: Tranca, acao: string): Promise<void> {
        const assunto = `${acao} de Tranca no Totem`;
        const mensagem = `
            Tranca ${acao.toLowerCase()} no totem:
            Número: ${tranca.numero}
            Modelo: ${tranca.modelo}
            Ano de Fabricação: ${tranca.anoDeFabricacao}
            Localização: ${tranca.localizacao}
            Data de ${acao.toLowerCase()}
            Status após ${acao.toLowerCase()}: ${tranca.statusTranca}
            Funcionário Responsável: ${idFuncionario}
        `;
        await this.enviarEmailParaReparador(idFuncionario, assunto, mensagem);
    }
}
