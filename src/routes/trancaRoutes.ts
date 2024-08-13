import { Router } from 'express';
import {TrancaController} from '../controllers/TrancaController';

export class TrancaRouter {
  public readonly router: Router;

  constructor() {
    const controller = new TrancaController();
    this.router = Router();

    this.router.route('/').post(controller.cadastrarTranca);
    this.router.route('/').get(controller.listarTrancas);
    this.router.route('/:id').put(controller.editarTranca);
    this.router.route('/:id').delete(controller.removerTranca);
    this.router.route('/:id').get(controller.obterTranca);
    this.router.route('/integrarNaRede').post(controller.integrarNaRede);
    this.router.route('/retirarDaRede').post(controller.retirarDaRede);
    this.router.route('/:idTranca/status/:acao').post(controller.alterarStatusDaTranca);
    this.router.route('/:idTranca/trancar').post(controller.trancar);
    this.router.route('/:idTranca/destrancar').post(controller.destrancar);

  }
}
