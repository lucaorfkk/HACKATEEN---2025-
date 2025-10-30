/* ===== SERVICOS.JS - Funções específicas da página de serviços =====
   Incluir este arquivo APENAS na página servicos.html
   <script src="servicos.js"></script> */

// Variável para controlar o slide atual do carrossel
let slideAtual = 0;
let intervaloCarrossel;

// Função para mudar slide
function mudarSlide(direcao) {
    const slides = document.querySelectorAll('.carrossel-slide');
    const indicadores = document.querySelectorAll('.indicador');
    
    if (!slides.length) return;
    
    // Remover classe ativo do slide atual
    slides[slideAtual].classList.remove('ativo');
    indicadores[slideAtual].classList.remove('ativo');
    
    // Calcular novo índice
    slideAtual = (slideAtual + direcao + slides.length) % slides.length;
    
    // Adicionar classe ativo ao novo slide
    slides[slideAtual].classList.add('ativo');
    indicadores[slideAtual].classList.add('ativo');
    
    // Resetar intervalo automático
    resetarIntervaloCarrossel();
}

// Função para ir direto para um slide específico
function irParaSlide(indice) {
    const slides = document.querySelectorAll('.carrossel-slide');
    const indicadores = document.querySelectorAll('.indicador');
    
    if (!slides.length || indice === slideAtual) return;
    
    // Remover classe ativo do slide atual
    slides[slideAtual].classList.remove('ativo');
    indicadores[slideAtual].classList.remove('ativo');
    
    // Atualizar índice
    slideAtual = indice;
    
    // Adicionar classe ativo ao novo slide
    slides[slideAtual].classList.add('ativo');
    indicadores[slideAtual].classList.add('ativo');
    
    // Resetar intervalo automático
    resetarIntervaloCarrossel();
}

// Função para resetar o intervalo de auto-play
function resetarIntervaloCarrossel() {
    clearInterval(intervaloCarrossel);
    iniciarCarrosselAutomatico();
}

// Função para iniciar carrossel automático
function iniciarCarrosselAutomatico() {
    intervaloCarrossel = setInterval(() => {
        mudarSlide(1);
    }, 5000); // Muda a cada 5 segundos
}

// Inicializar carrossel e acordeão quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    // Iniciar carrossel automático
    if (document.querySelector('.carrossel-container')) {
        iniciarCarrosselAutomatico();
        
        // Pausar carrossel quando mouse estiver sobre ele
        const container = document.querySelector('.carrossel-container');
        if (container) {
            container.addEventListener('mouseenter', () => {
                clearInterval(intervaloCarrossel);
            });
            
            container.addEventListener('mouseleave', () => {
                iniciarCarrosselAutomatico();
            });
        }
    }
    
    // Configurar acordeão (FAQ)
    const itensAcordeao = document.querySelectorAll('.item-acordeao');
    itensAcordeao.forEach(item => {
        const pergunta = item.querySelector('.pergunta-acordeao');
        if (pergunta) {
            pergunta.addEventListener('click', () => {
                // Fechar outros itens
                itensAcordeao.forEach(outroItem => {
                    if (outroItem !== item && outroItem.classList.contains('ativo')) {
                        outroItem.classList.remove('ativo');
                    }
                });
                // Alternar item atual
                item.classList.toggle('ativo');
            });
        }
    });
});