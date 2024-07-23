// src/services/TotemService.ts

import {NovoTotemDTO} from "../entities/dto/NovoTotemDTO";
import {TotemMapper} from "../mapper/TotemMapper";
import {TotemRepository} from "../repositories/TotemRepository";

export class TotemService {

    async listarTotens() {
        return TotemRepository.getAll();
    }

    async cadastrarTotem(totemData: NovoTotemDTO) {
        const totemEntity = TotemMapper.DTOtoEntity(totemData);
        const savedTotem = await TotemRepository.create(totemEntity);
        return savedTotem;
    }

}
