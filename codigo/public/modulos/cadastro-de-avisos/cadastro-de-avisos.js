const texto = document.querySelector("input");
const importancia = document.getElementById("importancia");
const tipo = document.getElementById("tipo");

const botaoAdicionar = document.querySelector(".adicionar");
const botaoLimpar = document.querySelector(".limpar");
const botaoDeletar = document.querySelector(".deletar");

const tabela = document.querySelector(".tabela tbody");

const dias = document.querySelectorAll(".dias span");

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

        dataSelecionada = dia.textContent + "/09/2025";
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