const tabelaRespostas = document.getElementById("tabela-respostas");

const API_URL = "http://localhost:3000";

function carregarRespostas(
    funcionarioFiltro = "",
    maquinaFiltro = "",
    dataFiltro = ""
) {

    fetch("http://localhost:3000/formularios")
        .then(res => res.json())
        .then(formularios => {

            const tabela =
                document.getElementById("tabela-respostas");

            tabela.innerHTML = "";

            formularios.forEach(formulario => {

                const funcionarioOk =
                    formulario.funcionario
                        .toLowerCase()
                        .includes(funcionarioFiltro);

                const maquinaOk =
                    maquinaFiltro === "" ||
                    formulario.maquinaNome === maquinaFiltro;

                const dataOk =
                    dataFiltro === "" ||
                    formulario.dataHora.startsWith(dataFiltro);

                if (
                    funcionarioOk &&
                    maquinaOk &&
                    dataOk
                ) {

                    tabela.innerHTML += `
                        <tr>
                            <td>${formulario.id}</td>
                            <td>${formulario.funcionario}</td>
                            <td>${formulario.maquinaNome}</td>
                            <td>${formulario.dataHora}</td>

                            <td>
                                <button
                                    class="visualizar"
                                    data-id="${formulario.id}"
                                >
                                    Visualizar
                                </button>
                            </td>
                        </tr>
                    `;
                }

            });

        });
}

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