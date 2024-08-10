import { Request, Response } from 'express';
import { TrancaService } from '../services/TrancaService';
import { NovaTrancaDTO } from "../entities/dto/NovaTrancaDTO";
import {IntegrarTrancaNaRedeDTO} from "../entities/dto/IntegrarTrancaNaRedeDTO";
import {RetirarTrancaDaRedeDTO} from "../entities/dto/RetirarTrancaDaRedeDTO";
import {Constantes} from "../entities/constants/Constantes";
import { Error } from "../entities/Error"

export class TrancaController {

    async cadastrarTranca(req: Request, res: Response) {
        try {
            const trancaCadastrada = await new TrancaService().cadastrarTranca(req.body as NovaTrancaDTO);
            const trancaJson = trancaCadastrada.toResponseJSON();
            res.status(200).json(trancaJson);
        }catch (error: Error | unknown){
            if(error instanceof Error){
                res.status(422).json({codigo: '422', mensagem: Constantes.ERRO_CRIAR_TRANCA});
            }else{
                res.status(500).json({codigo: '500', mensagem: 'Erro desconhecido'});
            }
        }
    }

    async listarTrancas(req: Request, res: Response) {
        try{
            const data = await new TrancaService().listarTrancas();
            const dataJson = data.map(tranca => tranca.toResponseJSON());
            res.json(dataJson);
        }catch (error: Error | unknown){
            if(error instanceof Error){
                res.status(422).json({codigo: '422', mensagem: Constantes.ERRO_LISTAR_TRANCAS});
            }else{
                res.status(500).json({codigo: '500', mensagem: 'Erro desconhecido'});
            }
        }
    }

    async integrarNaRede(req: Request, res: Response) {
        try {
            await new TrancaService().integrarNaRede(req.body as IntegrarTrancaNaRedeDTO);
            res.status(200).json;
        } catch (error: Error | unknown) {
            if(error instanceof Error){
                res.status(422).json({codigo: '422', mensagem: Constantes.ERRO_INTEGRAR_TRANCA});
            }else{
                res.status(500).json({codigo: '500', mensagem: 'Erro desconhecido'});
            }
        }
    }


    async retirarDaRede(req: Request, res: Response) {
        try {
            await new TrancaService().retirarDaRede(req.body as RetirarTrancaDaRedeDTO);
            res.status(200).json;
        } catch (error: Error | unknown){
            if(error instanceof Error){
                res.status(422).json({codigo: '422', mensagem: Constantes.ERRO_RETIRAR_TRANCA});
            }else{
                res.status(500).json({codigo: '500', mensagem: 'Erro desconhecido'});
            }
        }
    }

    async obterTranca(req: Request, res: Response) {
        try{
            const id = parseInt(req.params.idTranca);
            const tranca = await new TrancaService().getById(id);
            const trancaJson = tranca.toResponseJSON();
            res.status(200).json(trancaJson);
        }catch (error: Error | unknown){
            if(error instanceof Error){
                res.status(404).json({codigo: '404', mensagem: Constantes.TRANCA_NAO_ENCONTRADA});
            }else {
                res.status(500).json({codigo: '500', mensagem: 'Erro desconhecido'});
            }
        }
    }

    async editarTranca(req: Request, res: Response) {
        try{
            const id = parseInt(req.params.id);
            const data = req.body;
            const tranca = await new TrancaService().editarTranca(id, data);
            const trancaJson = tranca.toResponseJSON();
            res.json(trancaJson).json(Constantes.ACAO_BEM_SUCEDIDA);
        }catch (error: Error | unknown){
            if(error instanceof Error){
                if(error.getCodigo() === '404'){
                    res.status(404).json({codigo: '404', mensagem: Constantes.TRANCA_NAO_ENCONTRADA});
                }
                if(error.getCodigo() === '422'){
                    res.status(422).json({codigo: '422', mensagem: Constantes.ERRO_EDITAR_TRANCA});
                }else{
                    res.status(500).json({codigo: '500', mensagem: 'Erro desconhecido'});
                }
            }
        }
    }

    async removerTranca(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.idTranca);
            const tranca = await new TrancaService().removerTranca(id);
            res.json(tranca).json(Constantes.TRANCA_REMOVIDA);
        } catch (error: Error | unknown) {
            if(error instanceof Error){
                if(error.getCodigo() === '404') {
                    res.status(404).json({codigo: '404', mensagem: Constantes.TRANCA_NAO_ENCONTRADA});
                }
                if (error.getCodigo() === '422') {
                    res.status(422).json({codigo: '422', mensagem: Constantes.ERRO_REMOVER_TRANCA});
                }else{
                    res.status(500).json({codigo: '500', mensagem: 'Erro desconhecido'});
                }
            }
        }
    }

    async obterBicicletaNaTranca(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.idTranca);
            const bicicleta = await new TrancaService().obterBicicletaNaTranca(id);
            res.json(bicicleta).json(Constantes.BICICLETA_ENCONTRADA);
        }catch (error: Error | unknown){
            if(error instanceof Error){
                if(error.getCodigo() === '404'){
                    res.status(404).json({codigo: '404', mensagem: Constantes.BICICLETA_NAO_ENCONTRADA});
                }
                if(error.getCodigo() === '422'){
                    res.status(422).json({codigo: '422', mensagem: Constantes.ERRO_OBTER_BICICLETA_TRANCA});
                }else{
                    res.status(500).json({codigo: '500', mensagem: 'Erro desconhecido'});
                }
            }
        }
    }

    async trancar(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const idBicicleta = parseInt(req.body.bicicleta);
            await new TrancaService().trancarTranca(id, idBicicleta);
            res.status(200).json(Constantes.ACAO_BEM_SUCEDIDA);
        } catch (error: Error | unknown){
            if(error instanceof Error){
                if (error.getCodigo() === '404') {
                    res.status(404).json({codigo: '404', mensagem: Constantes.TRANCA_NAO_ENCONTRADA});
                }
                if (error.getCodigo() === '422') {
                    res.status(422).json({codigo: '422', mensagem: Constantes.ERRO_TRANCAR_TRANCA});
                }else {
                    res.status(500).json({codigo: '500', mensagem: 'Erro desconhecido'});
                }
            }
        }
    }

    async destrancar(req: Request, res: Response) {
        try{
            const id = parseInt(req.params.id);
            const idBicicleta = parseInt(req.body.bicicleta);
            await new TrancaService().destrancarTranca(id, idBicicleta);
            res.status(200).json(Constantes.ACAO_BEM_SUCEDIDA);
        }catch (error: Error | unknown){
            if(error instanceof Error){
                if (error.getCodigo() === '404') {
                    res.status(404).json({codigo: '404', mensagem: Constantes.TRANCA_NAO_ENCONTRADA});
                }
                if (error.getCodigo() === '422') {
                    res.status(422).json({codigo: '422', mensagem: Constantes.ERRO_DESTRANCAR_TRANCA});
                }else {
                    res.status(500).json({codigo: '500', mensagem: 'Erro desconhecido'});
                }
            }
        }
    }

    async alterarStatusDaTranca(req: Request, res: Response) {
        try {
            const idTranca = parseInt(req.params.idTranca);
            const acao = req.params.acao
            const tranca = await new TrancaService().alterarStatus(idTranca, acao);
            res.status(200).json(tranca);
        }catch (error: Error | unknown){
            if(error instanceof Error){
                if (error.getCodigo() === '404') {
                    res.status(404).json({codigo: '404', mensagem: Constantes.TRANCA_NAO_ENCONTRADA});
                }
                if (error.getCodigo() === '422') {
                    res.status(422).json({codigo: '422', mensagem: Constantes.ERRO_ALTERAR_STATUS_TRANCA});
                }else {
                    res.status(500).json({codigo: '500', mensagem: 'Erro desconhecido'});
                }
            }
        }
    }
}
