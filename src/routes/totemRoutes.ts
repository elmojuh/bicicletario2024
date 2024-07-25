// src/routes/totemRoutes.ts
import { Router } from 'express';
import {TotemController} from '../controllers/TotemController';

export class TotemRouter {
  public readonly router: Router;

  constructor() {
    const controller = new TotemController();
    this.router = Router();

    this.router.route('/').post(controller.cadastrarTotem);
    this.router.route('/').get(controller.listarTotens);
    this.router.route('/:id').put(controller.editarTotem);
    this.router.route('/:id').delete(controller.removerTotem);
    this.router.route('/:id/trancas').get(controller.listarTrancas);
    this.router.route('/:id/bicicletas').get(controller.listarBicicletas);
  }
}
