(function () {
  const STORAGE_KEY = "opm-training-records";

  function normalizeText(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function getTrainings() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Erro ao carregar treinamentos:", error);
      return [];
    }
  }

  function saveTrainings(trainings) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trainings));
  }

  function createTraining(data) {
    const trainings = getTrainings();
    const id =
      window.crypto && window.crypto.randomUUID
        ? window.crypto.randomUUID()
        : String(Date.now());
    const training = {
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data,
    };

    trainings.push(training);
    saveTrainings(trainings);
    return training;
  }

  function updateTraining(id, data) {
    const trainings = getTrainings();
    const index = trainings.findIndex((training) => training.id === id);

    if (index === -1) {
      return null;
    }

    trainings[index] = {
      ...trainings[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    saveTrainings(trainings);
    return trainings[index];
  }

  function deleteTraining(id) {
    const trainings = getTrainings().filter((training) => training.id !== id);
    saveTrainings(trainings);
  }

  function getUniqueValues(field) {
    return Array.from(
      new Set(getTrainings().map((training) => training[field]).filter(Boolean))
    ).sort((a, b) => a.localeCompare(b, "pt-BR"));
  }

  function isExpired(training) {
    if (training.status === "Vencido") {
      return true;
    }

    if (!training.dataVencimento || training.status === "Concluido") {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(`${training.dataVencimento}T00:00:00`) < today;
  }

  function getEffectiveStatus(training) {
    return isExpired(training) ? "Vencido" : training.status;
  }

  function calculatePercentage(concluded, total) {
    if (!total) {
      return 0;
    }

    return Math.round((concluded / total) * 100);
  }

  window.TrainingStorage = {
    normalizeText,
    getTrainings,
    saveTrainings,
    createTraining,
    updateTraining,
    deleteTraining,
    getUniqueValues,
    getEffectiveStatus,
    calculatePercentage,
  };
})();
