// src/repositories/TotemRepository.ts
import {NovoTotemDTO} from "../entities/dto/NovoTotemDTO";
import TotemModel from "../db/mongoDB/TotemModel";

export class TotemRepository {
    static async create(totemData: NovoTotemDTO) {
        const totem = new TotemModel(totemData);
        await totem.save();
        return totem;
    }

    static async getAll() {
        return TotemModel.find().exec();
    }

    static async getById(id: string){
        return TotemModel.findById(id).exec();
    }

    static async getTrancas(id: string){
        return TotemModel.findById(id).populate('trancas').exec();
    }

    static async getBicicletas(id: string){
        return TotemModel.findById(id).populate('bicicletas').exec();
    }

}
