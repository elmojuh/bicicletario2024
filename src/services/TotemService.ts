// src/services/TotemService.ts
import { Totem as TotemInterface } from '../entities/TotemInterface';
import totemRepository from "../repositories/TotemRepository";

class TotemService {
    create(totem: TotemInterface) {
        return totemRepository.create(totem);
    }

    getAll() {
        return totemRepository.getAll();
    }

    getById(id: string) {
        return totemRepository.getById(id);
    }

    update(id: string, totem: TotemInterface) {
        return totemRepository.update(id, totem);
    }

    delete(id: string) {
        return totemRepository.delete(id);
    }
}

export default new TotemService();
