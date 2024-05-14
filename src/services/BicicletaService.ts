// src/services/BicicletaService.ts
import BicicletaRepository from '../repositories/BicicletaRepository';
import { Bicicleta } from '../entities/BicicletaInterface';

class BicicletaService {
    create(bicicleta: Bicicleta) {
        return BicicletaRepository.create(bicicleta);
    }

    getAll() {
        return BicicletaRepository.getAll();
    }

    getById(id: string) {
        return BicicletaRepository.getById(id);
    }

    update(id: string, bicicleta: Bicicleta) {
        return BicicletaRepository.update(id, bicicleta);
    }

    delete(id: string) {
        return BicicletaRepository.delete(id);
    }
}

export default new BicicletaService();
