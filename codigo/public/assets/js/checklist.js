const checklists = {
    maquina_exemplo: [
        "Exemplo de item 1",
        "Exemplo de item 2",
        "Exemplo de item 3",
        "Exemplo de item 4",
        "Exemplo de item 5",
    ],
    maquina_exemplo_2: [
        "Exemplo de item 6",
        "Exemplo de item 7",
        "Exemplo de item 8",
        "Exemplo de item 9",
        "Exemplo de item 10",
    ],
    maquina_exemplo_3: [
        "Exemplo de item 11",
        "Exemplo de item 12",
        "Exemplo de item 13",
        "Exemplo de item 14",
        "Exemplo de item 15",
    ],
    torno: [
        "Máquina limpa e sem cavacos acumulados",
        "Nível de óleo lubrificante",
        "Ferramentas montadas corretamente",
        "Programa CNC correto carregado",
        "Parâmetros de corte corretos"
    ],

    fresa: [
        "Mesa da máquina limpa",
        "Ferramentas montadas corretamente",
        "Ferramenta de corte instalada",
        "Sistema de refrigeração funcionando",
        "EPI’s utilizados"
    ],

    furadeira: [
        "Broca bem fixada",
        "Proteção da máquina posicionada",
        "Peça presa corretamente",
        "Botão de emergência funcionando",
        "Ferramentas montadas corretamente"
    ]
};

const selectMaquina = document.getElementById("maquina");
const checklist = document.getElementById("checklist");

selectMaquina.addEventListener("change", function () {
    const maquinaSelecionada = selectMaquina.value;

    checklist.innerHTML = "";

    if (maquinaSelecionada === "") {
        return;
    }

    const itens = checklists[maquinaSelecionada];

    itens.forEach(function (texto) {
        checklist.innerHTML += `
            <div class="item">
                <span>${texto}</span>
                <button class="ok">OK</button>
                <button class="nok">NOK</button>
            </div>
        `;
    });
});