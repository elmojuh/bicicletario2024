// src/controllers/BicicletaController.ts
import { Request, Response } from 'express';
import BicicletaService from '../services/BicicletaService';
import { Bicicleta as BicicletaInterface } from '../entities/BicicletaInterface';

class BicicletaController {
    async create(req: Request, res: Response) {
        const bicicleta: BicicletaInterface = req.body;
        const newBicicleta = await BicicletaService.create(bicicleta);
        res.status(201).json(newBicicleta);
    }

    async getAll(req: Request, res: Response) {
        const bicicletas = await BicicletaService.getAll();
        res.json(bicicletas);
    }

    async getById(req: Request, res: Response) {
        const id = req.params.id;
        const bicicleta = await BicicletaService.getById(id);
        if (!bicicleta) {
            res.status(404).json({ message: 'Bicicleta not found' });
        } else {
            res.json(bicicleta);
        }
    }

    async update(req: Request, res: Response) {
        const id = req.params.id;
        const bicicletaData: BicicletaInterface = req.body;
        const updatedBicicleta = await BicicletaService.update(id, bicicletaData);
        if (!updatedBicicleta) {
            res.status(404).json({ message: 'Bicicleta not found' });
        } else {
            res.json(updatedBicicleta);
        }
    }

    async delete(req: Request, res: Response) {
        const id = req.params.id;
        const deletedBicicleta = await BicicletaService.delete(id);
        if (!deletedBicicleta) {
            res.status(404).json({ message: 'Bicicleta not found' });
        } else {
            res.json(deletedBicicleta);
        }
    }
}

export default new BicicletaController();
