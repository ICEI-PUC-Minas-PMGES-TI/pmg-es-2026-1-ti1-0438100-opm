const texto = document.querySelector("input");
const importancia = document.getElementById("importancia");
const tipo = document.getElementById("tipo");

const botaoAdicionar = document.querySelector(".adicionar");
const botaoLimpar = document.querySelector(".limpar");
const botaoDeletar = document.querySelector(".deletar");
const botaoFiltro = document.querySelector(".funil");

const tabela = document.querySelector(".tabela tbody");

const dias = document.querySelectorAll(".dias span");
const seletorMes = document.querySelectorAll(".calendario_topo select")[0];
const seletorAno = document.querySelectorAll(".calendario_topo select")[1];

const mesesMap = {
    "Janeiro": "01",
    "Fevereiro": "02",
    "Março": "03",
    "Abril": "04",
    "Maio": "05",
    "Junho": "06",
    "Julho": "07",
    "Agosto": "08",
    "Setembro": "09",
    "Outubro": "10",
    "Novembro": "11",
    "Dezembro": "12"
};

let dataSelecionada = "";
let linhaSelecionada = null;

/* ===========================
   CARREGAR AVISOS
=========================== */

async function carregarAvisos() {

    try {

        const resposta = await fetch(
            "http://localhost:3000/avisos"
        );

        const avisos = await resposta.json();

        tabela.innerHTML = "";

        avisos.forEach(function(aviso, indice) {

            const linha = document.createElement("tr");

            linha.dataset.preenchida = "true";
            linha.dataset.id = aviso.id;

            linha.classList.add(
                indice % 2 === 0
                    ? "cor1tabela"
                    : "cor2tabela"
            );

            linha.innerHTML = `
                <td>${aviso.id}</td>
                <td>${aviso.importancia}</td>
                <td>${aviso.tipo}</td>
                <td>${aviso.data}</td>
                <td>${aviso.texto}</td>
            `;

            adicionarEventoSelecao(linha);

            tabela.appendChild(linha);

        });

    }

    catch (erro) {

        console.error(
            "Erro ao carregar avisos",
            erro
        );

    }

}

/* ===========================
   SELEÇÃO DE LINHA
=========================== */

function adicionarEventoSelecao(linha) {

    linha.addEventListener("click", function() {

        const linhas =
            document.querySelectorAll(
                ".tabela tbody tr"
            );

        linhas.forEach(function(item) {

            item.style.outline = "none";

        });

        linha.style.outline =
            "3px solid white";

        linhaSelecionada = linha;

    });

}

/* ===========================
   CALENDÁRIO
=========================== */

dias.forEach(function(dia) {

    dia.addEventListener("click", function() {

        if (dia.textContent === "") {

            return;

        }

        dias.forEach(function(item) {

            item.classList.remove(
                "selecionado"
            );

        });

        dia.classList.add(
            "selecionado"
        );

        const mesNumero =
            mesesMap[seletorMes.value] ||
            "01";

        const ano =
            seletorAno.value ||
            "2026";

        dataSelecionada =
            dia.textContent +
            "/" +
            mesNumero +
            "/" +
            ano;

    });

});

/* ===========================
   FILTRO
=========================== */

function ordenarAvisosPorImportancia() {

    const linhas =
        Array.from(
            tabela.querySelectorAll("tr")
        );

    const ordemImportancia = {

        "Alta": 1,
        "Média": 2,
        "Baixa": 3

    };

    linhas.sort(function(a, b) {

        const importanciaA =
            a.children[1].textContent.trim();

        const importanciaB =
            b.children[1].textContent.trim();

        return (
            ordemImportancia[
                importanciaA
            ] -
            ordemImportancia[
                importanciaB
            ]
        );

    });

    tabela.innerHTML = "";

    linhas.forEach(function(linha, indice) {

        linha.classList.remove(
            "cor1tabela",
            "cor2tabela"
        );

        linha.classList.add(
            indice % 2 === 0
                ? "cor1tabela"
                : "cor2tabela"
        );

        tabela.appendChild(linha);

    });

}

botaoFiltro.addEventListener(
    "click",
    ordenarAvisosPorImportancia
);

/* ===========================
   ADICIONAR
=========================== */

botaoAdicionar.addEventListener(
    "click",
    async function() {

        if (

            texto.value === "" ||
            importancia.value === "" ||
            tipo.value === "" ||
            dataSelecionada === ""

        ) {

            alert(
                "Preencha todos os campos"
            );

            return;

        }

        const novoAviso = {

            importancia:
                importancia.options[
                    importancia.selectedIndex
                ].text,

            tipo:
                tipo.options[
                    tipo.selectedIndex
                ].text,

            data:
                dataSelecionada,

            texto:
                texto.value

        };

        try {

            await fetch(
                "http://localhost:3000/avisos",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify(
                        novoAviso
                    )

                }
            );

            limparCampos();

            carregarAvisos();

        }

        catch (erro) {

            console.error(
                "Erro ao adicionar aviso",
                erro
            );

        }

    }
);

/* ===========================
   DELETAR
=========================== */

botaoDeletar.addEventListener(
    "click",
    async function() {

        if (
            linhaSelecionada === null
        ) {

            alert(
                "Selecione uma linha"
            );

            return;

        }

        const id =
            linhaSelecionada.dataset.id;

        try {

            await fetch(
                `http://localhost:3000/avisos/${id}`,
                {

                    method: "DELETE"

                }
            );

            linhaSelecionada = null;

            carregarAvisos();

        }

        catch (erro) {

            console.error(
                "Erro ao deletar aviso",
                erro
            );

        }

    }
);

/* ===========================
   LIMPAR
=========================== */

botaoLimpar.addEventListener(
    "click",
    limparCampos
);

function limparCampos() {

    texto.value = "";

    importancia.value = "";

    tipo.value = "";

    dias.forEach(function(item) {

        item.classList.remove(
            "selecionado"
        );

    });

    dataSelecionada = "";

}

/* ===========================
   INICIAR
=========================== */

carregarAvisos();