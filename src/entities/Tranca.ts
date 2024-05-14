import mongoose from 'mongoose';

const TrancaSchema = new mongoose.Schema({
    numero: {
        type: Number,
        required: true,
        min: 0
    },
    localizacao: {
        type: String,
        required: true
    },
    anoDeFabricacao: {
        type: String
    },
    modelo: {
        type: String
    },
    status: {
        type: String,
        enum: ['LIVRE', 'OCUPADA', 'NOVA', 'APOSENTADA', 'EM_REPARO'],
        required: true
    },
    bicicleta: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bicicleta'
    }
});

const Tranca = mongoose.model('Tranca', TrancaSchema);

export default Tranca;
