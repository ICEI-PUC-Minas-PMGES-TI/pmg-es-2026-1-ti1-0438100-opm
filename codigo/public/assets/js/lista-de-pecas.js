let pecas = [];

const filtroMaquina = document.getElementById("filtroMaquina");
const filtroPrioridade = document.getElementById("filtroPrioridade");
const filtroStatus = document.getElementById("filtroStatus");
const filtroBusca = document.getElementById("filtroBusca");
const filtroData = document.getElementById("filtroData");

const corpoTabela = document.getElementById("corpoTabela");
const totalPecas = document.getElementById("totalPecas");

const btnFiltrar = document.getElementById("btnFiltrar");
const btnLimpar = document.getElementById("btnLimpar");
const btnAtualizar = document.getElementById("btnAtualizar");
const btnExportar = document.getElementById("btnExportar");

const ordenarPor = document.getElementById("ordenarPor");

const oeePercentual = document.getElementById("oeePercentual");
const disponibilidade = document.getElementById("disponibilidade");
const performance = document.getElementById("performance");
const qualidade = document.getElementById("qualidade");

const oeeMaquinas = {
  "CNC 01": {
    oee: 68,
    disponibilidade: 72,
    performance: 75,
    qualidade: 84
  },
  "CNC 02": {
    oee: 74,
    disponibilidade: 78,
    performance: 80,
    qualidade: 86
  },
  "CNC 03": {
    oee: 81,
    disponibilidade: 85,
    performance: 87,
    qualidade: 90
  },
  "Todos": {
    oee: 70,
    disponibilidade: 75,
    performance: 78,
    qualidade: 85
  }
};

async function carregarPecas() {
  try {
    const resposta = await fetch("/codigo/db/lista-de-pecas.json");

    if (!resposta.ok) {
      throw new Error("Arquivo JSON não encontrado");
    }

    pecas = await resposta.json();

    preencherFiltros();
    renderizarTabela(ordenarLista(pecas));
    atualizarOEE();

  } catch (erro) {
    console.error("Erro ao carregar JSON:", erro);

    totalPecas.textContent = "Total de peças: 0";

    corpoTabela.innerHTML = `
      <tr>
        <td colspan="9" class="sem-resultados">
          Erro ao carregar o arquivo JSON.
        </td>
      </tr>
    `;
  }
}

function preencherFiltros() {
  filtroMaquina.innerHTML = `<option value="">Todos</option>`;
  filtroPrioridade.innerHTML = `<option value="">Todas</option>`;
  filtroStatus.innerHTML = `<option value="">Todos</option>`;

  const maquinas = [...new Set(pecas.map(item => item.maquina))];
  const prioridades = [...new Set(pecas.map(item => item.prioridade))];
  const status = [...new Set(pecas.map(item => item.status))];

  maquinas.forEach(maquina => {
    filtroMaquina.innerHTML += `<option value="${maquina}">${maquina}</option>`;
  });

  prioridades.forEach(prioridade => {
    filtroPrioridade.innerHTML += `<option value="${prioridade}">${prioridade}</option>`;
  });

  status.forEach(situacao => {
    filtroStatus.innerHTML += `<option value="${situacao}">${situacao}</option>`;
  });
}

function renderizarTabela(lista) {
  corpoTabela.innerHTML = "";
  totalPecas.textContent = `Total de peças: ${lista.length}`;

  if (lista.length === 0) {
    corpoTabela.innerHTML = `
      <tr>
        <td colspan="9" class="sem-resultados">
          Nenhuma peça encontrada com os filtros selecionados.
        </td>
      </tr>
    `;
    return;
  }

  lista.forEach((item, index) => {
    const prioridadeClasse = item.prioridade.toLowerCase().replace("é", "e");

    let statusClasse = "pendente";

    if (item.status === "Em produção") {
      statusClasse = "producao";
    }

    if (item.status === "Concluído") {
      statusClasse = "concluido";
    }

    let acaoPrincipal = "";

    if (item.status === "Pendente") {
      acaoPrincipal = `
        <button onclick="iniciarPeca(${item.id})">
          ▶ Iniciar
        </button>
      `;
    }

    if (item.status === "Em produção") {
      acaoPrincipal = `
        <button onclick="pausarPeca(${item.id})">
          ⏸ Pausar
        </button>
      `;
    }

    corpoTabela.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>${item.codigo}</td>
        <td>${item.peca}</td>
        <td>${item.maquina}</td>
        <td>
          <span class="prioridade ${prioridadeClasse}">
            ${item.prioridade}
          </span>
        </td>
        <td>${item.quantidadeDia}</td>
        <td>${item.tempoCiclo}</td>
        <td>
          <span class="status ${statusClasse}">
            ${item.status}
          </span>
        </td>
        <td>
          ${
            item.status !== "Concluído"
              ? `
                ${acaoPrincipal}
                <button onclick="concluirPeca(${item.id})">
                  ☑ Concluir
                </button>
              `
              : "✔ Finalizado"
          }
        </td>
      </tr>
    `;
  });
}

function filtrarPecas() {
  const maquina = filtroMaquina.value;
  const prioridade = filtroPrioridade.value;
  const status = filtroStatus.value;
  const busca = filtroBusca.value.toLowerCase();
  const data = filtroData.value;

  let resultado = pecas.filter(item => {
    const filtroPorMaquina = maquina === "" || item.maquina === maquina;
    const filtroPorPrioridade = prioridade === "" || item.prioridade === prioridade;
    const filtroPorStatus = status === "" || item.status === status;
    const filtroPorData = data === "" || item.data === data;

    const filtroPorBusca =
      item.codigo.toLowerCase().includes(busca) ||
      item.peca.toLowerCase().includes(busca);

    return (
      filtroPorMaquina &&
      filtroPorPrioridade &&
      filtroPorStatus &&
      filtroPorData &&
      filtroPorBusca
    );
  });

  resultado = ordenarLista(resultado);

  renderizarTabela(resultado);
  atualizarOEE();
}

function ordenarLista(lista) {
  const criterio = ordenarPor.value;
  const listaOrdenada = [...lista];

  if (criterio === "prioridade") {
    const ordemPrioridade = {
      "Alta": 1,
      "Média": 2,
      "Baixa": 3
    };

    listaOrdenada.sort((a, b) => {
      return ordemPrioridade[a.prioridade] - ordemPrioridade[b.prioridade];
    });
  }

  if (criterio === "quantidade") {
    listaOrdenada.sort((a, b) => {
      return b.quantidadeDia - a.quantidadeDia;
    });
  }

  if (criterio === "tempo") {
    listaOrdenada.sort((a, b) => {
      return b.tempoCiclo - a.tempoCiclo;
    });
  }

  return listaOrdenada;
}

function limparFiltros() {
  filtroMaquina.value = "";
  filtroPrioridade.value = "";
  filtroStatus.value = "";
  filtroBusca.value = "";
  filtroData.value = "";
  ordenarPor.value = "prioridade";

  renderizarTabela(ordenarLista(pecas));
  atualizarOEE();
}

function atualizarOEE() {
  const maquinaSelecionada = filtroMaquina.value || "Todos";
  const dadosOEE = oeeMaquinas[maquinaSelecionada];

  oeePercentual.textContent = `${dadosOEE.oee}%`;
  disponibilidade.textContent = `${dadosOEE.disponibilidade}%`;
  performance.textContent = `${dadosOEE.performance}%`;
  qualidade.textContent = `${dadosOEE.qualidade}%`;
}

function iniciarPeca(id) {
  const indice = pecas.findIndex(item => item.id === id);

  if (indice !== -1) {
    pecas[indice].status = "Em produção";
    filtrarPecas();
  }
}

function pausarPeca(id) {
  const indice = pecas.findIndex(item => item.id === id);

  if (indice !== -1) {
    pecas[indice].status = "Pendente";
    filtrarPecas();
  }
}

function concluirPeca(id) {
  const indice = pecas.findIndex(item => item.id === id);

  if (indice !== -1) {
    pecas[indice].status = "Concluído";
    filtrarPecas();
  }
}

function exportarRelatorio() {
  alert("Relatório exportado com sucesso!");
}

btnFiltrar.addEventListener("click", filtrarPecas);
btnLimpar.addEventListener("click", limparFiltros);
btnAtualizar.addEventListener("click", carregarPecas);
btnExportar.addEventListener("click", exportarRelatorio);
ordenarPor.addEventListener("change", filtrarPecas);

carregarPecas();