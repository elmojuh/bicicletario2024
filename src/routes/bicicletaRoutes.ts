import { Router } from 'express';
import {BicicletaController} from '../controllers/BicicletaController';

export class BicicletaRouter {
  public readonly router: Router;

  constructor() {
    const controller = new BicicletaController();
    this.router = Router();

    this.router.route('/').post(controller.cadastrarBicicleta);
    this.router.route('/:id').get(controller.buscarPorId);
    this.router.route('/').get(controller.listar);
    this.router.route('/:id').put(controller.editarBicicleta);
    this.router.route('/:id').delete(controller.removerBicicleta);
    this.router.route('/integrarNaRede').post(controller.integrarNaRede);
    this.router.route('/retirarDaRede').post(controller.retirarDaRede);
    this.router.route('/:idBicicleta/status/:acao').get(controller.alterarStatusDaBicicleta);
  }
}
