// src/repositories/BicicletaRepository.ts
import Bicicleta from '../entities/Bicicleta';
import { Bicicleta as BicicletaInterface } from '../entities/BicicletaInterface';

class BicicletaRepository {
    async create(bicicletaData: BicicletaInterface) {
        const bicicleta = new Bicicleta(bicicletaData);
        await bicicleta.save();
        return bicicleta;
    }


    async getAll() {
        return Bicicleta.find();
    }

    async getById(id: string) {
        return Bicicleta.findById(id);
    }

    async update(id: string, bicicletaData: BicicletaInterface) {
        return Bicicleta.findByIdAndUpdate(id, bicicletaData, { new: true });
    }

    async delete(id: string) {
        return Bicicleta.findByIdAndDelete(id);
    }
}
export default new BicicletaRepository();
