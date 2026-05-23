const selectMaquina = document.getElementById("maquina");
const checklist = document.getElementById("checklist");
const btnEnviar = document.querySelector(".enviar");
const inputFuncionario = document.getElementById("funcionario");

let checklists = {};
let respostas = {};
let formularios = JSON.parse(localStorage.getItem("formularios")) || [];

fetch("../../../db/checklist.json")
    .then(function (res) {
        return res.json();
    })
    .then(function (data) {
        checklists = data;
        console.log("Checklists carregadas:", checklists);
    })
    .catch(function (erro) {
        console.log("Erro ao carregar checklist.json:", erro);
    });

selectMaquina.addEventListener("change", function () {
    const maquinaSelecionada = selectMaquina.value;

    checklist.innerHTML = "";
    respostas = {};

    if (maquinaSelecionada === "") {
        return;
    }

    const maquina = checklists[maquinaSelecionada];

    if (!maquina) {
        console.log("Máquina não encontrada:", maquinaSelecionada);
        return;
    }

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

    const maquinaSelecionada = selectMaquina.value;
    const maquina = checklists[maquinaSelecionada];

    if (!maquina) {
        return;
    }

    const index = botao.dataset.index;
    const status = botao.dataset.status;

    const item = botao.parentElement;
    const botoes = item.querySelectorAll("button");

    const jaSelecionado = botao.classList.contains("selecionado");

    botoes.forEach(function (btn) {
        btn.classList.remove("selecionado");
    });

    if (jaSelecionado) {
        delete respostas[index];
    } else {
        botao.classList.add("selecionado");

        respostas[index] = {
            item: maquina.itens[index],
            status: status
        };
    }

    console.log("Respostas atuais:", respostas);
});

btnEnviar.addEventListener("click", function () {
    const maquinaSelecionada = selectMaquina.value;
    const maquina = checklists[maquinaSelecionada];
    const funcionario = inputFuncionario.value;

    if (maquinaSelecionada === "") {
        alert("Selecione uma máquina.");
        return;
    }

    if (!funcionario) {
        alert("Digite o nome do funcionário.");
        return;
    }

    if (!maquina) {
        alert("Máquina não encontrada.");
        return;
    }

    const id = formularios.length + 1;

    const dados = {
        id: id,
        funcionario: funcionario,
        maquinaId: maquina.id,
        maquinaNome: maquina.nome,
        dataHora: new Date().toLocaleString("pt-BR"),
        respostas: Object.values(respostas)
    };

    formularios.push(dados);

    localStorage.setItem(
        "formularios",
        JSON.stringify(formularios)
    );

    console.log("Formulários salvos:", formularios);

    respostas = {};
    checklist.innerHTML = "";
    selectMaquina.value = "";
    inputFuncionario.value = "";
});