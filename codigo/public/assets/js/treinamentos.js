(function () {
    // === Mapeamento de Elementos do DOM ===
    // (Unificando os seletores da branch Current com os da Incoming)
    const trainingGrid = document.querySelector("#treinamentosGrid") || document.getElementById("treinamentosGrid");
    const searchInput = document.querySelector("#treinamentosSearch") || document.getElementById("pesquisa");
    const sectorFilter = document.querySelector("#treinamentosSector") || document.getElementById("categoria");
    
    // Elementos exclusivos da branch Current (novos filtros e contadores)
    const statusFilter = document.querySelector("#treinamentosStatus");
    const quickSectors = document.querySelectorAll("#quickSectors"); // ou querySelector dependendo da estrutura
    const emptyState = document.querySelector("#emptyState");
    const resultCount = document.querySelector("#resultCount");
    const sectorCount = document.querySelector("#sectorCount");

    // Estado da aplicação (vindo da branch Incoming)
    let treinamentos = [];

    // === Funções de Lógica e Dados ===

    // Função trazida da branch Incoming
    async function carregarTreinamentos() {
        try {
            const resposta = await fetch("../../../db/treinamentos.json"); // Ajuste o caminho se necessário
            const dados = await resposta.json();
            treinamentos = dados.treinamentos;
            
            // Renderiza os treinamentos iniciais
            renderizarTreinamentos(treinamentos);
        } catch (erro) {
            console.error("Erro ao carregar os treinamentos:", erro);
        }
    }

    // Função trazida da branch Current
    function getEffectiveStatus(training) {
        if (window.TrainingStorage) {
            // Lógica existente na sua branch local...
        }
        // ... restante da função
    }

    // Exemplo de como a renderização pode conversar com o Grid mapeado
    function renderizarTreinamentos(lista) {
        if (!trainingGrid) return;
        // Lógica para limpar e preencher o HTML do grid...
    }

    // === Inicialização ===
    document.addEventListener("DOMContentLoaded", () => {
        carregarTreinamentos();
        // Configurar event listeners para os filtros aqui (search, sectorFilter, etc.)
    });

})();