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

    static getById(id: number): Tranca | null{
        return this.trancas.find(tranca => tranca.id === id) || null;
    }

    static update(id: number, trancaData: Partial<Tranca>): Tranca | null{
        const tranca = this.trancas.find(t => t.id === id);
        if (!tranca) {
            return null
        }
        tranca.atualizar(trancaData);
        return tranca;
    }

    static delete(id: number): void {
        const lengthBefore = this.trancas.length;
        this.trancas = this.trancas.filter(tranca => tranca.id !== id);
        if (this.trancas.length === lengthBefore) {
            throw new Error(`Tranca with id ${id} not found`);
        }
    }

    static findByTotemId(idTotem: number): Tranca[] {
        const trancas = this.trancas.filter(tranca => tranca.totem?.id === idTotem);
        return trancas;
    }
}
