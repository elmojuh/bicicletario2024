import {NovaTrancaDTO} from "../entities/dto/NovaTrancaDTO";
import {Tranca} from "../entities/Tranca";
import {TrancaDTO} from "../entities/dto/TrancaDTO";
import {StatusTranca} from "../entities/enums/StatusTranca";

export class TrancaMapper{
    static DTOtoEntity(totemData: NovaTrancaDTO): Tranca {
        return new Tranca(
            totemData.numero,
            <StatusTranca>totemData.status,
            totemData.localizacao,
            totemData.anoDeFabricacao,
            totemData.modelo
        );
    }
    static EntityToDTO(totem: Tranca): TrancaDTO {
        return new TrancaDTO(
            totem.statusTranca,
            totem.localizacao,
            totem.anoDeFabricacao,
            totem.modelo
        );
    }
}
