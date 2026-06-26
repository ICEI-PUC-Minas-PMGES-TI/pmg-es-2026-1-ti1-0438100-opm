fetch("../../modulos/header/header.html")
    .then(response => response.text())
    .then(data => {

        // Carrega o header
        document.getElementById("header").innerHTML = data;

        // Adiciona o favicon caso não exista
        if (!document.querySelector("link[rel='icon']")) {
            const favicon = document.createElement("link");
            favicon.rel = "icon";
            favicon.type = "image/png";
            favicon.href = "../../assets/images/icon.png";
            document.head.appendChild(favicon);
        }

        // Menu lateral
        const menuBtn = document.getElementById("menuBtn");
        const sidebar = document.getElementById("sidebar");

        menuBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            sidebar.classList.toggle("ativo");
        });

        sidebar.addEventListener("click", (e) => {
            e.stopPropagation();
        });

        document.addEventListener("click", () => {
            sidebar.classList.remove("ativo");
        });

    })
    .catch(error => {
        console.error("Erro ao carregar o header:", error);
    });