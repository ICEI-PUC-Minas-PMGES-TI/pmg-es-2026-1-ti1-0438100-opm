(function () {
    const searchInput = document.querySelector("#training-search");
    const sectorFilter = document.querySelector("#training-sector");
    const statusFilter = document.querySelector("#training-status");
    const trainingGrid = document.querySelector("#training-grid");
    const quickSectors = document.querySelector("#quick-sectors");
    const emptyState = document.querySelector("#empty-trainings");
    const resultCount = document.querySelector("#result-count");
    const sectorCount = document.querySelector("#sector-count");

    function getEffectiveStatus(training) {
        if (window.TrainingStorage) {
            return TrainingStorage.getEffectiveStatus(training);
        }

        return training.status || "Pendente";
    }

    function normalizeText(value) {
        if (window.TrainingStorage) {
            return TrainingStorage.normalizeText(value);
        }

        return String(value || "").trim().toLowerCase();
    }

    function getTrainings() {
        if (window.TrainingStorage) {
            return TrainingStorage.getTrainings();
        }

        return [];
    }

    function escapeHtml(value) {
        const element = document.createElement("span");
        element.textContent = value || "";
        return element.innerHTML;
    }

    function displayStatus(status) {
        return status === "Concluido" ? "Concluído" : status;
    }

    function statusClass(status) {
        const classes = {
            Concluido: "status-concluido",
            "Em andamento": "status-andamento",
            Pendente: "status-pendente",
            Vencido: "status-vencido",
        };

        return classes[status] || "status-pendente";
    }

    function formatDate(date) {
        if (!date) {
            return "-";
        }

        return new Date(`${date}T00:00:00`).toLocaleDateString("pt-BR");
    }

    function updateSummary(trainings) {
        const statusList = trainings.map(getEffectiveStatus);

        document.querySelector("#summary-total").textContent = trainings.length;
        document.querySelector("#summary-completed").textContent = statusList.filter(
            (status) => status === "Concluido"
        ).length;
        document.querySelector("#summary-pending").textContent = statusList.filter(
            (status) => status === "Pendente"
        ).length;
        document.querySelector("#summary-expired").textContent = statusList.filter(
            (status) => status === "Vencido"
        ).length;
    }

    function updateSectorFilter(trainings) {
        const selectedSector = sectorFilter.value;
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

        sectorFilter.value = sectors.includes(selectedSector) ? selectedSector : "";
    }

    function getFilteredTrainings(trainings) {
        const search = normalizeText(searchInput.value);
        const sector = sectorFilter.value;
        const status = statusFilter.value;

        return trainings.filter((training) => {
            const effectiveStatus = getEffectiveStatus(training);
            const matchesSearch =
                !search ||
                normalizeText(training.nomeOperario).includes(search) ||
                normalizeText(training.nomeTreinamento).includes(search) ||
                normalizeText(training.categoria).includes(search);
            const matchesSector = !sector || training.setor === sector;
            const matchesStatus = !status || effectiveStatus === status;

            return matchesSearch && matchesSector && matchesStatus;
        });
    }

    function groupSectors(trainings) {
        const groups = new Map();

        trainings.forEach((training) => {
            const sector = training.setor || "Sem setor";

            if (!groups.has(sector)) {
                groups.set(sector, {
                    name: sector,
                    total: 0,
                    completed: 0,
                });
            }

            const group = groups.get(sector);
            group.total += 1;

            if (getEffectiveStatus(training) === "Concluido") {
                group.completed += 1;
            }
        });

        return Array.from(groups.values()).sort((a, b) =>
            a.name.localeCompare(b.name, "pt-BR")
        );
    }

    function renderSectors(trainings) {
        const sectors = groupSectors(trainings);
        quickSectors.innerHTML = "";
        sectorCount.textContent = `${sectors.length} ${sectors.length === 1 ? "setor" : "setores"}`;

        sectors.forEach((sector) => {
            const percentage = sector.total ? Math.round((sector.completed / sector.total) * 100) : 0;
            const card = document.createElement("article");
            card.className = "rapido-card";
            card.innerHTML = `
                <strong>${escapeHtml(sector.name)}</strong>
                <span>${sector.total} treinamentos</span>
                <span>${percentage}% concluídos</span>
            `;

            quickSectors.appendChild(card);
        });
    }

    function renderTrainings(trainings) {
        trainingGrid.innerHTML = "";
        resultCount.textContent = `${trainings.length} ${trainings.length === 1 ? "encontrado" : "encontrados"}`;
        emptyState.hidden = trainings.length > 0;

        trainings.forEach((training) => {
            const effectiveStatus = getEffectiveStatus(training);
            const card = document.createElement("article");
            card.className = "treinamento-card";

            card.innerHTML = `
                <div class="treinamento-card-topo">
                    <h3>${escapeHtml(training.nomeTreinamento)}</h3>
                    <span class="status-pill ${statusClass(effectiveStatus)}">${displayStatus(effectiveStatus)}</span>
                </div>

                <p>${escapeHtml(training.categoria || "Sem categoria")}</p>

                <div class="treinamento-meta">
                    <div>
                        <strong>Operário</strong>
                        <span>${escapeHtml(training.nomeOperario)}</span>
                    </div>
                    <div>
                        <strong>Setor</strong>
                        <span>${escapeHtml(training.setor)}</span>
                    </div>
                    <div>
                        <strong>Realização</strong>
                        <span>${formatDate(training.dataRealizacao)}</span>
                    </div>
                    <div>
                        <strong>Vencimento</strong>
                        <span>${formatDate(training.dataVencimento)}</span>
                    </div>
                </div>

                <div class="status-info">
                    <div>
                        <strong>Carga horária</strong>
                        <span>${escapeHtml(String(training.cargaHoraria || "-"))}h</span>
                    </div>
                    <div>
                        <strong>Responsável</strong>
                        <span>${escapeHtml(training.responsavel || "-")}</span>
                    </div>
                </div>
            `;

            trainingGrid.appendChild(card);
        });
    }

    function renderPage() {
        const trainings = getTrainings();
        updateSectorFilter(trainings);

        const filteredTrainings = getFilteredTrainings(trainings);
        updateSummary(filteredTrainings);
        renderSectors(filteredTrainings);
        renderTrainings(filteredTrainings);
    }

    [searchInput, sectorFilter, statusFilter].forEach((field) => {
        field.addEventListener("input", renderPage);
        field.addEventListener("change", renderPage);
    });

    renderPage();
})();
