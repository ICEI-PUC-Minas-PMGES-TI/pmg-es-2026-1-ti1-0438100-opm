const API_URL = "http://localhost:3000";

const tabela = document.getElementById("tabela-respostas");
const btnBuscar = document.getElementById("btn-buscar");

const inputFuncionario = document.getElementById("filtro-funcionario");
const selectMaquina = document.getElementById("filtro-maquina");
const inputData = document.getElementById("filtro-data");

let formularios = [];

function carregarRespostas() {
    fetch(`${API_URL}/formularios`)
        .then(res => res.json())
        .then(data => {
            formularios = data;
            mostrarNaTabela(formularios);
        })
        .catch(erro => {
            console.log("Erro ao carregar respostas:", erro);
        });
}

function mostrarNaTabela(lista) {
    tabela.innerHTML = "";

    lista.forEach(function (formulario) {
        tabela.innerHTML += `
            <tr>
                <td>${formulario.id}</td>
                <td>${formulario.funcionario}</td>
                <td>${formulario.maquinaNome}</td>
                <td>${formulario.dataHora}</td>
                <td>
                    <button
                        type="button"
                        class="visualizar"
                        data-id="${formulario.id}"
                    >
                        Visualizar
                    </button>
                </td>
            </tr>
        `;
    });
}

function converterData(dataInput) {
    if (dataInput === "") {
        return "";
    }

    const partes = dataInput.split("-");
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

btnBuscar.addEventListener("click", function () {
    const funcionarioDigitado = inputFuncionario.value.trim().toLowerCase();
    const maquinaSelecionada = selectMaquina.value;
    const dataSelecionada = converterData(inputData.value);

    const filtrados = formularios.filter(function (formulario) {
        const funcionarioOk =
            funcionarioDigitado === "" ||
            formulario.funcionario.toLowerCase().includes(funcionarioDigitado);

        const maquinaOk =
            maquinaSelecionada === "" ||
            formulario.maquinaNome === maquinaSelecionada;

        const dataOk =
            dataSelecionada === "" ||
            formulario.dataHora.includes(dataSelecionada);

        return funcionarioOk && maquinaOk && dataOk;
    });

    mostrarNaTabela(filtrados);
});

function visualizarChecklist(id) {

    fetch(`http://localhost:3000/formularios/${id}`)
        .then(res => res.json())
        .then(formulario => {

            let texto = `
Funcionário: ${formulario.funcionario}

Máquina: ${formulario.maquinaNome}

Data: ${formulario.dataHora}

Respostas:

`;

            formulario.respostas.forEach(resposta => {

                texto +=
                    `${resposta.item} - ${resposta.status}\n`;

            });

            alert(texto);

        });
}

document.addEventListener("click", function (evento) {

    if (
        !evento.target.classList.contains("visualizar")
    ) {
        return;
    }

    const id =
        evento.target.dataset.id;

    visualizarChecklist(id);

});

carregarRespostas();