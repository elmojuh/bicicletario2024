import {NovaTrancaDTO} from "../entities/dto/NovaTrancaDTO";
import {Tranca} from "../entities/Tranca";
import {StatusTranca} from "../entities/enums/StatusTranca";

export class TrancaMapper{
    static DTOtoEntity(totemDTO: NovaTrancaDTO): Tranca {
        const tranca = new Tranca(
            0,
            totemDTO.numero,
            totemDTO.localizacao,
            totemDTO.anoDeFabricacao,
            totemDTO.modelo,
            StatusTranca[totemDTO.status as keyof typeof StatusTranca]
        );
        return tranca;
    }
}
