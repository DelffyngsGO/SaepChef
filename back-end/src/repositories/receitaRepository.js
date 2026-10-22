import { query } from "../config/db.js";

// O "chef" que aparece no card é o nome do usuário dono da receita
const SELECT_RECEITA = `
    SELECT r.id_receita, r.titulo_receita, r.origem_receita, r.tipo,
           r.ingredientes, r.preparo, r.url_imagem, r.id_usuario,
           u.nome AS chef
    FROM tb_receita r
    JOIN tb_usuario u ON u.id_usuario = r.id_usuario`;

export const receitaRepository = {

    async create(receita) {
        const { titulo_receita, origem_receita, tipo, ingredientes, preparo, id_usuario, url_imagem } = receita;
        const sql = `INSERT INTO tb_receita(titulo_receita, origem_receita, tipo, ingredientes, preparo, id_usuario, url_imagem)
        VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id_receita`;
        const res = await query(sql, [titulo_receita, origem_receita, tipo, ingredientes, preparo, id_usuario, url_imagem]);
        return this.findById(res.rows[0].id_receita);
    },

    async findById(id) {
        const res = await query(`${SELECT_RECEITA} WHERE r.id_receita = $1;`, [id]);
        return res.rows[0];
    },

    async findAll() {
        const res = await query(`${SELECT_RECEITA} ORDER BY r.id_receita;`);
        return res.rows;
    },

    async update(id, receita) {
        const { titulo_receita, origem_receita, tipo, ingredientes, preparo, id_usuario, url_imagem } = receita;
        const sql = `UPDATE tb_receita SET
            titulo_receita = $1, origem_receita = $2, tipo = $3, ingredientes = $4,
            preparo = $5, id_usuario = $6, url_imagem = $7, updated_at = CURRENT_TIMESTAMP
            WHERE id_receita = $8 RETURNING id_receita`;
        const res = await query(sql, [titulo_receita, origem_receita, tipo, ingredientes, preparo, id_usuario, url_imagem, id]);
        return this.findById(res.rows[0].id_receita);
    },

    async delete(id) {
        const sql = 'DELETE FROM tb_receita WHERE id_receita = $1 RETURNING *';
        const res = await query(sql, [id]);
        return res.rows[0];
    },

};