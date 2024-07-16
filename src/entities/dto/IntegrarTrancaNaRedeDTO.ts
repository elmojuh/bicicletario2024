export class IntegrarTrancaNaRedeDTO {
    public idToten: number;
    public idTranca: number;
    public idFuncionario: number;
    constructor(idToten: number, idTranca: number, idFuncionario: number) {
        this.idToten = idToten;
        this.idTranca = idTranca;
        this.idFuncionario = idFuncionario;
    }
}
