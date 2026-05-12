const selectMaquina = document.getElementById("maquina");
const checklist = document.getElementById("checklist");

let checklists = {};

fetch ("../../../db/checklist.json")
    .then(res => res.json())
    .then(data => {
        checklists = data;
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
    });