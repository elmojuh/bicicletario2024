import { Request, Response } from 'express';
import { TotemService } from '../services/TotemService';
import { NovoTotemDTO } from '../entities/dto/NovoTotemDTO';
import { Totem } from "../entities/Totem";
import { Constantes } from "../entities/constants/Constantes";
import { Error } from "../entities/Error";

export class TotemController {

    async listarTotens(req: Request, res: Response) {
        try {
            const totens = await new TotemService().listarTotens();
            const totensJson = totens.map(totem => totem.toResponseJSON());
            res.status(200).json(totensJson);
        } catch (error: Error | unknown) {
            res.status(422).json({ codigo: '422', mensagem: Constantes.ERRO_LISTAR_TOTENS });
        }
    }

    async cadastrarTotem(req: Request, res: Response) {
        try {
            const totemDTO: NovoTotemDTO = req.body;
            const totemCadastrado = await new TotemService().cadastrarTotem(totemDTO);
            const totemJson = totemCadastrado.toResponseJSON();
            res.status(200).json(totemJson);
        } catch (error: Error | any) {
            res.status(422).json({codigo: '422', mensagem: Constantes.ERRO_CRIAR_TOTEM});
        }
    }

    async editarTotem(req: Request, res: Response) {
        try {
            const idTotem = parseInt(req.params.id);
            const totem: Totem = req.body;
            const totemEditado = await new TotemService().editarTotem(idTotem, totem);
            const totemJson = totemEditado.toResponseJSON();
            res.status(200).json(totemJson);
        } catch (error: Error | any) {
            if (error.getCodigo() === '404') {
                res.status(404).json({ codigo: '404', mensagem: Constantes.TOTEM_NAO_ENCONTRADO });
            }
            else if (error.getCodigo() === '422') {
                res.status(422).json({ codigo: '422', mensagem: Constantes.DADOS_INVALIDOS });
            }
        }
    }


    async removerTotem(req: Request, res: Response) {
        try {
            const idTotem = parseInt(req.params.id);
            await new TotemService().removerTotem(idTotem);
            res.status(200).json({ message: Constantes.TOTEM_REMOVIDO });
        } catch (error: Error | any) {
            res.status(404).json({ codigo: '404', mensagem: Constantes.TOTEM_NAO_ENCONTRADO });

        }
    }

    async listarTrancas(req: Request, res: Response) {
        try {
            const idTotem = parseInt(req.params.id);
            const trancas = await new TotemService().listarTrancas(idTotem);
            res.status(200).json(trancas);
        } catch (error: Error | any) {
            if(error.getCodigo() === '404') {
                res.status(404).json({ codigo: '404', mensagem: Constantes.TRANCA_NAO_ENCONTRADA });
            }
            else if(error.getCodigo() === '422') {
                res.status(422).json({ codigo: '422', mensagem: Constantes.ERRO_LISTAR_TRANCAS });
            }
        }
    }

    async listarBicicletas(req: Request, res: Response) {
        try {
            const idTotem = parseInt(req.params.id);
            const bicicletas = await new TotemService().listarBicicletas(idTotem);
            res.status(200).json(bicicletas);
        } catch (error: Error | any) {
            if(error.getCodigo() === '404') {
                res.status(404).json({ codigo: '404', mensagem: Constantes.BICICLETA_NAO_ENCONTRADA });
            }
            else if(error.getCodigo() === '422') {
                res.status(422).json({ codigo: '422', mensagem: Constantes.ERRO_LISTAR_BICICLETAS });
            }
        }
    }
}
