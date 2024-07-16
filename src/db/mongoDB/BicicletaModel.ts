import mongoose, { Schema, Document } from "mongoose";

interface BicicletaModel extends Document {
  marca: string;
  modelo: string;
  ano: string;
  numero: number;
  status: string;
  dataInsercaoTranca: string;
  trancaId: Schema.Types.ObjectId;
}

const bicicletaSchema = new Schema<BicicletaModel>({
  marca: { type: String, required: true },
  modelo: { type: String, required: true },
  ano: { type: String, required: true},
  numero: { type: Number, required: true },
  status: { type: String, required: true, enum: ['DISPONÍVEL', 'EM_USO', 'NOVA', 'APOSENTADA', 'REPARO_SOLICITADO', 'EM_REPARO'] },
  dataInsercaoTranca: { type: String, required: true },
  trancaId: { type: Schema.Types.ObjectId, ref: 'Tranca' }
});

export default mongoose.model<BicicletaModel>("Bicicleta", bicicletaSchema);
