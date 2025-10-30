/* ===== SOBRE.JS - Funções específicas da página sobre =====
   Incluir este arquivo APENAS na página sobre.html
   <script src="sobre.js"></script> */

// Animação da timeline
document.addEventListener('DOMContentLoaded', function() {
    const itensTimeline = document.querySelectorAll('.item-timeline');
    
    if (itensTimeline.length > 0) {
        function verificarTimeline() {
            const triggerBottom = window.innerHeight * 0.8;
            
            itensTimeline.forEach(item => {
                const itemTop = item.getBoundingClientRect().top;
                
                if (itemTop < triggerBottom) {
                    item.style.opacity = '1';
                    item.style.transform = 'translateX(0)';
                }
            });
        }
        
        // Configurar estado inicial dos itens
        itensTimeline.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            if (index % 2 === 0) {
                item.style.transform = 'translateX(-50px)';
            } else {
                item.style.transform = 'translateX(50px)';
            }
        });
        
        // Adicionar listener de scroll
        window.addEventListener('scroll', verificarTimeline);
        
        // Verificar na carga inicial
        verificarTimeline();
    }
});