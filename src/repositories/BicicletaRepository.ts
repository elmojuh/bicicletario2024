// src/repositories/BicicletaRepository.ts
import BicicletaModel from '../db/mongoDB/BicicletaModel';
import {Bicicleta} from "../entities/Bicicleta";
import {BicicletaMapper} from "../mapper/BicicletaMapper";

export class BicicletaRepository {
    static async create(bicicletaData: Bicicleta): Promise<Bicicleta>{
        try {
            const bicicletaToSave = new BicicletaModel({
                marca: bicicletaData.marca,
                modelo: bicicletaData.modelo,
                ano: bicicletaData.ano,
                numero: bicicletaData.numero,
                status: bicicletaData.statusBicicleta,
                dataInsercaoTranca: bicicletaData.dataInsercaoTranca
            });
            await bicicletaToSave.save();
            const bicicletaResponse = BicicletaMapper.ModelToEntitie(bicicletaToSave)
            return bicicletaResponse;
        } catch (error) {
            console.error("Erro ao criar bicicleta no banco:", error);
            throw error;
        }
    }

    static getAll() {
        return BicicletaModel.find().exec();
    }

    static async getById(id: string) : Promise<Bicicleta> {
        const bicicleta = await BicicletaModel.findById(id).exec();
        const bicicletaEntitie = BicicletaMapper.ModelToEntitie(bicicleta);
        return bicicletaEntitie;
    }

    static async update(id: string, bicicletaData: any) {
        return BicicletaModel.findByIdAndUpdate(id, bicicletaData, { new: true }).exec();
    }

    static async delete(id: string) {
        return BicicletaModel.findByIdAndDelete(id).exec();
    }
}
