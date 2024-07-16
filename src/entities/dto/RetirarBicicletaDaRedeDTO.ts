import {StatusAcaoReparador} from "../enums/StatusAcaoReparador";

export class RetirarBicicletaDaRedeDTO {
    public idTranca: number;
    public idBicicleta: number;
    public idFuncionario: number;
    public statusAcaoReparador: StatusAcaoReparador;
    constructor(idTranca: number, idBicicleta: number, idFuncionario: number, statusAcaoReparador: StatusAcaoReparador) {
        this.idTranca = idTranca;
        this.idBicicleta = idBicicleta;
        this.idFuncionario = idFuncionario;
        this.statusAcaoReparador = statusAcaoReparador;
    }
}
