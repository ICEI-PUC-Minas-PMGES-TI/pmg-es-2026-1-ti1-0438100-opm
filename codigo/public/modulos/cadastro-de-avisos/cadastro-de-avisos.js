const texto = document.querySelector("input");
const importancia = document.getElementById("importancia");
const tipo = document.getElementById("tipo");

const botaoAdicionar = document.querySelector(".adicionar");
const botaoLimpar = document.querySelector(".limpar");
const botaoDeletar = document.querySelector(".deletar");

const tabela = document.querySelector(".tabela tbody");

const dias = document.querySelectorAll(".dias span");
const seletorMes = document.querySelectorAll(".calendario_topo select")[0];
const seletorAno = document.querySelectorAll(".calendario_topo select")[1];
const quantidadeLinhasVazias = 9;

// Mapeamento de mês em texto para número
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

let contador = 1;
let dataSelecionada = "";
let linhaSelecionada = null;

criarLinhasVazias();

/* LINHAS VAZIAS DA TABELA */

function criarLinhasVazias() {

    for (let i = 0; i < quantidadeLinhasVazias; i++) {

        const linha = document.createElement("tr");

        if (i % 2 === 0) {
            linha.classList.add("cor1tabela");
        } else {
            linha.classList.add("cor2tabela");
        }

        limparLinha(linha);
        adicionarEventoSelecao(linha);

        tabela.appendChild(linha);
    }
}

function limparLinha(linha) {

    linha.dataset.preenchida = "false";
    linha.style.outline = "none";

    linha.innerHTML = `
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
    `;
}

function adicionarEventoSelecao(linha) {

    linha.addEventListener("click", function() {

        if (linha.dataset.preenchida === "false") {
            return;
        }

        const linhas = document.querySelectorAll(".tabela tbody tr");

        linhas.forEach(function(item) {
            item.style.outline = "none";
        });

        linha.style.outline = "3px solid white";

        linhaSelecionada = linha;
    });
}

/* CALENDARIO */

dias.forEach(function(dia) {

    dia.addEventListener("click", function() {

        if (dia.textContent === "") {
            return;
        }

        dias.forEach(function(item) {
            item.classList.remove("selecionado");
        });

        dia.classList.add("selecionado");

        const mesNumero = mesesMap[seletorMes.value] || "01";
        const ano = seletorAno.value || "2026";
        dataSelecionada = dia.textContent + "/" + mesNumero + "/" + ano;
    });

});

/* ADICIONAR */

botaoAdicionar.addEventListener("click", function () {

    if (
        texto.value === "" ||
        importancia.value === "" ||
        tipo.value === "" ||
        dataSelecionada === ""
    ) {
        alert("Preencha todos os campos");
        return;
    }

    const linhaVazia = document.querySelector('.tabela tbody tr[data-preenchida="false"]');

    if (linhaVazia === null) {
        alert("A tabela está cheia");
        return;
    }

    linhaVazia.dataset.preenchida = "true";

    const textoImportancia = importancia.options[importancia.selectedIndex].text;
    const textoTipo = tipo.options[tipo.selectedIndex].text;

    linhaVazia.innerHTML = `
        <td>${contador}</td>
        <td>${textoImportancia}</td>
        <td>${textoTipo}</td>
        <td>${dataSelecionada}</td>
        <td>${texto.value}</td>
    `;

    contador++;

    limparCampos();
});

/* LIMPAR */

botaoLimpar.addEventListener("click", function() {
    limparCampos();
});

/* DELETAR */

botaoDeletar.addEventListener("click", function() {

    if (linhaSelecionada === null) {
        alert("Selecione uma linha");
        return;
    }

    limparLinha(linhaSelecionada);

    linhaSelecionada = null;
});

/* FUNÇÃO LIMPAR */

function limparCampos() {

    texto.value = "";
    importancia.value = "";
    tipo.value = "";

    dias.forEach(function(item) {
        item.classList.remove("selecionado");
    });

    dataSelecionada = "";
}
