function limparForm() {
    ['fTipo', 'fModelo', 'fCodigo', 'fFabricante', 'fAssociacao', 'fAno'].forEach(id => {
        document.getElementById(id).value = '';
    });
    editando = false;
    document.querySelector('.btn-add').textContent = 'Adicionar';
}
