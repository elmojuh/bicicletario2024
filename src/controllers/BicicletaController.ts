import { Request, Response } from 'express';
import { BicicletaService } from '../services/BicicletaService';
import {IntegrarBicicletaNaRedeDTO} from "../entities/dto/IntegrarBicicletaNaRedeDTO";
import {RetirarBicicletaDaRedeDTO} from "../entities/dto/RetirarBicicletaDaRedeDTO";

export class BicicletaController {

    async buscarPorId(req: Request, res: Response) {
        try{
            const id = parseInt(req.params.id);
            const bicicleta = await new BicicletaService().getById(id);
            const bicicletaJson = bicicleta.toJSON();
            res.json(bicicletaJson);
        }catch (error){
            res.status(500).json({ message: 'Bicicleta not found' });
        }
    }

    async create(req: Request, res: Response) {
        try{
            const bicicleta = req.body;
            const newBicicleta = await new BicicletaService().criarBicicleta(bicicleta);
            const bicicletaJson = newBicicleta.toJSON();
            res.status(201).json(bicicletaJson);
        }catch (error){
            res.status(500).json({ message: 'Bicicleta not created' });
        }
    }

    async listar(req: Request, res: Response) {
        try{
            const data = await new BicicletaService().listarBicicletas();
            const dataJson = data.map(bicicleta => bicicleta.toJSON());
            res.json(dataJson);
        }catch (error){
            res.status(500).json({ message: 'Bicicletas not listed' });
        }
    }

    async editarBicicleta(req: Request, res: Response) {
        try{
            const id = parseInt(req.params.id);
            const data = req.body;
            const bicicleta = await new BicicletaService().editarBicicleta(id, data);
            const bicicletaJson = bicicleta.toJSON();
            res.status(200).json(bicicletaJson);
        }catch (error){
            res.status(500).json({ message: 'Bicicleta not updated' });
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
            const bicicleta = await new BicicletaService().retirarDaRede(data);
            res.status(200).json(bicicleta);
        }catch (error){
            res.status(500).json({ message: 'Bicicleta not removed' });
        }
    }

    async alterarStatusDaBicicleta(req: Request, res: Response) {
    try {
        const idBicicleta = parseInt(req.params.idBicicleta);
        const acao = req.params.acao;
        const bicicleta = await new BicicletaService().alterarStatus(idBicicleta, acao);
        res.status(200).json(bicicleta);
    } catch (error) {
        res.status(500).json({ message: 'Bicicleta nao alterada' });
    }
}






}
