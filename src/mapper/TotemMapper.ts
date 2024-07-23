import {NovoTotemDTO} from "../entities/dto/NovoTotemDTO";
import {Totem} from "../entities/Totem";
import {TotemDTO} from "../entities/dto/TotemDTO";

export class TotemMapper {
    static DTOtoEntity(totemData: NovoTotemDTO): Totem {
        return new Totem(
            totemData.localizacao,
            totemData.descricao);
    }
    static EntityToDTO(totem: Totem): TotemDTO {
        return new TotemDTO(
            totem.localizacao,
            totem.descricao
        );
    }
    static ModelToEntitie(totemModel: any): Totem {
        const totem = new Totem(
            totemModel.localizacao,
            totemModel.descricao
        );
        totem.id = totemModel.id;
        return totem;
    }
}
