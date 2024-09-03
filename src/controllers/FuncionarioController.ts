import { Request, Response } from 'express';
import { FuncionarioService } from "../services/FuncionarioService";
import { Error as CustomError } from "../entities/Error";

export class FuncionarioController {
    async buscarPorId(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const funcionario = await new FuncionarioService().getById(id);
            const funcionarioJson = funcionario.toResponseJSON();
            res.json(funcionarioJson);
        } catch (error: any) {
            if (error instanceof CustomError) {
                res.status(404).json({ codigo: error.getCodigo(), mensagem: error.getMensagem() });
            } else {
                // Lida com outros tipos de erro, se necessário
                res.status(500).json({ codigo: '500', mensagem: 'Internal Server Error' });
            }
        }
    }
}
