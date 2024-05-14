// src/repositories/TrancaRepository.ts
import Tranca from '../entities/Tranca';
import { Tranca as TrancaInterface } from '../entities/TrancaInterface';

class TrancaRepository {
    async create(trancaData: TrancaInterface) {
        const tranca = new Tranca(trancaData);
        await tranca.save();
        return tranca;
    }

    async getAll() {
        return Tranca.find();
    }

    async getById(id: string) {
        return Tranca.findById(id);
    }

    async update(id: string, trancaData: TrancaInterface) {
        return Tranca.findByIdAndUpdate(id, trancaData, { new: true });
    }

    async delete(id: string) {
        return Tranca.findByIdAndDelete(id);
    }
}

export default new TrancaRepository();
