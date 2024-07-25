import { NovaBicicletaDTO } from "../entities/dto/NovaBicicletaDTO";
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
}
