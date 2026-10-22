import { query } from "../config/db.js";

export const usuarioRepository = {

    async create(usuario) {
        const { nome, nome_usuario, email, senha, imagem_usuario, tipo } = usuario;
      
        const sql = `INSERT INTO tb_usuario(nome, nome_usuario, email, senha, imagem_usuario, tipo)
        VALUES($1, $2, $3, $4, $5, $6) RETURNING *`;
        const res = await query(sql, [nome, nome_usuario, email, senha, imagem_usuario, tipo]);
        return res.rows[0];
    },

    async getByLogin(email, senha) {
      
        const sql = 'SELECT * FROM tb_usuario WHERE email = $1 AND senha = $2;';
        const res = await query(sql, [email, senha]);
        return res.rows[0];
    },

    async findById(id) {
        const sql = 'SELECT * FROM tb_usuario WHERE id_usuario = $1;';
        const res = await query(sql, [id]);
        return res.rows[0];
    },

    async findAll() {
        const sql = 'SELECT * FROM tb_usuario;';
        const res = await query(sql);
   
        return res.rows;
    },

    async update(id, usuario) {
        const { nome, nome_usuario, email, senha, imagem_usuario, tipo } = usuario;
        const sql = `UPDATE tb_usuario SET
            nome = COALESCE($1, nome),
            nome_usuario = COALESCE($2, nome_usuario),
            email = COALESCE($3, email),
            senha = COALESCE($4, senha),
            imagem_usuario = COALESCE($5, imagem_usuario),
            tipo = COALESCE($6, tipo)
            WHERE id_usuario = $7 RETURNING *`;
        const res = await query(sql, [nome, nome_usuario, email, senha, imagem_usuario, tipo, id]);
        return res.rows[0];
    },

    async delete(id) {
        const sql = 'DELETE FROM tb_usuario WHERE id_usuario = $1 RETURNING *';
        const res = await query(sql, [id]);
        return res.rows[0];
    },

};