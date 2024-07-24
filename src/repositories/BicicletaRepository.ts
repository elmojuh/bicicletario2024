import { Bicicleta } from "../entities/Bicicleta";
import {BicicletaMapper} from "../mapper/BicicletaMapper";
import {NovaBicicletaDTO} from "../entities/dto/NovaBicicletaDTO";

export class BicicletaRepository {
    private static bicicletas: Bicicleta[] = [];
    private static nextId = 1;

    static create(bicicletaDTO: NovaBicicletaDTO): Bicicleta {
        const bicicletaData = BicicletaMapper.DTOtoEntity(bicicletaDTO);
        const newBicicleta = new Bicicleta(
            this.nextId++,
            bicicletaData.marca,
            bicicletaData.modelo,
            bicicletaData.ano,
            bicicletaData.numero,
            bicicletaData.statusBicicleta
        );
        this.bicicletas.push(newBicicleta);
        return newBicicleta;
    }

    static getAll(): Bicicleta[] {
        return this.bicicletas;
    }

    static getById(id: number): Bicicleta | undefined {
        return this.bicicletas.find(bicicleta => bicicleta.id === id);
    }

    static update(id: number, bicicletaData: Partial<Bicicleta>): Bicicleta | undefined {
        const bicicleta = this.bicicletas.find(b => b.id === id);
        if (!bicicleta) return undefined;
        bicicleta.atualizar(bicicletaData);
        return bicicleta;
    }

    static delete(id: string): boolean {
        const numericId = parseInt(id, 10);
        const lengthBefore = this.bicicletas.length;
        this.bicicletas = this.bicicletas.filter(bicicleta => bicicleta.id !== numericId);
        return this.bicicletas.length < lengthBefore;
    }
}
