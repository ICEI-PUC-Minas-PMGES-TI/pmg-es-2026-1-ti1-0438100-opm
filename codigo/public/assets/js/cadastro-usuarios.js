const formulario          = document.getElementById('formulario-cadastro');
const campNome            = document.getElementById('nome');
const campSobrenome       = document.getElementById('sobrenome');
const campCargo           = document.getElementById('cargo');
const campSenha           = document.getElementById('senha');
const campConfirmarSenha  = document.getElementById('confirmar-senha');
const boxRequisitos       = document.getElementById('requisitos-senha');
const alertaSenhasDif     = document.getElementById('alerta-senhas-diferentes');
const notificacaoSucesso  = document.getElementById('notificacao-sucesso');

const REGRAS_DE_SENHA = {

    minimoDeCaracteres: {
        elementoNaTela: document.getElementById('requisito-minimo'),
        verificar: senha => senha.length >= 7
    },

    possuiCaractereEspecial: {
        elementoNaTela: document.getElementById('requisito-caractere-especial'),
        verificar: senha => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(senha)
    },
    semEspacos: {
        elementoNaTela: document.getElementById('requisito-sem-espaco'),
        verificar: senha => senha.length > 0 && !/\s/.test(senha)
    },
};

function definirStatusDoCampo(campInput, elementoMensagem, mensagem) {
    if (mensagem) {
        campInput.classList.add('campo__entrada--invalido');
        campInput.classList.remove('campo__entrada--valido');
        elementoMensagem.textContent = mensagem;
    } else {
        campInput.classList.remove('campo__entrada--invalido');
        campInput.classList.add('campo__entrada--valido');
        elementoMensagem.textContent = '';
    }
}

function atualizarIconesDeRequisitos(valorDaSenha) {
    boxRequisitos.classList.add('requisitos-senha--visivel');
    Object.values(REGRAS_DE_SENHA).forEach(({ elementoNaTela, verificar }) => {
        const regraPassou = verificar(valorDaSenha);
        elementoNaTela.classList.toggle('requisitos-senha__item--aprovado', regraPassou);
        elementoNaTela.classList.toggle('requisitos-senha__item--reprovado', valorDaSenha.length > 0 && !regraPassou);

        elementoNaTela.querySelector('.requisitos-senha__icone').textContent = regraPassou ? '✓' : '✕';
    });
}

function senhaAtendeTodosRequisitos(valorDaSenha) {
    return Object.values(REGRAS_DE_SENHA).every(({ verificar }) => verificar(valorDaSenha));
}

function mostrarAlertaSenhasDiferentes() {
    alertaSenhasDif.classList.add('alerta-senhas-diferentes--visivel');
}
function esconderAlertaSenhasDiferentes() {
    alertaSenhasDif.classList.remove('alerta-senhas-diferentes--visivel');
}

campSenha.addEventListener('input', () => {
    atualizarIconesDeRequisitos(campSenha.value);

    const mensagemErroSenha = document.getElementById('erro-senha');

    if (campSenha.value === '') {
        definirStatusDoCampo(campSenha, mensagemErroSenha, '');
        boxRequisitos.classList.remove('requisitos-senha--visivel');
    } else if (!senhaAtendeTodosRequisitos(campSenha.value)) {
        definirStatusDoCampo(campSenha, mensagemErroSenha, 'A senha não atende todos os requisitos.');
    } else {
        definirStatusDoCampo(campSenha, mensagemErroSenha, '');
    }

    if (campConfirmarSenha.value) verificarCoincidenciaDeSenhas();
});

campSenha.addEventListener('focus', () => {
    if (campSenha.value.length > 0) boxRequisitos.classList.add('requisitos-senha--visivel');
});

function verificarCoincidenciaDeSenhas() {
    const mensagemErroConfirmacao = document.getElementById('erro-confirmar-senha');

    if (!campConfirmarSenha.value) {
        definirStatusDoCampo(campConfirmarSenha, mensagemErroConfirmacao, '');
        esconderAlertaSenhasDiferentes();
        return;
    }

    if (campConfirmarSenha.value !== campSenha.value) {
        definirStatusDoCampo(campConfirmarSenha, mensagemErroConfirmacao, '');
        mostrarAlertaSenhasDiferentes();
    } else {
        
        definirStatusDoCampo(campConfirmarSenha, mensagemErroConfirmacao, '');
        esconderAlertaSenhasDiferentes();
    }
}

campConfirmarSenha.addEventListener('input', verificarCoincidenciaDeSenhas);

function alternarVisibilidadeSenha(campInput, botao) {
    if (campInput.type === 'password') {
        campInput.type = 'text';
    } else {
        campInput.type = 'password'; 
        botao.textContent = '👁';    
    }
}

document.getElementById('botao-mostrar-senha').addEventListener('click', () => {
    alternarVisibilidadeSenha(campSenha, document.getElementById('botao-mostrar-senha'));
});

document.getElementById('botao-mostrar-confirmacao').addEventListener('click', () => {
    alternarVisibilidadeSenha(campConfirmarSenha, document.getElementById('botao-mostrar-confirmacao'));
});



function validarCampoObrigatorio(campInput, idMensagemErro, nomeDoCampo) {
    const elementoMensagem = document.getElementById(idMensagemErro);

    if (!campInput.value.trim()) {
        definirStatusDoCampo(campInput, elementoMensagem, `${nomeDoCampo} é obrigatório.`);
        return false; 
    }

    definirStatusDoCampo(campInput, elementoMensagem, '');
    return true; 
}



formulario.addEventListener('submit', evento => {


    evento.preventDefault();

 
    let formularioEstaValido = true;


    formularioEstaValido = validarCampoObrigatorio(campNome,      'erro-nome',      'Nome')      && formularioEstaValido;
    formularioEstaValido = validarCampoObrigatorio(campSobrenome, 'erro-sobrenome', 'Sobrenome') && formularioEstaValido;
    formularioEstaValido = validarCampoObrigatorio(campCargo,     'erro-cargo',     'Cargo')     && formularioEstaValido;

    const mensagemErroSenha = document.getElementById('erro-senha');
    if (!campSenha.value) {
        definirStatusDoCampo(campSenha, mensagemErroSenha, 'A senha é obrigatória.');
        formularioEstaValido = false;
    } else if (!senhaAtendeTodosRequisitos(campSenha.value)) {
        definirStatusDoCampo(campSenha, mensagemErroSenha, 'A senha não atende todos os requisitos.');
        formularioEstaValido = false;
    }


    const mensagemErroConfirmacao = document.getElementById('erro-confirmar-senha');
    if (!campConfirmarSenha.value) {
        definirStatusDoCampo(campConfirmarSenha, mensagemErroConfirmacao, 'Confirme sua senha.');
        formularioEstaValido = false;
    } else if (campConfirmarSenha.value !== campSenha.value) {
  
        mostrarAlertaSenhasDiferentes();
        campConfirmarSenha.classList.add('campo__entrada--invalido');
        formularioEstaValido = false;
    }

    if (!formularioEstaValido) return;


    notificacaoSucesso.classList.add('notificacao-sucesso--visivel');

    setTimeout(() => notificacaoSucesso.classList.remove('notificacao-sucesso--visivel'), 3000);

    formulario.reset();

    [campNome, campSobrenome, campCargo, campSenha, campConfirmarSenha]
        .forEach(campo => campo.classList.remove('campo__entrada--valido', 'campo__entrada--invalido'));

    boxRequisitos.classList.remove('requisitos-senha--visivel');
    esconderAlertaSenhasDiferentes();
});