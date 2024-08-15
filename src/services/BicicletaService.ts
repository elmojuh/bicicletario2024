// src/services/BicicletaService.ts
import {NovaBicicletaDTO} from "../entities/dto/NovaBicicletaDTO";
import {BicicletaRepository} from "../repositories/BicicletaRepository";
import {IntegrarBicicletaNaRedeDTO} from "../entities/dto/IntegrarBicicletaNaRedeDTO";
import {StatusBicicleta} from "../entities/enums/StatusBicicleta";
import {FuncionarioService} from "./FuncionarioService";
import {StatusTranca} from "../entities/enums/StatusTranca";
import {EmailService} from "./EmailService";
import {Constantes} from "../entities/constants/Constantes";
import {RetirarBicicletaDaRedeDTO} from "../entities/dto/RetirarBicicletaDaRedeDTO";
import {Bicicleta} from "../entities/Bicicleta";
import {TrancaRepository} from "../repositories/TrancaRepository";
import { Error } from "../entities/Error"
import {StatusAcaoReparador} from "../entities/enums/StatusAcaoReparador";

export class BicicletaService {

    async criarBicicleta(dto: NovaBicicletaDTO): Promise<Bicicleta> {
        const savedBicicleta = BicicletaRepository.create(dto);
        return savedBicicleta;
    }

    async getById(id: number): Promise<Bicicleta> {
        const bicicleta = BicicletaRepository.getById(id);
        if (!bicicleta) {
            throw new Error('404', Constantes.BICICLETA_NAO_ENCONTRADA);
        }
        return bicicleta;
    }

    async listarBicicletas(): Promise<Bicicleta[]> {
        const bicicletas = BicicletaRepository.getAll();
        if (!bicicletas) {
            throw new Error('404', Constantes.ERRO_LISTAR_BICICLETAS);
        }
        return BicicletaRepository.getAll();
    }

    async editarBicicleta(id: number, dto: NovaBicicletaDTO) : Promise<Bicicleta>{
        await this.getById(id);
        const updatedBicicleta = BicicletaRepository.update(id, dto);
        if (!updatedBicicleta) {
            throw new Error('422', Constantes.ERRO_EDITAR_BICICLETA);
        }
        return updatedBicicleta;
    }

    async removerBicicleta(id: number): Promise<void>{
        await this.getById(id);
        const deleted = BicicletaRepository.delete(id);
        if (!deleted) {
            throw new Error('422', Constantes.ERRO_REMOVER_BICICLETA);
        }
    }

    async integrarNaRede(dto: IntegrarBicicletaNaRedeDTO) : Promise<void>{
        const tranca = TrancaRepository.getById(dto.idTranca);
        const funcionarioDisponivel = await FuncionarioService.isFuncionarioValido(dto.idFuncionario);
        const bicicleta = await this.getById(dto.idBicicleta);

        if (!tranca) {
            throw new Error('404', Constantes.TRANCA_NAO_ENCONTRADA); // Lançando 404 corretamente
        }

        if (!funcionarioDisponivel) {
            throw new Error('422', Constantes.FUNCIONARIO_INVALIDO);
        }

        if (bicicleta.statusBicicleta !== StatusBicicleta.NOVA && bicicleta.statusBicicleta !== StatusBicicleta.EM_REPARO) {
            throw new Error('422', Constantes.STATUS_DA_BICICLETA_INVALIDO);
        }


        await this.alterarStatus(dto.idBicicleta, StatusBicicleta.DISPONIVEL);
        bicicleta.dataInsercaoTranca = new Date().toISOString();
        bicicleta.tranca = tranca;
        BicicletaRepository.update(dto.idBicicleta, bicicleta);

        tranca.statusTranca = StatusTranca.OCUPADA;
        TrancaRepository.update(dto.idTranca, tranca);

        const emailService = new EmailService();
        try {
            await emailService.enviarEmailParaReparador(dto.idFuncionario);
        } catch (e) {
            throw new Error('422', Constantes.ERROR_ENVIAR_EMAIL); // Lançando erro de e-mail corretamente
        }
    }

    async retirarDaRede(dto: RetirarBicicletaDaRedeDTO) : Promise<void>{
        const bicicleta = await this.getById(dto.idBicicleta);
        if (bicicleta.statusBicicleta !== StatusBicicleta.DISPONIVEL) {
            throw new Error('422', Constantes.STATUS_DA_BICICLETA_INVALIDO);
        }

        const acao =  dto.statusAcaoReparador;

        switch (acao) {
            case StatusAcaoReparador.EM_REPARO:
                bicicleta.statusBicicleta = StatusBicicleta.EM_REPARO;
                break;
            case StatusAcaoReparador.APOSENTADA:
                bicicleta.statusBicicleta = StatusBicicleta.APOSENTADA;
                break;
            default:
                throw new Error ('422', Constantes.STATUS_DA_BICICLETA_INVALIDO);
        }

        const idTranca = bicicleta.tranca?.id;
        if(!idTranca){
            throw new Error('422', Constantes.ERRO_RETIRAR_BICICLETA);
        }
        const tranca = TrancaRepository.getById(idTranca);
        if(!tranca){
            throw new Error('404', Constantes.TRANCA_NAO_ENCONTRADA);
        }

        await this.alterarStatus(dto.idBicicleta, StatusBicicleta.EM_REPARO);

        tranca.statusTranca = StatusTranca.LIVRE;
        TrancaRepository.update(idTranca, tranca);

        const emailService = new EmailService();
        try {
            await emailService.enviarEmailParaReparador(dto.idFuncionario);
        } catch (e) {
            throw new Error('422',Constantes.ERROR_ENVIAR_EMAIL);
        }
    }

    async alterarStatus(id: number, acao: string) : Promise<Bicicleta>{
        const bicicleta = await this.getById(id);
        switch (acao as StatusBicicleta) {
            case StatusBicicleta.DISPONIVEL:
                bicicleta.statusBicicleta = StatusBicicleta.DISPONIVEL;
                break;
            case StatusBicicleta.EM_USO:
                bicicleta.statusBicicleta = StatusBicicleta.EM_USO;
                break;
            case StatusBicicleta.EM_REPARO:
                bicicleta.statusBicicleta = StatusBicicleta.EM_REPARO;
                break;
            case StatusBicicleta.NOVA:
                bicicleta.statusBicicleta = StatusBicicleta.NOVA;
                break;
            case StatusBicicleta.APOSENTADA:
                bicicleta.statusBicicleta = StatusBicicleta.APOSENTADA;
                break;
            default:
                throw new Error('422', Constantes.STATUS_DA_BICICLETA_INVALIDO);
        }
        const updatedBicicleta = BicicletaRepository.update(id, bicicleta);
        if (!updatedBicicleta) {
            throw new Error('422', Constantes.ERRO_EDITAR_BICICLETA);
        }
        return updatedBicicleta;
    }

}
