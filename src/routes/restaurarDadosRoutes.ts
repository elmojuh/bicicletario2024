import {Request, Response, Router} from 'express';
import {TrancaRepository} from '../repositories/TrancaRepository';
import {BicicletaRepository} from '../repositories/BicicletaRepository';
import {TotemRepository} from '../repositories/TotemRepository';
import {StatusBicicleta} from "../entities/enums/StatusBicicleta";

export class RestaurarDadosRouter {
    public readonly router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post('/', this.restaurarDados);
        this.router.get('/teste', this.testRoute);
    }

    private async restaurarDados(req: Request, res: Response): Promise<void> {
        try {
            // Limpa os dados atuais
            console.log("Iniciando restauração de dados...");

            // Adicione os dados iniciais conforme o seu cenário
            const dadosIniciais = {
                bicicletas: [
                    { id: 1, marca: 'Caloi', modelo: 'Caloi', ano: '2020', numero: 12345, status: StatusBicicleta.DISPONIVEL },
                    { id: 2, marca: 'Caloi', modelo: 'Caloi', ano: '2020', numero: 12345, status: StatusBicicleta.REPARO_SOLICITADO },
                    { id: 3, marca: 'Caloi', modelo: 'Caloi', ano: '2020', numero: 12345, status: StatusBicicleta.EM_USO },
                    { id: 4, marca: 'Caloi', modelo: 'Caloi', ano: '2020', numero: 12345, status: StatusBicicleta.EM_REPARO },
                    { id: 5, marca: 'Caloi', modelo: 'Caloi', ano: '2020', numero: 12345, status: StatusBicicleta.EM_USO },
                ],
                trancas: [
                    { id: 1, localizacao: 'Rio de Janeiro', numero: 12345, anoDeFabricacao: '2020', modelo: 'Caloi', status: 'OCUPADA', bicicletaId: 1, totemId: 1 },
                    { id: 2, localizacao: 'Rio de Janeiro', numero: 12345, anoDeFabricacao: '2020', modelo: 'Caloi', status: 'DISPONIVEL', totemId: 1 },
                    { id: 3, localizacao: 'Rio de Janeiro', numero: 12345, anoDeFabricacao: '2020', modelo: 'Caloi', status: 'OCUPADA', bicicletaId: 2, totemId: 1 },
                    { id: 4, localizacao: 'Rio de Janeiro', numero: 12345, anoDeFabricacao: '2020', modelo: 'Caloi', status: 'OCUPADA', bicicletaId: 5, totemId: 1 },
                    { id: 5, localizacao: 'Rio de Janeiro', numero: 12345, anoDeFabricacao: '2020', modelo: 'Caloi', status: 'EM_REPARO' },
                    { id: 6, localizacao: 'Rio de Janeiro', numero: 12345, anoDeFabricacao: '2020', modelo: 'Caloi', status: 'REPARO_SOLICITADO', totemId: 1 },
                ],
                totens: [
                    { id: 1, localizacao: 'Rio de Janeiro', descricao: 'Totem 1' },
                ],
            };

            dadosIniciais.bicicletas.forEach(bicicleta => BicicletaRepository.create(bicicleta));
            dadosIniciais.trancas.forEach(tranca => TrancaRepository.create(tranca));
            dadosIniciais.totens.forEach(totem => TotemRepository.create(totem));

            res.status(200).send({ message: 'Dados restaurados com sucesso!' });
        } catch (error) {
            res.status(500).send({ message: 'Erro ao restaurar os dados.' });
        }
    }
    private testRoute(req: Request, res: Response): void {
        res.status(200).send({ message: 'Rota de teste funcionando!' });
    }
}
