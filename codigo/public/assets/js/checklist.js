const selectMaquina = document.getElementById("maquina");
const checklist = document.getElementById("checklist");
const btnEnviar = document.querySelector(".enviar");
const inputFuncionario = document.getElementById("funcionario");

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

    const item = botao.parentElement;

    const botoes = item.querySelectorAll("button");

    const jaSelecionado = item.querySelector(".selecionado");

    botoes.forEach(function (btn) {
        btn.classList.remove("selecionado");
    });

    if (jaSelecionado) {
        delete respostas[index];
    } else {
        botao.classList.add("selecionado");

        respostas[index] = status;
    }

});

btnEnviar.addEventListener("click", function () {

    const maquinaSelecionada = selectMaquina.value;

    const maquina = checklists[maquinaSelecionada];

    const funcionario = inputFuncionario.value;

    const dados = {
        funcionario: funcionario,
        maquinaId: maquina.id,
        maquinaNome: maquina.nome,
        dataHora: new Date(),
        respostas: respostas
    };

    console.log(dados);
    
    respostas = {};
    checklist.innerHTML = "";
    selectMaquina.value = "";

});