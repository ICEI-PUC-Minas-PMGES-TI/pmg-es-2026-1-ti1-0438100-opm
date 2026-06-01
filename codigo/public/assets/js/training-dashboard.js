(function () {
  const searchInput = document.querySelector("#dashboard-search");
  const sectorFilter = document.querySelector("#dashboard-sector");
  const operatorFilter = document.querySelector("#dashboard-operator");
  const sortSelect = document.querySelector("#dashboard-sort");
  const operatorGrid = document.querySelector("#operator-grid");
  const sectorGrid = document.querySelector("#sector-grid");
  const emptyState = document.querySelector("#empty-dashboard");

  function getSummary(trainings) {
    const effectiveTrainings = trainings.map((training) => ({
      ...training,
      effectiveStatus: TrainingStorage.getEffectiveStatus(training),
    }));

    const total = effectiveTrainings.length;
    const concluded = effectiveTrainings.filter(
      (training) => training.effectiveStatus === "Concluido"
    ).length;
    const pending = effectiveTrainings.filter(
      (training) => training.effectiveStatus === "Pendente"
    ).length;
    const expired = effectiveTrainings.filter(
      (training) => training.effectiveStatus === "Vencido"
    ).length;
    const operators = new Set(
      effectiveTrainings.map((training) => training.matricula || training.nomeOperario)
    ).size;

    return {
      total,
      operators,
      concluded,
      pending,
      expired,
      percentage: TrainingStorage.calculatePercentage(concluded, total),
    };
  }

  function escapeHtml(value) {
    const element = document.createElement("span");
    element.textContent = value || "";
    return element.innerHTML;
  }

  function groupByOperator(trainings) {
    const groups = new Map();

    trainings.forEach((training) => {
      const key = training.matricula || training.nomeOperario;

      if (!groups.has(key)) {
        groups.set(key, {
          nomeOperario: training.nomeOperario,
          matricula: training.matricula,
          setor: training.setor,
          cargo: training.cargo,
          total: 0,
          concluded: 0,
          pending: 0,
          inProgress: 0,
          expired: 0,
        });
      }

      const group = groups.get(key);
      const status = TrainingStorage.getEffectiveStatus(training);
      group.total += 1;

      if (status === "Concluido") group.concluded += 1;
      if (status === "Pendente") group.pending += 1;
      if (status === "Em andamento") group.inProgress += 1;
      if (status === "Vencido") group.expired += 1;
    });

    return Array.from(groups.values()).map((operator) => ({
      ...operator,
      percentage: TrainingStorage.calculatePercentage(operator.concluded, operator.total),
    }));
  }

  function groupBySector(trainings) {
    const groups = new Map();

    trainings.forEach((training) => {
      const sector = training.setor || "Sem setor";

      if (!groups.has(sector)) {
        groups.set(sector, {
          sector,
          total: 0,
          concluded: 0,
        });
      }

      const group = groups.get(sector);
      group.total += 1;

      if (TrainingStorage.getEffectiveStatus(training) === "Concluido") {
        group.concluded += 1;
      }
    });

    return Array.from(groups.values()).map((sector) => ({
      ...sector,
      percentage: TrainingStorage.calculatePercentage(sector.concluded, sector.total),
    }));
  }

  function getProgressClass(percentage) {
    if (percentage >= 85) return "barra-verde";
    if (percentage >= 60) return "barra-amarela";
    return "barra-vermelha";
  }

  function getStatusLabel(percentage) {
    if (percentage >= 85) return "Em dia";
    if (percentage >= 60) return "Atenção";
    return "Crítico";
  }

  function getStatusClass(percentage) {
    if (percentage >= 85) return "operando";
    if (percentage >= 60) return "atencao";
    return "parada";
  }

  function updateFilters(trainings) {
    const selectedSector = sectorFilter.value;
    const selectedOperator = operatorFilter.value;

    const sectors = Array.from(
      new Set(trainings.map((training) => training.setor).filter(Boolean))
    ).sort((a, b) => a.localeCompare(b, "pt-BR"));
    const operators = Array.from(
      new Set(trainings.map((training) => training.nomeOperario).filter(Boolean))
    ).sort((a, b) => a.localeCompare(b, "pt-BR"));

    sectorFilter.innerHTML = '<option value="">Todos os setores</option>';
    sectors.forEach((sector) => {
      const option = document.createElement("option");
      option.value = sector;
      option.textContent = sector;
      sectorFilter.appendChild(option);
    });

    operatorFilter.innerHTML = '<option value="">Todos os operarios</option>';
    operators.forEach((operator) => {
      const option = document.createElement("option");
      option.value = operator;
      option.textContent = operator;
      operatorFilter.appendChild(option);
    });

    sectorFilter.value = sectors.includes(selectedSector) ? selectedSector : "";
    operatorFilter.value = operators.includes(selectedOperator) ? selectedOperator : "";
  }

  function getFilteredTrainings() {
    const trainings = TrainingStorage.getTrainings();
    const search = TrainingStorage.normalizeText(searchInput.value);
    const selectedSector = sectorFilter.value;
    const selectedOperator = operatorFilter.value;

    return trainings.filter((training) => {
      const matchesSearch =
        !search ||
        TrainingStorage.normalizeText(training.nomeOperario).includes(search) ||
        TrainingStorage.normalizeText(training.nomeTreinamento).includes(search) ||
        TrainingStorage.normalizeText(training.setor).includes(search);
      const matchesSector = !selectedSector || training.setor === selectedSector;
      const matchesOperator = !selectedOperator || training.nomeOperario === selectedOperator;

      return matchesSearch && matchesSector && matchesOperator;
    });
  }

  function renderSummary(summary) {
    document.querySelector("#general-compliance").textContent = `${summary.percentage}%`;
    document.querySelector("#total-operators").textContent = summary.operators;
    document.querySelector("#completed-trainings").textContent = summary.concluded;
    document.querySelector("#pending-trainings").textContent = summary.pending;
    document.querySelector("#expired-trainings").textContent = summary.expired;
  }

  function renderOperators(operators) {
    const sort = sortSelect.value;
    const sortedOperators = [...operators].sort((a, b) => {
      if (sort === "menor-percentual") return a.percentage - b.percentage;
      if (sort === "maior-percentual") return b.percentage - a.percentage;
      return (a.nomeOperario || "").localeCompare(b.nomeOperario || "", "pt-BR");
    });

    operatorGrid.innerHTML = "";

    sortedOperators.forEach((operator) => {
      const statusClass = getStatusClass(operator.percentage);
      const card = document.createElement("article");
      card.className = "card-maquina card-operario";

      card.innerHTML = `
        <div class="cabecalho-card-maquina">
          <div class="area-nome-maquina">
            <span class="bolinha-status status-${statusClass}"></span>
            <h2 class="nome-maquina">${escapeHtml(operator.nomeOperario)}</h2>
          </div>
          <span class="selo-status selo-${statusClass}">${escapeHtml(getStatusLabel(operator.percentage))}</span>
        </div>

        <div class="area-informacoes-maquina">
          <div class="icone-maquina">OP</div>
          <div class="dados-maquina">
            <p><strong>Setor</strong><span>${escapeHtml(operator.setor || "-")}</span></p>
            <p><strong>Cargo</strong><span>${escapeHtml(operator.cargo || "-")}</span></p>
          </div>
        </div>

        <div class="linha-divisoria"></div>

        <div class="area-indicadores indicadores-operario">
          <div class="indicador"><strong>${operator.concluded}</strong><span>concluídos</span></div>
          <div class="indicador"><strong>${operator.pending}</strong><span>pendentes</span></div>
          <div class="indicador"><strong>${operator.expired}</strong><span>vencidos</span></div>
        </div>

        <div class="indicador indicador-progresso">
          <strong>Status: ${operator.percentage}%</strong>
          <span>${operator.concluded} de ${operator.total} treinamentos concluídos</span>
          <div class="progress-bar">
            <div class="progress-fill ${getProgressClass(operator.percentage)}" style="width: ${operator.percentage}%"></div>
          </div>
        </div>
      `;

      operatorGrid.appendChild(card);
    });
  }

  function renderSectors(sectors) {
    sectorGrid.innerHTML = "";

    sectors.forEach((sector) => {
      const item = document.createElement("article");
      item.className = "card-setor";

      item.innerHTML = `
        <div>
          <h3>${escapeHtml(sector.sector)}</h3>
          <span>${sector.concluded} de ${sector.total} treinamentos</span>
        </div>
        <strong>${sector.percentage}%</strong>
        <div class="progress-bar">
          <div class="progress-fill ${getProgressClass(sector.percentage)}" style="width: ${sector.percentage}%"></div>
        </div>
      `;

      sectorGrid.appendChild(item);
    });
  }

  function renderDashboard() {
    const allTrainings = TrainingStorage.getTrainings();
    updateFilters(allTrainings);

    const filteredTrainings = getFilteredTrainings();
    const summary = getSummary(filteredTrainings);
    const operators = groupByOperator(filteredTrainings);
    const sectors = groupBySector(filteredTrainings);

    renderSummary(summary);
    renderOperators(operators);
    renderSectors(sectors);
    emptyState.hidden = filteredTrainings.length > 0;
  }

  [searchInput, sectorFilter, operatorFilter, sortSelect].forEach((field) => {
    field.addEventListener("input", renderDashboard);
    field.addEventListener("change", renderDashboard);
  });

  renderDashboard();
})();
