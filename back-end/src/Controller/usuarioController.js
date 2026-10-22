// CORRIGIDO: o controller agora passa pelo service, como o de receitas
import { usuarioService } from "../Services/usuarioService.js";

export const usuarioController = {

    async create(req, res) {
        try {
            const usuario = await usuarioService.create(req.body);

            res.status(201).json(usuario);
        } catch (error) {
            res.status(500).json({
                erro: error.message
            });
        }
    },

    async getByLogin(req, res) {
        try {
            const { email, senha } = req.body;
            const usuario = await usuarioService.getByLogin(email, senha);

            res.json(usuario);
        } catch (error) {
            res.status(401).json({
                erro: error.message
            });
        }
    },

    async findById(req, res) {
        try {
            const usuario = await usuarioService.findById(req.params.id);

            res.json(usuario);
        } catch (error) {
            res.status(404).json({
                erro: error.message
            });
        }
    },

   
    async findAll(req, res) {
        try {
            const usuarios = await usuarioService.findAll();

            res.status(200).json(usuarios);
        } catch (error) {
            res.status(500).json({
                erro: error.message
            });
        }
    },

    async update(req, res) {
        try {
            const usuario = await usuarioService.update(
                req.params.id,
                req.body
            );

            res.json(usuario);
        } catch (error) {
            res.status(404).json({
                erro: error.message
            });
        }
    },

    async delete(req, res) {
        try {
            await usuarioService.delete(req.params.id);

            res.json({
                mensagem: "Usuário excluído com sucesso"
            });
        } catch (error) {
            res.status(404).json({
                erro: error.message
            });
        }
    }

};