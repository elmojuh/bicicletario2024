import { Router, Request, Response } from 'express';
import { BicicletaRouter } from './bicicletaRoutes';
import { TotemRouter } from './totemRoutes';
import { TrancaRouter } from './trancaRoutes';
import { FuncionarioRouter } from "./funcionarioRoutes";
import { RestaurarDadosRouter } from "./restaurarDadosRoutes";

export default class AppRoutes {
    public router: Router;

    constructor() {
        this.router = Router();
        this.initializeMiddlewares();
        this.initializeRoutes();
    }

    private initializeMiddlewares(): void {
        this.router.use((req, res, next) => {
            next();
        });
    }

    private initializeRoutes(): void {
        const bicicletaRouter = new BicicletaRouter().router;
        const totemRouter = new TotemRouter().router;
        const trancaRouter = new TrancaRouter().router;
        const funcionarioRouter = new FuncionarioRouter().router;
        const restaurarDadosRouter = new RestaurarDadosRouter().router;

        this.router.get('/', (req: Request, res: Response) => {
            res.send('Bicicletário, acesse as rotas em /api/{rota}');
        });

        this.router.use('/bicicleta', bicicletaRouter);
        this.router.use('/totem', totemRouter);
        this.router.use('/tranca', trancaRouter);
        this.router.use('/funcionario', funcionarioRouter);
        this.router.use('/restaurarDados', restaurarDadosRouter);

        // Inicializa os dados ao iniciar as rotas
        new RestaurarDadosRouter().inicializarDados();
    }
}
