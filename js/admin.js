// js/admin.js

function mostrarSecao(idSecao) {
    // 1. Esconde todas as seções
    const secoes = document.querySelectorAll('.secao');
    secoes.forEach(secao => {
        secao.classList.remove('ativa');
        secao.style.display = 'none';
    });

    // 2. Remove o estado ativo de todos os botões do menu
    const botoesMenu = document.querySelectorAll('.menu-btn');
    botoesMenu.forEach(btn => {
        btn.classList.remove('active');
    });

    // 3. Ativa a seção clicada
    const secaoAlvo = document.getElementById(idSecao);
    if(secaoAlvo) {
        secaoAlvo.style.display = 'block';
        setTimeout(() => secaoAlvo.classList.add('ativa'), 10);
    }

    // 4. Marca o botão atual como ativo (pega o botão que disparou o evento)
    if(event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
}