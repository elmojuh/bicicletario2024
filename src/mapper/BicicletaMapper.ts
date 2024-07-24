import { NovaBicicletaDTO } from "../entities/dto/NovaBicicletaDTO";
import {BicicletaDTO} from "../entities/dto/BicicletaDTO";
import {Bicicleta} from "../entities/Bicicleta";
import {StatusBicicleta} from "../entities/enums/StatusBicicleta";

export class BicicletaMapper {
    static DTOtoEntity(bicicletaDTO: NovaBicicletaDTO): Bicicleta {
        const bicicleta = new Bicicleta(
            0,
            bicicletaDTO.marca,
            bicicletaDTO.modelo,
            bicicletaDTO.ano,
            bicicletaDTO.numero,
            StatusBicicleta[bicicletaDTO.status as keyof typeof StatusBicicleta]
        );
        return bicicleta;
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
