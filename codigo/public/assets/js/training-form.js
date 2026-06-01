(function () {
  const form = document.querySelector("#training-form");
  const tableBody = document.querySelector("#training-table-body");
  const searchInput = document.querySelector("#search-training");
  const sectorFilter = document.querySelector("#filter-sector");
  const statusFilter = document.querySelector("#filter-status");
  const submitButton = document.querySelector("#submit-training");
  const cancelButton = document.querySelector("#cancel-edit");
  const emptyState = document.querySelector("#empty-training-list");

  let editingId = null;

  function getFormData() {
    return {
      nomeOperario: form.nomeOperario.value.trim(),
      matricula: form.matricula.value.trim(),
      setor: form.setor.value.trim(),
      cargo: form.cargo.value.trim(),
      nomeTreinamento: form.nomeTreinamento.value.trim(),
      categoria: form.categoria.value.trim(),
      dataRealizacao: form.dataRealizacao.value,
      dataVencimento: form.dataVencimento.value,
      cargaHoraria: Number(form.cargaHoraria.value),
      responsavel: form.responsavel.value.trim(),
      status: form.status.value,
    };
  }

  function escapeHtml(value) {
    const element = document.createElement("span");
    element.textContent = value || "";
    return element.innerHTML;
  }

  function displayStatus(status) {
    return status === "Concluido" ? "Concluído" : status;
  }

  function fillForm(training) {
    form.nomeOperario.value = training.nomeOperario || "";
    form.matricula.value = training.matricula || "";
    form.setor.value = training.setor || "";
    form.cargo.value = training.cargo || "";
    form.nomeTreinamento.value = training.nomeTreinamento || "";
    form.categoria.value = training.categoria || "";
    form.dataRealizacao.value = training.dataRealizacao || "";
    form.dataVencimento.value = training.dataVencimento || "";
    form.cargaHoraria.value = training.cargaHoraria || "";
    form.responsavel.value = training.responsavel || "";
    form.status.value = training.status || "Pendente";
  }

  function resetForm() {
    editingId = null;
    form.reset();
    submitButton.textContent = "Adicionar treinamento";
    cancelButton.hidden = true;
  }

  function formatDate(date) {
    if (!date) {
      return "-";
    }

    return new Date(`${date}T00:00:00`).toLocaleDateString("pt-BR");
  }

  function statusClass(status) {
    const statusMap = {
      Concluido: "status-concluido",
      "Em andamento": "status-andamento",
      Pendente: "status-pendente",
      Vencido: "status-vencido",
    };

    return statusMap[status] || "status-pendente";
  }

  function updateSectorOptions(trainings) {
    const selected = sectorFilter.value;
    const sectors = Array.from(
      new Set(trainings.map((training) => training.setor).filter(Boolean))
    ).sort((a, b) => a.localeCompare(b, "pt-BR"));

    sectorFilter.innerHTML = '<option value="">Todos os setores</option>';
    sectors.forEach((sector) => {
      const option = document.createElement("option");
      option.value = sector;
      option.textContent = sector;
      sectorFilter.appendChild(option);
    });
    sectorFilter.value = sectors.includes(selected) ? selected : "";
  }

  function getFilteredTrainings() {
    const trainings = TrainingStorage.getTrainings();
    const search = TrainingStorage.normalizeText(searchInput.value);
    const selectedSector = sectorFilter.value;
    const selectedStatus = statusFilter.value;

    return trainings.filter((training) => {
      const effectiveStatus = TrainingStorage.getEffectiveStatus(training);
      const matchesSearch =
        !search ||
        TrainingStorage.normalizeText(training.nomeOperario).includes(search) ||
        TrainingStorage.normalizeText(training.nomeTreinamento).includes(search) ||
        TrainingStorage.normalizeText(training.matricula).includes(search);
      const matchesSector = !selectedSector || training.setor === selectedSector;
      const matchesStatus = !selectedStatus || effectiveStatus === selectedStatus;

      return matchesSearch && matchesSector && matchesStatus;
    });
  }

  function renderTable() {
    const trainings = TrainingStorage.getTrainings();
    updateSectorOptions(trainings);
    const filteredTrainings = getFilteredTrainings();

    tableBody.innerHTML = "";
    emptyState.hidden = filteredTrainings.length > 0;

    filteredTrainings.forEach((training) => {
      const effectiveStatus = TrainingStorage.getEffectiveStatus(training);
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>
          <strong>${escapeHtml(training.nomeOperario)}</strong>
          <span>${escapeHtml(training.matricula)}</span>
        </td>
        <td>${escapeHtml(training.setor)}</td>
        <td>${escapeHtml(training.nomeTreinamento)}</td>
        <td>${escapeHtml(training.categoria)}</td>
        <td>${formatDate(training.dataVencimento)}</td>
        <td><span class="status-pill ${statusClass(effectiveStatus)}">${displayStatus(effectiveStatus)}</span></td>
        <td class="acoes-tabela">
          <button type="button" class="botao-secundario" data-action="edit" data-id="${training.id}">Editar</button>
          <button type="button" class="botao-perigo" data-action="delete" data-id="${training.id}">Excluir</button>
        </td>
      `;

      tableBody.appendChild(row);
    });
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = getFormData();

    if (editingId) {
      TrainingStorage.updateTraining(editingId, data);
    } else {
      TrainingStorage.createTraining(data);
    }

    resetForm();
    renderTable();
  });

  tableBody.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");

    if (!button) {
      return;
    }

    const { action, id } = button.dataset;
    const training = TrainingStorage.getTrainings().find((item) => item.id === id);

    if (action === "edit" && training) {
      editingId = id;
      fillForm(training);
      submitButton.textContent = "Salvar alteracoes";
      cancelButton.hidden = false;
      form.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    if (action === "delete") {
      const shouldDelete = confirm("Deseja excluir este treinamento?");

      if (shouldDelete) {
        TrainingStorage.deleteTraining(id);
        renderTable();
        if (editingId === id) {
          resetForm();
        }
      }
    }
  });

  cancelButton.addEventListener("click", resetForm);
  searchInput.addEventListener("input", renderTable);
  sectorFilter.addEventListener("change", renderTable);
  statusFilter.addEventListener("change", renderTable);

  renderTable();
})();
