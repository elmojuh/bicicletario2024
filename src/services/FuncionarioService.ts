import {Funcionario} from "../entities/Funcionario";
import {Error} from "../entities/Error";
import {Constantes} from "../entities/constants/Constantes";
import axios from "axios";

export class FuncionarioService {

    private readonly baseUrlDeAluguel = 'https://outro-microservico.com/api';

    async getById(idFuncionario: number) {
        try {
            // const response = await axios.get<Funcionario>(`${this.baseUrlDeAluguel}/${idFuncionario}`);
            // if (response.status === 200) {
            //     return response.data;
            // }
            const funcionario = new Funcionario(1, 'Nome', 'email@email.com', '12345678901', '123', '123', 20, '');
            return funcionario;
        } catch (error: Error | any) {
            if(!idFuncionario){
                throw new Error('404', Constantes.FUNCIONARIO_NAO_ENCONTRADO);
            }
            throw new Error('422', Constantes.FUNCIONARIO_INVALIDO);
        }
    }

    async isFuncionarioValido(idFuncionario: number): Promise<boolean> {
        const funcionario = await this.getById(idFuncionario);
        if (!funcionario) {
            throw new Error('404', Constantes.FUNCIONARIO_NAO_ENCONTRADO);
        }
        return true;
    }
}
