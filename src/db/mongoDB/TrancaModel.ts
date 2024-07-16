import mongoose, { Schema, Document } from "mongoose";

interface TrancaModel extends Document {
    statusTranca: string;
    localizacao: string;
    anoDeFabricacao: string;
    modelo: string;
}

const trancaSchema = new Schema<TrancaModel>({
    statusTranca: { type: String, enum: ['LIVRE', 'OCUPADA', 'NOVA', 'APOSENTADA', 'EM_REPARO'], required: true },
    localizacao: { type: String, required: true },
    anoDeFabricacao: { type: String, required: true },
    modelo: { type: String, required: true }
});

export default mongoose.model<TrancaModel>("Tranca", trancaSchema);
