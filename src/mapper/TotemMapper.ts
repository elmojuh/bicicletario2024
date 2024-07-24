import {NovoTotemDTO} from "../entities/dto/NovoTotemDTO";
import {Totem} from "../entities/Totem";
import {TotemDTO} from "../entities/dto/TotemDTO";

export class TotemMapper {
    static DTOtoEntity(totemData: NovoTotemDTO): Totem {
        const totem = new Totem(
            0,
            totemData.localizacao,
            totemData.descricao
        );
        return totem;
    }
    static EntityToDTO(totem: Totem): TotemDTO {
        return new TotemDTO(
            totem.localizacao,
            totem.descricao
        );
    }
    static ModelToEntitie(totemModel: any): Totem {
        const totem = new Totem(
            0,
            totemModel.localizacao,
            totemModel.descricao
        );
        totem.id = totemModel.id;
        return totem;
    }
}
