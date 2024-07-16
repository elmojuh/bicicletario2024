export class IntegrarBicicletaNaRedeDTO {
    public idTranca: number;
    public idBicicleta: number;
    public idFuncionario: number;
    constructor(idTranca: number, idBicicleta: number, idFuncionario: number) {
        this.idTranca = idTranca;
        this.idBicicleta = idBicicleta;
        this.idFuncionario = idFuncionario;
    }
}
