import {NovoTotemDTO} from "../entities/dto/NovoTotemDTO";
import {TotemRepository} from "../repositories/TotemRepository";
import {Totem} from "../entities/Totem";
import {Tranca} from "../entities/Tranca";
import {Bicicleta} from "../entities/Bicicleta";
import {TrancaRepository} from "../repositories/TrancaRepository";
import {BicicletaRepository} from "../repositories/BicicletaRepository";
import {Error} from "../entities/Error";
import {Constantes} from "../entities/constants/Constantes";

export class TotemService {

    listarTotens(): Totem[] {
        return TotemRepository.getAll();
    }

    cadastrarTotem(totemData: NovoTotemDTO): Totem {
        const savedTotem = TotemRepository.create(totemData);
        return savedTotem;
    }
    getById(id: number) : Totem{
        const totem = TotemRepository.getById(id);
        if (!totem) {
            throw new Error('404', Constantes.TOTEM_NAO_ENCONTRADO);
        }
        return totem;
    }
    editarTotem(id: number, totemData: Totem): Totem {
        this.getById(id);
        const updatedTotem = TotemRepository.update(id, totemData);
        if (!updatedTotem) {
            throw new Error('422', Constantes.DADOS_INVALIDOS);
        }
        return updatedTotem;
    }

    removerTotem(id: number) : void{
        this.getById(id);
        TotemRepository.delete(id);
    }

    listarTrancas(id: number) : Tranca[]{
        const trancas = TrancaRepository.findByTotemId(id);
        if(!trancas){
            throw new Error('404', Constantes.TRANCA_NAO_ENCONTRADA);
        }
        return trancas;

    }

    listarBicicletas(id: number) : Bicicleta[]{
        const bicicletas = BicicletaRepository.findByTotemId(id);
        if(!bicicletas){
            throw new Error('404', Constantes.BICICLETA_NAO_ENCONTRADA);
        }
        return bicicletas;
    }
}
