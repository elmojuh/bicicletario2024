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

    async listarTotens(): Promise<Totem[]> {
        return TotemRepository.getAll();
    }

    async cadastrarTotem(totemData: NovoTotemDTO): Promise<Totem> {
        const savedTotem = TotemRepository.create(totemData);
        return savedTotem;
    }
    async getById(id: number) : Promise<Totem>{
        const totem = TotemRepository.getById(id);
        if (!totem) {
            throw new Error('404', Constantes.TOTEM_NAO_ENCONTRADO);
        }
        return totem;
    }
    async editarTotem(id: number, totemData: Totem): Promise<Totem> {
        await this.getById(id);
        const updatedTotem = TotemRepository.update(id, totemData);
        if (!updatedTotem) {
            throw new Error('422', Constantes.DADOS_INVALIDOS);
        }
        return updatedTotem;
    }

    async removerTotem(id: number) : Promise<void>{
        this.getById(id);
        TotemRepository.delete(id);
    }

    async listarTrancas(id: number) : Promise<Tranca[]> {
        const trancas = TrancaRepository.findByTotemId(id);
        if(!trancas){
            throw new Error('404', Constantes.TRANCA_NAO_ENCONTRADA);
        }
        return trancas;

    }

    async listarBicicletas(id: number) : Promise<Bicicleta[]> {
        const bicicletas = BicicletaRepository.findByTotemId(id);
        if(!bicicletas){
            throw new Error('404', Constantes.BICICLETA_NAO_ENCONTRADA);
        }
        return bicicletas;
    }
}
