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
        console.log("dto.idBicicleta em service", dto.idBicicleta);
        const bicicleta = await this.getById(dto.idBicicleta);
        if(!bicicleta){
            throw new Error('404', Constantes.BICICLETA_NAO_ENCONTRADA);
        }
        console.log("bicicleta.id em service", bicicleta.id);
        if (bicicleta.statusBicicleta !== StatusBicicleta.NOVA || StatusBicicleta.EM_REPARO ) {
            throw new Error('404', Constantes.ERRO_INTEGRAR_BICICLETA);
        }

        const tranca = TrancaRepository.getById( dto.idTranca);
        if(!tranca){
            throw new Error('404', Constantes.TRANCA_NAO_ENCONTRADA);
        }

        const funcionarioDisponivel = await FuncionarioService.isFuncionarioValido(dto.idFuncionario);
        if (!funcionarioDisponivel) {
            throw new Error('422', Constantes.FUNCIONARIO_INVALIDO);
        }
        await this.alterarStatus(dto.idBicicleta, 'disponibilizar');
        bicicleta.dataInsercaoTranca = new Date().toISOString();
        BicicletaRepository.update(dto.idBicicleta, bicicleta);

        tranca.statusTranca = StatusTranca.OCUPADA;
        TrancaRepository.update(dto.idTranca, tranca);

        const emailService = new EmailService();
        try {
            await emailService.enviarEmailParaReparador(dto.idFuncionario);
        } catch (e) {
            throw new Error("422", Constantes.ERROR_ENVIAR_EMAIL);
        }
    }

    async retirarDaRede(dto: RetirarBicicletaDaRedeDTO) : Promise<void>{
        const idBicicleta = dto.idBicicleta;
        const bicicleta = await this.getById(idBicicleta);
        if (bicicleta.statusBicicleta !== StatusBicicleta.DISPONIVEL) {
            throw new Error('422', Constantes.ERRO_RETIRAR_BICICLETA);
        }

        const acao =  dto.statusAcaoReparador.toString();

        switch (acao) {
            case 'reparo':
                bicicleta.statusBicicleta = StatusBicicleta.EM_REPARO;
                break;
            case 'aposentadoria':
                bicicleta.statusBicicleta = StatusBicicleta.APOSENTADA;
                break;
            default:
                throw new Error ('422', Constantes.STATUS_DA_BICICLETA_INVALIDO);
        }

        const idTranca = bicicleta.tranca?.id;
        if(!idTranca){
            throw new Error('404', Constantes.BICICLETA_NAO_ENCONTRADA);
        }
        const tranca = TrancaRepository.getById(idTranca);
        if(!tranca){
            throw new Error('404', Constantes.TRANCA_NAO_ENCONTRADA);
        }

        await this.alterarStatus(idBicicleta, 'reparar');

        tranca.statusTranca = StatusTranca.LIVRE;
        TrancaRepository.update(idTranca, tranca);

        const emailService = new EmailService();
        try {
            await emailService.enviarEmailParaReparador(dto.idFuncionario);
        } catch (e) {
            throw new Error('',Constantes.ERROR_ENVIAR_EMAIL);
        }
    }

    async alterarStatus(id: number, acao: string) : Promise<Bicicleta>{
        const bicicleta = await this.getById(id);
        switch (acao) {
            case 'DISPONIVEL':
                bicicleta.statusBicicleta = StatusBicicleta.DISPONIVEL;
                break;
            case 'EM_USO':
                bicicleta.statusBicicleta = StatusBicicleta.EM_USO;
                break;
            case 'EM_REPARO':
                bicicleta.statusBicicleta = StatusBicicleta.EM_REPARO;
                break;
            case 'NOVA':
                bicicleta.statusBicicleta = StatusBicicleta.NOVA;
                break;
            case 'APOSENTADA':
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
