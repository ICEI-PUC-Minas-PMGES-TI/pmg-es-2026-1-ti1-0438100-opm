const API_URL = "http://localhost:3000";

async function enviarCadastro() {
    // --- Coleta de valores ---
    const nome      = document.getElementById("nome").value.trim();
    const sobrenome = document.getElementById("sobrenome").value.trim();
    const login     = document.getElementById("login").value.trim();
    const email     = document.getElementById("email").value.trim();
    const senha     = document.getElementById("senha").value;
    const confirmar = document.getElementById("confirma-senha").value;

    // --- Validações ---
    if (nome === "" && sobrenome === "") {
        alert("Os campos nome e sobrenome estão em branco!"); return;
    }
    if (nome === "") {
        alert("O campo nome está em branco!"); return;
    }
    if (sobrenome === "") {
        alert("O campo sobrenome está em branco!"); return;
    }
    if (login === "") {
        alert("O campo login está em branco!"); return;
    }
    if (email === "") {
        alert("O campo e-mail está em branco!"); return;
    }
    if (senha === "" || confirmar === "") {
        alert("Campo de senha vazio."); return;
    }
    if (senha !== confirmar) {
        alert("As senhas estão diferentes!"); return;
    }
    if (senha.length < 8) {
        alert("A senha deve ter pelo menos 8 caracteres!"); return;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(senha)) {
        alert("A senha deve conter pelo menos um caractere especial (!@#$...)"); return;
    }

    // --- Verifica se o login já existe ---
    try {
        const checkRes = await fetch(`${API_URL}/usuarios?login=${login}`);
        const existentes = await checkRes.json();
        if (existentes.length > 0) {
            alert(`O login "${login}" já está em uso. Escolha outro.`);
            return;
        }
    } catch (erro) {
        alert("Não foi possível conectar ao servidor. Verifique se o json-server está rodando.");
        console.error("Erro ao verificar login:", erro);
        return;
    }

    // --- Monta o objeto exatamente com a estrutura de "usuarios" no db.json ---
    const novoUsuario = {
        login: login,
        senha: senha,
        nome: `${nome} ${sobrenome}`,
        email: email
    };

    // --- Envia o cadastro (POST) ---
    const botao = document.getElementById("botao-cadastrar");
    botao.disabled = true;
    botao.textContent = "Cadastrando...";

    try {
        const res = await fetch(`${API_URL}/usuarios`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(novoUsuario)
        });

        if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);

        // Limpa o formulário
        document.getElementById("nome").value = "";
        document.getElementById("sobrenome").value = "";
        document.getElementById("login").value = "";
        document.getElementById("email").value = "";
        document.getElementById("senha").value = "";
        document.getElementById("confirma-senha").value = "";

        alert("Cadastro realizado com sucesso!");

    } catch (erro) {
        alert("Erro ao cadastrar. Verifique se o json-server está rodando em localhost:3000.");
        console.error("Erro no cadastro:", erro);
    } finally {
        botao.disabled = false;
        botao.textContent = "Cadastrar";
    }
}