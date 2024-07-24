import { Tranca } from "../entities/Tranca";
import { TrancaMapper } from "../mapper/TrancaMapper";
import {NovaTrancaDTO} from "../entities/dto/NovaTrancaDTO";

export class TrancaRepository {
    private static trancas: Tranca[] = [];
    private static nextId = 1;

    static create(trancaDTO: NovaTrancaDTO): Tranca {
        const trancaData = TrancaMapper.DTOtoEntity(trancaDTO);
        const newTranca = new Tranca(
            this.nextId++,
            trancaData.numero,
            trancaData.localizacao,
            trancaData.anoDeFabricacao,
            trancaData.modelo,
            trancaData.statusTranca
        );
        this.trancas.push(newTranca);
        return newTranca;
    }

    static getAll(): Tranca[] {
        return this.trancas;
    }

    static getById(id: number): Tranca | undefined {
        return this.trancas.find(tranca => tranca.id === id);
    }

    static update(id: number, trancaData: Partial<Tranca>): Tranca | undefined {
        const tranca = this.trancas.find(t => t.id === id);
        if (!tranca) return undefined;
        tranca.atualizar(trancaData);
        return tranca;
    }

    static delete(id: number): boolean {
        const lengthBefore = this.trancas.length;
        this.trancas = this.trancas.filter(tranca => tranca.id !== id);
        return this.trancas.length < lengthBefore;
    }
}
