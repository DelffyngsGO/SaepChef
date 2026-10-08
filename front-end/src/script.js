const RECEITAS_POR_PAGINA = 6;

const receitas = [
    {
        nome: "Brigadeiro",
        origem: "Brasil",
        tipo: "Doce",
        chef: "SAEPChef1",
        imagem: "",
        ingredientes: [
            "1 lata de leite condensado",
            "1 colher (sopa) de manteiga",
            "4 colheres (sopa) de chocolate em pó",
            "Granulado a gosto",
        ],
        preparo:
            "Misture o leite condensado, a manteiga e o chocolate em uma panela. Cozinhe em fogo baixo, mexendo sempre, até desgrudar do fundo. Deixe esfriar, modele as bolinhas e passe no granulado.",
    },
    {
        nome: "Lasanha à Bolonhesa",
        origem: "Itália",
        tipo: "Salgado",
        chef: "SAEPChef1",
        imagem: "",
        ingredientes: [
            "500 g de massa de lasanha",
            "500 g de carne moída",
            "500 ml de molho de tomate",
            "300 g de queijo mussarela",
            "300 g de presunto",
        ],
        preparo:
            "Refogue a carne e misture ao molho de tomate. Em um refratário, monte camadas de massa, molho, presunto e queijo. Cubra com queijo e leve ao forno a 200 °C por 30 minutos.",
    },
    {
        nome: "Frango Agridoce",
        origem: "China",
        tipo: "Agridoce",
        chef: "SAEPChef1",
        imagem: "",
        ingredientes: [
            "500 g de peito de frango em cubos",
            "1 pimentão vermelho",
            "1/2 xícara de ketchup",
            "3 colheres (sopa) de açúcar",
            "3 colheres (sopa) de vinagre",
            "2 colheres (sopa) de shoyu",
        ],
        preparo:
            "Frite o frango até dourar. Misture ketchup, açúcar, vinagre e shoyu e leve ao fogo até engrossar. Junte o pimentão e o frango, mexa por 3 minutos e sirva com arroz.",
    },
    {
        nome: "Tiramisù",
        origem: "Itália",
        tipo: "Doce",
        chef: "SAEPChef1",
        imagem: "",
        ingredientes: [
            "250 g de queijo mascarpone",
            "3 ovos",
            "100 g de açúcar",
            "200 ml de café forte",
            "200 g de biscoito champagne",
            "Cacau em pó para polvilhar",
        ],
        preparo:
            "Bata as gemas com o açúcar e misture ao mascarpone. Incorpore as claras em neve. Molhe os biscoitos no café e monte camadas alternadas com o creme. Leve à geladeira por 4 horas e polvilhe cacau antes de servir.",
    },
];

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
        const bateBusca =
            !termo ||
            r.nome.toLowerCase().includes(termo) ||
            r.origem.toLowerCase().includes(termo) ||
            r.chef.toLowerCase().includes(termo);
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
                ${
                    r.imagem
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

    let botoes = `<button type="button" data-pagina="${paginaAtual - 1}" ${
        paginaAtual === 1 ? "disabled" : ""
    }>‹ Anterior</button>`;

    for (let p = 1; p <= totalPaginas; p++) {
        botoes += `<button type="button" data-pagina="${p}" class="${
            p === paginaAtual ? "Ativa" : ""
        }" ${p === paginaAtual ? 'aria-current="page"' : ""}>${p}</button>`;
    }

    botoes += `<button type="button" data-pagina="${paginaAtual + 1}" ${
        paginaAtual === totalPaginas ? "disabled" : ""
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

btnCriar.addEventListener("click", () => modal.showModal());
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

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const ingredientes = lerIngredientes();
    if (ingredientes.length === 0) {
        const primeiro = listaIngredientes.querySelector("input");
        primeiro.setCustomValidity("Adicione pelo menos um ingrediente.");
        primeiro.reportValidity();
        primeiro.addEventListener("input", () => primeiro.setCustomValidity(""), { once: true });
        return;
    }

    receitas.push({
        nome: document.getElementById("nome").value.trim(),
        origem: document.getElementById("origem").value.trim(),
        tipo: document.getElementById("tipo").value,
        chef: document.getElementById("chef").value.trim(),
        imagem: imagemBase64,
        ingredientes,
        preparo: document.getElementById("preparo").value.trim(),
    });

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

// ---------- Foto de perfil ----------
const btnFotoPerfil = document.getElementById("btnFotoPerfil");
const inputFotoPerfil = document.getElementById("inputFotoPerfil");
const fotoPerfil = document.getElementById("fotoPerfil");

function mostrarFotoPerfil(src) {
    fotoPerfil.src = src;
    fotoPerfil.hidden = false;
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

// ---------- Início ----------
resetarIngredientes();
renderizarReceitas();