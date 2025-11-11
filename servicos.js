class CarouselNovo {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    
    this.track = this.container.querySelector('.carousel-track');
    this.slides = this.container.querySelectorAll('.carousel-slide-novo');
    this.dots = this.container.querySelectorAll('.carousel-dot');
    this.prevBtn = this.container.querySelector('.carousel-prev');
    this.nextBtn = this.container.querySelector('.carousel-next');
    
    this.currentIndex = 0;
    this.isAnimating = false;
    this.autoplayInterval = null;
    this.autoplayDelay = 5000;
    
    this.init();
  }
  
  init() {
    if (this.slides.length === 0) return;
    
    // Event listeners para botões
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.prev());
    }
    
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.next());
    }
    
    // Event listeners para dots
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToSlide(index));
    });
    
    // Pausar autoplay ao passar o mouse
    this.container.addEventListener('mouseenter', () => this.stopAutoplay());
    this.container.addEventListener('mouseleave', () => this.startAutoplay());
    
    // Suporte para touch/swipe em mobile
    this.setupTouchEvents();
    
    // Iniciar autoplay
    this.startAutoplay();
    
    // Mostrar primeiro slide
    this.updateCarousel();
  }
  
  setupTouchEvents() {
    let touchStartX = 0;
    let touchEndX = 0;
    
    this.container.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    this.container.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe(touchStartX, touchEndX);
    }, { passive: true });
  }
  
  handleSwipe(startX, endX) {
    const swipeThreshold = 50;
    const diff = startX - endX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        this.next();
      } else {
        this.prev();
      }
    }
  }
  
  next() {
    if (this.isAnimating) return;
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.updateCarousel();
    this.resetAutoplay();
  }
  
  prev() {
    if (this.isAnimating) return;
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.updateCarousel();
    this.resetAutoplay();
  }
  
  goToSlide(index) {
    if (this.isAnimating || index === this.currentIndex) return;
    this.currentIndex = index;
    this.updateCarousel();
    this.resetAutoplay();
  }
  
  updateCarousel() {
    this.isAnimating = true;
    
    // Atualizar posição do track
    const offset = -this.currentIndex * 100;
    this.track.style.transform = `translateX(${offset}%)`;
    
    // Atualizar dots
    this.dots.forEach((dot, index) => {
      if (index === this.currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
    
    // Liberar animação após transição
    setTimeout(() => {
      this.isAnimating = false;
    }, 600);
  }
  
  startAutoplay() {
    this.stopAutoplay();
    this.autoplayInterval = setInterval(() => {
      this.next();
    }, this.autoplayDelay);
  }
  
  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }
  
  resetAutoplay() {
    this.stopAutoplay();
    this.startAutoplay();
  }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
  // Inicializar carrossel
  const carousel = new CarouselNovo('carousel-servicos');
  
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