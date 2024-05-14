// src/routes/trancaRoutes.ts
import { Router } from 'express';
import TrancaController from '../controllers/TrancaController';

const router = Router();

router.post('/', TrancaController.create);
router.get('/', TrancaController.getAll);
router.get('/:id', TrancaController.getById);
router.put('/:id', TrancaController.update);
router.delete('/:id', TrancaController.delete);

export default router;
