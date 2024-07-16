import mongoose, {Schema, Document} from "mongoose";

interface TotemModel extends Document {
    localizacao: string;
    descricao: string;
}

const totemSchema = new Schema<TotemModel>({
    localizacao: {type: String, required: true},
    descricao: {type: String, required: true}
});

export default mongoose.model<TotemModel>("Totem", totemSchema);
