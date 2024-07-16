// src/repositories/TrancaRepository.ts
import TrancaModel from '../db/mongoDB/TrancaModel';
import {NovaTrancaDTO} from "../entities/dto/NovaTrancaDTO";
import {Tranca} from "../entities/Tranca";

export class TrancaRepository {
    static async create(trancaData: Tranca) {
        const tranca = new TrancaModel(trancaData);
        await tranca.save();
        return tranca;
    }

    static async getAll() {
        return TrancaModel.find().exec();
    }

    static async getById(id: string){
        return TrancaModel.findById(id).exec();
    }

}
