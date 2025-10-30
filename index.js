/* ===== INDEX.JS - Funções específicas da página inicial =====
   Incluir este arquivo APENAS na página index.html
   <script src="index.js"></script> */

// Variável para controlar o slide atual do carrossel
let slideAtualIndex = 0;
let intervaloCarrosselIndex;

// Função para mudar slide
function mudarSlide(direcao) {
    const slides = document.querySelectorAll('.carrossel-slide');
    const indicadores = document.querySelectorAll('.indicador');
    
    if (!slides.length) return;
    
    // Remover classe ativo do slide atual
    slides[slideAtualIndex].classList.remove('ativo');
    indicadores[slideAtualIndex].classList.remove('ativo');
    
    // Calcular novo índice
    slideAtualIndex = (slideAtualIndex + direcao + slides.length) % slides.length;
    
    // Adicionar classe ativo ao novo slide
    slides[slideAtualIndex].classList.add('ativo');
    indicadores[slideAtualIndex].classList.add('ativo');
    
    // Resetar intervalo automático
    resetarIntervaloCarrossel();
}

// Função para ir direto para um slide específico
function irParaSlide(indice) {
    const slides = document.querySelectorAll('.carrossel-slide');
    const indicadores = document.querySelectorAll('.indicador');
    
    if (!slides.length || indice === slideAtualIndex) return;
    
    // Remover classe ativo do slide atual
    slides[slideAtualIndex].classList.remove('ativo');
    indicadores[slideAtualIndex].classList.remove('ativo');
    
    // Atualizar índice
    slideAtualIndex = indice;
    
    // Adicionar classe ativo ao novo slide
    slides[slideAtualIndex].classList.add('ativo');
    indicadores[slideAtualIndex].classList.add('ativo');
    
    // Resetar intervalo automático
    resetarIntervaloCarrossel();
}

// Função para resetar o intervalo de auto-play
function resetarIntervaloCarrossel() {
    clearInterval(intervaloCarrosselIndex);
    iniciarCarrosselAutomatico();
}

// Função para iniciar carrossel automático
function iniciarCarrosselAutomatico() {
    intervaloCarrosselIndex = setInterval(() => {
        mudarSlide(1);
    }, 5000); // Muda a cada 5 segundos
}

// Inicializar carrossel quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    // Iniciar carrossel automático
    if (document.querySelector('.carrossel-container')) {
        iniciarCarrosselAutomatico();
        
        // Pausar carrossel quando mouse estiver sobre ele
        const container = document.querySelector('.carrossel-container');
        if (container) {
            container.addEventListener('mouseenter', () => {
                clearInterval(intervaloCarrosselIndex);
            });
            
            container.addEventListener('mouseleave', () => {
                iniciarCarrosselAutomatico();
            });
        }
    }
});