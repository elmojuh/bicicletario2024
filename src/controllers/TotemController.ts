import { Request, Response } from 'express';
import { TotemService } from '../services/TotemService';
import { NovoTotemDTO } from '../entities/dto/NovoTotemDTO';

export class TotemController {

    async listarTotens(req: Request, res: Response) {
        try {
            const totens = await new TotemService().listarTotens();
            res.json(totens);
        } catch (error) {
            res.status(500).json({ message: 'Error listing Totems' });
        }
    }

    async cadastrarTotem(req: Request, res: Response) {
        try {
            const totemDTO: NovoTotemDTO = req.body;
            const totemCadastrado = await new TotemService().cadastrarTotem(totemDTO);
            res.status(201).json(totemCadastrado);
        } catch (error) {
            res.status(422).json({ message: 'Error cadastred Trancas' });
        }
    }

    // async editarTotem(req: Request, res: Response) {
    //     try {
    //         const idTotem = req.params.id;
    //         const totemDTO: TotemDTO = req.body;
    //         const totemEditado = await this.totemService.editarTotem(idTotem, totemDTO);
    //         res.json(totemEditado);
    //     } catch (error) {
    //         res.status(422).json({ message: 'Error edit Totem' });
    //     }
    // }
    //
    // async removerTotem(req: Request, res: Response) {
    //     try {
    //         const idTotem = req.params.id;
    //         await this.totemService.removerTotem(idTotem);
    //         res.json({ message: 'Totem removido' });
    //     } catch (error) {
    //         res.status(422).json({ message: 'Error removing Totem' });
    //     }
    // }
    //
    // async listarTrancas(req: Request, res: Response) {
    //     try {
    //         const idTotem = req.params.id;
    //         const trancas = await this.totemService.listarTrancas(idTotem);
    //         res.json(trancas);
    //     } catch (error) {
    //         res.status(500).json({ message: 'Error listing Trancas' });
    //     }
    // }
    //
    // async listarBicicletas(req: Request, res: Response) {
    //     try {
    //         const idTotem = req.params.id;
    //         const bicicletas = await this.totemService.listarBicicletas(idTotem);
    //         res.json(bicicletas);
    //     } catch (error) {
    //         res.status(500).json({ message: 'Error listing Bicicletas' });
    //     }
    // }
}
