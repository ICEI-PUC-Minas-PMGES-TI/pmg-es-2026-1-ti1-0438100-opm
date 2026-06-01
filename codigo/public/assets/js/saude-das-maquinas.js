const botoesAumentar = document.querySelectorAll(".btn-aumentar");
const botoesDiminuir = document.querySelectorAll(".btn-diminuir");

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

  // VERDE
  if (vidaUtil > 70 && durabilidade > 70) {

    bolinha.style.backgroundColor = "#19b55a";

    selo.style.color = "#19b55a";

    selo.style.border = "2px solid #19b55a";

    selo.textContent = "Operando";

  }

  // VERMELHO
  else if (vidaUtil <= 40 && durabilidade <= 40) {

    bolinha.style.backgroundColor = "#c90000";

    selo.style.color = "#c90000";

    selo.style.border = "2px solid #c90000";

    selo.textContent = "Parada";

  }

  // AMARELO
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

const cards = document.querySelectorAll(".card-maquina");

cards.forEach(function(card) {

  atualizarTudo(card);

});