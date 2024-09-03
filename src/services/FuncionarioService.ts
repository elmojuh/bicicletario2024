import {Funcionario} from "../entities/Funcionario";
import {Error} from "../entities/Error";
import {Constantes} from "../entities/constants/Constantes";
import axios from "axios";

export class FuncionarioService {

    private readonly baseUrlDeAluguel = 'https://bike-aluguel.azurewebsites.net/funcionario';

    async getById(idFuncionario: number): Promise<Funcionario> {
        try {
            // const funcionario = await axios.get<Funcionario>(`${this.baseUrlDeAluguel}/${idFuncionario}`);
            // console.log('URL ALUGUEL',this.baseUrlDeAluguel);
            // if(!funcionario.data){
            //     throw new Error('404', Constantes.FUNCIONARIO_NAO_ENCONTRADO);
            // }
            // if (funcionario.data.id === idFuncionario) {
            //     return funcionario.data;
            // }
            const funcionarioMock = new Funcionario(1, 'Nome', 'email@email.com', '12345678901', '123', '123', 20, '');
            if(idFuncionario === funcionarioMock.id){
                return funcionarioMock;
            }
            else {
                throw new Error('404', Constantes.FUNCIONARIO_NAO_ENCONTRADO);
            }
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
