const selectMaquina = document.getElementById("maquina");
const checklist = document.getElementById("checklist");
const btnEnviar = document.querySelector(".enviar");

let checklists = {};
let respostas = {};

fetch("../../../db/checklist.json")
    .then(res => res.json())
    .then(data => {
        checklists = data;
    });

selectMaquina.addEventListener("change", function () {

    const maquinaSelecionada = selectMaquina.value;

    checklist.innerHTML = "";
    respostas = {};

    if (maquinaSelecionada === "") {
        return;
    }

    const maquina = checklists[maquinaSelecionada];

    const itens = maquina.itens;

    itens.forEach(function (texto, index) {

        checklist.innerHTML += `
            <div class="item">

                <span>${texto}</span>

                <button
                    type="button"
                    class="ok"
                    data-index="${index}"
                    data-status="OK"
                >
                    OK
                </button>

                <button
                    type="button"
                    class="nok"
                    data-index="${index}"
                    data-status="NOK"
                >
                    NOK
                </button>

            </div>
        `;
    });

});

checklist.addEventListener("click", function (evento) {

    const botao = evento.target;

    if (
        !botao.classList.contains("ok") &&
        !botao.classList.contains("nok")
    ) {
        return;
    }

    const index = botao.dataset.index;
    const status = botao.dataset.status;

    respostas[index] = status;

    const item = botao.parentElement;

    const botoes = item.querySelectorAll("button");

    botoes.forEach(function (btn) {
        btn.classList.remove("selecionado");
    });

    botao.classList.add("selecionado");

});

btnEnviar.addEventListener("click", function () {

    const maquinaSelecionada = selectMaquina.value;

    const maquina = checklists[maquinaSelecionada];

    const dados = {
        maquinaId: maquina.id,
        maquinaNome: maquina.nome,
        respostas: respostas
    };

    console.log(dados);

});