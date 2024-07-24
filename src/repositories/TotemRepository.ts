import { Totem } from "../entities/Totem";
import { TotemMapper } from "../mapper/TotemMapper";
import { NovoTotemDTO } from "../entities/dto/NovoTotemDTO";

export class TotemRepository {
    private static totens: Totem[] = [];
    private static nextId = 1;

    static create(totemDTO: NovoTotemDTO): Totem {
        const totemData = TotemMapper.DTOtoEntity(totemDTO);
        const newTotem = new Totem(
            this.nextId++,
            totemData.localizacao,
            totemData.descricao
        );
        this.totens.push(newTotem);
        return newTotem;
    }

    static getAll(): Totem[] {
        return this.totens;
    }

    static getById(id: number): Totem | undefined {
        return this.totens.find(totem => totem.id === id);
    }

    static update(id: number, totemData: Partial<Totem>): Totem | undefined {
        const totem = this.totens.find(t => t.id === id);
        if (!totem) return undefined;
        totem.atualizar(totemData);
        return totem;
    }

    static delete(id: number): boolean {
        const lengthBefore = this.totens.length;
        this.totens = this.totens.filter(totem => totem.id !== id);
        return this.totens.length < lengthBefore;
    }
}
