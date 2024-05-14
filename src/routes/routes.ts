// src/routes.ts
import { Router } from 'express';
import bicicletaRoutes from './bicicletaRoutes';
import totemRoutes from './totemRoutes';
import trancaRoutes from './trancaRoutes';

const router = Router();

router.use((req, res, next) => {
    console.log(`Received request for ${req.path}`);
    next();
});

router.use('/bicicleta', bicicletaRoutes);
router.use('/totem', totemRoutes);
router.use('/tranca', trancaRoutes);

export default router;
