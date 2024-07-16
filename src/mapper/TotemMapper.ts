import {NovoTotemDTO} from "../entities/dto/NovoTotemDTO";
import {Totem} from "../entities/Totem";
import {TotemDTO} from "../entities/dto/TotemDTO";

export class TotemMapper {
    static DTOtoEntity(totemData: NovoTotemDTO): Totem {
        return new Totem(
            totemData.localizacao,
            totemData.descricao,
            undefined);
    }
    static EntityToDTO(totem: Totem): TotemDTO {
        return new TotemDTO(
            totem.localizacao,
            totem.descricao
        );
    }
}
