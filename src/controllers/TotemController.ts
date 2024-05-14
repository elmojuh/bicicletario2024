// src/controllers/TotemController.ts
import { Request, Response } from 'express';
import TotemService from '../services/TotemService';
import { Totem as TotemInterface } from '../entities/TotemInterface';

class TotemController {
    async create(req: Request, res: Response) {
        const totem: TotemInterface = req.body;
        const newTotem = await TotemService.create(totem);
        res.status(201).json(newTotem);
    }

    async getAll(req: Request, res: Response) {
        const totems = await TotemService.getAll();
        res.json(totems);
    }

    async getById(req: Request, res: Response) {
        const id = req.params.id;
        const totem = await TotemService.getById(id);
        if (!totem) {
            res.status(404).json({ message: 'Totem not found' });
        } else {
            res.json(totem);
        }
    }

    async update(req: Request, res: Response) {
        const id = req.params.id;
        const totemData: TotemInterface = req.body;
        const updatedTotem = await TotemService.update(id, totemData);
        if (!updatedTotem) {
            res.status(404).json({ message: 'Totem not found' });
        } else {
            res.json(updatedTotem);
        }
    }

    async delete(req: Request, res: Response) {
        const id = req.params.id;
        const deletedTotem = await TotemService.delete(id);
        if (!deletedTotem) {
            res.status(404).json({ message: 'Totem not found' });
        } else {
            res.json(deletedTotem);
        }
    }
}

export default new TotemController();
