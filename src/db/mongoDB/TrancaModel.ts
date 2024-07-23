import mongoose, { Schema, Document } from "mongoose";
import {StatusTranca} from "../../entities/enums/StatusTranca";

interface TrancaModel extends Document {
  _id?: number;
  bicicleta?: Schema.Types.ObjectId; // Assumindo que bicicleta é uma referência a outro documento
  numero: number;
  localizacao: string;
  anoDeFabricacao: string;
  modelo: string;
  status: string;
  dataInsercaoTotem?: string;
  totem?: Schema.Types.ObjectId; // Assumindo que totem é uma referência a outro documento
}

const TrancaSchema = new Schema<TrancaModel>({
  bicicleta: { type: Schema.Types.ObjectId, ref: 'Bicicleta', required: false, value: 0 },
  numero: { type: Number, required: true},
  localizacao: { type: String, required: true },
  anoDeFabricacao: { type: String, required: true },
  modelo: { type: String, required: true },
  status: { type: String, required: false, enum: StatusTranca },
  dataInsercaoTotem: { type: String, required: false },
  totem: { type: Schema.Types.ObjectId, ref: 'Totem', required: false }
});

export default mongoose.model<TrancaModel>('Tranca', TrancaSchema);
