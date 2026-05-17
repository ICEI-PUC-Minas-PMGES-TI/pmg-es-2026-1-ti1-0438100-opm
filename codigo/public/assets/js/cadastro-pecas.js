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

function renderTabela() {
    const tbody = document.getElementById('tbody');
    tbody.innerHTML = '';
    pecas.forEach((p, i) => {
        const tr = document.createElement('tr');
        if (i === selectedIndex) tr.classList.add('selected');
        tr.innerHTML = `
        <td>${i + 1}</td>
        <td><span class="badge">${p.tipo}</span></td>
        <td>${p.modelo}</td>
        <td style="font-family:'IBM Plex Mono',monospace;font-size:12px">${p.codigo}</td>
        <td>${p.fabricante}</td>
        <td>${p.associacao}</td>`;
        tr.onclick = () => { selectedIndex = i; renderTabela(); };
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




renderTabela();