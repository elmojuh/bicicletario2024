// src/services/TrancaService.ts
import {TrancaRepository} from '../repositories/TrancaRepository';
import {NovaTrancaDTO} from "../entities/dto/NovaTrancaDTO";
import {Tranca} from "../entities/Tranca";
import {IntegrarTrancaNaRedeDTO} from "../entities/dto/IntegrarTrancaNaRedeDTO";
import {StatusTranca} from "../entities/enums/StatusTranca";
import {TotemRepository} from "../repositories/TotemRepository";
import {FuncionarioService} from "./FuncionarioService";
import {EmailService} from "./EmailService";
import {RetirarTrancaDaRedeDTO} from "../entities/dto/RetirarTrancaDaRedeDTO";
import {Constantes} from "../entities/constants/Constantes";
import {Bicicleta} from "../entities/Bicicleta";
import {BicicletaRepository} from "../repositories/BicicletaRepository";
import {StatusBicicleta} from "../entities/enums/StatusBicicleta";
import {Error} from "../entities/Error";
import {StatusAcaoReparador} from "../entities/enums/StatusAcaoReparador";

export class TrancaService {
    async cadastrarTranca(dto: NovaTrancaDTO): Promise<Tranca> {
        const savedTranca = TrancaRepository.create(dto);
        if(!savedTranca){
            throw new Error('422', Constantes.ERRO_CRIAR_TRANCA);
        }
        return savedTranca;
    }

    async listarTrancas(): Promise<Tranca[]> {
        const trancas = TrancaRepository.getAll();
        if(!trancas){
            throw new Error('404', Constantes.ERRO_LISTAR_TRANCAS);
        }
        return trancas;
    }

    async getById(id: number ): Promise<Tranca> {
        const tranca = TrancaRepository.getById(id);
        if(!tranca){
            throw new Error('404', Constantes.TRANCA_NAO_ENCONTRADA);
        }
        return tranca;
    }

    async editarTranca(id: number, trancaData: Tranca): Promise<Tranca> {
        await this.getById(id);
        const trancaUpdate = TrancaRepository.update(id, trancaData);
        if (!trancaUpdate) {
            throw new Error('422', Constantes.ERRO_EDITAR_TRANCA);
        }
        return trancaUpdate;
    }

    async removerTranca(id: number): Promise<void> {
        await this.getById(id);
        TrancaRepository.delete(id);
    }

    async obterBicicletaNaTranca(id: number): Promise<Bicicleta> {
        const tranca = await this.getById(id);
        if (!tranca.bicicleta) {
            throw new Error('422', Constantes.ERRO_OBTER_BICICLETA_TRANCA);
        }
        return tranca.bicicleta;
    }

    async integrarNaRede(dto: IntegrarTrancaNaRedeDTO): Promise<void> {
        const idTranca = Number(dto.idTranca);
        const idTotem = Number(dto.idTotem);
        const idFuncionario = Number(dto.idFuncionario);

        const tranca = await this.getById(idTranca);
        const totem = TotemRepository.getById(idTotem);
        const funcionario = await new FuncionarioService().getById(idFuncionario);

        if (!totem) {
            throw new Error('404', Constantes.TOTEM_NAO_ENCONTRADO);
        }
        if (!funcionario) {
            throw new Error('422', Constantes.FUNCIONARIO_INVALIDO);
        }
        if (tranca.statusTranca !== StatusTranca.NOVA && tranca.statusTranca !== StatusTranca.EM_REPARO) {
            throw new Error('422', Constantes.STATUS_DA_TRANCA_INVALIDO);
        }

        const emailService = new EmailService();
        try {
            await emailService.enviarEmailParaReparador(idFuncionario, 'Integrar na rede',  'Integrando na rede');
        } catch (error) {
            throw new Error('422',Constantes.ERROR_ENVIAR_EMAIL);
        }

        await this.alterarStatus(idTranca, StatusTranca.LIVRE);
        tranca.dataInsercaoTotem = new Date().toISOString();
        tranca.totem = totem;
        TrancaRepository.update(idTranca, tranca);


    }

    async retirarDaRede(dto: RetirarTrancaDaRedeDTO): Promise<void> {
        const idTranca = Number(dto.idTranca);
        const idTotem = Number(dto.idTotem);
        const idFuncionario = Number(dto.idFuncionario);
        const statusAcaoReparador = dto.statusAcaoReparador;

        const tranca = await this.getById(idTranca);
        const totem = TotemRepository.getById(idTotem);
        const funcionario = await new FuncionarioService().getById(idFuncionario);

        if (!totem) {
            throw new Error('404', Constantes.TOTEM_NAO_ENCONTRADO);
        }
        if (!funcionario) {
            throw new Error('422', Constantes.FUNCIONARIO_INVALIDO);
        }

        if (tranca.statusTranca !== StatusTranca.NOVA && tranca.statusTranca !== StatusTranca.LIVRE) {// Passa se for nova ou livre
            throw new Error('422', Constantes.STATUS_DA_TRANCA_INVALIDO);
        }

        const emailService = new EmailService();
        try {
            await emailService.enviarEmailParaReparador(idFuncionario, 'Retirar da rede',  'Retirando na rede');
        } catch (error) {
            throw new Error('422',Constantes.ERROR_ENVIAR_EMAIL);
        }

        const acao =  statusAcaoReparador;

        switch (acao) {
            case StatusAcaoReparador.EM_REPARO:
                await this.alterarStatus(idTranca, StatusTranca.EM_REPARO);
                break;
            case StatusAcaoReparador.APOSENTADA:
                await this.alterarStatus(idTranca, StatusTranca.APOSENTADA);
                break;
            default:
                throw new Error('422', Constantes.STATUS_DE_ACAO_REPARADOR_INVALIDO);
        }


    }

    async trancarTranca(idTranca: number, idBicicleta?: number): Promise<void> {
        const tranca = await this.getById(idTranca);
        if (tranca.statusTranca !== StatusTranca.LIVRE) {
            throw new Error('422', Constantes.STATUS_DA_TRANCA_INVALIDO);
        }

        if (idBicicleta) {
            const bicicleta = BicicletaRepository.getById(idBicicleta);
            if (!bicicleta) {
                throw new Error('404', Constantes.BICICLETA_NAO_ENCONTRADA);
            }
            if (bicicleta.statusBicicleta !== StatusBicicleta.EM_USO && bicicleta.statusBicicleta !== StatusBicicleta.EM_REPARO && bicicleta.statusBicicleta !== StatusBicicleta.NOVA) {
                throw new Error('422', Constantes.STATUS_DA_BICICLETA_INVALIDO);
            }

            bicicleta.statusBicicleta = StatusBicicleta.DISPONIVEL;
            bicicleta.tranca = tranca;
            BicicletaRepository.update(idBicicleta, bicicleta);
        }

        tranca.statusTranca = StatusTranca.OCUPADA;
        const update = TrancaRepository.update(idTranca, tranca);
        if(!update){
            throw new Error('422', Constantes.ERRO_TRANCAR_TRANCA);
        }
    }

    async destrancarTranca(idTranca: number, idBicicleta?: number): Promise<void> {
        const tranca = await this.getById(idTranca);
        if (tranca.statusTranca !== StatusTranca.OCUPADA && tranca.statusTranca !== StatusTranca.EM_REPARO) {
            throw new Error('422', Constantes.STATUS_DA_TRANCA_INVALIDO);
        }
        if (idBicicleta) {
            const bicicleta = BicicletaRepository.getById(idBicicleta);
            if (!bicicleta) {
                throw new Error('404', Constantes.BICICLETA_NAO_ENCONTRADA);
            }
            if (bicicleta.statusBicicleta !== StatusBicicleta.DISPONIVEL) {
                throw new Error('422', Constantes.STATUS_DA_BICICLETA_INVALIDO);
            }
            bicicleta.statusBicicleta = StatusBicicleta.EM_USO;
            bicicleta.tranca = null;
            BicicletaRepository.update(idBicicleta, bicicleta);
        }

        if(tranca.statusTranca === StatusTranca.OCUPADA){
            await this.alterarStatus(idTranca, StatusTranca.LIVRE);
        }
        if(tranca.statusTranca === StatusTranca.EM_REPARO){
            const emailService = new EmailService();
            try {
                await emailService.enviarEmailParaReparador(1, 'Destrancar',  'Destrancando');
            } catch (error) {
                throw new Error('422',Constantes.ERROR_ENVIAR_EMAIL);
            }
            await this.alterarStatus(idTranca, StatusTranca.LIVRE);
        }
    }

    async alterarStatus(id: number, acao: string): Promise<Tranca> {
        const tranca = await this.getById(id);
        switch (acao as StatusTranca){
            case StatusTranca.LIVRE:
                tranca.statusTranca = StatusTranca.LIVRE;
                break;
            case StatusTranca.APOSENTADA:
                tranca.statusTranca = StatusTranca.APOSENTADA;
                break;
            case StatusTranca.EM_REPARO:
                tranca.statusTranca = StatusTranca.EM_REPARO;
                break;
            case StatusTranca.OCUPADA:
                tranca.statusTranca = StatusTranca.OCUPADA;
                break;
            default:
                throw new Error('422', Constantes.STATUS_DA_TRANCA_INVALIDO);
        }
        const trancaUpdate = TrancaRepository.update(id, tranca);
        if (!trancaUpdate) {
            throw new Error('422', Constantes.ERRO_ALTERAR_STATUS_TRANCA);
        }
        return trancaUpdate;
    }

}
