import {NovaTrancaDTO} from "../entities/dto/NovaTrancaDTO";
import {Tranca} from "../entities/Tranca";
import {TrancaDTO} from "../entities/dto/TrancaDTO";
import {StatusTranca} from "../entities/enums/StatusTranca";
import { Types } from "mongoose";

export class TrancaMapper{
    static NovoDTOtoEntity(totemData: NovaTrancaDTO): Tranca {
        return new Tranca(
            totemData.numero,
            totemData.localizacao,
            totemData.anoDeFabricacao,
            totemData.modelo,
            <StatusTranca>totemData.status,
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
    static ModelToResponse(trancaModel: any): any {
        return {
            id: trancaModel._id instanceof Types.ObjectId ? trancaModel._id.toHexString() : trancaModel._id,
            bicicleta: 0,
            numero: trancaModel.numero,
            localizacao: trancaModel.localizacao,
            anoDeFabricacao: trancaModel.anoDeFabricacao,
            modelo: trancaModel.modelo,
            status: trancaModel.status
        };
    }
    static ModelToEntitie(trancaModel: any): Tranca {
        const tranca = new Tranca(
            trancaModel.numero,
            trancaModel.localizacao,
            trancaModel.anoDeFabricacao,
            trancaModel.modelo,
            StatusTranca[trancaModel.status as keyof typeof StatusTranca]
        );
        tranca.id = trancaModel.id;
        return tranca;
    }
}
