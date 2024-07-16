// src/mappers/bicicletaMapper.ts
import { NovaBicicletaDTO } from "../entities/dto/NovaBicicletaDTO";
import {BicicletaDTO} from "../entities/dto/BicicletaDTO";
import {Bicicleta} from "../entities/Bicicleta";

export class BicicletaMapper {
    static DTOtoEntity(bicicletaDTO: NovaBicicletaDTO): Bicicleta {
        // Cria uma nova instância de Bicicleta usando os dados do DTO
        return new Bicicleta(
            bicicletaDTO.marca,
            bicicletaDTO.modelo,
            bicicletaDTO.ano,
            bicicletaDTO.numero,
            bicicletaDTO.status,
            new Date().toISOString(),
            undefined,
            undefined
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
}
