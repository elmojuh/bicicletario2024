import mongoose from "mongoose";

export interface Tranca {
    numero: number;
    localizacao: string;
    anoDeFabricacao: string;
    modelo: string;
    status: string;
    bicicleta: mongoose.Types.ObjectId;
}
