// src/controllers/BicicletaController.ts
import { Request, Response } from 'express';
import { BicicletaService } from '../services/BicicletaService';
import {IntegrarBicicletaNaRedeDTO} from "../entities/dto/IntegrarBicicletaNaRedeDTO";
import {RetirarBicicletaDaRedeDTO} from "../entities/dto/RetirarBicicletaDaRedeDTO";

export class BicicletaController {

    async buscarPorId(req: Request, res: Response) {
        try{
            const id = req.params.id;
            const bicicleta = await new BicicletaService().getById(id);
            res.json(bicicleta);
        }catch (error){
            res.status(500).json({ message: 'Bicicleta not found' });
        }
    }

    async create(req: Request, res: Response) {
        try{
            const bicicleta = req.body;
            const newBicicleta = await new BicicletaService().create(bicicleta);
            res.status(201).json(newBicicleta);
        }catch (error){
            res.status(500).json({ message: 'Bicicleta not created' });
        }
    }

    async listar(req: Request, res: Response) {
        try{
            const data = await new BicicletaService().listarBicicletas();
            res.json(data);
        }catch (error){
            res.status(500).json({ message: 'Bicicletas not listed' });
        }
    }

    async integrarNaRede(req: Request, res: Response) {
        try{
            const data: IntegrarBicicletaNaRedeDTO = req.body;
            const bicicleta = await new BicicletaService().integrarNaRede(data);
            res.status(200).json(bicicleta);
        }catch (error){
            res.status(500).json({ message: 'Bicicleta not integrated' });
        }
    }

    async retirarDaRede(req: Request, res: Response) {
        try{
            const data: RetirarBicicletaDaRedeDTO = req.body;
            const bicicleta = await new BicicletaService().retirarDaRede(data.idBicicleta);
            res.status(200).json(bicicleta);
        }catch (error){
            res.status(500).json({ message: 'Bicicleta not removed' });
        }
    }




}
