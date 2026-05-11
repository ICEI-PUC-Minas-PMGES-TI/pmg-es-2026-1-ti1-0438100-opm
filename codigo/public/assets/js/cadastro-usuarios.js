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
        const cargo = document.getElementById("cargo").value.trim();
        if (cargo === "") {
            alert("O campo cargo está em branco!");
        }
        const senha = document.getElementById("senha").value;
        const confirmar = document.getElementById("confirma-senha").value;
        if (senha === "" || confirmar === "") {
            alert("Campo de senha vazio.");
        } else if (senha !== confirmar) {
            alert("As senhas estão diferentes!");
        }
}