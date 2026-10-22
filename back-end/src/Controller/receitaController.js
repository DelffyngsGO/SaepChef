import { receitaService } from "../services/receitaService.js";

export const receitaController = {

    async create(req, res) {
    try {
        const receita = await receitaService.create(req.body);

        res.status(201).json(receita);
    } catch (error) {
        res.status(500).json({
            erro: error.message
        });
    }
},

    async findById(req, res) {
        try {
            const receita = await receitaService.findById(req.params.id);

            res.json(receita);
        } catch (error) {
            res.status(404).json({
                erro: error.message
            });
        }
    },

    async findAll(req, res) {
        try {
            const receitas = await receitaService.findAll();

            res.json(receitas);
        } catch (error) {
            res.status(500).json({
                erro: error.message
            });
        }
    },


    async update(req, res) {
        try {
            const receita = await receitaService.update(
                req.params.id,
                req.body
            );

            res.json(receita);
        } catch (error) {
            res.status(404).json({
                erro: error.message
            });
        }
    },

    async delete(req, res) {
        try {
            await receitaService.delete(req.params.id);

            res.json({
                mensagem: "Receita excluída com sucesso"
            });
        } catch (error) {
            res.status(404).json({
                erro: error.message
            });
        }
    }

};