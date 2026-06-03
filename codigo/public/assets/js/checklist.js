const selectMaquina = document.getElementById("maquina");
const checklist = document.getElementById("checklist");
const btnEnviar = document.querySelector(".enviar");
const inputFuncionario = document.getElementById("funcionario");

const API_URL = "http://localhost:3000";

let checklists = {};
let respostas = {};

fetch(`${API_URL}/checklists`)
    .then(res => res.json())
    .then(data => {
    checklists = data.find(item => item.torno && item.fresa && item.furadeira);

    console.log("Checklists carregadas:", checklists);
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
        console.log("Máquina não encontrada.");
        return;
    }

    maquina.itens.forEach(function (texto, index) {
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

    const index = botao.dataset.index;
    const status = botao.dataset.status;

    const item = botao.parentElement;
    const botoes = item.querySelectorAll("button");

    const jaSelecionado = botao.classList.contains("selecionado");

    botoes.forEach(btn => {
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
});

btnEnviar.addEventListener("click", function () {
    const maquinaSelecionada = selectMaquina.value;
    const maquina = checklists[maquinaSelecionada];
    const funcionario = inputFuncionario.value.trim();

    if (maquinaSelecionada === "") {
        alert("Selecione uma máquina.");
        return;
    }

    if (funcionario === "") {
        alert("Digite o nome do funcionário.");
        return;
    }

    const dados = {
        funcionario: funcionario,
        maquinaId: maquina.id,
        maquinaNome: maquina.nome,
        dataHora: new Date().toLocaleString("pt-BR"),
        respostas: Object.values(respostas)
    };

    fetch("http://localhost:3000/formularios", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    })
    .then(res => res.json())
    .then(data => {

        console.log("Checklist salva:", data);

        respostas = {};
        checklist.innerHTML = "";
        selectMaquina.value = "";
        inputFuncionario.value = "";

    })
    .catch(erro => {
        console.error("Erro ao salvar:", erro);
});

    respostas = {};
    checklist.innerHTML = "";
    selectMaquina.value = "";
    inputFuncionario.value = "";
});