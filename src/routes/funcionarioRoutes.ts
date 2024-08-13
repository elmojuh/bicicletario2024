import { Router } from 'express';
import {FuncionarioController} from "../controllers/FuncionarioController";

export class FuncionarioRouter {
    public readonly router: Router;

    constructor() {
        const controller = new FuncionarioController();
        this.router = Router();

        this.router.route('/:id').get(controller.buscarPorId);
    }
}
