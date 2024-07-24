// src/services/BicicletaService.ts
import {NovaBicicletaDTO} from "../entities/dto/NovaBicicletaDTO";
import {BicicletaRepository} from "../repositories/BicicletaRepository";
import {BicicletaMapper} from "../mapper/BicicletaMapper";
import {IntegrarBicicletaNaRedeDTO} from "../entities/dto/IntegrarBicicletaNaRedeDTO";
import {TrancaService} from "./TrancaService";
import {StatusBicicleta} from "../entities/enums/StatusBicicleta";
import {FuncionarioService} from "./FuncionarioService";
import {StatusTranca} from "../entities/enums/StatusTranca";
import {EmailService} from "./EmailService";
import {Constantes} from "../entities/constants/Constantes";

export class BicicletaService {

    async create(dto: NovaBicicletaDTO): Promise<any> {
        const savedBicicleta = BicicletaRepository.create(dto);
        return savedBicicleta.toJSON();
    }

    async getById(id: string): Promise<any> {
        const idNumber = parseInt(id, 10);
        const bicicleta = BicicletaRepository.getById(idNumber);
        if (!bicicleta) {
            throw new Error('Bicicleta não encontrada');
        }
        return bicicleta.toJSON();
    }

    async listarBicicletas() {
        return BicicletaRepository.getAll();
    }


    async integrarNaRede(dto: IntegrarBicicletaNaRedeDTO) : Promise<any>{
        const idBicicleta = dto.idBicicleta;
        const bicicleta = BicicletaRepository.getById(idBicicleta);
        if(!bicicleta){
            throw new Error('Bicicleta não encontrada');
        }
        if (bicicleta.statusBicicleta !== StatusBicicleta.NOVA || StatusBicicleta.EM_REPARO ) {
            throw new Error('Bicicleta não pode ser integrada na rede');
        }

        const idTranca = dto.idTranca;
        const trancaService = new TrancaService();
        const idString = idTranca.toString();
        const tranca = await trancaService.getById(idString);
        if(!tranca){
            throw new Error('Tranca não encontrada');
        }
        if (tranca.statusTranca() !== StatusBicicleta.DISPONIVEL) {
            throw new Error('Tranca não disponível');
        }

        const idFuncionario = dto.idFuncionario;
        const funcionarioDisponivel = await FuncionarioService.isFuncionarioValido(idFuncionario);
        if (!funcionarioDisponivel) {
            throw new Error('Bicicleta não pode ser integrada na rede');
        }

        bicicleta.statusBicicleta = StatusBicicleta.DISPONIVEL;
        bicicleta.dataInsercaoTranca = new Date().toISOString();
        BicicletaRepository.update(idBicicleta, bicicleta);

        tranca.statusTranca = StatusTranca.OCUPADA;
        await trancaService.update(idTranca, tranca);

        const emailService = new EmailService();
        try {
            await emailService.enviarEmailParaReparador(dto.idFuncionario);
        } catch (e) {
            throw new Error(Constantes.ERROR_ENVIAR_EMAIL);
        }
    }

    async retirarDaRede(id: number) : Promise<any>{
        return null;
    }

}
