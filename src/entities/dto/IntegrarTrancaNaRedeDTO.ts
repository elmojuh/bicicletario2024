export class IntegrarTrancaNaRedeDTO {
    public idTotem: number;
    public idTranca: number;
    public idFuncionario: number;
    constructor(idTotem: number, idTranca: number, idFuncionario: number) {
        this.idTotem = idTotem;
        this.idTranca = idTranca;
        this.idFuncionario = idFuncionario;
    }
}
