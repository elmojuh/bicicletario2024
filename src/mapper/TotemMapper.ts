import {NovoTotemDTO} from "../entities/dto/NovoTotemDTO";
import {Totem} from "../entities/Totem";

export class TotemMapper {
    static DTOtoEntity(totemData: NovoTotemDTO): Totem {
        const totem = new Totem(
            0,
            totemData.localizacao,
            totemData.descricao
        );
        return totem;
    }
}
