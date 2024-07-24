// src/services/TrancaService.ts
import { TrancaRepository } from '../repositories/TrancaRepository';
import {NovaTrancaDTO} from "../entities/dto/NovaTrancaDTO";
import {TrancaMapper} from "../mapper/TrancaMapper";

export class TrancaService {
    async cadastrarTranca(dto: NovaTrancaDTO) {
        const savedTranca = TrancaRepository.create(dto);
        return savedTranca.toJSON();
    }

    async listarTrancas() {
        return TrancaRepository.getAll();
    }

    async getById(id: string ): Promise<any> {
        const idNumber = parseInt(id, 10);
        const tranca = TrancaRepository.getById(idNumber);
        if(!tranca){
            throw new Error('Tranca não encontrada');
        }
        return tranca;
    }

    async update(id: number, trancaData: any) {
        return TrancaRepository.update(id, trancaData);
    }

    // async integrarNaRede(tranca: Tranca) {
    //     return TrancaRepository.update(tranca.id, tranca);
    // }
    //
    // async retirarDaRede(tranca: Tranca) {
    //     return TrancaRepository.delete(tranca.id);
    // }
    //
    //
    // async obterTranca(id: string) {
    //     return TrancaRepository.getById(id);
    // }
    //
    // async editarTranca(id: string, tranca: Tranca) {
    //     return TrancaRepository.update(id, tranca);
    // }
    //
    // async removerTranca(id: string) {
    //     return TrancaRepository.delete(id);
    // }
    //
    // async obterBicicletaNaTranca(id: string) {
    //     return TrancaRepository.getById(id);
    // }
    //
    // async trancarTranca(id: string, bicicletaId: string) {
    //     return TrancaRepository.getById(id);
    // }
    //
    // async destrancarTranca(id: string, bicicletaId: string) {
    //     return TrancaRepository.getById(id);
    // }
    //
    // async alterarStatusTranca(id: string, status: string) {
    //     return TrancaRepository.getById(id);
    // }
}
