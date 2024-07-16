// src/services/TotemService.ts

import {NovoTotemDTO} from "../entities/dto/NovoTotemDTO";
import {TotemMapper} from "../mapper/TotemMapper";
import {TotemRepository} from "../repositories/TotemRepository";

export class TotemService {

    async listarTotens() {
        return TotemRepository.getAll();
    }

    async cadastrarTotem(totemData: NovoTotemDTO) {
        const totem = TotemMapper.DTOtoEntity(totemData);
        await TotemRepository.create(totem);
        return TotemMapper.EntityToDTO(totem);
    }

}
