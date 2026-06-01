const botoesAumentar = document.querySelectorAll(".btn-aumentar");
const botoesDiminuir = document.querySelectorAll(".btn-diminuir");

botoesAumentar.forEach(function(botao) {

  botao.addEventListener("click", function() {

    const indicador = botao.parentElement;
    const barra = indicador.previousElementSibling.children[0];

    let larguraAtual = parseInt(barra.style.width);

    if (larguraAtual < 100) {
      larguraAtual += 10;
      barra.style.width = larguraAtual + "%";
    }
    if (larguraAtual < 70) {
        barra.style.color = "yellow"
    }
    if (larguraAtual < 40) {
        barra.style.color = "red"
    }

  });

});

botoesDiminuir.forEach(function(botao) {

  botao.addEventListener("click", function() {

    const indicador = botao.parentElement;
    const barra = indicador.previousElementSibling.children[0];

    let larguraAtual = parseInt(barra.style.width);

    if (larguraAtual > 0) {
      larguraAtual -= 10;
      barra.style.width = larguraAtual + "%";
    }

  });

});