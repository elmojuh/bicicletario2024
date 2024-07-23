// src/routes/trancaRoutes.ts
import { Router } from 'express';
import {TrancaController} from '../controllers/TrancaController';

export class TrancaRouter {
  public readonly router: Router;

  constructor() {
    const controller = new TrancaController();
    this.router = Router();

    this.router.route('/').post(controller.cadastrarTranca);
    this.router.route('/').get(controller.listarTrancas);
  }
}
