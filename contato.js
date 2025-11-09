document.addEventListener('DOMContentLoaded', function() {
    const formularioContato = document.getElementById('formulario-contato');
    
    if (formularioContato) {
        formularioContato.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const camposObrigatorios = this.querySelectorAll('[required]');
            let valido = true;
            
            camposObrigatorios.forEach(campo => {
                if (!campo.value.trim()) {
                    campo.classList.add('campo-invalido');
                    valido = false;
                } else {
                    campo.classList.remove('campo-invalido');
                }
            });
            
            const email = document.getElementById('email');
            if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
                email.classList.add('campo-invalido');
                valido = false;
            }
            
            if (valido) {
                alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
                formularioContato.reset();
            } else {
                alert('Por favor, preencha todos os campos obrigatórios corretamente.');
            }
        });
        
        const campos = formularioContato.querySelectorAll('input, textarea, select');
        campos.forEach(campo => {
            campo.addEventListener('blur', function() {
                if (this.hasAttribute('required') && !this.value.trim()) {
                    this.classList.add('campo-invalido');
                } else {
                    this.classList.remove('campo-invalido');
                }
                
                if (this.type === 'email' && this.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value)) {
                    this.classList.add('campo-invalido');
                }
            });
        });
    }
});