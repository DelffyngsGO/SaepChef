
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

pool.query("SELECT current_database(), current_schema()")
    .then(res => console.log("Banco conectado:", res.rows[0]))
    .catch(error => console.error("Erro de conexão:", error));

export const query = (text, params) => pool.query(text, params);
