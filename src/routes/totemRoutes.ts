// src/routes/totemRoutes.ts
import { Router } from 'express';
import TotemController from '../controllers/TotemController';

const router = Router();

router.post('/', TotemController.create);
router.get('/', TotemController.getAll);
router.get('/:id', TotemController.getById);
router.put('/:id', TotemController.update);
router.delete('/:id', TotemController.delete);

export default router;
