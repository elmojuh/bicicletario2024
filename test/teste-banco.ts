import db from '../src/config/db'; // Importe o arquivo de configuração do banco de dados
import BicicletaDTO from '../src/entities/dto/./BicicletaDTO';

const bicicletaTeste = new BicicletaDTO({
    marca: 'Teste',
    modelo: 'Teste',
    ano: '2022',
    numero: 1,
    status: 'DISPONÍVEL'
});

// Aguarde a conexão com o banco de dados ser estabelecida antes de tentar salvar a bicicleta de teste
db.then(() => {
    bicicletaTeste.save()
        .then(() => console.log('BicicletaDTO de teste criada com sucesso'))
        .catch((error) => console.error('Erro ao criar bicicleta de teste:', error));
}).catch((error) => console.error('Erro ao conectar-se ao MongoDB:', error));
