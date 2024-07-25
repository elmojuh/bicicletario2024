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

    static getById(id: number): Bicicleta | null{
        return this.bicicletas.find(bicicleta => bicicleta.id === id) || null;
    }

    static update(id: number, bicicletaData: Partial<Bicicleta>): Bicicleta | null {
        const bicicleta = this.bicicletas.find(b => b.id === id);
        if (!bicicleta) {
            return null;
        }
        bicicleta.atualizar(bicicletaData);
        return bicicleta;
    }

    static delete(id: number): boolean {
        const lengthBefore = this.bicicletas.length;
        this.bicicletas = this.bicicletas.filter(bicicleta => bicicleta.id !== id);
        return this.bicicletas.length !== lengthBefore;
    }

    static findByTrancaId(id: number): Bicicleta[] {
        const bicicletas = this.bicicletas.filter(bicicleta => bicicleta.tranca?.id === id);
        return bicicletas;
    }

    static findByTotemId(id: number): Bicicleta[] {
        const bicicletas = this.bicicletas.filter(bicicleta => bicicleta.tranca?.totem?.id === id);
        return bicicletas;
    }
}
