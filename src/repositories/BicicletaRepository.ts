// src/repositories/BicicletaRepository.ts
import BicicletaModel from '../db/mongoDB/BicicletaModel';
import {Bicicleta} from "../entities/Bicicleta";

export class BicicletaRepository {
    static async create(bicicletaData: Bicicleta) {
        try {
            // Adicione validação para campos obrigatórios aqui
            if (!bicicletaData.marca || !bicicletaData.modelo || !bicicletaData.ano || bicicletaData.numero === undefined || !bicicletaData.statusBicicleta || !bicicletaData.dataInsercaoTranca) {
                throw new Error("Todos os campos obrigatórios devem ser fornecidos");
            }
            const bicicleta = new BicicletaModel(bicicletaData);
            await bicicleta.save();
            return bicicleta;
        } catch (error) {
            console.error("Erro ao criar bicicleta no banco:", error);
            throw error;
        }
    }

    static getAll() {
        return BicicletaModel.find().exec();
    }

    static async getById(id: string){
        return BicicletaModel.findById(id).exec();
    }

    static async update(id: string, bicicletaData: any) {
        return BicicletaModel.findByIdAndUpdate(id, bicicletaData, { new: true }).exec();
    }

    static async delete(id: string) {
        return BicicletaModel.findByIdAndDelete(id).exec();
    }
}
