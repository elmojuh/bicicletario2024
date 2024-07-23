// src/services/TotemService.ts

import {NovoTotemDTO} from "../entities/dto/NovoTotemDTO";
import {TotemMapper} from "../mapper/TotemMapper";
import {TotemRepository} from "../repositories/TotemRepository";

export class TotemService {

    async listarTotens() {
        return TotemRepository.getAll();
    }

    async cadastrarTotem(totemData: NovoTotemDTO): Promise<any> {
        const totemEntity = TotemMapper.DTOtoEntity(totemData);
        const savedTotem = await TotemRepository.create(totemEntity);
        return savedTotem.toJSON();
    }
    async getById(id: string) : Promise<any>{
        const totem = await TotemRepository.getById(id);
        return totem.toJSON();
    }

}
