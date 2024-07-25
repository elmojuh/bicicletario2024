import { Request, Response } from 'express';
import { BicicletaService } from '../services/BicicletaService';
import {IntegrarBicicletaNaRedeDTO} from "../entities/dto/IntegrarBicicletaNaRedeDTO";
import {RetirarBicicletaDaRedeDTO} from "../entities/dto/RetirarBicicletaDaRedeDTO";
import {Error} from "../entities/Error";
import {Constantes} from "../entities/constants/Constantes";
import {NovaBicicletaDTO} from "../entities/dto/NovaBicicletaDTO";

export class BicicletaController {

    async buscarPorId(req: Request, res: Response) {
        try{
            const id = parseInt(req.params.id);
            const bicicleta = await new BicicletaService().getById(id);
            const bicicletaJson = bicicleta.toResponseJSON();
            res.json(bicicletaJson);
        }catch (error){
            res.status(404).json(error);
        }
    }

    async create(req: Request, res: Response) {
        try {
            const dto: NovaBicicletaDTO = req.body;
            const newBicicleta = await new BicicletaService().criarBicicleta(dto);
            const bicicletaJson = newBicicleta.toResponseJSON();
            res.status(201).json(bicicletaJson);
        } catch (error) {
            res.status(422).json(error);
        }
    }

    async removerBicicleta(req: Request, res: Response) {
        try{
            const id = parseInt(req.params.id);
            await new BicicletaService().removerBicicleta(id);
            res.status(200).json(Constantes.BICICLETA_REMOVIDA);
        }catch (error){
            res.status(404).json(error);
        }
    }

    async listar(req: Request, res: Response) {
        try{
            const data = await new BicicletaService().listarBicicletas();
            const dataJson = data.map(bicicleta => bicicleta.toResponseJSON());
            res.json(dataJson);
        }catch (error){
            res.status(404).json(error);
        }
    }

    async editarBicicleta(req: Request, res: Response) {
        try{
            const id = parseInt(req.params.id);
            const data = req.body;
            const bicicleta = await new BicicletaService().editarBicicleta(id, data);
            const bicicletaJson = bicicleta.toResponseJSON();
            res.status(200).json(bicicletaJson);
        }catch (error){
            res.status(422).json(error);
        }
    }

    async integrarNaRede(req: Request, res: Response) {
        try{
            const data: IntegrarBicicletaNaRedeDTO = req.body;
            const bicicleta = await new BicicletaService().integrarNaRede(data);
            res.status(200).json(Constantes.DADOS_CADASTRADOS);
        }catch (error){
            res.status(422).json(error);
        }
    }

    async retirarDaRede(req: Request, res: Response) {
        try{
            const data: RetirarBicicletaDaRedeDTO = req.body;
            const bicicleta = await new BicicletaService().retirarDaRede(data);
            res.status(200).json(Constantes.DADOS_CADASTRADOS);
        }catch (error){
            res.status(422).json(error);
        }
    }

    async alterarStatusDaBicicleta(req: Request, res: Response) {
    try {
        const idBicicleta = parseInt(req.params.idBicicleta);
        const acao = req.params.acao;
        const bicicleta = await new BicicletaService().alterarStatus(idBicicleta, acao);
        res.status(200).json(Constantes.ACAO_BEM_SUCEDIDA);
    } catch (error) {
        res.status(422).json(error);
    }
}






}
