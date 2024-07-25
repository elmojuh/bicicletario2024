// src/services/TotemService.ts

import {NovoTotemDTO} from "../entities/dto/NovoTotemDTO";
import {TotemRepository} from "../repositories/TotemRepository";
import {Totem} from "../entities/Totem";
import {Tranca} from "../entities/Tranca";
import {Bicicleta} from "../entities/Bicicleta";
import {TrancaRepository} from "../repositories/TrancaRepository";
import {BicicletaRepository} from "../repositories/BicicletaRepository";

export class TotemService {

    async listarTotens(): Promise<Totem[]> {
        return TotemRepository.getAll();
    }

    async cadastrarTotem(totemData: NovoTotemDTO): Promise<Totem> {
        const savedTotem = TotemRepository.create(totemData);
        return savedTotem;
    }
    async getById(id: number) : Promise<Totem>{
        const totem = TotemRepository.getById(id);
        if (!totem) {
            throw new Error('Totem não encontrado');
        }
        return totem;
    }
    async editarTotem(id: number, totemData: Totem) : Promise<Totem>{
        const totem = TotemRepository.getById(id);
        if (!totem) {
            throw new Error('Totem não encontrado');
        }
        const updatedTotem = TotemRepository.update(id, totemData);
        if (!updatedTotem) {
            throw new Error('Erro ao atualizar totem');
        }
        return updatedTotem;
    }

    async removerTotem(id: number) : Promise<void>{
        const totem = TotemRepository.getById(id);
        if (!totem) {
            throw new Error('Totem não encontrado');
        }
        const removed = TotemRepository.delete(id);
    }

    async listarTrancas(id: number) : Promise<Tranca[]>{
        const trancas = TrancaRepository.findByTotemId(id);
        return trancas;

    }

    async listarBicicletas(id: number) : Promise<Bicicleta[]>{
        const bicicletas = BicicletaRepository.findByTotemId(id);
        return bicicletas;
    }
}
