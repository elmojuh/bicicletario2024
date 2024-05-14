// src/routes/bicicletaRoutes.ts
import { Router } from 'express';
import BicicletaController from '../controllers/BicicletaController';

const router = Router();

router.post('/', BicicletaController.create);
router.get('/', BicicletaController.getAll);
router.get('/:id', BicicletaController.getById);
router.put('/:id', BicicletaController.update);
router.delete('/:id', BicicletaController.delete);

export default router;
