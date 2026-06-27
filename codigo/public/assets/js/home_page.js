const containerAvisos = document.getElementById("avisos");
const containerOee = document.getElementById("oee");

/* AVISOS */

async function carregarAvisos() {

    const resposta = await fetch("../../../db/avisos.json");

    const avisos = await resposta.json();

    avisos.forEach(function (aviso) {

        containerAvisos.innerHTML += `
            <div class="aviso">

                <h4>${aviso.importancia}</h4>

                <p>${aviso.texto}</p>

                <span>
                    ${aviso.tipo} • ${aviso.data}
                </span>

            </div>
        `;

    });

}

/* OEE */
const API_URL_MAQUINAS = 'http://localhost:3000/maquinas'

async function carregarMaquinas() {
    const response = await fetch(API_URL_MAQUINAS)
    maquinas = await response.json()
    carregarOee()
}

let maquinas = []

async function carregarOee() {


    maquinas.forEach(function (maquina) {

        let corTexto = "#14532d";
        let corFundo = "#bbf7d0";
        let corBorda = "#166534";

        const valor = parseFloat(
            String(maquina.OEE).replace("%", "").replace(",", ".")
        );

        /* LARANJA */

        if (valor < 85) {

            corTexto = "#9a3412";
            corFundo = "#fed7aa";
            corBorda = "#c2410c";

        }

        /* VERMELHO */

        if (valor < 70) {

            corTexto = "#991b1b";
            corFundo = "#fecaca";
            corBorda = "#b91c1c";

        }

        containerOee.innerHTML += `

            <div class="oee-card">

                <strong>${maquina.nome}</strong>

                <span 
                    class="oee-valor"
                    style="
                        color:${corTexto};
                        background:${corFundo};
                        border:1px solid ${corBorda};
                    "
                >
                    ${maquina.OEE}%
                </span>

            </div>

        `;

    });

}

const containerPendentes = document.getElementById("pecasPendentes");
const containerMeta = document.getElementById("pecasMeta");

/* PEÇAS */

async function carregarPecas() {

    const resposta = await fetch("../../../db/pecas.json");

    const dados = await resposta.json();

    /* PENDENTES */

    dados.pendentes.forEach(function (peca) {

        containerPendentes.innerHTML += `

            <div class="peca-card">

                <div class="peca-topo">

                    <strong>
                        ${peca.quantidade} peças tipo ${peca.tipo}
                    </strong>

                    <span>${peca.dia}</span>

                </div>

                <div class="barra">

                    <div 
                        class="progresso azul"
                        style="width:${peca.progresso}%"
                    ></div>

                </div>

            </div>

        `;

    });

    /* META */

    dados.meta.forEach(function (peca) {

        containerMeta.innerHTML += `

            <div class="peca-card">

                <div class="peca-topo">

                    <strong>
                        ${peca.quantidade} peças tipo ${peca.tipo}
                    </strong>

                    <span>${peca.dia}</span>

                </div>

                <div class="barra">

                    <div 
                        class="progresso cinza"
                        style="width:${peca.progresso}%"
                    ></div>

                </div>

            </div>

        `;

    });

}

carregarPecas();
carregarAvisos();
carregarMaquinas();