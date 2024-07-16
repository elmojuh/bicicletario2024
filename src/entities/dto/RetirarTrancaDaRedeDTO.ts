import {StatusAcaoReparador} from "../enums/StatusAcaoReparador";

export class RetirarTrancaDaRedeDTO {
    public idTotem: number;
    public idTranca: number;
    public idFuncionario: number;
    public statusAcaoReparador: StatusAcaoReparador;
    constructor(idTotem: number, idTranca: number, idFuncionario: number, statusAcaoReparador: StatusAcaoReparador) {
        this.idTotem = idTotem;
        this.idTranca = idTranca;
        this.idFuncionario = idFuncionario;
        this.statusAcaoReparador = statusAcaoReparador;
    }
}
