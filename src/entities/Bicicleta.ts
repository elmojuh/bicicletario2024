import mongoose from 'mongoose';

const BicicletaSchema = new mongoose.Schema({
    marca: {
        type: String,
        required: true
    },
    modelo: {
        type: String,
        required: true
    },
    ano: {
        type: String,
    },
    numero: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['DISPONÍVEL', 'EM_USO', 'NOVA', 'APOSENTADA', 'REPARO_SOLICITADO', 'EM_REPARO'],
        required: true
    }
});

const Bicicleta = mongoose.model('Bicicleta', BicicletaSchema);

export default Bicicleta;
