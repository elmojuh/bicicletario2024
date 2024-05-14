// src/config/db.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bicicletario';

// Se a aplicação está rodando em um contêiner Docker, use 'host.docker.internal'
if (process.env.DOCKER_ENV) {
    MONGODB_URI = 'mongodb://mongo:27017/bicicletario';
}

mongoose.connection.on('connecting', () => {
    console.log('Connecting to MongoDB...');
});

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
    mongoose.connection.db.admin().ping().then((result) => {
        console.log('Ping result:', result); // Deve imprimir '1' se a conexão for bem-sucedida
    }).catch((error) => {
        console.error('Error pinging MongoDB:', error);
    });
});

mongoose.connection.on('error', (error) => {
    console.error('Error connecting to MongoDB:', error);
});

const db = mongoose.connect(MONGODB_URI).then(() => {
    useNewUrlParser: true;
    useUnifiedTopology: true;
    console.log('Conexão com o MongoDB estabelecida com sucesso');
}).catch((error) => {
    console.error('Erro ao conectar-se ao MongoDB:', error);
    process.exit(1);
});

export default db;
