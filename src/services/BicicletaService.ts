// src/services/BicicletaService.ts
import BicicletaModel from "../db/mongoDB/BicicletaModel";
import {NovaBicicletaDTO} from "../entities/dto/NovaBicicletaDTO";
import {BicicletaRepository} from "../repositories/BicicletaRepository";
import {BicicletaMapper} from "../mapper/BicicletaMapper";

export class BicicletaService {

    async create(bicicletaData: NovaBicicletaDTO) {
        const bicicleta = BicicletaMapper.DTOtoEntity(bicicletaData);
        const savedBicicleta = await BicicletaRepository.create(bicicleta);
        return savedBicicleta;
    }

    async listarBicicletas() {
        return BicicletaRepository.getAll();
    }

    async integrarNaRede(data: any) {
        return;
    }

    async retirarDaRede(id: number) {
        return;
    }

}
