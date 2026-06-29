const API_URL = "http://localhost:3000/usuarios";
console.log("login.js carregado");

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("btnLogin").addEventListener("click", async () => {
        const login = document.getElementById("login").value.trim();
        const senha = document.getElementById("senha").value;
        const errorMsg = document.getElementById("loginError");
        errorMsg.style.display = "none";

        try {
            const res = await fetch(API_URL);
            const usuarios = await res.json();
            const usuario = usuarios.find(u => u.login === login && u.senha === senha);

            if (usuario) {
                // Salva id, login E admin para o menu dinâmico funcionar
                sessionStorage.setItem(
                    "usuarioLogado",
                    JSON.stringify({ id: usuario.id, login: usuario.login, admin: usuario.admin })
                );
                window.location.href = "http://localhost:3000/modulos/home-page/home.html";
            } else {
                errorMsg.style.display = "block";
            }
        } catch (err) {
            console.error("Erro ao fazer login:", err);
        }
    });
});