import { Router } from 'express';
import { BicicletaRouter } from './bicicletaRoutes';
import { TotemRouter } from './totemRoutes';
import { TrancaRouter } from './trancaRoutes';
import {FuncionarioRouter} from "./funcionarioRoutes";

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

        this.router.use('/bicicleta', bicicletaRouter);
        this.router.use('/totem', totemRouter);
        this.router.use('/tranca', trancaRouter);
        this.router.use('/funcionario', funcionarioRouter);
    }
}
