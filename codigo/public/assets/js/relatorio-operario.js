const OPERARIOS = [
  {
    nome: "Carlos Augusto",
    matricula: "A-5542",
    funcao: "Operador de CNC",
    setor: "Usinagem",
    status: "ativo",
    horas: 80,
    tarefas: 15,
    ocorrencias: 0,
    desempenho: [
      { item: "Produtividade", pct: 94 },
      { item: "Qualidade das peças", pct: 98 },
      { item: "Pontualidade", pct: 100 },
      { item: "Segurança", pct: 97 },
      { item: "Trabalho em equipe", pct: 88 }
    ],
    maquinas: [
      { nome: "Torno CNC", tempo: "50h" },
      { nome: "Fresadora", tempo: "30h" }
    ],
    historico: [
      { data: "05/05/2026", descricao: "Usinagem de eixos", status: "Finalizado" },
      { data: "08/05/2026", descricao: "Setup da fresadora", status: "Finalizado" },
      { data: "12/05/2026", descricao: "Manutenção preventiva do torno", status: "Finalizado" },
      { data: "14/05/2026", descricao: "Conferência dimensional de lote", status: "Finalizado" }
    ],
    observacoes: "Operador manteve excelente ritmo de produção e cumpriu todas as metas de segurança do período."
  },
  {
    nome: "Ana Paula Ribeiro",
    matricula: "B-1120",
    funcao: "Operadora de Montagem",
    setor: "Montagem",
    status: "ativo",
    horas: 72,
    tarefas: 22,
    ocorrencias: 1,
    desempenho: [
      { item: "Produtividade", pct: 88 },
      { item: "Qualidade", pct: 91 },
      { item: "Pontualidade", pct: 95 },
      { item: "Segurança", pct: 100 },
      { item: "Trabalho em equipe", pct: 93 }
    ],
    maquinas: [
      { nome: "Estação de Montagem A", tempo: "40h" },
      { nome: "Parafusadeira Bosch", tempo: "32h" }
    ],
    historico: [
      { data: "02/05/2026", descricao: "Montagem subconjunto hidráulico", status: "Finalizado" },
      { data: "07/05/2026", descricao: "Inspeção de qualidade lote 44", status: "Finalizado" },
      { data: "10/05/2026", descricao: "Ajuste de linha de montagem", status: "Em andamento" },
      { data: "13/05/2026", descricao: "Treinamento NR-12", status: "Pendente" }
    ],
    observacoes: ""
  },
  {
    nome: "João Marcos Silva",
    matricula: "C-0873",
    funcao: "Técnico de Manutenção",
    setor: "Manutenção",
    status: "ferias",
    horas: 40,
    tarefas: 8,
    ocorrencias: 2,
    desempenho: [
      { item: "Produtividade", pct: 72 },
      { item: "Qualidade", pct: 85 },
      { item: "Pontualidade", pct: 80 },
      { item: "Segurança", pct: 90 },
      { item: "Trabalho em equipe", pct: 78 }
    ],
    maquinas: [
      { nome: "Multímetro Digital", tempo: "15h" },
      { nome: "Torno Manual", tempo: "25h" }
    ],
    historico: [
      { data: "01/05/2026", descricao: "Revisão geral compressor", status: "Finalizado" },
      { data: "06/05/2026", descricao: "Troca de rolamento torno", status: "Finalizado" },
      { data: "09/05/2026", descricao: "Diagnóstico elétrico painel", status: "Pendente" },
      { data: "11/05/2026", descricao: "Lubrificação geral", status: "Em andamento" }
    ],
    observacoes: ""
  }
];

let operarioAtual = null;

function el(id) { return document.getElementById(id); }

function classeBarra(pct) {
  if (pct >= 90) return "desempenho__barra-preenchimento--alto";
  if (pct >= 70) return "desempenho__barra-preenchimento--medio";
  return "desempenho__barra-preenchimento--baixo";
}

function classeEtiqueta(status) {
  if (status === "Finalizado")   return "etiqueta--finalizado";
  if (status === "Em andamento") return "etiqueta--andamento";
  return "etiqueta--pendente";
}

function renderizarKPIs(op) {
  const kpiHoras  = el("kpi-horas");
  const kpiTaref  = el("kpi-tarefas");
  const kpiOcorr  = el("kpi-ocorr");

  kpiHoras.textContent  = op.horas + "h";
  kpiTaref.textContent  = op.tarefas;
  kpiOcorr.textContent  = op.ocorrencias;

  [kpiHoras, kpiTaref, kpiOcorr].forEach(e => e.classList.remove("kpis__valor--vazio"));
}

function renderizarOperario(op) {
  el("operario-info").innerHTML = `
    <p class="cartao-operario__nome">${op.nome}</p>
    <div class="cartao-operario__meta">
      <div class="cartao-operario__meta-item">
        <span class="cartao-operario__meta-label">Matrícula</span>
        <span class="cartao-operario__meta-valor">${op.matricula}</span>
      </div>
      <div class="cartao-operario__meta-item">
        <span class="cartao-operario__meta-label">Função</span>
        <span class="cartao-operario__meta-valor">${op.funcao}</span>
      </div>
      <div class="cartao-operario__meta-item">
        <span class="cartao-operario__meta-label">Setor</span>
        <span class="cartao-operario__meta-valor">${op.setor}</span>
      </div>
    </div>
  `;

  const labels = { ativo: "Ativo", inativo: "Inativo", ferias: "Férias" };
  const badge = el("operario-status");
  badge.textContent = labels[op.status] || op.status;
  badge.className = "cartao-operario__status cartao-operario__status--" + op.status;
}

function renderizarDesempenho(op) {
  el("desempenho-container").innerHTML = op.desempenho.map(d => `
    <div class="desempenho__linha">
      <div class="desempenho__cabecalho">
        <span class="desempenho__nome">${d.item}</span>
        <span class="desempenho__pct">${d.pct}%</span>
      </div>
      <div class="desempenho__barra-fundo">
        <div class="desempenho__barra-preenchimento ${classeBarra(d.pct)}"
             style="width:0" data-largura="${d.pct}%"></div>
      </div>
    </div>
  `).join("");

  setTimeout(() => {
    document.querySelectorAll(".desempenho__barra-preenchimento").forEach(barra => {
      barra.style.width = barra.dataset.largura;
    });
  }, 50);
}

function renderizarMaquinas(op) {
  el("maquinas-corpo").innerHTML = op.maquinas.map(m => `
    <tr>
      <td class="tabela-maquinas__nome">${m.nome}</td>
      <td class="tabela-maquinas__tempo">${m.tempo}</td>
    </tr>
  `).join("");
}

function renderizarHistorico(lista) {
  if (!lista.length) {
    el("historico-corpo").innerHTML = `<tr><td colspan="3" class="texto-vazio">Nenhum registro no período.</td></tr>`;
    return;
  }
  el("historico-corpo").innerHTML = lista.map(t => `
    <tr>
      <td class="tabela-historico__data">${t.data}</td>
      <td class="tabela-historico__desc">${t.descricao}</td>
      <td><span class="etiqueta ${classeEtiqueta(t.status)}">${t.status}</span></td>
    </tr>
  `).join("");
}

function filtrar() {
  const nome  = el("filtro-operario").value.trim().toLowerCase();
  const setor = el("filtro-setor").value;
  const inicio = el("filtro-inicio").value;
  const fim    = el("filtro-fim").value;

  const op = OPERARIOS.find(o =>
    (!nome  || o.nome.toLowerCase().includes(nome)) &&
    (!setor || o.setor === setor)
  );

  if (!op) {
    alert("Operário não encontrado.\nTente: Carlos Augusto, Ana Paula Ribeiro ou João Marcos Silva.");
    return;
  }

  operarioAtual = op;

  let historico = op.historico;
  if (inicio || fim) {
    historico = historico.filter(t => {
      const [d, m, a] = t.data.split("/");
      const data = new Date(`${a}-${m}-${d}`);
      if (inicio && data < new Date(inicio)) return false;
      if (fim    && data > new Date(fim))    return false;
      return true;
    });
  }

  renderizarKPIs(op);
  renderizarOperario(op);
  renderizarDesempenho(op);
  renderizarMaquinas(op);
  renderizarHistorico(historico);

  el("obs-textarea").value = op.observacoes || "";
  atualizarContador();
}

function atualizarContador() {
  const len = el("obs-textarea").value.length;
  el("obs-contador").textContent = `${len} / 500`;
}

function salvarObservacoes() {
  const texto = el("obs-textarea").value.trim();
  if (operarioAtual) operarioAtual.observacoes = texto;

  const msg = el("obs-confirmacao");
  msg.hidden = false;
  setTimeout(() => msg.hidden = true, 2500);
}

window.addEventListener("DOMContentLoaded", () => {
  el("botao-filtrar").addEventListener("click", filtrar);
  el("botao-salvar").addEventListener("click", salvarObservacoes);
  el("obs-textarea").addEventListener("input", atualizarContador);
  el("filtro-operario").addEventListener("keydown", e => {
    if (e.key === "Enter") filtrar();
  });
});