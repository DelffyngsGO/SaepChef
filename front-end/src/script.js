const RECEITAS_POR_PAGINA = 6;

// Endereço do back-end (ajuste se mudar a porta)
const API = "";

// As receitas agora vêm do banco, via API
let receitas = [];

// Elementos
const lista = document.getElementById("listaReceitas");
const paginacao = document.getElementById("paginacao");
const pesquisa = document.getElementById("pesquisa");
const listaIngredientes = document.getElementById("listaIngredientes");
const btnAddIngrediente = document.getElementById("btnAddIngrediente");

const btnCriar = document.getElementById("btnCriar");
const modal = document.getElementById("modalReceita");
const form = document.getElementById("formReceita");
const btnCancelar = document.getElementById("btnCancelar");
const inputFoto = document.getElementById("foto");
const previa = document.getElementById("previa");

const btnFiltros = document.getElementById("btnFiltros");
const modalFiltros = document.getElementById("modalFiltros");
const formFiltros = document.getElementById("formFiltros");
const selectFiltroTipo = document.getElementById("filtroTipo");
const btnLimparFiltros = document.getElementById("btnLimparFiltros");

// Estado
let imagemBase64 = "";
let termoBusca = "";
let filtroTipo = "";
let paginaAtual = 1;

// ---------- Utilidades ----------
function escapar(texto) {
    const div = document.createElement("div");
    div.textContent = texto;
    return div.innerHTML;
}

function caminhoImagem(img) {
    if (!img) return "";
    if (/^(data:|https?:)/.test(img)) return img;
    return `/imagens/${img}`;
}

// ---------- API ----------
// Converte uma linha do banco para o formato que o front já usa
function paraFront(r) {
    return {
        id: r.id_receita,
        nome: r.titulo_receita,
        origem: r.origem_receita,
        tipo: r.tipo,
        chef: r.chef,
        // imagens antigas do seed (ex.: "receita1.jpg") não existem no front
        imagem: caminhoImagem(r.url_imagem),
        ingredientes: r.ingredientes || [],
        preparo: r.preparo || "",
    };
}

async function carregarReceitas() {
    try {
        const res = await fetch(`${API}/receitas`);
        if (!res.ok) throw new Error("Resposta inválida");
        receitas = (await res.json()).map(paraFront);
        return true;
    } catch (erro) {
        console.error(erro);
        lista.innerHTML = `<p class="SemResultado">Não foi possível carregar as receitas. O servidor está rodando?</p>`;
        return false;
    }
}

// ---------- Ingredientes ----------
function adicionarCampoIngrediente(foco = true) {
    const linha = document.createElement("div");
    linha.className = "Ingrediente";

    const input = document.createElement("input");
    input.type = "text";
    input.className = "CampoIngrediente";
    input.placeholder = "Ex.: 2 xícaras de farinha";

    const btnRemover = document.createElement("button");
    btnRemover.type = "button";
    btnRemover.className = "Remover";
    btnRemover.textContent = "✕";
    btnRemover.setAttribute("aria-label", "Remover ingrediente");
    btnRemover.addEventListener("click", () => {
        linha.remove();
        if (!listaIngredientes.children.length) adicionarCampoIngrediente(false);
    });

    linha.append(input, btnRemover);
    listaIngredientes.append(linha);
    if (foco) input.focus();
}

function resetarIngredientes() {
    listaIngredientes.innerHTML = "";
    adicionarCampoIngrediente(false);
}

function lerIngredientes() {
    return [...listaIngredientes.querySelectorAll(".CampoIngrediente")]
        .map((campo) => campo.value.trim())
        .filter(Boolean);
}

btnAddIngrediente.addEventListener("click", () => adicionarCampoIngrediente());

// Enter num ingrediente cria o próximo, em vez de enviar o formulário
listaIngredientes.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target.classList.contains("CampoIngrediente")) {
        e.preventDefault();
        adicionarCampoIngrediente();
    }
});

// ---------- Renderização ----------
function receitasFiltradas() {
    const termo = termoBusca.trim().toLowerCase();

    return receitas.filter((r) => {
        const bateTipo = !filtroTipo || r.tipo === filtroTipo;
        // A pesquisa considera apenas o título (nome) da receita
        const bateBusca = !termo || r.nome.toLowerCase().includes(termo);
        return bateTipo && bateBusca;
    });
}

function htmlCard(r) {
    return `
        <article class="Card">
            <div class="Topo">
                <div class="Dados">
                    <h3>${escapar(r.nome)}</h3>
                    <p>Tipo: ${escapar(r.tipo)}</p>
                    <p>Origem: ${escapar(r.origem)}</p>
                    <p>Chef: ${escapar(r.chef)}</p>
                </div>
                ${r.imagem
            ? `<img src="${r.imagem}" alt="${escapar(r.nome)}">`
            : `<div class="Foto"></div>`
        }
            </div>

            <hr>
            <div class="Receita">
                <h4>Receita:</h4>
                <div class="ReceitaConteudo">
                    <h5>Ingredientes</h5>
                    <ul>
                        ${(r.ingredientes || [])
            .map((i) => `<li>${escapar(i)}</li>`)
            .join("")}
                    </ul>
                    <h5>Modo de preparo</h5>
                    <p>${escapar(r.preparo || "")}</p>
                </div>
            </div>
        </article>`;
}

function renderizarPaginacao(totalPaginas) {
    if (totalPaginas <= 1) {
        paginacao.hidden = true;
        paginacao.innerHTML = "";
        return;
    }

    let botoes = `<button type="button" data-pagina="${paginaAtual - 1}" ${paginaAtual === 1 ? "disabled" : ""
        }>‹ Anterior</button>`;

    for (let p = 1; p <= totalPaginas; p++) {
        botoes += `<button type="button" data-pagina="${p}" class="${p === paginaAtual ? "Ativa" : ""
            }" ${p === paginaAtual ? 'aria-current="page"' : ""}>${p}</button>`;
    }

    botoes += `<button type="button" data-pagina="${paginaAtual + 1}" ${paginaAtual === totalPaginas ? "disabled" : ""
        }>Próxima ›</button>`;

    paginacao.innerHTML = `
        <span class="Contador">Página ${paginaAtual} de ${totalPaginas}</span>
        ${botoes}`;
    paginacao.hidden = false;
}

function renderizarReceitas() {
    const filtradas = receitasFiltradas();
    const totalPaginas = Math.max(1, Math.ceil(filtradas.length / RECEITAS_POR_PAGINA));

    // Garante que a página existe (ex.: depois de filtrar)
    paginaAtual = Math.min(Math.max(1, paginaAtual), totalPaginas);

    if (filtradas.length === 0) {
        lista.innerHTML = `<p class="SemResultado">Nenhuma receita encontrada.</p>`;
        renderizarPaginacao(1);
        return;
    }

    const inicio = (paginaAtual - 1) * RECEITAS_POR_PAGINA;
    const daPagina = filtradas.slice(inicio, inicio + RECEITAS_POR_PAGINA);

    lista.innerHTML = daPagina.map(htmlCard).join("");
    renderizarPaginacao(totalPaginas);
}

// Troca de página
paginacao.addEventListener("click", (e) => {
    const botao = e.target.closest("button[data-pagina]");
    if (!botao || botao.disabled) return;

    paginaAtual = Number(botao.dataset.pagina);
    renderizarReceitas();
    lista.scrollIntoView({ behavior: "smooth", block: "start" });
});

// ---------- Pesquisa ----------
pesquisa.addEventListener("input", () => {
    termoBusca = pesquisa.value;
    paginaAtual = 1;
    renderizarReceitas();
});

// ---------- Pop-up: nova receita ----------
function fecharModal() {
    modal.close();
    form.reset();
    resetarIngredientes();
    previa.hidden = true;
    previa.removeAttribute("src");
    imagemBase64 = "";
}

btnCriar.addEventListener("click", () => {
    if (!usuarioLogado) {
        abrirAuth();
        mostrarErro("Faça login para criar uma receita.");
        return;
    }
    modal.showModal();
});
btnCancelar.addEventListener("click", fecharModal);

modal.addEventListener("click", (e) => {
    if (e.target === modal) fecharModal();
});
modal.addEventListener("cancel", (e) => {
    e.preventDefault(); // Esc
    fecharModal();
});

inputFoto.addEventListener("change", () => {
    const arquivo = inputFoto.files[0];
    if (!arquivo) return;

    const leitor = new FileReader();
    leitor.onload = () => {
        imagemBase64 = leitor.result;
        previa.src = imagemBase64;
        previa.hidden = false;
    };
    leitor.readAsDataURL(arquivo);
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const ingredientes = lerIngredientes();
    if (ingredientes.length === 0) {
        const primeiro = listaIngredientes.querySelector("input");
        primeiro.setCustomValidity("Adicione pelo menos um ingrediente.");
        primeiro.reportValidity();
        primeiro.addEventListener("input", () => primeiro.setCustomValidity(""), { once: true });
        return;
    }

    try {
        const res = await fetch(`${API}/receitas`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                titulo_receita: document.getElementById("nome").value.trim(),
                origem_receita: document.getElementById("origem").value.trim(),
                tipo: document.getElementById("tipo").value,
                ingredientes,
                preparo: document.getElementById("preparo").value.trim(),
                url_imagem: imagemBase64,
                id_usuario: usuarioLogado.id_usuario,
            }),
        });
        if (!res.ok) {
            const dados = await res.json().catch(() => ({}));
            throw new Error(dados.erro || "Erro ao salvar");
        }
    } catch (erro) {
        alert("Não foi possível salvar a receita: " + erro.message);
        return;
    }

    await carregarReceitas();

    // Vai para a última página, onde a nova receita aparece
    paginaAtual = Math.ceil(receitasFiltradas().length / RECEITAS_POR_PAGINA);

    renderizarReceitas();
    fecharModal();
});

// ---------- Pop-up: filtros ----------
btnFiltros.addEventListener("click", () => {
    selectFiltroTipo.value = filtroTipo;
    modalFiltros.showModal();
});

formFiltros.addEventListener("submit", (e) => {
    e.preventDefault();
    filtroTipo = selectFiltroTipo.value;
    paginaAtual = 1;
    renderizarReceitas();
    modalFiltros.close();
});

btnLimparFiltros.addEventListener("click", () => {
    filtroTipo = "";
    selectFiltroTipo.value = "";
    paginaAtual = 1;
    renderizarReceitas();
    modalFiltros.close();
});

modalFiltros.addEventListener("click", (e) => {
    if (e.target === modalFiltros) modalFiltros.close();
});

// ---------- Perfil ----------
const btnFotoPerfil = document.getElementById("btnFotoPerfil");
const inputFotoPerfil = document.getElementById("inputFotoPerfil");
const fotoPerfil = document.getElementById("fotoPerfil");
const iniciais = document.getElementById("iniciais");
const nomePerfil = document.getElementById("nomePerfil");
const handlePerfil = document.getElementById("handlePerfil");

function mostrarFotoPerfil(src) {
    fotoPerfil.src = src;
    fotoPerfil.hidden = false;
    iniciais.hidden = true;
}

function esconderFotoPerfil() {
    fotoPerfil.removeAttribute("src");
    fotoPerfil.hidden = true;
    iniciais.hidden = false;
}

function gerarIniciais(nome) {
    const partes = nome.trim().split(/\s+/).filter(Boolean);
    if (!partes.length) return "V";
    const primeira = partes[0][0];
    const ultima = partes.length > 1 ? partes[partes.length - 1][0] : "";
    return (primeira + ultima).toUpperCase();
}

function gerarHandle(nome) {
    const base = nome
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-zA-Z0-9]/g, "");
    return "@" + (base || "SAEPChef");
}

function atualizarPerfil() {
    if (usuarioLogado) {
        nomePerfil.textContent = usuarioLogado.nome;
        handlePerfil.textContent = gerarHandle(usuarioLogado.nome);
        iniciais.textContent = gerarIniciais(usuarioLogado.nome);
    } else {
        nomePerfil.textContent = "Visitante";
        handlePerfil.textContent = "@SAEPChef";
        iniciais.textContent = "V";
    }
}

try {
    const salva = localStorage.getItem("fotoPerfil");
    if (salva) mostrarFotoPerfil(salva);
} catch (erro) {
    console.warn("Não foi possível ler a foto salva:", erro);
}

btnFotoPerfil.addEventListener("click", () => inputFotoPerfil.click());

inputFotoPerfil.addEventListener("change", () => {
    const arquivo = inputFotoPerfil.files[0];
    if (!arquivo) return;

    const leitor = new FileReader();
    leitor.onload = () => {
        mostrarFotoPerfil(leitor.result);

        try {
            localStorage.setItem("fotoPerfil", leitor.result);
        } catch (erro) {
            alert("A foto é muito grande para ser salva. Ela aparece agora, mas some ao recarregar a página.");
        }
    };
    leitor.readAsDataURL(arquivo);

    inputFotoPerfil.value = "";
});

// ---------- Pop-up: login / registro ----------
// Login e registro agora passam pelo back-end. No navegador fica só o usuário logado.
const btnLogin = document.getElementById("btnLogin");
const modalAuth = document.getElementById("modalAuth");
const formAuth = document.getElementById("formAuth");
const btnFecharAuth = document.getElementById("btnFecharAuth");
const tituloAuth = document.getElementById("tituloAuth");
const abaLogin = document.getElementById("abaLogin");
const abaRegistro = document.getElementById("abaRegistro");
const campoNome = document.getElementById("campoNome");
const authNome = document.getElementById("authNome");
const authEmail = document.getElementById("authEmail");
const authSenha = document.getElementById("authSenha");
const authErro = document.getElementById("authErro");
const btnConectar = document.getElementById("btnConectar");

let modoRegistro = false;

function lerStorage(chave, padrao) {
    try {
        const bruto = localStorage.getItem(chave);
        return bruto ? JSON.parse(bruto) : padrao;
    } catch (erro) {
        return padrao;
    }
}

function salvarStorage(chave, valor) {
    try {
        localStorage.setItem(chave, JSON.stringify(valor));
    } catch (erro) {
        console.warn("Não foi possível salvar:", erro);
    }
}

let usuarioLogado = lerStorage("usuarioLogado", null);

function mostrarErro(mensagem) {
    authErro.textContent = mensagem;
    authErro.hidden = !mensagem;
}

function definirModo(registro) {
    modoRegistro = registro;
    campoNome.hidden = !registro;
    authNome.required = registro;
    authSenha.autocomplete = registro ? "new-password" : "current-password";

    abaLogin.classList.toggle("Ativa", !registro);
    abaRegistro.classList.toggle("Ativa", registro);
    abaLogin.setAttribute("aria-selected", String(!registro));
    abaRegistro.setAttribute("aria-selected", String(registro));

    tituloAuth.textContent = registro ? "CRIAR CONTA" : "LOGAR";
    btnConectar.textContent = registro ? "REGISTRAR" : "CONECTAR";
    mostrarErro("");
}

function abrirAuth() {
    definirModo(false);
    modalAuth.showModal();
    authEmail.focus();
}

function fecharAuth() {
    modalAuth.close();
    formAuth.reset();
    mostrarErro("");
}

function atualizarBotaoLogin() {
    btnLogin.textContent = usuarioLogado ? "SAIR" : "LOGIN";
}

function sair() {
    usuarioLogado = null;
    try {
        localStorage.removeItem("usuarioLogado");
    } catch (erro) {
        /* ignora */
    }
    atualizarBotaoLogin();
    atualizarPerfil();
}

btnLogin.addEventListener("click", () => (usuarioLogado ? sair() : abrirAuth()));
btnFecharAuth.addEventListener("click", fecharAuth);
abaLogin.addEventListener("click", () => definirModo(false));
abaRegistro.addEventListener("click", () => definirModo(true));

modalAuth.addEventListener("click", (e) => {
    if (e.target === modalAuth) fecharAuth();
});
modalAuth.addEventListener("cancel", (e) => {
    e.preventDefault(); // Esc
    fecharAuth();
});

formAuth.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = authNome.value.trim();
    const email = authEmail.value.trim().toLowerCase();
    const senha = authSenha.value;

    if (modoRegistro && !nome) return mostrarErro("Informe seu nome.");
    if (!/^\S+@\S+\.\S+$/.test(email)) return mostrarErro("Informe um e-mail válido.");
    if (senha.length < 6) return mostrarErro("A senha deve ter pelo menos 6 caracteres.");

    try {
        const res = await fetch(`${API}/usuarios${modoRegistro ? "" : "/login"}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(modoRegistro ? { nome, email, senha } : { email, senha }),
        });
        const dados = await res.json();
        if (!res.ok) return mostrarErro(dados.erro || "Erro ao conectar.");
        usuarioLogado = dados; // { id_usuario, nome, email, tipo, ... }
    } catch (erro) {
        console.error(erro);
        return mostrarErro("Não foi possível falar com o servidor.");
    }

    salvarStorage("usuarioLogado", usuarioLogado);
    atualizarBotaoLogin();
    atualizarPerfil();
    fecharAuth();
});

// ---------- Início ----------
// Sessão antiga (feita antes do back-end) não tem id_usuario: descarta
if (usuarioLogado && !usuarioLogado.id_usuario) sair();

atualizarBotaoLogin();
atualizarPerfil();
resetarIngredientes();
carregarReceitas().then((ok) => ok && renderizarReceitas());