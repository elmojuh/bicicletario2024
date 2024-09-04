import { Request, Response, Router } from 'express';
import { TrancaRepository } from '../repositories/TrancaRepository';
import { BicicletaRepository } from '../repositories/BicicletaRepository';
import { TotemRepository } from '../repositories/TotemRepository';
import { StatusBicicleta } from "../entities/enums/StatusBicicleta";
import { TrancaService } from '../services/TrancaService';
import { BicicletaService } from '../services/BicicletaService';

export class RestaurarDadosRouter {
    public readonly router: Router;

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get('/', this.restaurarDados.bind(this));
    }

    private getDadosIniciais() {
        return {
            totens: [
                { id: 1, localizacao: 'Rio de Janeiro', descricao: 'Totem 1' },
            ],
            trancas: [
                { id: 1, localizacao: 'Rio de Janeiro', numero: 12345, anoDeFabricacao: '2020', modelo: 'Caloi', status: 'OCUPADA', bicicletaId: 1, totemId: 1 },
                { id: 2, localizacao: 'Rio de Janeiro', numero: 12345, anoDeFabricacao: '2020', modelo: 'Caloi', status: 'DISPONIVEL', totemId: 1 },
                { id: 3, localizacao: 'Rio de Janeiro', numero: 12345, anoDeFabricacao: '2020', modelo: 'Caloi', status: 'OCUPADA', bicicletaId: 2, totemId: 1 },
                { id: 4, localizacao: 'Rio de Janeiro', numero: 12345, anoDeFabricacao: '2020', modelo: 'Caloi', status: 'OCUPADA', bicicletaId: 5, totemId: 1 },
                { id: 5, localizacao: 'Rio de Janeiro', numero: 12345, anoDeFabricacao: '2020', modelo: 'Caloi', status: 'EM_REPARO' },
                { id: 6, localizacao: 'Rio de Janeiro', numero: 12345, anoDeFabricacao: '2020', modelo: 'Caloi', status: 'REPARO_SOLICITADO', totemId: 1 },
            ],
            bicicletas: [
                { id: 1, marca: 'Caloi', modelo: 'Caloi', ano: '2020', numero: 12345, status: StatusBicicleta.DISPONIVEL },
                { id: 2, marca: 'Caloi', modelo: 'Caloi', ano: '2020', numero: 12345, status: StatusBicicleta.REPARO_SOLICITADO },
                { id: 3, marca: 'Caloi', modelo: 'Caloi', ano: '2020', numero: 12345, status: StatusBicicleta.EM_USO },
                { id: 4, marca: 'Caloi', modelo: 'Caloi', ano: '2020', numero: 12345, status: StatusBicicleta.EM_REPARO },
                { id: 5, marca: 'Caloi', modelo: 'Caloi', ano: '2020', numero: 12345, status: StatusBicicleta.EM_USO },
            ],
        };
    }

    public async inicializarDados(): Promise<void> {
        try {
            console.log("Inicializando dados...");

            const dadosIniciais = this.getDadosIniciais();

            BicicletaRepository.clear();
            TrancaRepository.clear();
            TotemRepository.clear();

            // Cria os totens
            for (const totem of dadosIniciais.totens) {
                await TotemRepository.create(totem);
            }

            // Cria as trancas e já realiza a integração
            const trancaService = new TrancaService();
            for (const tranca of dadosIniciais.trancas) {
                const novaTranca = await TrancaRepository.create(tranca);

                // Integra a tranca na rede se ela tiver um totem associado
                if (tranca.totemId) {
                    await trancaService.integrarNaRede({
                        idTranca: novaTranca.id,
                        idTotem: tranca.totemId,
                        idFuncionario: 1 // Use um ID de funcionário válido
                    });
                }
            }

            // Cria as bicicletas e já realiza a integração
            const bicicletaService = new BicicletaService();
            for (const bicicleta of dadosIniciais.bicicletas) {
                await BicicletaRepository.create(bicicleta);

                // Se a bicicleta já estiver associada a uma tranca, integre-a na tranca
                const tranca = dadosIniciais.trancas.find(t => t.bicicletaId === bicicleta.id);
                if (tranca) {
                    await bicicletaService.integrarNaRede({
                        idBicicleta: bicicleta.id,
                        idTranca: tranca.id,
                        idFuncionario: 1 // Use um ID de funcionário válido
                    });
                }
            }

            console.log("Dados iniciais carregados com sucesso!");
        } catch (error) {
            console.error("Erro ao carregar os dados iniciais:", error);
        }
    }

    public async restaurarDados(req: Request, res: Response): Promise<void> {
        try {
            await this.inicializarDados();
            res.status(200).send({ message: 'Dados restaurados com sucesso!' });
        } catch (error) {
            console.error("Erro ao restaurar os dados:", error);
            res.status(500).send({ message: 'Erro ao restaurar os dados.' });
        }
    }
}
