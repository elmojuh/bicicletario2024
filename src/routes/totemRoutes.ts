// src/routes/totemRoutes.ts
import { Router } from 'express';
import {TotemController} from '../controllers/TotemController';

export class TotemRouter {
  public readonly router: Router;

  constructor() {
    const controller = new TotemController();
    this.router = Router();

    this.router.route('/').post(controller.cadastrarTotem);
  }
}
