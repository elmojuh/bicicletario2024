// src/repositories/TotemRepository.ts
import Totem from '../entities/Totem';
import { Totem as TotemInterface } from '../entities/TotemInterface';

class TotemRepository {
    async create(totemData: TotemInterface) {
        const totem = new Totem(totemData);
        await totem.save();
        return totem;
    }

    async getAll() {
        return Totem.find();
    }

    async getById(id: string) {
        return Totem.findById(id);
    }

    async update(id: string, totemData: TotemInterface) {
        return Totem.findByIdAndUpdate(id, totemData, { new: true });
    }

    async delete(id: string) {
        return Totem.findByIdAndDelete(id);
    }
}

export default new TotemRepository();
