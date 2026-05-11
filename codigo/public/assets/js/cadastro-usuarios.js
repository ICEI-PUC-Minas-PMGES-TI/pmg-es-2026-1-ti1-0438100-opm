function enviarCadastro(){
        const nome = document.getElementById("nome").value.trim();
        const sobrenome = document.getElementById("sobrenome").value.trim();
        if (nome === "" && sobrenome === "") {
            alert("Os campos nome e sobrenome estão em branco!");
        } else if (nome === "") {
            alert("O campo nome está em branco!");
        } else if (sobrenome === "") {
            alert("O campo sobrenome está em branco!");
        }
}