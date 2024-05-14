// src/services/TrancaService.ts
import TrancaRepository from '../repositories/TrancaRepository';
import { Tranca } from '../entities/TrancaInterface';

class TrancaService {
    create(tranca: Tranca) {
        return TrancaRepository.create(tranca);
    }

    getAll() {
        return TrancaRepository.getAll();
    }

    getById(id: string) {
        return TrancaRepository.getById(id);
    }

    update(id: string, tranca: Tranca) {
        return TrancaRepository.update(id, tranca);
    }

    delete(id: string) {
        return TrancaRepository.delete(id);
    }

}

export default new TrancaService();
