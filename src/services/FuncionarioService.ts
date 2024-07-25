import {Funcionario} from "../entities/Funcionario";

export class FuncionarioService {

    async getById(idFuncionario: number): Promise<Funcionario> {
        const funcionario = new Funcionario(
            idFuncionario,
            "Funcionario",
            "Funcionario@Funcionario.com",
            "123.456.789-00",
            "123456",
            "123456",
            30,
            "Funcionario"
        );
        return funcionario;
    }

    static async isFuncionarioValido(idFuncionario: number): Promise<boolean> {
        return true;
    }
}
