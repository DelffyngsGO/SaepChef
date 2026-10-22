import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import usuarioRoutes from '../Routes/usuarioRoutes.js'
import receitaRoutes from "../routes/receitaRoutes.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" })); // fotos em base64 são grandes

app.use("/usuarios", usuarioRoutes);
app.use("/receitas", receitaRoutes);


const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "../../../front-end/src")));

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});