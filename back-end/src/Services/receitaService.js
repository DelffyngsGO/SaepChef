import { receitaRepository } from "../repositories/receitaRepository.js";

export const receitaService = {

    async create(receita) {
        return await receitaRepository.create(receita);
    },

    async findById(id) {
        const receitaExiste = await receitaRepository.findById(id);

        if (!receitaExiste) {
            throw new Error('Receita não encontrada');
        }

        return receitaExiste;
    },

    async findAll() {
        return await receitaRepository.findAll();
    },

    async update(id, receita) {
        const receitaExiste = await receitaRepository.findById(id);

        if (!receitaExiste) {
            throw new Error('Receita não encontrada');
        }

        return await receitaRepository.update(id, receita);
    },

    async delete(id) {
        const receitaExiste = await receitaRepository.findById(id);

        if (!receitaExiste) {
            throw new Error('Receita não encontrada');
        }

        return await receitaRepository.delete(id);
    }

};