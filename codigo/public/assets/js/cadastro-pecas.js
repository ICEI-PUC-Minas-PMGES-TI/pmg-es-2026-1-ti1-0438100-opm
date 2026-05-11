function limparForm() {
    ['fTipo', 'fModelo', 'fCodigo', 'fFabricante', 'fAssociacao', 'fAno'].forEach(id => {
        document.getElementById(id).value = '';
    });
    editando = false;
    document.querySelector('.btn-add').textContent = 'Adicionar';
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

function renderTabela() {
    const tbody = document.getElementById('tbody');
    tbody.innerHTML = '';
    pecas.forEach((p, i) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
        <td>${i + 1}</td>
        <td><span class="badge">${p.tipo}</span></td>
        <td>${p.modelo}</td>
        <td style="font-family:'IBM Plex Mono',monospace;font-size:12px">${p.codigo}</td>
        <td>${p.fabricante}</td>
        <td>${p.associacao}</td>`;
        tbody.appendChild(tr);
    });
}

renderTabela();