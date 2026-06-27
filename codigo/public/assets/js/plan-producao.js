let pecasPlanejadas = [];
let pecasDisponiveis = [];
const API_URL = "http://localhost:3000";

async function carregarPecas() {
  try {
    const resposta = await fetch(`${API_URL}/plan-producao`);
    pecasDisponiveis = await resposta.json();

    preencherSelectPecas();
  } catch (erro) {
    console.error("Erro ao carregar JSON:", erro);
  }
}

function preencherSelectPecas() {
  const selectCodigo = document.getElementById("codigoPeca");

  selectCodigo.innerHTML =
    '<option value="">Selecione o Part Number</option>';

  pecasDisponiveis.forEach((item) => {
    const option = document.createElement("option");

    option.value = item.codigo;
    option.textContent = `${item.codigo} - ${item.peca}`;

    selectCodigo.appendChild(option);
  });
}

function preencherNomePeca() {
  const codigoSelecionado =
    document.getElementById("codigoPeca").value;

  const nomePeca =
    document.getElementById("nomePeca");

  const pecaEncontrada = pecasDisponiveis.find(
    item => item.codigo === codigoSelecionado
  );

  if (pecaEncontrada) {
    nomePeca.value = pecaEncontrada.peca;

    document.getElementById("maquina").value =
      pecaEncontrada.maquina;

    document.getElementById("prioridade").value =
      pecaEncontrada.prioridade;

    document.getElementById("tempoCiclo").value =
      pecaEncontrada.tempoCicloMin;
  } else {
    nomePeca.value = "";
  }
}

function salvarPlanejamento() {
  const periodo =
    document.getElementById("periodo").value;

  const maquina =
    document.getElementById("maquina").value;

  const codigoPeca =
    document.getElementById("codigoPeca").value;

  const nomePeca =
    document.getElementById("nomePeca").value;

  const quantidade =
    document.getElementById("quantidade").value;

  const tempoCiclo =
    document.getElementById("tempoCiclo").value;

  const prioridade =
    document.getElementById("prioridade").value;

  if (
    codigoPeca === "" ||
    nomePeca === "" ||
    quantidade === "" ||
    tempoCiclo === ""
  ) {
    alert("Preencha todos os campos obrigatórios.");
    return;
  }

  const novaPeca = {
    id: pecasPlanejadas.length + 1,
    codigo: codigoPeca,
    peca: nomePeca,
    maquina: maquina,
    quantidadeDia: Number(quantidade),
    tempoCicloMin: Number(tempoCiclo),
    periodo: periodo,
    prioridade: prioridade,
    status: "Planejado"
  };

  pecasPlanejadas.push(novaPeca);

  console.log(pecasPlanejadas);

  atualizarTabela();

  limparCampos();

  alert("Produção cadastrada com sucesso!");
}

function atualizarTabela() {
  const tabela =
    document.getElementById("tabelaPecas");

  tabela.innerHTML = "";

  pecasPlanejadas.forEach((item) => {
    const linha = document.createElement("tr");

    linha.innerHTML = `
      <td>${item.codigo}</td>
      <td>${item.peca}</td>
      <td>${item.maquina}</td>
      <td>${item.quantidadeDia}</td>
      <td>${item.periodo}</td>
      <td>
        <span class="${classePrioridade(item.prioridade)}">
          ${item.prioridade}
        </span>
      </td>
      <td>
        <span class="status-planejado">
          ${item.status}
        </span>
      </td>
    `;

    tabela.appendChild(linha);
  });
}

function classePrioridade(prioridade) {
  if (prioridade === "Alta") {
    return "prioridade-alta";
  }

  if (prioridade === "Média") {
    return "prioridade-media";
  }

  return "prioridade-baixa";
}

function limparCampos() {
  document.getElementById("codigoPeca").value = "";
  document.getElementById("nomePeca").value = "";
  document.getElementById("quantidade").value = "";
  document.getElementById("tempoCiclo").value = "";
  document.getElementById("observacoes").value = "";
}

function calcularDataFim() {
  const periodo =
    document.getElementById("periodo").value;

  const dataInicio =
    document.getElementById("dataInicio").value;

  const dataFim =
    document.getElementById("dataFim");

  if (dataInicio === "") {
    dataFim.value = "";
    return;
  }

  const data = new Date(dataInicio + "T00:00:00");

  if (periodo === "Semanal") {
    data.setDate(data.getDate() + 6);
  } else {
    data.setMonth(data.getMonth() + 1);
    data.setDate(data.getDate() - 1);
  }

  dataFim.value =
    data.toISOString().split("T")[0];
}

document
  .getElementById("codigoPeca")
  .addEventListener("change", preencherNomePeca);

document
  .getElementById("dataInicio")
  .addEventListener("change", calcularDataFim);

document
  .getElementById("periodo")
  .addEventListener("change", calcularDataFim);

carregarPecas();