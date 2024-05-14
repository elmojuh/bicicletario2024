// src/controllers/TrancaController.ts
import { Request, Response } from 'express';
import TrancaService from '../services/TrancaService';
import { Tranca as TrancaInterface } from '../entities/TrancaInterface';

class TrancaController {
    async create(req: Request, res: Response) {
        const tranca: TrancaInterface = req.body;
        const newTranca = await TrancaService.create(tranca);
        res.status(201).json(newTranca);
    }

    async getAll(req: Request, res: Response) {
        const trancas = await TrancaService.getAll();
        res.json(trancas);
    }

    async getById(req: Request, res: Response) {
        const id = req.params.id;
        const tranca = await TrancaService.getById(id);
        if (!tranca) {
            res.status(404).json({ message: 'Tranca not found' });
        } else {
            res.json(tranca);
        }
    }

    async update(req: Request, res: Response) {
        const id = req.params.id;
        const trancaData: TrancaInterface = req.body;
        const updatedTranca = await TrancaService.update(id, trancaData);
        if (!updatedTranca) {
            res.status(404).json({ message: 'Tranca not found' });
        } else {
            res.json(updatedTranca);
        }
    }

    async delete(req: Request, res: Response) {
        const id = req.params.id;
        const deletedTranca = await TrancaService.delete(id);
        if (!deletedTranca) {
            res.status(404).json({ message: 'Tranca not found' });
        } else {
            res.json(deletedTranca);
        }
    }
}

export default new TrancaController();
