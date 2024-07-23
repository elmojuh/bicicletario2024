// src/repositories/TrancaRepository.ts
import TrancaModel from '../db/mongoDB/TrancaModel';
import {Tranca} from "../entities/Tranca";
import {TrancaMapper} from "../mapper/TrancaMapper";

export class TrancaRepository {
    static async create(trancaData: Tranca) {
        try{
            if(!trancaData.numero || !trancaData.localizacao || !trancaData.anoDeFabricacao || !trancaData.modelo || !trancaData.statusTranca){
                throw new Error("Campos obrigatórios não preenchidos");
            }
            const trancaToSave = new TrancaModel({
                numero: trancaData.numero,
                localizacao: trancaData.localizacao,
                anoDeFabricacao: trancaData.anoDeFabricacao,
                modelo: trancaData.modelo,
                status: trancaData.statusTranca,
            });
            await trancaToSave.save();
            return trancaToSave;
        }catch (error) {
            console.error("Erro ao criar tranca no banco:", error);
            throw error;
        }
    }

    static async getAll() {
        return TrancaModel.find().exec();
    }

    static async getById(id: string){
        const tranca = TrancaModel.findById(id).exec();
        const trancaEntitie = TrancaMapper.ModelToEntitie(tranca);
        return trancaEntitie;
    }

    static async update(id: string, trancaData: any) {
        return TrancaModel.findByIdAndUpdate(id, trancaData, {new: true}).exec();
    }

}
