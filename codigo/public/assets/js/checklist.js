const URL_API = "http://localhost:3000";

// Inicia a aplicação assim que a página carrega
document.addEventListener("DOMContentLoaded", () => {
    iniciarApp();
});

async function iniciarApp() {
    const selectMaquinas = document.getElementById('maquina');
    
    // Injeta a estrutura do Dashboard de Estatísticas antes do formulário
    renderizarEstruturaDashboard();

    // 1. CARREGA AS MÁQUINAS DISPONÍVEIS DA API
    try {
        const response = await fetch(`${URL_API}/maquinas`);
        const maquinas = await response.json();
        
        selectMaquinas.innerHTML = '<option value="">Escolha uma máquina...</option>' + 
            maquinas.map(m => `<option value="${m.nome}" data-tipo="${m.tipo}">${m.nome}</option>`).join('');
    } catch (error) {
        selectMaquinas.innerHTML = '<option>Erro: Servidor Offline</option>';
        console.error("Erro ao conectar ao JSONServer. Verifique se executou o comando correto.", error);
    }

    // 2. ESCUTA A MUDANÇA DE MÁQUINA PARA EXIBIR AS PERGUNTAS ESPECÍFICAS
    selectMaquinas.addEventListener('change', () => {
        const opcaoSelecionada = selectMaquinas.options[selectMaquinas.selectedIndex];
        if (!opcaoSelecionada || !opcaoSelecionada.value) {
            document.getElementById('checklist-itens').innerHTML = '';
            return;
        }

        const tipo = opcaoSelecionada.getAttribute('data-tipo');
        const containerItens = document.getElementById('checklist-itens');
        
        // Banco de perguntas baseado nas imagens estruturais fornecidas
        const bancoPerguntas = {
            "Usinagem": [
                "Máquina limpa e sem cavacos acumulados?",
                "Mesa da máquina limpa?",
                "Todas ferramentas necessárias disponíveis?",
                "Nível de óleo lubrificante OK?",
                "Ferramenta de corte instalada?",
                "Botão de emergência funcionando?",
                "EPI's utilizados?"
            ],
            "Conformação": [
                "Área de prensagem e moldes limpos?",
                "Nível de fluido hidráulico dentro do padrão?",
                "Proteções de segurança e grades travadas?",
                "Ferramental fixado e alinhado corretamente?",
                "Dispositivos de acionamento bimanual operando?",
                "EPI's específicos utilizados?"
            ]
        };

        const listaAtiva = bancoPerguntas[tipo] || ["Verificação visual e de segurança padrão realizada?"];
        
        containerItens.innerHTML = listaAtiva.map(pergunta => `
            <div class="checklist-item">
                <span>${pergunta}</span>
                <div class="checklist-buttons">
                    <button type="button" class="btn-sim" onclick="alternarBotao(this)">OK</button>
                    <button type="button" class="btn-nao" onclick="alternarBotao(this)">NOK</button>
                </div>
            </div>
        `).join('');
    });

    // 3. EVENTO DO BOTÃO SALVAR (CREATE)
    document.getElementById('btn-salvar').onclick = async () => {
        if (!selectMaquinas.value) {
            alert("Por favor, selecione uma máquina antes de enviar!");
            return;
        }

        const itensChecklist = document.querySelectorAll('.checklist-item');
        let todosRespondidos = true;
        
        const respostas = Array.from(itensChecklist).map(item => {
            const botaoSelecionado = item.querySelector('.selecionado');
            if (!botaoSelecionado) todosRespondidos = false;
            
            return {
                pergunta: item.querySelector('span').textContent,
                status: botaoSelecionado ? botaoSelecionado.textContent : "Pendente"
            };
        });

        if (!todosRespondidos) {
            alert("Por favor, responda todos os itens do checklist antes de salvar!");
            return;
        }

        const payload = {
            maquina: selectMaquinas.value,
            data: new Date().toLocaleString('pt-BR'),
            itens: respostas
        };

        try {
            const response = await fetch(`${URL_API}/checklists`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const feedback = document.getElementById('feedback');
                feedback.innerHTML = "<span style='color:var(--success)'>✔ CHECKLIST ENVIADO COM SUCESSO!</span>";
                setTimeout(() => location.reload(), 1500);
            }
        } catch (error) {
            alert("Erro ao salvar os dados no servidor.");
        }
    };

    // 4. ATUALIZA O DASHBOARD E O HISTÓRICO DE RELATÓRIOS (READ & CALCULATE)
    atualizarDadosHistoricoEDashboard();
}

// Cria os blocos de estatísticas antes do container do formulário
function renderizarEstruturaDashboard() {
    const main = document.querySelector('main');
    const dashboardHTML = `
        <section class="estatisticas-container">
            <div class="card-estatistica">
                <h3>Total de Checklists</h3>
                <div id="estatistica-total" class="valor-grande">0</div>
                <div class="barra"><div id="barra-total" class="progresso verde" style="width: 0%"></div></div>
            </div>
            <div class="card-estatistica">
                <h3>Conformidade Geral</h3>
                <div id="estatistica-porcentagem" class="valor-grande">0%</div>
                <div class="barra"><div id="barra-porcentagem" class="progresso amarelo" style="width: 0%"></div></div>
            </div>
        </section>
    `;
    main.insertAdjacentHTML('afterbegin', dashboardHTML);
}

// Processa as informações vindas do banco e faz o cálculo das porcentagens
async function atualizarDadosHistoricoEDashboard() {
    const historicoDiv = document.getElementById('lista-relatorios');
    
    try {
        const response = await fetch(`${URL_API}/checklists`);
        const logs = await response.json();
        
        let totalItensAvaliados = 0;
        let totalItensConformes = 0;

        // Renderiza a lista de cartões históricos
        if (logs.length === 0) {
            historicoDiv.innerHTML = '<p style="color:var(--muted); text-align:center;">Nenhum relatório enviado ainda.</p>';
        } else {
            historicoDiv.innerHTML = logs.map(log => {
                // Contabiliza cada pergunta interna do checklist para gerar as estatísticas
                log.itens.forEach(item => {
                    totalItensAvaliados++;
                    if (item.status === 'OK') totalItensConformes++;
                });

                return `
                    <div class="card-relatorio">
                        <div class="info-relatorio">
                            <strong>${log.maquina}</strong>
                            <span>Data de envio: ${log.data}</span>
                        </div>
                        <button type="button" class="btn-excluir" onclick="removerRelatorio(${log.id})">Excluir</button>
                    </div>
                `;
            }).join('');
        }

        // Cálculos matemáticos das métricas visuais
        const totalChecklists = logs.length;
        const porcentagemConformidade = totalItensAvaliados > 0 
            ? Math.round((totalItensConformes / totalItensAvaliados) * 100) 
            : 0;

        // Atualiza os elementos de texto e as barras de progresso do Dashboard
        document.getElementById('estatistica-total').textContent = totalChecklists;
        document.getElementById('barra-total').style.width = totalChecklists > 0 ? '100%' : '0%';
        
        document.getElementById('estatistica-porcentagem').textContent = `${porcentagemConformidade}%`;
        document.getElementById('barra-porcentagem').style.width = `${porcentagemConformidade}%`;

    } catch (error) {
        historicoDiv.innerHTML = '<p style="color:var(--danger)">Não foi possível carregar as estatísticas e histórico.</p>';
    }
}

// Controla a seleção visual exclusiva entre os botões OK e NOK
window.alternarBotao = (botaoClicado) => {
    const boxBotoes = botaoClicado.parentElement;
    boxBotoes.querySelectorAll('button').forEach(btn => btn.classList.remove('selecionado'));
    botaoClicado.classList.add('selecionado');
};

// Remove um registro do banco (DELETE)
window.removerRelatorio = async (id) => {
    if (confirm("Deseja realmente apagar este relatório permanentemente do histórico?")) {
        try {
            await fetch(`${URL_API}/checklists/${id}`, { method: 'DELETE' });
            location.reload();
        } catch (error) {
            alert("Erro ao tentar deletar o registro.");
        }
    }
};