import { Request, Response } from 'express';
import { TotemService } from '../services/TotemService';
import { NovoTotemDTO } from '../entities/dto/NovoTotemDTO';
import {Totem} from "../entities/Totem";
import {Constantes} from "../entities/constants/Constantes";

export class TotemController {

    async listarTotens(req: Request, res: Response) {
        try {
            const totens = await new TotemService().listarTotens();
            const totensJson = totens.map(totem => totem.toResponseJSON());
            res.json(totensJson);
        } catch (error) {
            res.status(422).json(error);
        }
    }

    async cadastrarTotem(req: Request, res: Response) {
        try {
            const totemDTO: NovoTotemDTO = req.body;
            const totemCadastrado = await new TotemService().cadastrarTotem(totemDTO);
            const totemJson = totemCadastrado.toResponseJSON();
            res.status(201).json(totemJson);
        } catch (error) {
            res.status(422).json(error);
        }
    }

    async editarTotem(req: Request, res: Response) {
        try {
            const idTotem = parseInt(req.params.id);
            const totem: Totem = req.body;
            const totemEditado = await new TotemService().editarTotem(idTotem, totem);
            res.json(totemEditado);
        } catch (error) {
            res.status(422).json(error);
        }
    }

    async removerTotem(req: Request, res: Response) {
        try {
            const idTotem = parseInt(req.params.id);
            await new TotemService().removerTotem(idTotem);
            res.json({ message: Constantes.TOTEM_REMOVIDO });
        } catch (error) {
            res.status(422).json(error);
        }
    }

    async listarTrancas(req: Request, res: Response) {
        try {
            const idTotem = parseInt(req.params.id);
            const trancas = await new TotemService().listarTrancas(idTotem);
            res.json(trancas);
        } catch (error) {
            res.status(422).json(error);
        }
    }

    async listarBicicletas(req: Request, res: Response) {
        try {
            const idTotem = parseInt(req.params.id);
            const bicicletas = await new TotemService().listarBicicletas(idTotem);
            res.json(bicicletas);
            res.json(bicicletas);
        } catch (error) {
            res.status(422).json(error);
        }
    }
}
