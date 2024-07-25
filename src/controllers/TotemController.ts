import { Request, Response } from 'express';
import { TotemService } from '../services/TotemService';
import { NovoTotemDTO } from '../entities/dto/NovoTotemDTO';
import {Totem} from "../entities/Totem";

export class TotemController {

    async listarTotens(req: Request, res: Response) {
        try {
            const totens = await new TotemService().listarTotens();
            const totensJson = totens.map(totem => totem.toJSON());
            res.json(totensJson);
        } catch (error) {
            res.status(500).json({ message: 'Error listing Totems' });
        }
    }

    async cadastrarTotem(req: Request, res: Response) {
        try {
            const totemDTO: NovoTotemDTO = req.body;
            const totemCadastrado = await new TotemService().cadastrarTotem(totemDTO);
            const totemJson = totemCadastrado.toJSON();
            res.status(201).json(totemJson);
        } catch (error) {
            res.status(422).json({ message: 'Error cadastred Trancas' });
        }
    }

    async editarTotem(req: Request, res: Response) {
        try {
            const idTotem = parseInt(req.params.id);
            const totem: Totem = req.body;
            const totemEditado = await new TotemService().editarTotem(idTotem, totem);
            res.json(totemEditado);
        } catch (error) {
            res.status(422).json({ message: 'Error edit Totem' });
        }
    }

    async removerTotem(req: Request, res: Response) {
        try {
            const idTotem = parseInt(req.params.id);
            const totem = await new TotemService().removerTotem(idTotem);
            res.json({ message: 'Totem removido' });
        } catch (error) {
            res.status(422).json({ message: 'Error removing Totem' });
        }
    }

    async listarTrancas(req: Request, res: Response) {
        try {
            const idTotem = parseInt(req.params.id);
            const trancas = await new TotemService().listarTrancas(idTotem);
            res.json(trancas);
        } catch (error) {
            res.status(500).json({ message: 'Error listing Trancas' });
        }
    }

    async listarBicicletas(req: Request, res: Response) {
        try {
            const idTotem = parseInt(req.params.id);
            const bicicletas = await new TotemService().listarBicicletas(idTotem);
            res.json(bicicletas);
        } catch (error) {
            res.status(500).json({ message: 'Error listing Bicicletas' });
        }
    }
}
