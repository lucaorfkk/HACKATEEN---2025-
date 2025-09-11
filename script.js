/* ===== ARQUIVO JAVASCRIPT PRINCIPAL - script.js =====
   Este arquivo contém todas as funcionalidades JavaScript do site */

// ===== FUNÇÕES GERAIS =====

/**
 * Alterna a visibilidade do menu mobile
 * @param {string} idMenu - ID do elemento do menu
 */
function alternarMenuMobile(idMenu = 'menu-navegacao') {
    const menu = document.getElementById(idMenu);
    menu.classList.toggle('mostrar');
}

/**
 * Fecha o menu mobile quando um link é clicado
 * @param {string} idMenu - ID do elemento do menu
 */
function configurarFechamentoMenuMobile(idMenu = 'menu-navegacao') {
    const menu = document.getElementById(idMenu);
    const links = document.querySelectorAll('nav a');
    
    links.forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('mostrar');
        });
    });
}

/**
 * Adiciona efeito de transição suave ao rolar a página
 * Modifica a aparência do header quando a página é rolada
 */
function configurarScrollHeader() {
    const header = document.querySelector('.cabecalho');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.backgroundColor = 'rgba(45, 90, 39, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.backgroundColor = '';
            header.style.backdropFilter = '';
        }
    });
}

/**
 * Inicializa todos os tooltips na página
 * Baseado no atributo data-tooltip dos elementos
 */
function inicializarTooltips() {
    const elementosComTooltip = document.querySelectorAll('[data-tooltip]');
    
    elementosComTooltip.forEach(elemento => {
        const texto = elemento.getAttribute('data-tooltip');
        
        elemento.addEventListener('mouseenter', (e) => {
            // Criar tooltip
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = texto;
            document.body.appendChild(tooltip);
            
            // Posicionar tooltip
            const rect = elemento.getBoundingClientRect();
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
            tooltip.style.left = `${rect.left + (rect.width - tooltip.offsetWidth) / 2}px`;
            
            // Guardar referência para remover depois
            elemento._tooltip = tooltip;
        });
        
        elemento.addEventListener('mouseleave', () => {
            if (elemento._tooltip) {
                elemento._tooltip.remove();
                elemento._tooltip = null;
            }
        });
    });
}

// ===== FUNÇÕES DE FORMULÁRIO =====

/**
 * Valida um formulário antes do envio
 * @param {string} idFormulario - ID do formulário a ser validado
 * @returns {boolean} - Retorna true se o formulário é válido
 */
function validarFormulario(idFormulario) {
    const formulario = document.getElementById(idFormulario);
    const campos = formulario.querySelectorAll('input[required], textarea[required], select[required]');
    let valido = true;
    
    campos.forEach(campo => {
        // Remover estilos de erro anteriores
        campo.classList.remove('campo-invalido');
        
        // Verificar se o campo está vazio
        if (!campo.value.trim()) {
            campo.classList.add('campo-invalido');
            valido = false;
            
            // Criar mensagem de erro se não existir
            if (!campo.nextElementSibling || !campo.nextElementSibling.classList.contains('mensagem-erro')) {
                const mensagemErro = document.createElement('span');
                mensagemErro.className = 'mensagem-erro';
                mensagemErro.textContent = 'Este campo é obrigatório';
                campo.parentNode.insertBefore(mensagemErro, campo.nextSibling);
            }
        } else {
            // Remover mensagem de erro se existir
            if (campo.nextElementSibling && campo.nextElementSibling.classList.contains('mensagem-erro')) {
                campo.nextElementSibling.remove();
            }
            
            // Validações específicas por tipo de campo
            if (campo.type === 'email' && !validarEmail(campo.value)) {
                campo.classList.add('campo-invalido');
                valido = false;
                
                const mensagemErro = document.createElement('span');
                mensagemErro.className = 'mensagem-erro';
                mensagemErro.textContent = 'Por favor, insira um email válido';
                campo.parentNode.insertBefore(mensagemErro, campo.nextSibling);
            }
        }
    });
    
    return valido;
}

/**
 * Valida um endereço de email
 * @param {string} email - Email a ser validado
 * @returns {boolean} - Retorna true se o email é válido
 */
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Configura a validação em tempo real para campos de formulário
 * @param {string} idFormulario - ID do formulário a ser configurado
 */
function configurarValidacaoTempoReal(idFormulario) {
    const formulario = document.getElementById(idFormulario);
    const campos = formulario.querySelectorAll('input, textarea, select');
    
    campos.forEach(campo => {
        campo.addEventListener('blur', () => {
            // Validar campo individual quando perde o foco
            if (campo.hasAttribute('required') && !campo.value.trim()) {
                campo.classList.add('campo-invalido');
                
                if (!campo.nextElementSibling || !campo.nextElementSibling.classList.contains('mensagem-erro')) {
                    const mensagemErro = document.createElement('span');
                    mensagemErro.className = 'mensagem-erro';
                    mensagemErro.textContent = 'Este campo é obrigatório';
                    campo.parentNode.insertBefore(mensagemErro, campo.nextSibling);
                }
            } else {
                campo.classList.remove('campo-invalido');
                if (campo.nextElementSibling && campo.nextElementSibling.classList.contains('mensagem-erro')) {
                    campo.nextElementSibling.remove();
                }
            }
            
            // Validação específica para email
            if (campo.type === 'email' && campo.value.trim() && !validarEmail(campo.value)) {
                campo.classList.add('campo-invalido');
                
                if (!campo.nextElementSibling || !campo.nextElementSibling.classList.contains('mensagem-erro')) {
                    const mensagemErro = document.createElement('span');
                    mensagemErro.className = 'mensagem-erro';
                    mensagemErro.textContent = 'Por favor, insira um email válido';
                    campo.parentNode.insertBefore(mensagemErro, campo.nextSibling);
                }
            }
        });
    });
}

// ===== FUNÇÕES DO DASHBOARD =====

/**
 * Simula a atualização de dados do dashboard
 * Em uma implementação real, isso buscaria dados de uma API
 */
function simularAtualizacaoDadosDashboard() {
    console.log('Atualizando dados do dashboard...');
    
    // Em uma implementação real, aqui viria:
    // 1. Chamada para API para buscar dados atualizados
    // 2. Atualização dos elementos do DOM com os novos dados
    // 3. Atualização de gráficos e visualizações
    
    // Simulação de atualização dos cards de resumo
    const cardsResumo = document.querySelectorAll('.card-resumo');
    if (cardsResumo.length) {
        cardsResumo.forEach(card => {
            // Animação sutil para indicar atualização
            card.style.transform = 'scale(1.02)';
            setTimeout(() => {
                card.style.transform = '';
            }, 300);
        });
    }
}

/**
 * Configura os eventos do dashboard
 */
function configurarDashboard() {
    // Configurar seletor de período
    const seletorPeriodo = document.querySelector('.selecao-periodo');
    if (seletorPeriodo) {
        seletorPeriodo.addEventListener('change', function() {
            console.log(`Período selecionado: ${this.value}`);
            simularAtualizacaoDadosDashboard();
        });
    }
    
    // Configurar botão de exportação
    const botaoExportar = document.querySelector('.botao-exportar');
    if (botaoExportar) {
        botaoExportar.addEventListener('click', function() {
            alert('Iniciando exportação de dados...');
            // Em uma implementação real, aqui viria a lógica de exportação
        });
    }
}

// ===== FUNÇÕES DE ANIMAÇÃO =====

/**
 * Animação de contagem para números estatísticos
 * @param {string} seletor - Seletor CSS dos elementos a animar
 * @param {number} duracao - Duração da animação em milissegundos
 */
function animarContagem(seletor, duracao = 2000) {
    const elementos = document.querySelectorAll(seletor);
    
    elementos.forEach(elemento => {
        const valorFinal = parseInt(elemento.textContent);
        let valorInicial = 0;
        const incremento = Math.ceil(valorFinal / (duracao / 16)); // 60fps
        
        const timer = setInterval(() => {
            valorInicial += incremento;
            if (valorInicial >= valorFinal) {
                elemento.textContent = valorFinal.toLocaleString();
                clearInterval(timer);
            } else {
                elemento.textContent = valorInicial.toLocaleString();
            }
        }, 16);
    });
}

/**
 * Observa elementos para animação quando entram na viewport
 * @param {string} seletor - Seletor CSS dos elementos a observar
 */
function configurarAnimacaoScroll(seletor = '.card, .estatistica') {
    const elementos = document.querySelectorAll(seletor);
    
    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('visivel');
                
                // Se for um número estatístico, inicia a animação de contagem
                if (entrada.target.classList.contains('numero-estatistica')) {
                    animarContagem(`#${entrada.target.id}`, 1500);
                }
            }
        });
    }, { threshold: 0.1 });
    
    elementos.forEach(elemento => {
        observador.observe(elemento);
    });
}

// ===== FUNÇÕES DE ACESSIBILIDADE =====

/**
 * Adiciona navegação por teclado para melhor acessibilidade
 */
function melhorarAcessibilidadeTeclado() {
    // Tornar todos os elementos interativos focáveis
    const elementosInterativos = document.querySelectorAll('a, button, input, select, textarea, [tabindex]');
    
    elementosInterativos.forEach(elemento => {
        // Adicionar indicador visual de foco
        elemento.addEventListener('focus', function() {
            this.style.outline = '2px solid var(--cor-secundaria)';
            this.style.outlineOffset = '2px';
        });
        
        elemento.addEventListener('blur', function() {
            this.style.outline = '';
        });
    });
    
    // Adicionar atalhos de teclado
    document.addEventListener('keydown', function(e) {
        // Tecla M - focar no menu principal
        if (e.key === 'm' || e.key === 'M') {
            const menu = document.querySelector('nav');
            if (menu) menu.focus();
        }
        
        // Tecla 1 - ir para o conteúdo principal
        if (e.key === '1') {
            const main = document.querySelector('main');
            if (main) main.focus();
        }
    });
}

/**
 * Adiciona atributos ARIA para melhorar a acessibilidade
 */
function melhorarAcessibilidadeAria() {
    // Menu mobile
    const botaoMenuMobile = document.querySelector('.botao-menu-mobile');
    const menuNavegacao = document.getElementById('menu-navegacao');
    
    if (botaoMenuMobile && menuNavegacao) {
        botaoMenuMobile.setAttribute('aria-expanded', 'false');
        botaoMenuMobile.setAttribute('aria-controls', 'menu-navegacao');
        menuNavegacao.setAttribute('aria-hidden', 'true');
        
        botaoMenuMobile.addEventListener('click', function() {
            const expandido = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !expandido);
            menuNavegacao.setAttribute('aria-hidden', expandido);
        });
    }
    
    // Alertas dinâmicos
    const alertas = document.querySelectorAll('.alerta');
    alertas.forEach(alerta => {
        alerta.setAttribute('role', 'alert');
    });
}

// ===== INICIALIZAÇÃO =====

/**
 * Inicializa todas as funcionalidades quando o DOM estiver carregado
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('CarbonTracker - Inicializando aplicação...');
    
    // Configurar menu mobile
    configurarFechamentoMenuMobile();
    
    // Configurar scroll do header
    configurarScrollHeader();
    
    // Configurar validação de formulários
    const formularios = document.querySelectorAll('form');
    formularios.forEach(formulario => {
        formulario.addEventListener('submit', function(e) {
            if (!validarFormulario(this.id)) {
                e.preventDefault();
            }
        });
        
        configurarValidacaoTempoReal(formulario.id);
    });
    
    // Configurar dashboard se estiver na página
    if (document.querySelector('.dashboard')) {
        configurarDashboard();
    }
    
    // Configurar animações de scroll
    configurarAnimacaoScroll();
    
    // Melhorar acessibilidade
    melhorarAcessibilidadeTeclado();
    melhorarAcessibilidadeAria();
    
    // Inicializar tooltips
    inicializarTooltips();
    
    console.log('CarbonTracker - Aplicação inicializada com sucesso!');
});

// ===== FUNÇÕES DE COOKIES =====

/**
 * Define um cookie
 * @param {string} nome - Nome do cookie
 * @param {string} valor - Valor do cookie
 * @param {number} dias - Dias até expirar
 */
function definirCookie(nome, valor, dias) {
    const data = new Date();
    data.setTime(data.getTime() + (dias * 24 * 60 * 60 * 1000));
    const expira = `expires=${data.toUTCString()}`;
    document.cookie = `${nome}=${valor};${expira};path=/;SameSite=Lax`;
}

/**
 * Obtém o valor de um cookie
 * @param {string} nome - Nome do cookie a ser buscado
 * @returns {string} - Valor do cookie ou string vazia se não encontrado
 */
function obterCookie(nome) {
    const nomeCompleto = `${nome}=`;
    const cookies = document.cookie.split(';');
    
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(nomeCompleto) === 0) {
            return cookie.substring(nomeCompleto.length, cookie.length);
        }
    }
    
    return '';
}

/**
 * Verifica se o usuário aceitou os cookies
 * e exibe o banner se necessário
 */
function gerenciarCookies() {
    if (!obterCookie('aceitouCookies')) {
        // Criar banner de cookies
        const bannerCookies = document.createElement('div');
        bannerCookies.id = 'banner-cookies';
        bannerCookies.innerHTML = `
            <div class="conteudo-banner-cookies">
                <p>Utilizamos cookies para melhorar sua experiência. Ao continuar navegando, você concorda com nossa <a href="#">Política de Privacidade</a>.</p>
                <button id="aceitar-cookies" class="botao botao-primario">Aceitar</button>
            </div>
        `;
        
        // Adicionar estilos
        bannerCookies.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: var(--cor-primaria);
            color: white;
            padding: 1rem;
            z-index: 1000;
            box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
        `;
        
        document.body.appendChild(bannerCookies);
        
        // Configurar botão de aceitar
        document.getElementById('aceitar-cookies').addEventListener('click', function() {
            definirCookie('aceitouCookies', 'true', 365);
            bannerCookies.style.display = 'none';
        });
    }
}

// ===== MANIPULAÇÃO DE DATAS =====

/**
 * Formata uma data para o formato brasileiro
 * @param {Date} data - Data a ser formatada
 * @returns {string} - Data formatada (dd/mm/aaaa)
 */
function formatarData(data) {
    return data.toLocaleDateString('pt-BR');
}

/**
 * Formata uma data e hora para o formato brasileiro
 * @param {Date} data - Data a ser formatada
 * @returns {string} - Data e hora formatada (dd/mm/aaaa às hh:mm)
 */
function formatarDataHora(data) {
    return data.toLocaleString('pt-BR');
}

// Inicializar gerenciamento de cookies quando o DOM carregar
document.addEventListener('DOMContentLoaded', gerenciarCookies);