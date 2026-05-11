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

let contador = 10;
let dataSelecionada = "";
let linhaSelecionada = null;

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

    const novaLinha = document.createElement("tr");

    if (contador % 2 === 0) {
        novaLinha.classList.add("cor1tabela");
    } else {
        novaLinha.classList.add("cor2tabela");
    }

    novaLinha.innerHTML = `
        <td>${contador}</td>
        <td>${importancia.value}</td>
        <td>${tipo.value}</td>
        <td>${dataSelecionada}</td>
        <td>${texto.value}</td>
    `;

    /* SELECIONAR LINHA */

    novaLinha.addEventListener("click", function() {

        const linhas = document.querySelectorAll(".tabela tbody tr");

        linhas.forEach(function(linha) {
            linha.style.outline = "none";
        });

        novaLinha.style.outline = "3px solid white";

        linhaSelecionada = novaLinha;
    });

    tabela.appendChild(novaLinha);

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

    linhaSelecionada.remove();

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