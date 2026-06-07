const botoesAumentar = document.querySelectorAll(".btn-aumentar");
const botoesDiminuir = document.querySelectorAll(".btn-diminuir");
const cards = document.querySelectorAll(".card-maquina");

function atualizarCor(barra, larguraAtual) {

  if (larguraAtual <= 40) {

    barra.style.backgroundColor = "#c90000";

  }

  else if (larguraAtual <= 70) {

    barra.style.backgroundColor = "#f2a51a";

  }

  else {

    barra.style.backgroundColor = "#19b55a";

  }

}

function atualizarStatus(card) {

  const barras = card.querySelectorAll(".barra-preenchida");

  const vidaUtil = parseInt(barras[0].style.width);

  const durabilidade = parseInt(barras[1].style.width);

  const bolinha = card.querySelector(".bolinha-status");

  const selo = card.querySelector(".selo-status");

  if (vidaUtil > 70 && durabilidade > 70) {

    bolinha.style.backgroundColor = "#19b55a";

    selo.style.color = "#19b55a";

    selo.style.border = "2px solid #19b55a";

    selo.textContent = "Operando";

  }

  else if (vidaUtil <= 40 && durabilidade <= 40) {

    bolinha.style.backgroundColor = "#c90000";

    selo.style.color = "#c90000";

    selo.style.border = "2px solid #c90000";

    selo.textContent = "Parada";

  }

  else {

    bolinha.style.backgroundColor = "#f2a51a";

    selo.style.color = "#f2a51a";

    selo.style.border = "2px solid #f2a51a";

    selo.textContent = "Atenção";

  }

}

function atualizarTudo(card) {

  const barras = card.querySelectorAll(".barra-preenchida");

  barras.forEach(function(barra) {

    const larguraAtual = parseInt(barra.style.width);

    atualizarCor(barra, larguraAtual);

  });

  atualizarStatus(card);

}

botoesAumentar.forEach(function(botao) {

  botao.addEventListener("click", function() {

    const indicador = botao.parentElement;

    const barra = indicador.previousElementSibling.children[0];

    const card = botao.closest(".card-maquina");

    let larguraAtual = parseInt(barra.style.width);

    if (larguraAtual < 100) {

      larguraAtual += 10;

      barra.style.width = larguraAtual + "%";

    }

    atualizarTudo(card);

  });

});

botoesDiminuir.forEach(function(botao) {

  botao.addEventListener("click", function() {

    const indicador = botao.parentElement;

    const barra = indicador.previousElementSibling.children[0];

    const card = botao.closest(".card-maquina");

    let larguraAtual = parseInt(barra.style.width);

    if (larguraAtual > 0) {

      larguraAtual -= 10;

      barra.style.width = larguraAtual + "%";

    }

    atualizarTudo(card);

  });

});

async function carregarMaquinas() {

  try {

    const resposta = await fetch(
      "http://localhost:3000/maquinas"
    );

    const maquinas = await resposta.json();

    cards.forEach(function(card, indice) {

      const barras = card.querySelectorAll(
        ".barra-preenchida"
      );

      barras[0].style.width =
        maquinas[indice].vidaUtil + "%";

      barras[1].style.width =
        maquinas[indice].durabilidade + "%";

      atualizarTudo(card);

    });

  }

  catch (erro) {

    console.error(
      "Erro ao carregar máquinas:",
      erro
    );

  }

}

async function salvarAlteracoes() {

  try {

    for (let i = 0; i < cards.length; i++) {

      const barras =
        cards[i].querySelectorAll(
          ".barra-preenchida"
        );

      const vidaUtil =
        parseInt(barras[0].style.width);

      const durabilidade =
        parseInt(barras[1].style.width);

      await fetch(
        `http://localhost:3000/maquinas/${i + 1}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            vidaUtil,
            durabilidade
          })
        }
      );

    }

    alert("Alterações salvas com sucesso!");

  }

  catch (erro) {

    console.error(
      "Erro ao salvar:",
      erro
    );

  }

}

carregarMaquinas();

const btnSalvar =
  document.getElementById("btnSalvar");

btnSalvar.addEventListener(
  "click",
  salvarAlteracoes
);