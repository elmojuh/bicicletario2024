import mongoose from 'mongoose';

const TotemSchema = new mongoose.Schema({
    localizacao: {
        type: String,
        required: true
    },
    descricao: {
        type: String
    }
});

const Totem = mongoose.model('Totem', TotemSchema);

export default Totem;
