import { usuarioRepository } from "../repositories/usuarioRepository.js";

// Nunca devolve a senha para o front
function semSenha(usuario) {
    if (!usuario) return usuario;
    const { senha, ...resto } = usuario;
    return resto;
}

// "João da Silva" -> "joaodasilva" (a coluna nome_usuario aceita até 20 caracteres)
function gerarNomeUsuario(nome) {
    const base = nome
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9]/g, "")
        .toLowerCase()
        .slice(0, 20);
    return base || "usuario";
}

export const usuarioService = {

    async create(usuario) {
        const { nome, email, senha } = usuario;

        if (!nome || !email || !senha) {
            throw new Error('Preencha nome, e-mail e senha');
        }

        try {
            // O front só manda nome, e-mail e senha: o resto é definido aqui.
            // O tipo fica sempre "comum" para ninguém se registrar como chef pelo front.
            const criado = await usuarioRepository.create({
                nome,
                nome_usuario: gerarNomeUsuario(nome),
                email,
                senha,
                imagem_usuario: null,
                tipo: 'comum'
            });
            return semSenha(criado);
        } catch (error) {
            if (error.code === '23505') { // violação do UNIQUE do e-mail
                throw new Error('Este e-mail já está cadastrado.');
            }
            throw error;
        }
    },

    async getByLogin(email, senha) {
        const usuario = await usuarioRepository.getByLogin(email, senha);

        if (!usuario) {
            throw new Error('E-mail ou senha incorretos.');
        }

        return semSenha(usuario);
    },

    async findById(id) {
        const usuarioExiste = await usuarioRepository.findById(id);

        if (!usuarioExiste) {
            throw new Error('Usuário não encontrado');
        }

        return semSenha(usuarioExiste);
    },

    async findAll() {
        const usuarios = await usuarioRepository.findAll();
        return usuarios.map(semSenha);
    },

    async update(id, usuario) {
        const usuarioExiste = await usuarioRepository.findById(id);

        if (!usuarioExiste) {
            throw new Error('Usuário não encontrado');
        }

        return semSenha(await usuarioRepository.update(id, usuario));
    },

    async delete(id) {
        const usuarioExiste = await usuarioRepository.findById(id);

        if (!usuarioExiste) {
            throw new Error('Usuário não encontrado');
        }

        return semSenha(await usuarioRepository.delete(id));
    },

};