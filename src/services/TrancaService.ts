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

export class TrancaService {
    cadastrarTranca(dto: NovaTrancaDTO): Tranca {
        const savedTranca = TrancaRepository.create(dto);
        return savedTranca;
    }

    listarTrancas(): Tranca[] {
        return TrancaRepository.getAll();
    }

    getById(id: number ): Tranca {
        const tranca = TrancaRepository.getById(id);
        if(!tranca){
            throw new Error('404', Constantes.TRANCA_NAO_ENCONTRADA);
        }
        return tranca;
    }

    editarTranca(id: number, trancaData: Tranca): Tranca {
        const tranca = this.getById(id);
        const trancaUpdate = TrancaRepository.update(id, trancaData);
        if (!trancaUpdate) {
            throw new Error('404', Constantes.TRANCA_NAO_ENCONTRADA);
        }
        return trancaUpdate;
    }

    removerTranca(id: number): void {
        this.getById(id);
        TrancaRepository.delete(id);
    }

    obterBicicletaNaTranca(id: number): Bicicleta {
        const tranca = this.getById(id);
        const bicicleta = tranca.bicicleta;
        if (!bicicleta) {
            throw new Error('404', Constantes.BICICLETA_NAO_ENCONTRADA);
        }
        return bicicleta;
    }

    integrarNaRede(dto: IntegrarTrancaNaRedeDTO): void {
        const idTranca = dto.idTranca;
        const tranca = this.getById(idTranca);
        if (tranca.statusTranca !== StatusTranca.NOVA || StatusTranca.EM_REPARO) {
            throw new Error('422', Constantes.ERRO_INTEGRAR_TRANCA);
        }

        const idTotem = dto.idTotem;
        const totem = TotemRepository.getById(idTotem);
        if (!totem) {
            throw new Error('404', Constantes.TOTEM_NAO_ENCONTRADO);
        }

        const idFuncionario = dto.idFuncionario;
        const funcionarioDispobilidade = FuncionarioService.isFuncionarioValido(idFuncionario);
        if (!funcionarioDispobilidade) {
            throw new Error('422', Constantes.FUNCIONARIO_INVALIDO);
        }

        tranca.totem = totem;
        tranca.statusTranca = StatusTranca.LIVRE;
        tranca.dataInsercaoTotem = new Date().toISOString();
        TrancaRepository.update(idTranca, tranca);

        const emailService = new EmailService();
        try {
            emailService.enviarEmailParaReparador(dto.idFuncionario);
        } catch (error) {
            throw new Error('400',Constantes.ERROR_ENVIAR_EMAIL);
        }
    }

    retirarDaRede(dto: RetirarTrancaDaRedeDTO): void {
        const idTranca = dto.idTranca;
        const tranca = this.getById(idTranca);
        if (tranca.statusTranca !== StatusTranca.LIVRE) {
            throw new Error('422', Constantes.ERRO_RETIRAR_TRANCA);
        }
        const acao =  dto.statusAcaoReparador.toString();

        switch (acao) {
            case 'reparo':
                tranca.statusTranca = StatusTranca.EM_REPARO;
                break;
            case "aposentadoria":
                tranca.statusTranca = StatusTranca.APOSENTADA;
                break;
            default:
                throw new Error('422', Constantes.STATUS_DE_ACAO_REPARADOR_INVALIDO);
        }
        TrancaRepository.update(idTranca, tranca);

        const emailService = new EmailService();
        try {
            emailService.enviarEmailParaReparador(dto.idFuncionario);
        } catch (error) {
            throw new Error('400',Constantes.ERROR_ENVIAR_EMAIL);
        }
    }

    trancarTranca(idTranca: number, idBicicleta?: number): void {
        const tranca = this.getById(idTranca);
        if (tranca.statusTranca !== StatusTranca.LIVRE) {
            throw new Error('422', Constantes.ERRO_TRANCAR_TRANCA);
        }

        if (idBicicleta) {
            const bicicleta = BicicletaRepository.getById(idBicicleta);
            if (!bicicleta) {
                throw new Error('404', Constantes.BICICLETA_NAO_ENCONTRADA);
            }
            if (bicicleta.statusBicicleta !== StatusBicicleta.EM_USO && bicicleta.statusBicicleta !== StatusBicicleta.EM_REPARO && bicicleta.statusBicicleta !== StatusBicicleta.NOVA) {
                throw new Error('422', Constantes.ERRO_TRANCAR_TRANCA);
            }

            bicicleta.statusBicicleta = StatusBicicleta.DISPONIVEL;
            bicicleta.tranca = tranca;
            BicicletaRepository.update(idBicicleta, bicicleta);
        }

        tranca.statusTranca = StatusTranca.OCUPADA;
        TrancaRepository.update(idTranca, tranca);
    }

    destrancarTranca(idTranca: number, idBicicleta?: number): void {
        const tranca = this.getById(idTranca);
        if (idBicicleta) {
            const bicicleta = BicicletaRepository.getById(idBicicleta);
            if (!bicicleta) {
                throw new Error('404', Constantes.BICICLETA_NAO_ENCONTRADA);
            }
            if (bicicleta.statusBicicleta !== StatusBicicleta.DISPONIVEL) {
                throw new Error('422', Constantes.ERRO_DESTRANCAR_TRANCA);
            }
            bicicleta.statusBicicleta = StatusBicicleta.EM_USO;
            bicicleta.tranca = null;
            BicicletaRepository.update(idBicicleta, bicicleta);
        }

        tranca.statusTranca = StatusTranca.LIVRE;
        TrancaRepository.update(idTranca, tranca);
    }

    alterarStatus(id: number, acao: string): Tranca {
        const tranca = this.getById(id);
        switch (acao){
            case 'DESTRANCAR':
                tranca.statusTranca = StatusTranca.LIVRE;
                break;
            case 'TRANCAR':
                tranca.statusTranca = StatusTranca.OCUPADA;
                break;
        }
        const trancaUpdate = TrancaRepository.update(id, tranca);
        if (!trancaUpdate) {
            throw new Error('422', Constantes.ERRO_ALTERAR_STATUS_TRANCA);
        }
        return trancaUpdate;
    }

}
