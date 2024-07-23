// src/mappers/bicicletaMapper.ts
import { NovaBicicletaDTO } from "../entities/dto/NovaBicicletaDTO";
import {BicicletaDTO} from "../entities/dto/BicicletaDTO";
import {Bicicleta} from "../entities/Bicicleta";
import {StatusBicicleta} from "../entities/enums/StatusBicicleta";
import {Types} from "mongoose";

export class BicicletaMapper {
    static DTOtoEntity(bicicletaDTO: NovaBicicletaDTO): Bicicleta {
        return new Bicicleta(
            bicicletaDTO.marca,
            bicicletaDTO.modelo,
            bicicletaDTO.ano,
            bicicletaDTO.numero,
            StatusBicicleta[bicicletaDTO.status as keyof typeof StatusBicicleta]
        );
    }
    static EntityToDTO(bicicleta: Bicicleta): BicicletaDTO {
        return new BicicletaDTO(
            bicicleta.marca,
            bicicleta.modelo,
            bicicleta.ano,
            bicicleta.numero,
            bicicleta.statusBicicleta
        );
    }
    static ModelToEntitie(bicicletaModel: any): Bicicleta {
        const bicicleta = new Bicicleta(
            bicicletaModel.marca,
            bicicletaModel.modelo,
            bicicletaModel.ano,
            bicicletaModel.numero,
            StatusBicicleta[bicicletaModel.status as keyof typeof StatusBicicleta]
        );
        bicicleta.id = bicicletaModel.id;
        return bicicleta;
    }
}
