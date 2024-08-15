import { Request, Response } from 'express';
import {FuncionarioService} from "../services/FuncionarioService";
import {Error} from "../entities/Error";

export class FuncionarioController{
    async buscarPorId(req: Request, res: Response) {
        try{
            const id = parseInt(req.params.id);
            const funcionario = await new FuncionarioService().getById(id);
            const funcionarioJson = funcionario.toResponseJSON();
            res.json(funcionarioJson);
        }catch (error: Error | any){
            res.status(404).json({codigo: error.getCodigo(), mensagem: error.getMensagem()});
        }
    }
}
