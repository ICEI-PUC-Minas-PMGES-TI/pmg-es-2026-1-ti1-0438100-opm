const grid = document.getElementById("treinamentosGrid");
const pesquisa = document.getElementById("pesquisa");
const categoria = document.getElementById("categoria");

let treinamentos = [];

async function carregarTreinamentos() {
    const resposta = await fetch("../../../db/treinamentos.json");
    const dados = await resposta.json();

    treinamentos = dados.treinamentos;
    renderizarTreinamentos(treinamentos);
}

function renderizarTreinamentos(lista) {

    grid.innerHTML = "";

    lista.forEach(treinamento => {

        grid.innerHTML += `
            <div class="treinamento-card">

                <div class="info">

                    <span class="categoria">
                        ${treinamento.categoria}
                    </span>

                    <h2>
                        ${treinamento.titulo}
                    </h2>

                    <p>
                        ${treinamento.descricao}
                    </p>

                    <div class="duracao">
                        ⏱ ${treinamento.duracao}
                    </div>

                    <div class="progresso">
                        <div
                            class="barra"
                            style="width:${treinamento.progresso}%"
                        ></div>
                    </div>

                    <button class="btn">
                        Iniciar Treinamento
                    </button>

                </div>

                <div class="thumb">
                    <img src="${treinamento.imagem}">
                </div>

            </div>
        `;
    });
}

function filtrarTreinamentos() {

    const texto = pesquisa.value.toLowerCase();
    const cat = categoria.value;

    const filtrados = treinamentos.filter(treinamento => {

        const correspondeTexto =
            treinamento.titulo.toLowerCase().includes(texto);

        const correspondeCategoria =
            cat === "Todos" ||
            treinamento.categoria === cat;

        return correspondeTexto && correspondeCategoria;
    });

    renderizarTreinamentos(filtrados);
}

pesquisa.addEventListener("input", filtrarTreinamentos);
categoria.addEventListener("change", filtrarTreinamentos);

carregarTreinamentos();