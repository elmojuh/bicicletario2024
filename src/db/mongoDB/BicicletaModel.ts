import mongoose, { Schema, Document } from "mongoose";
import {StatusBicicleta} from "../../entities/enums/StatusBicicleta";

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
  status: { type: String, required: true, enum: StatusBicicleta },
  dataInsercaoTranca: { type: String, required: false },
  trancaId: { type: Schema.Types.ObjectId, ref: 'Tranca' }
});

export default mongoose.model<BicicletaModel>("Bicicleta", bicicletaSchema);
