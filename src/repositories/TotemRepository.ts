// src/repositories/TotemRepository.ts
import {NovoTotemDTO} from "../entities/dto/NovoTotemDTO";
import TotemModel from "../db/mongoDB/TotemModel";
import {Totem} from "../entities/Totem";

export class TotemRepository {
    static async create(totemData: Totem) {
        try {
            const totemToSave = new TotemModel({
                localizacao: totemData.localizacao,
                descricao: totemData.descricao
            });
            await totemToSave.save();
            return totemToSave;
        }catch (error) {
            console.error("Erro ao criar totem no banco:", error);
            throw error;
        }
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
