const API_URL = 'http://localhost:3000/maquinas'

async function carregarMaquinas() {
    const response = await fetch(API_URL)
    maquinas = await response.json()
    renderTabela()
}

let maquinas = []

/*
let maquinas = [
    { nome: 'Maquina A1', tipo: 'Torno CNC', patrimonio: 'PAT-00101', serie: 'SN-8812301', fabricante: 'Romi', ano: '2021', local: 'Galpão A – Linha 1', status: 'Ativo', ultManutencao: '2025-03-10', obs: '' },
    { nome: 'Maquina B3', tipo: 'Fresadora', patrimonio: 'PAT-00234', serie: 'SN-7741029', fabricante: 'Romi', ano: '2020', local: 'Galpão A – Linha 2', status: 'Ativo', ultManutencao: '2025-01-22', obs: '' },
    { nome: 'Maquina C2', tipo: 'Prensa', patrimonio: 'PAT-00389', serie: 'SN-6630182', fabricante: 'Schuler', ano: '2019', local: 'Galpão B – Linha 1', status: 'Manutenção', ultManutencao: '2024-11-05', obs: 'Aguardando peça de reposição' },
    { nome: 'Maquina D4', tipo: 'Injetora', patrimonio: 'PAT-00412', serie: 'SN-5521837', fabricante: 'Arburg', ano: '2022', local: 'Galpão B – Linha 3', status: 'Ativo', ultManutencao: '2025-04-18', obs: '' },
    { nome: 'Maquina E1', tipo: 'Soldadora', patrimonio: 'PAT-00501', serie: 'SN-4410293', fabricante: 'Lincoln', ano: '2018', local: 'Galpão C – Linha 1', status: 'Inativo', ultManutencao: '2024-06-30', obs: 'Desativada aguardando descarte' },
    { nome: 'Maquina F2', tipo: 'Torno CNC', patrimonio: 'PAT-00618', serie: 'SN-3309182', fabricante: 'Mazak', ano: '2023', local: 'Galpão A – Linha 3', status: 'Ativo', ultManutencao: '2025-05-02', obs: '' },
];*/

let selectedIndex = -1;
let editando = false;

const statusClass = { 'Ativo': 'badge-status-ativo', 'Inativo': 'badge-status-inativo', 'Manutenção': 'badge-status-manutencao' };

function toggleFiltro() {
    document.getElementById('filterPanel').classList.toggle('open');
    document.querySelector('.btn-filter').classList.toggle('active');
}

function limparFiltro() {
    ['filtNome', 'filtTipo', 'filtStatus', 'filtLocal'].forEach(id => document.getElementById(id).value = '');
    renderTabela();
}

function getFiltradas() {
    const nome = document.getElementById('filtNome').value.toLowerCase();
    const tipo = document.getElementById('filtTipo').value;
    const status = document.getElementById('filtStatus').value;
    const local = document.getElementById('filtLocal').value.toLowerCase();

    return maquinas.filter(m => {
        if (nome && !m.nome.toLowerCase().includes(nome)) return false;
        if (tipo && m.tipo !== tipo) return false;
        if (status && m.status !== status) return false;
        if (local && !m.local.toLowerCase().includes(local)) return false;
        return true;
    });
}

function renderTabela() {
    const tbody = document.getElementById('tbody');
    const filtradas = getFiltradas();
    tbody.innerHTML = '';

    const countEl = document.getElementById('countLabel');
    countEl.innerHTML = `Exibindo <span>${filtradas.length}</span> de <span>${maquinas.length}</span> máquinas`;

    filtradas.forEach((m, i) => {
        const realIndex = maquinas.indexOf(m);
        const tr = document.createElement('tr');
        if (realIndex === selectedIndex) tr.classList.add('selected');
        tr.innerHTML = `
        <td>${i + 1}</td>
        <td style="font-weight:500">${m.nome}</td>
        <td><span class="badge badge-tipo">${m.tipo}</span></td>
        <td style="font-family:'IBM Plex Mono',monospace;font-size:12px">${m.patrimonio}</td>
        <td style="color:var(--muted);font-size:13px">${m.local}</td>
        <td style="font-family:'IBM Plex Mono',monospace;font-size:12px">${m.ano}</td>
        <td><span class="badge ${statusClass[m.status] || ''}">${m.status}</span></td>`;
        tr.onclick = () => { selectedIndex = realIndex; renderTabela(); };
        tbody.appendChild(tr);
    });
}

async function adicionarOuSalvar() {
    const nome = document.getElementById('fNome').value.trim();
    const tipo = document.getElementById('fTipo').value;
    const patrimonio = document.getElementById('fPatrimonio').value.trim();
    const serie = document.getElementById('fSerie').value.trim();
    const fabricante = document.getElementById('fFabricante').value.trim();
    const ano = document.getElementById('fAno').value;
    const local = document.getElementById('fLocal').value.trim();
    const status = document.getElementById('fStatus').value;
    const OEE = Number(document.getElementById('fOEE').value.trim());
    const ultManutencao = document.getElementById('fUltManutencao').value;
    const obs = document.getElementById('fObs').value.trim();

    if (!nome || !tipo || !patrimonio || !local || !status || !OEE) {
        showToast('⚠ Preencha os campos obrigatórios.');
        return;
    }

    const maquina = { nome, tipo, patrimonio, serie, fabricante, ano, local, status, OEE, ultManutencao, obs };

    if (editando && selectedIndex >= 0) {
        await fetch(`${API_URL}/${maquinas[selectedIndex].id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(maquina)
        });
        editando = false;
        document.querySelector('.btn-add').textContent = 'Adicionar';
        showToast('✓ Máquina atualizada com sucesso.');
    } else {
        await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(maquina)
        })
        showToast('✓ Máquina adicionada com sucesso.');
    }

    limparForm();
    await carregarMaquinas()
}

async function deletarSelecionado() {
    if (selectedIndex < 0) { showToast('Selecione uma linha para deletar.'); return; }
    await fetch(`${API_URL}/${maquinas[selectedIndex].id}`,{
        method: 'DELETE'  
    })
    selectedIndex = -1;
    await carregarMaquinas();
    showToast('🗑 Máquina deletada.');
}

function alterarSelecionado() {
    if (selectedIndex < 0) { showToast('Selecione uma linha para alterar.'); return; }
    const m = maquinas[selectedIndex];
    document.getElementById('fNome').value = m.nome;
    document.getElementById('fTipo').value = m.tipo;
    document.getElementById('fPatrimonio').value = m.patrimonio;
    document.getElementById('fSerie').value = m.serie;
    document.getElementById('fFabricante').value = m.fabricante;
    document.getElementById('fAno').value = m.ano;
    document.getElementById('fLocal').value = m.local;
    document.getElementById('fStatus').value = m.status;
    document.getElementById('fOEE').value = m.OEE;
    document.getElementById('fUltManutencao').value = m.ultManutencao;
    document.getElementById('fObs').value = m.obs;
    editando = true;
    document.querySelector('.btn-add').textContent = 'Salvar';
    showToast('Edite os campos e clique em Salvar.');
}

function limparForm() {
    ['fNome', 'fTipo', 'fPatrimonio', 'fSerie', 'fFabricante', 'fAno',
        'fLocal', 'fStatus', 'fOEE', 'fUltManutencao', 'fObs'].forEach(id => {
            document.getElementById(id).value = '';
        });
    editando = false;
    document.querySelector('.btn-add').textContent = 'Adicionar';
}

let toastTimer;
function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
}

carregarMaquinas();