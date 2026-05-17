function limparForm() {
    ['fTipo', 'fModelo', 'fCodigo', 'fFabricante', 'fAssociacao', 'fAno'].forEach(id => {
        document.getElementById(id).value = '';
    });
    editando = false;
    document.querySelector('.btn-adicionar').textContent = 'Adicionar';
}


let pecas = [
    { tipo: 'Peça', modelo: 'Modelo 43A', codigo: '472819428', fabricante: 'Fabricante fictício', associacao: 'Maquina B3', ano: '2021' },
    { tipo: 'Peça', modelo: 'Modelo 43A', codigo: '472819428', fabricante: 'Fabricante fictício', associacao: 'Maquina B3', ano: '2021' },
    { tipo: 'Peça', modelo: 'Modelo 43A', codigo: '472819428', fabricante: 'Fabricante fictício', associacao: 'Maquina B3', ano: '2021' },
    { tipo: 'Peça', modelo: 'Modelo 43A', codigo: '472819428', fabricante: 'Fabricante fictício', associacao: 'Maquina B3', ano: '2021' },
    { tipo: 'Peça', modelo: 'Modelo 43A', codigo: '472819428', fabricante: 'Fabricante fictício', associacao: 'Maquina B3', ano: '2021' },
    { tipo: 'Peça', modelo: 'Modelo 43A', codigo: '472819428', fabricante: 'Fabricante fictício', associacao: 'Maquina B3', ano: '2021' },
    { tipo: 'Peça', modelo: 'Modelo 43A', codigo: '472819428', fabricante: 'Fabricante fictício', associacao: 'Maquina B3', ano: '2021' },
    { tipo: 'Peça', modelo: 'Modelo 43A', codigo: '472819428', fabricante: 'Fabricante fictício', associacao: 'Maquina B3', ano: '2021' },
    { tipo: 'Peça', modelo: 'Modelo 43A', codigo: '472819428', fabricante: 'Fabricante fictício', associacao: 'Maquina B3', ano: '2021' },
];
let selectedIndex = -1;
let editando = false;

function toggleFiltro() {
    const panel = document.getElementById('filterPanel');
    const btn = document.querySelector('.btn-filter');
    panel.classList.toggle('open');
    btn.classList.toggle('active');
}

function limparFiltro() {
    ['filtTipo', 'filtModelo', 'filtFabricante', 'filtAssociacao', 'filtAno'].forEach(id => {
        document.getElementById(id).value = '';
    });
    renderTabela();
}

function getFiltrados() {
    const tipo = document.getElementById('filtTipo')?.value.toLowerCase() || '';
    const modelo = document.getElementById('filtModelo')?.value.toLowerCase() || '';
    const fabricante = document.getElementById('filtFabricante')?.value.toLowerCase() || '';
    const associacao = document.getElementById('filtAssociacao')?.value.toLowerCase() || '';
    const ano = document.getElementById('filtAno')?.value || '';

    return pecas.filter(p => {
        if (tipo && !p.tipo.toLowerCase().includes(tipo)) return false;
        if (modelo && !p.modelo.toLowerCase().includes(modelo)) return false;
        if (fabricante && !p.fabricante.toLowerCase().includes(fabricante)) return false;
        if (associacao && !p.associacao.toLowerCase().includes(associacao)) return false;
        if (ano && p.ano !== ano) return false;
        return true;
    });
}


function renderTabela() {
    const tbody = document.getElementById('tbody');
    const filtrados = getFiltrados();
    tbody.innerHTML = '';

    let countEl = document.getElementById('countLabel');
    if (!countEl) {
        countEl = document.createElement('div');
        countEl.id = 'countLabel';
        countEl.className = 'count-label';
        document.querySelector('#table-container').before(countEl);
    }
    countEl.innerHTML = `Exibindo <span>${filtrados.length}</span> de <span>${pecas.length}</span> registros`;

    filtrados.forEach((p, i) => {
        const realIndex = pecas.indexOf(p);
        const tr = document.createElement('tr');
        if (realIndex === selectedIndex) tr.classList.add('selected');
        tr.innerHTML = `
        <td>${i + 1}</td>
        <td><span class="badge">${p.tipo}</span></td>
        <td>${p.modelo}</td>
        <td style="font-family:'IBM Plex Mono',monospace;font-size:12px">${p.codigo}</td>
        <td>${p.fabricante}</td>
        <td>${p.associacao}</td>`;
        tr.onclick = () => { selectedIndex = realIndex; renderTabela(); };
        tbody.appendChild(tr);
    });
}

function adicionarOuSalvar() {
    const tipo = document.getElementById('fTipo').value;
    const modelo = document.getElementById('fModelo').value.trim();
    const codigo = document.getElementById('fCodigo').value.trim();
    const fabricante = document.getElementById('fFabricante').value.trim();
    const associacao = document.getElementById('fAssociacao').value.trim();
    const ano = document.getElementById('fAno').value;

    if (!tipo || !modelo || !codigo || !fabricante || !associacao) {
        showToast('⚠ Preencha todos os campos obrigatórios.');
        return;
    }

    const peca = { tipo, modelo, codigo, fabricante, associacao, ano };

    if (editando && selectedIndex >= 0) {
        pecas[selectedIndex] = peca;
        editando = false;
        document.querySelector('.btn-adicionar').textContent = 'Adicionar';
        showToast('✓ Peça atualizada com sucesso.');
    } else {
        pecas.push(peca);
        showToast('✓ Peça adicionada com sucesso.');
    }

    limparForm();
    renderTabela();
}

let toastTimer;
function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
}

function deletarSelecionado() {
    if (selectedIndex < 0) { showToast('Selecione uma linha para deletar.'); return; }
    pecas.splice(selectedIndex, 1);
    selectedIndex = -1;
    renderTabela();
    showToast('🗑 Peça deletada.');
}

function alterarSelecionado() {
    if (selectedIndex < 0) { showToast('Selecione uma linha para alterar.'); return; }
    const p = pecas[selectedIndex];
    document.getElementById('fTipo').value = p.tipo;
    document.getElementById('fModelo').value = p.modelo;
    document.getElementById('fCodigo').value = p.codigo;
    document.getElementById('fFabricante').value = p.fabricante;
    document.getElementById('fAssociacao').value = p.associacao;
    document.getElementById('fAno').value = p.ano;
    editando = true;
    document.querySelector('.btn-add').textContent = 'Salvar';
    showToast('Edite os campos e clique em Salvar.');
}



renderTabela();