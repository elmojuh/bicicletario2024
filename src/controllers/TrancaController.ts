import { Request, Response } from 'express';
import { TrancaService } from '../services/TrancaService';
import { IntegrarBicicletaNaRedeDTO } from "../entities/dto/IntegrarBicicletaNaRedeDTO";
import { RetirarTrancaDaRedeDTO } from "../entities/dto/RetirarTrancaDaRedeDTO";
import { NovaTrancaDTO } from "../entities/dto/NovaTrancaDTO";
import { Tranca } from "../entities/Tranca";

export class TrancaController {

    async cadastrarTranca(req: Request, res: Response) {
        try {
            const trancaCadastrada = await new TrancaService().cadastrarTranca(req.body as NovaTrancaDTO);
            res.status(200).json(trancaCadastrada);
        }catch (error){
            res.status(500).json({ message: 'Tranca not created' });
        }
    }

    async listarTrancas(req: Request, res: Response) {
        try{
            const trancas = await new TrancaService().listarTrancas();
            res.json(trancas);
        }catch (error){
            res.status(500).json({ message: 'Trancas not listed' });
        }
    }

    // async integrarNaRede(req: Request, res: Response) {
    //     try {
    //         await new TrancaService().integrarNaRede(req.body as IntegrarBicicletaNaRedeDTO);
    //         res.status(200).json("Dados cadastrados");
    //     } catch (error) {
    //         res.status(422).json((error as Error).message);
    //     }
    // }
    //
    // async retirarDaRede(req: Request, res: Response) {
    //     try {
    //         await new TrancaService().retirarDaRede(req.body as RetirarTrancaDaRedeDTO);
    //         res.status(200).json("Tranca foi retirada com sucesso!");
    //     } catch (error) {
    //         res.status(422).json((error as Error).message);
    //     }
    // }
    //
    //
    // async obterTranca(req: Request, res: Response) {
    //     try{
    //         const tranca = await new TrancaService().obterTranca(req.params.idTranca);
    //         res.json(tranca);
    //     }catch (error){
    //         res.status(500).json({ message: 'Tranca not found' });
    //     }
    // }
    //
    // async editarTranca(req: Request, res: Response) {
    //     try{
    //         const trancaEditada = await new TrancaService().editarTranca(req.params.idTranca, req.body as NovaTrancaDTO);
    //         res.json(trancaEditada);
    //     }catch (error){
    //         res.status(500).json({ message: 'Tranca not edited' });
    //     }
    // }
    //
    // async removerTranca(req: Request, res: Response) {
    //     try {
    //         const tranca = await new TrancaService().obterTranca(req.params.idTranca);
    //         res.json(tranca);
    //     } catch (error) {
    //         res.status(500).json({ message: 'Tranca not found' });
    //     }
    // }
    //
    // async obterBicicletaNaTranca(req: Request, res: Response) {
    //     try {
    //         const bicicleta = await new TrancaService().obterBicicletaNaTranca(req.params.idTranca);
    //         res.json(bicicleta);
    //     }catch (error){
    //         res.status(500).json({ message: 'Bicicleta not found' });
    //     }
    // }
    //
    // async trancar(req: Request, res: Response) {
    //     try {
    //         await new TrancaService().trancarTranca(req.params.idTranca, req.body.bicicletaId);
    //         res.status(200).json("Ação bem sucedida");
    //     }catch (error){
    //         res.status(500).json({ message: 'Error trancando' });
    //     }
    // }
    //
    // async destrancar(req: Request, res: Response) {
    //     try{
    //         await new TrancaService().destrancarTranca(req.params.idTranca, req.body.bicicletaId);
    //         res.status(200).json("Ação bem sucedida");
    //     }catch (error){
    //         res.status(500).json({ message: 'Error destrancando' });
    //     }
    // }
    //
    // async alterarStatus(req: Request, res: Response) {
    //     try {
    //         await new TrancaService().alterarStatusTranca(req.params.idTranca, req.body.status);
    //         res.status(200).json("Ação bem sucedida");
    //     }catch (error){
    //         res.status(500).json({ message: 'Error changing status' });
    //     }
    // }
}
