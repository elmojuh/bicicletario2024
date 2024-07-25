import { Request, Response } from 'express';
import { TrancaService } from '../services/TrancaService';
import { NovaTrancaDTO } from "../entities/dto/NovaTrancaDTO";
import { Tranca } from "../entities/Tranca";
import {IntegrarBicicletaNaRedeDTO} from "../entities/dto/IntegrarBicicletaNaRedeDTO";
import {IntegrarTrancaNaRedeDTO} from "../entities/dto/IntegrarTrancaNaRedeDTO";
import {RetirarTrancaDaRedeDTO} from "../entities/dto/RetirarTrancaDaRedeDTO";
import {Constantes} from "../entities/constants/Constantes";

export class TrancaController {

    async cadastrarTranca(req: Request, res: Response) {
        try {
            const trancaCadastrada = await new TrancaService().cadastrarTranca(req.body as NovaTrancaDTO);
            const trancaJson = trancaCadastrada.toResponseJSON();
            res.status(201).json(trancaJson);
        }catch (error){
            res.status(422).json({ message: 'Tranca not created' });
        }
    }

    async buscarPorId(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const tranca = await new TrancaService().getById(id);
            res.json(tranca);
        } catch (error) {
            res.status(422).json({ message: 'Tranca not found' });
        }
    }

    async listarTrancas(req: Request, res: Response) {
        try{
            const trancas = await new TrancaService().listarTrancas();
            res.json(trancas);
        }catch (error){
            res.status(422).json({ message: 'Trancas not listed' });
        }
    }

    async integrarNaRede(req: Request, res: Response) {
        try {
            await new TrancaService().integrarNaRede(req.body as IntegrarTrancaNaRedeDTO);
            res.status(200).json(Constantes.DADOS_CADASTRADOS);
        } catch (error) {
            res.status(422).json((error as Error).message);
        }
    }


    async retirarDaRede(req: Request, res: Response) {
        try {
            await new TrancaService().retirarDaRede(req.body as RetirarTrancaDaRedeDTO);
            res.status(200).json(Constantes.DADOS_CADASTRADOS);
        } catch (error) {
            res.status(422).json((error as Error).message);
        }
    }


    async obterTranca(req: Request, res: Response) {
        try{
            const id = parseInt(req.params.idTranca);
            const tranca = await new TrancaService().getById(id);
            res.json(tranca).json(Constantes.TRANCA_ENCONTRADA);
        }catch (error){
            res.status(422).json({ message: 'Tranca not found' });
        }
    }

    async editarTranca(req: Request, res: Response) {
        try{
            const id = parseInt(req.params.id);
            const data = req.body;
            const tranca = await new TrancaService().update(id, data);
            const trancaJson = tranca.toResponseJSON();
            res.json(trancaJson);
        }catch (error){
            res.status(422).json(error);
        }
    }

    async removerTranca(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.idTranca);
            const tranca = await new TrancaService().removerTranca(id);
            res.json(tranca).json(Constantes.TRANCA_REMOVIDA);
        } catch (error) {
            res.status(422).json(error);
        }
    }

    async obterBicicletaNaTranca(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.idTranca);
            const bicicleta = await new TrancaService().obterBicicletaNaTranca(id);
            res.json(bicicleta).json(Constantes.BICICLETA_ENCONTRADA);
        }catch (error){
            res.status(422).json(error);
        }
    }

    async trancar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const idBicicleta = parseInt(req.body.bicicleta);
            await new TrancaService().trancarTranca(id, idBicicleta);
            res.status(200).json(Constantes.ACAO_BEM_SUCEDIDA);
        } catch (error) {
            res.status(422).json(error);
        }
    }

    async destrancar(req: Request, res: Response) {
        try{
            const id = parseInt(req.params.id);
            const idBicicleta = parseInt(req.body.bicicleta);
            await new TrancaService().destrancarTranca(id, idBicicleta);
            res.status(200).json(Constantes.ACAO_BEM_SUCEDIDA);
        }catch (error){
            res.status(422).json(error);
        }
    }

    async alterarStatusDaTranca(req: Request, res: Response) {
        try {
            const idTranca = parseInt(req.params.idTranca);
            const acao = req.params.acao
            const tranca = await new TrancaService().alterarStatus(idTranca, acao);
            res.status(200).json(tranca).json(Constantes.ACAO_BEM_SUCEDIDA);
        }catch (error){
            res.status(422).json(error);
        }
    }
}
