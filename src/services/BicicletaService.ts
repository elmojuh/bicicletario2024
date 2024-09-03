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
import {TrancaService} from "./TrancaService";

export class BicicletaService {

    async criarBicicleta(dto: NovaBicicletaDTO): Promise<Bicicleta> {
        const savedBicicleta = BicicletaRepository.create(dto);
        if(!savedBicicleta){
            throw new Error('422', Constantes.ERRO_CRIAR_BICICLETA);
        }
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
        return bicicletas;
    }

    async editarBicicleta(id: number, dto: NovaBicicletaDTO) : Promise<Bicicleta>{
        await this.getById(id);
        const updatedBicicleta = BicicletaRepository.update(id, dto);
        if (!updatedBicicleta) {
            throw new Error('422', Constantes.ERRO_EDITAR_BICICLETA);
        }
        return updatedBicicleta;
    }

    //RN 4 - não contemplada
    async removerBicicleta(id: number): Promise<void>{
        await this.getById(id);
        const deleted = BicicletaRepository.delete(id);
        if (!deleted) {
            throw new Error('422', Constantes.ERRO_REMOVER_BICICLETA);
        }
    }

    //funcionario ao integrar bicicleta deve verificar se o mesmo funcionario que retirou no caso de reparo
    async integrarNaRede(dto: IntegrarBicicletaNaRedeDTO) : Promise<void>{
        const tranca = await new TrancaService().getById(dto.idTranca);
        const funcionario = await new FuncionarioService().getById(dto.idFuncionario);
        const bicicleta = await this.getById(dto.idBicicleta);

        if (tranca.statusTranca !== StatusTranca.LIVRE && tranca.statusTranca !== StatusTranca.NOVA) {
            throw new Error('422', Constantes.STATUS_DA_TRANCA_INVALIDO);
        }
        if (bicicleta.statusBicicleta !== StatusBicicleta.NOVA && bicicleta.statusBicicleta !== StatusBicicleta.EM_REPARO) {
            throw new Error('422', Constantes.STATUS_DA_BICICLETA_INVALIDO);
        }

        const emailService = new EmailService();
        try {
            //encviar para reparador os dados de inclusao da bicicleta e tranca
            await emailService.enviarEmailParaReparador(funcionario.id, 'Integrar bicicleta', ``);
        } catch (e) {
            throw new Error('422', Constantes.ERROR_ENVIAR_EMAIL); // Lançando erro de e-mail corretamente
        }

        await this.alterarStatus(dto.idBicicleta, StatusBicicleta.DISPONIVEL);
        bicicleta.dataInsercaoTranca = new Date().toISOString();
        //necessario log para salvar todas as datas de inserção
        bicicleta.tranca = tranca;
        tranca.bicicleta = bicicleta;
        BicicletaRepository.update(dto.idBicicleta, bicicleta);

        tranca.statusTranca = StatusTranca.OCUPADA;
        TrancaRepository.update(dto.idTranca, tranca);


    }

    async retirarDaRede(dto: RetirarBicicletaDaRedeDTO) : Promise<void>{
        const tranca = TrancaRepository.getById(dto.idTranca);
        const funcionario = await new FuncionarioService().getById(dto.idFuncionario);
        const bicicleta = await this.getById(dto.idBicicleta);

        if (bicicleta.statusBicicleta !== StatusBicicleta.DISPONIVEL) {
            throw new Error('422', Constantes.STATUS_DA_BICICLETA_INVALIDO);
        }
        if(!tranca){
            throw new Error('404', Constantes.TRANCA_NAO_ENCONTRADA);
        }
        if (!funcionario) {
            throw new Error('422', Constantes.FUNCIONARIO_INVALIDO);
        }

        const acao =  dto.statusAcaoReparador;

        switch (acao) {
            case StatusAcaoReparador.EM_REPARO:
                await this.alterarStatus(dto.idBicicleta, StatusBicicleta.EM_REPARO);
                break;
            case StatusAcaoReparador.APOSENTADA:
                await this.alterarStatus(dto.idBicicleta, StatusBicicleta.APOSENTADA)
                break;
            default:
                throw new Error ('422', Constantes.STATUS_DA_BICICLETA_INVALIDO);
        }

        const idTranca = bicicleta.tranca?.id;
        if(!idTranca){
            throw new Error('422', Constantes.ERRO_RETIRAR_BICICLETA);
        }

        try {
            await new EmailService().enviarEmailParaReparador(dto.idFuncionario, 'Retirar bicicleta', 'Retirando bicicleta da rede');
        } catch (e) {
            throw new Error('422',Constantes.ERROR_ENVIAR_EMAIL);
        }

        tranca.statusTranca = StatusTranca.LIVRE;
        tranca.bicicleta = null;
        TrancaRepository.update(idTranca, tranca);


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
