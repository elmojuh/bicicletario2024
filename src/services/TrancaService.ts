// src/services/TrancaService.ts
import { TrancaRepository } from '../repositories/TrancaRepository';
import {NovaTrancaDTO} from "../entities/dto/NovaTrancaDTO";
import {TrancaMapper} from "../mapper/TrancaMapper";

export class TrancaService {
    async cadastrarTranca(trancaData: NovaTrancaDTO) {
        const tranca = TrancaMapper.DTOtoEntity(trancaData);
        await TrancaRepository.create(tranca);
        return TrancaMapper.EntityToDTO(tranca);
    }

    // async integrarNaRede(tranca: Tranca) {
    //     return TrancaRepository.update(tranca.id, tranca);
    // }
    //
    // async retirarDaRede(tranca: Tranca) {
    //     return TrancaRepository.delete(tranca.id);
    // }
    //
    // async listarTrancas() {
    //     return TrancaRepository.getAll();
    // }
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
