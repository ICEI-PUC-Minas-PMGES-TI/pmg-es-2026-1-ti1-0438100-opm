const URL_API = 'http://localhost:3000/maquinas';
let listaMaquinas = [];

window.onload = () => {
    buscarMaquinas();
    configurarEventos();
};

async function buscarMaquinas() {
    try {
        const resposta = await fetch(URL_API);
        listaMaquinas = await resposta.json();
        renderizarMaquinas(listaMaquinas);
    } catch (erro) {
        console.error("Erro ao carregar dados:", erro);
    }
}

function renderizarMaquinas(dados) {
    const container = document.getElementById('containerMaquinas');
    container.innerHTML = '';

    dados.forEach(maquina => {
        const card = document.createElement('div');
        card.className = 'card'; 
        
        const statusClass = maquina.status === 'Operacional' ? 'badge' : 'btn-deletar';

        card.innerHTML = `
            <img src="${maquina.imagem}" alt="${maquina.nome}">
            <p>${maquina.nome}</p>
            <span class="${statusClass}" style="padding: 5px; font-size: 10px; border-radius: 4px; text-align: center;">
                ${maquina.status}
            </span>
            <small style="color: #7a8194; margin-top: 5px;">Tipo: ${maquina.tipo}</small>
        `;

        card.onclick = () => alert(`Detalhes da Máquina: ${maquina.nome}\nÚltima Manutenção: ${maquina.ultimaManutencao}`);
        container.appendChild(card);
    });
}

function configurarEventos() {
    document.getElementById('inputBusca').oninput = (e) => {
        const termo = e.target.value.toLowerCase();
        const filtradas = listaMaquinas.filter(m => m.nome.toLowerCase().includes(termo));
        renderizarMaquinas(filtradas);
    };

    document.getElementById('filtroStatus').onchange = (e) => {
        const status = e.target.value;
        const filtradas = status ? listaMaquinas.filter(m => m.status === status) : listaMaquinas;
        renderizarMaquinas(filtradas);
    };

    document.getElementById('btnOrdenar').onclick = () => {
        const ordenadas = [...listaMaquinas].sort((a, b) => a.nome.localeCompare(b.nome));
        renderizarMaquinas(ordenadas);
    };
}