/* ===== ARQUIVO JAVASCRIPT PRINCIPAL - script.js =====
   JavaScript completo com sistema de autenticação */

// ===== FUNÇÃO PARA TOGGLE DO MENU MOBILE =====
function alternarMenuMobile() {
    const menuNavegacao = document.getElementById('menu-navegacao');
    menuNavegacao.classList.toggle('mostrar');
}

// ===== FECHAR MENU MOBILE AO CLICAR EM UM LINK =====
document.addEventListener('DOMContentLoaded', function() {
    const linksNavegacao = document.querySelectorAll('nav a');
    const menuNavegacao = document.getElementById('menu-navegacao');
    
    if (menuNavegacao) {
        linksNavegacao.forEach(link => {
            link.addEventListener('click', function() {
                menuNavegacao.classList.remove('mostrar');
            });
        });
    }

    // Inicializar dashboard
    if (document.querySelector('.conteiner-dashboard')) {
        inicializarDashboard();
    }

    // CONFIGURAR ACORDEÃO (servicos.html)
    const itensAcordeao = document.querySelectorAll('.item-acordeao');
    itensAcordeao.forEach(item => {
        const pergunta = item.querySelector('.pergunta-acordeao');
        if (pergunta) {
            pergunta.addEventListener('click', () => {
                itensAcordeao.forEach(outroItem => {
                    if (outroItem !== item && outroItem.classList.contains('ativo')) {
                        outroItem.classList.remove('ativo');
                    }
                });
                item.classList.toggle('ativo');
            });
        }
    });

    // ANIMAÇÃO DA TIMELINE (sobre.html)
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
        
        itensTimeline.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            if (index % 2 === 0) {
                item.style.transform = 'translateX(-50px)';
            } else {
                item.style.transform = 'translateX(50px)';
            }
        });
        
        window.addEventListener('scroll', verificarTimeline);
        verificarTimeline();
    }

    // ===== INICIALIZAÇÃO DO SISTEMA DE AUTENTICAÇÃO =====
    inicializarAutenticacao();
    
    // Atualizar header com informações do usuário
    atualizarHeaderComUsuario();
});

// ===== ANIMAÇÃO SUAVE AO ROLAR A PÁGINA =====
window.addEventListener('scroll', function() {
    const cabecalho = document.querySelector('.cabecalho');
    
    if (cabecalho) {
        if (window.scrollY > 50) {
            cabecalho.style.backgroundColor = 'rgba(45, 90, 39, 0.95)';
        } else {
            cabecalho.style.backgroundColor = '';
        }
    }
});

// ===== FUNÇÕES DO DASHBOARD (dashboard.html) =====

let dadosDashboard = {
    emissoesTotais: 1247.5,
    metaMensal: 78,
    economia: 89340,
    pontosMonitoramento: 47,
    tendencias: {
        total: -8.3,
        meta: 12,
        economia: -15.7,
        pontos: 100
    }
};

function obterValorBasePorPeriodo(periodo) {
    switch(periodo) {
        case 'hoje':
            return 41.2;
        case 'semana':
            return 287.3;
        case 'mes':
            return 1247.5;
        case 'trimestre':
            return 3892.1;
        case 'ano':
            return 14567.8;
        default:
            return 1247.5;
    }
}

function inicializarDashboard() {
    atualizarUltimaAtualizacao();
    setInterval(atualizarUltimaAtualizacao, 30000);
}

function atualizarDashboard() {
    const periodo = document.getElementById('selecao-periodo').value;
    
    mostrarCarregando();
    
    setTimeout(() => {
        switch(periodo) {
            case 'hoje':
                atualizarEstatisticas(41.2, 15, 2847, 47, {total: -2.1, meta: 8, economia: -12.3, pontos: 100});
                atualizarBarrasProgresso(15, 25, 10);
                break;
            case 'semana':
                atualizarEstatisticas(287.3, 45, 18450, 47, {total: -5.7, meta: 15, economia: -18.2, pontos: 100});
                atualizarBarrasProgresso(45, 35, 20);
                break;
            case 'mes':
                atualizarEstatisticas(1247.5, 78, 89340, 47, {total: -8.3, meta: 12, economia: -15.7, pontos: 100});
                atualizarBarrasProgresso(78, 65, 42);
                break;
            case 'trimestre':
                atualizarEstatisticas(3892.1, 65, 267890, 47, {total: -12.8, meta: 23, economia: -22.1, pontos: 100});
                atualizarBarrasProgresso(85, 65, 48);
                break;
            case 'ano':
                atualizarEstatisticas(14567.8, 42, 1234567, 47, {total: -18.5, meta: 42, economia: -28.9, pontos: 100});
                atualizarBarrasProgresso(92, 78, 42);
                break;
        }
        esconderCarregando();
        atualizarUltimaAtualizacao();
        atualizarUnidades();
    }, 1200);
}

function atualizarEstatisticas(emissoes, meta, economia, pontos, tendencias) {
    animarNumero('emissoes-totais', emissoes);
    animarNumero('meta-mensal', meta, '', '%');
    animarNumero('economia', economia, 'R$ ');
    animarNumero('pontos-monitoramento', pontos);
    
    atualizarTendencia('tendencia-total', tendencias.total, '%');
    atualizarTendencia('tendencia-meta', tendencias.meta, '%');
    atualizarTendencia('tendencia-economia', tendencias.economia, '%');
    atualizarTendencia('tendencia-pontos', tendencias.pontos, '%');
}

function animarNumero(idElemento, valorFinal, prefixo = '', sufixo = '') {
    const elemento = document.getElementById(idElemento);
    if (!elemento) return;
    
    const valorInicial = parseFloat(elemento.textContent.replace(/[^\d.-]/g, '')) || 0;
    const duracao = 1000;
    const tempoInicial = performance.now();
    
    function animar(tempoAtual) {
        const decorrido = tempoAtual - tempoInicial;
        const progresso = Math.min(decorrido / duracao, 1);
        
        const easeOut = 1 - Math.pow(1 - progresso, 3);
        const valorAtual = valorInicial + (valorFinal - valorInicial) * easeOut;
        
        let valorFormatado;
        if (prefixo === 'R$ ') {
            valorFormatado = prefixo + Math.floor(valorAtual).toLocaleString('pt-BR');
        } else if (sufixo === '%') {
            valorFormatado = Math.floor(valorAtual) + sufixo;
        } else {
            valorFormatado = valorAtual.toFixed(1);
        }
        
        elemento.textContent = valorFormatado;
        
        if (progresso < 1) {
            requestAnimationFrame(animar);
        }
    }
    
    requestAnimationFrame(animar);
}

function atualizarTendencia(idElemento, valor, sufixo) {
    const elemento = document.getElementById(idElemento);
    if (!elemento) return;
    
    const elementoPai = elemento.closest('.indicador-tendencia');
    
    elemento.textContent = Math.abs(valor) + sufixo;
    
    elementoPai.className = 'indicador-tendencia';
    if (valor > 0) {
        elementoPai.classList.add('tendencia-alta');
        elementoPai.querySelector('i').className = 'fas fa-arrow-up';
    } else if (valor < 0) {
        elementoPai.classList.add('tendencia-baixa');
        elementoPai.querySelector('i').className = 'fas fa-arrow-down';
    } else {
        elementoPai.classList.add('tendencia-estavel');
        elementoPai.querySelector('i').className = 'fas fa-minus';
    }
}

function atualizarBarrasProgresso(mensal, trimestral, anual) {
    const barraMensal = document.getElementById('barra-mensal');
    const barraTrimestral = document.getElementById('barra-trimestral');
    const barraAnual = document.getElementById('barra-anual');
    
    const progressoMensal = document.getElementById('progresso-mensal');
    const progressoTrimestral = document.getElementById('progresso-trimestral');
    const progressoAnual = document.getElementById('progresso-anual');

    if (barraMensal && barraTrimestral && barraAnual) {
        setTimeout(() => {
            barraMensal.style.width = mensal + '%';
            barraTrimestral.style.width = trimestral + '%';
            barraAnual.style.width = anual + '%';
            
            progressoMensal.textContent = mensal + '%';
            progressoTrimestral.textContent = trimestral + '%';
            progressoAnual.textContent = anual + '%';
        }, 500);
    }

    const textoResumo = document.getElementById('texto-resumo');
    if (textoResumo) {
        if (anual < 30) {
            textoResumo.textContent = 'Atenção! É necessário acelerar as ações para atingir a meta anual de -30%.';
            textoResumo.style.color = 'var(--aviso)';
        } else if (anual < 50) {
            textoResumo.textContent = 'Você está no caminho certo! Continue com as ações atuais.';
            textoResumo.style.color = 'var(--texto-escuro)';
        } else {
            textoResumo.textContent = 'Excelente progresso! Você está superando as expectativas.';
            textoResumo.style.color = 'var(--sucesso)';
        }
    }
}

function atualizarUnidades() {
    const unidade = document.getElementById('selecao-unidade');
    const periodo = document.getElementById('selecao-periodo');
    
    if (!unidade || !periodo) return;
    
    let multiplicador = 1;
    let rotuloUnidade = 'Toneladas CO₂';
    
    switch(unidade.value) {
        case 'kg':
            multiplicador = 1000;
            rotuloUnidade = 'kg CO₂';
            break;
        case 'ton':
            multiplicador = 1;
            rotuloUnidade = 'Toneladas CO₂';
            break;
        case 'mt':
            multiplicador = 0.001;
            rotuloUnidade = 'Mil Toneladas CO₂';
            break;
    }
    
    const valorBase = obterValorBasePorPeriodo(periodo.value);
    const novoValor = valorBase * multiplicador;
    
    animarNumero('emissoes-totais', novoValor);
    
    const rotulos = document.querySelectorAll('.rotulo-estatistica');
    if (rotulos.length > 0) {
        const periodoTexto = {
            'mes': 'Mês',
            'semana': 'Semana',
            'hoje': 'Hoje',
            'trimestre': 'Trimestre',
            'ano': 'Ano'
        };
        rotulos[0].textContent = rotuloUnidade + ` (${periodoTexto[periodo.value] || 'Mês'})`;
    }
}

function exportarRelatorio() {
    mostrarCarregando();
    
    setTimeout(() => {
        esconderCarregando();
        
        const dadosRelatorio = {
            empresa: 'Empresa Demo',
            periodo: document.getElementById('selecao-periodo').value,
            emissoes_totais: document.getElementById('emissoes-totais').textContent,
            meta_progresso: document.getElementById('meta-mensal').textContent,
            economia: document.getElementById('economia').textContent,
            pontos_monitoramento: document.getElementById('pontos-monitoramento').textContent,
            data_geracao: new Date().toLocaleString('pt-BR')
        };
        
        const conteudoRelatorio = `
RELATÓRIO DE EMISSÕES DE CARBONO - Carbon Techo
================================================

Empresa: ${dadosRelatorio.empresa}
Período: ${dadosRelatorio.periodo}
Data de Geração: ${dadosRelatorio.data_geracao}

RESUMO EXECUTIVO
----------------
Emissões Totais: ${dadosRelatorio.emissoes_totais}
Progresso da Meta: ${dadosRelatorio.meta_progresso}
Economia Alcançada: ${dadosRelatorio.economia}
Pontos de Monitoramento: ${dadosRelatorio.pontos_monitoramento}

DISTRIBUIÇÃO POR SETOR
---------------------
• Logística: 40%
• Produção: 35%
• Energia: 25%

RECOMENDAÇÕES
-------------
• Continue otimizando as rotas de logística
• Verifique equipamentos de filtragem da Fábrica A
• Mantenha o cronograma de manutenção dos sensores

---
Relatório gerado automaticamente pelo Carbon Techo
        `;
        
        const blob = new Blob([conteudoRelatorio], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `relatorio_emissoes_${dadosRelatorio.periodo}_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        mostrarNotificacao('Relatório exportado com sucesso!', 'sucesso');
    }, 2000);
}

function mostrarCarregando() {
    const carregando = document.getElementById('carregando');
    if (carregando) {
        carregando.style.display = 'block';
    }
}

function esconderCarregando() {
    const carregando = document.getElementById('carregando');
    if (carregando) {
        carregando.style.display = 'none';
    }
}

function atualizarUltimaAtualizacao() {
    const agora = new Date();
    const stringTempo = agora.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    const elemento = document.getElementById('tempo-atualizacao');
    if (elemento) {
        elemento.textContent = stringTempo;
    }
}

function mostrarNotificacao(mensagem, tipo = 'info') {
    const notificacao = document.createElement('div');
    notificacao.className = `alerta alerta-${tipo}`;
    notificacao.style.position = 'fixed';
    notificacao.style.top = '100px';
    notificacao.style.right = '20px';
    notificacao.style.zIndex = '9999';
    notificacao.style.minWidth = '300px';
    notificacao.style.padding = '1rem';
    notificacao.style.borderRadius = '8px';
    notificacao.style.backgroundColor = tipo === 'sucesso' ? '#d4edda' : tipo === 'aviso' ? '#fff3cd' : '#f8d7da';
    notificacao.style.border = `1px solid ${tipo === 'sucesso' ? '#c3e6cb' : tipo === 'aviso' ? '#ffeaa7' : '#f5c6cb'}`;
    notificacao.innerHTML = `<strong>${mensagem}</strong>`;
    
    document.body.appendChild(notificacao);
    
    setTimeout(() => {
        if (notificacao.parentNode) {
            notificacao.parentNode.removeChild(notificacao);
        }
    }, 3000);
}

function atualizarGraficoSecoes() {
    mostrarNotificacao('Gráfico de setores atualizado', 'sucesso');
}

// Simulação de atualizações em tempo real
setInterval(() => {
    const variacao = (Math.random() - 0.5) * 0.1;
    dadosDashboard.emissoesTotais += variacao;
    
    if (!document.hidden) {
        atualizarUltimaAtualizacao();
    }
}, 30000);

// ===== VALIDAÇÃO DO FORMULÁRIO DE CONTATO (contato.html) =====
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

/* ===== SISTEMA DE AUTENTICAÇÃO ===== */

// Simulação de banco de dados de usuários
let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

// ===== FUNÇÕES DE VALIDAÇÃO =====

// Validar email
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Validar força da senha
function validarForcaSenha(senha) {
    let forca = 0;
    
    if (senha.length >= 6) forca++;
    if (senha.length >= 10) forca++;
    if (/[a-z]/.test(senha) && /[A-Z]/.test(senha)) forca++;
    if (/[0-9]/.test(senha)) forca++;
    if (/[^a-zA-Z0-9]/.test(senha)) forca++;
    
    if (forca <= 2) return 'fraca';
    if (forca <= 4) return 'media';
    return 'forte';
}

// Atualizar indicador de força da senha
function atualizarIndicadorForcaSenha(senha) {
    const indicador = document.querySelector('.indicador-forca-senha');
    const progresso = document.getElementById('progresso-senha');
    const texto = document.getElementById('texto-forca-senha');
    
    if (!indicador || !progresso || !texto) return;
    
    if (senha.length === 0) {
        indicador.style.display = 'none';
        return;
    }
    
    indicador.style.display = 'block';
    const forca = validarForcaSenha(senha);
    
    // Remover classes anteriores
    progresso.className = 'progresso-forca-senha';
    texto.className = 'texto-forca-senha';
    
    // Adicionar nova classe
    progresso.classList.add(forca);
    texto.classList.add(forca);
    
    // Atualizar texto
    const textos = {
        'fraca': 'Senha fraca',
        'media': 'Senha média',
        'forte': 'Senha forte'
    };
    texto.textContent = textos[forca];
}

// ===== FUNÇÕES DE MENSAGEM =====

// Mostrar mensagem de feedback
function mostrarMensagem(mensagem, tipo = 'info') {
    const elemento = document.getElementById('mensagem-feedback');
    if (!elemento) return;
    
    elemento.innerHTML = mensagem;
    elemento.className = 'mensagem-feedback ' + tipo;
    elemento.style.display = 'block';
    
    // Auto-ocultar após 5 segundos
    setTimeout(() => {
        elemento.style.display = 'none';
    }, 5000);
}

// ===== FUNÇÕES DE CADASTRO =====

// Verificar se usuário já existe
function usuarioExiste(email) {
    return usuarios.some(usuario => usuario.email.toLowerCase() === email.toLowerCase());
}

// Processar cadastro
function processarCadastro(event) {
    event.preventDefault();
    
    const nome = document.getElementById('nome-cadastro').value.trim();
    const email = document.getElementById('email-cadastro').value.trim();
    const empresa = document.getElementById('empresa-cadastro').value.trim();
    const senha = document.getElementById('senha-cadastro').value;
    const confirmarSenha = document.getElementById('confirmar-senha').value;
    const aceitarTermos = document.getElementById('aceitar-termos').checked;
    
    const botao = document.querySelector('#formulario-cadastro button[type="submit"]');
    
    // Validações
    if (!nome) {
        mostrarMensagem('Por favor, preencha seu nome completo.', 'erro');
        return;
    }
    
    if (!validarEmail(email)) {
        mostrarMensagem('Por favor, insira um e-mail válido.', 'erro');
        document.getElementById('email-cadastro').classList.add('erro');
        return;
    }
    
    if (senha.length < 6) {
        mostrarMensagem('A senha deve ter no mínimo 6 caracteres.', 'erro');
        document.getElementById('senha-cadastro').classList.add('erro');
        return;
    }
    
    if (senha !== confirmarSenha) {
        mostrarMensagem('As senhas não coincidem.', 'erro');
        document.getElementById('confirmar-senha').classList.add('erro');
        return;
    }
    
    if (!aceitarTermos) {
        mostrarMensagem('Você precisa aceitar os termos de uso.', 'erro');
        return;
    }
    
    // Verificar se usuário já existe
    if (usuarioExiste(email)) {
        mostrarMensagem('Este e-mail já está cadastrado. Faça login ou use outro e-mail.', 'erro');
        document.getElementById('email-cadastro').classList.add('erro');
        return;
    }
    
    // Mostrar carregamento
    botao.classList.add('carregando');
    botao.disabled = true;
    
    // Simular tempo de processamento
    setTimeout(() => {
        // Criar novo usuário
        const novoUsuario = {
            id: Date.now(),
            nome: nome,
            email: email,
            empresa: empresa,
            senha: senha, // Em produção, usar hash!
            dataCadastro: new Date().toISOString()
        };
        
        // Adicionar ao array
        usuarios.push(novoUsuario);
        
        // Salvar no localStorage
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        
        // Mostrar mensagem de sucesso
        mostrarMensagem('Cadastro realizado com sucesso! Redirecionando...', 'sucesso');
        
        // Salvar sessão
        localStorage.setItem('usuarioLogado', JSON.stringify({
            id: novoUsuario.id,
            nome: novoUsuario.nome,
            email: novoUsuario.email,
            empresa: novoUsuario.empresa
        }));
        
        // Redirecionar após 2 segundos
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
    }, 1500);
}

// ===== FUNÇÕES DE LOGIN =====

// Processar login
function processarLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email-login').value.trim();
    const senha = document.getElementById('senha-login').value;
    const lembrar = document.getElementById('lembrar').checked;
    
    const botao = document.querySelector('#formulario-login button[type="submit"]');
    
    // Validações
    if (!validarEmail(email)) {
        mostrarMensagem('Por favor, insira um e-mail válido.', 'erro');
        document.getElementById('email-login').classList.add('erro');
        return;
    }
    
    if (!senha) {
        mostrarMensagem('Por favor, insira sua senha.', 'erro');
        document.getElementById('senha-login').classList.add('erro');
        return;
    }
    
    // Mostrar carregamento
    botao.classList.add('carregando');
    botao.disabled = true;
    
    // Simular tempo de processamento
    setTimeout(() => {
        // Buscar usuário
        const usuario = usuarios.find(u => 
            u.email.toLowerCase() === email.toLowerCase() && u.senha === senha
        );
        
        if (!usuario) {
            // Verificar se o email existe
            const emailExiste = usuarios.some(u => u.email.toLowerCase() === email.toLowerCase());
            
            if (emailExiste) {
                mostrarMensagem('Senha incorreta. Tente novamente.', 'erro');
                document.getElementById('senha-login').classList.add('erro');
            } else {
                mostrarMensagem('Usuário não encontrado. Verifique seu e-mail ou cadastre-se.', 'erro');
                document.getElementById('email-login').classList.add('erro');
            }
            
            botao.classList.remove('carregando');
            botao.disabled = false;
            return;
        }
        
        // Login bem-sucedido
        mostrarMensagem('Login realizado com sucesso! Redirecionando...', 'sucesso');
        
        // Salvar sessão
        const dadosUsuario = {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            empresa: usuario.empresa
        };
        
        if (lembrar) {
            localStorage.setItem('usuarioLogado', JSON.stringify(dadosUsuario));
        } else {
            sessionStorage.setItem('usuarioLogado', JSON.stringify(dadosUsuario));
        }
        
        // Redirecionar após 1.5 segundos
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    }, 1500);
}

// ===== FUNÇÕES DE RECUPERAÇÃO DE SENHA =====

// Abrir modal de recuperação
function abrirRecuperacaoSenha(event) {
    event.preventDefault();
    const modal = document.getElementById('modal-recuperacao');
    if (modal) {
        modal.style.display = 'flex';
    }
}

// Fechar modal de recuperação
function fecharRecuperacaoSenha() {
    const modal = document.getElementById('modal-recuperacao');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Processar recuperação de senha
function processarRecuperacao(event) {
    event.preventDefault();
    
    const email = document.getElementById('email-recuperacao').value.trim();
    
    if (!validarEmail(email)) {
        mostrarMensagem('Por favor, insira um e-mail válido.', 'erro');
        return;
    }
    
    // Verificar se usuário existe
    const usuarioExistente = usuarios.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!usuarioExistente) {
        mostrarMensagem('Não encontramos uma conta com este e-mail.', 'erro');
        return;
    }
    
    // Simular envio de email
    mostrarMensagem('Instruções de recuperação enviadas para seu e-mail!', 'sucesso');
    
    setTimeout(() => {
        fecharRecuperacaoSenha();
    }, 2000);
}

// ===== FUNÇÕES DE LOGIN SOCIAL =====

// Login com redes sociais
function loginSocial(provedor) {
    mostrarMensagem(`Redirecionando para login com ${provedor}...`, 'info');
    
    // Em produção, implementar OAuth real
    setTimeout(() => {
        mostrarMensagem('Funcionalidade em desenvolvimento. Use o login tradicional.', 'info');
    }, 1500);
}

// Cadastro com redes sociais
function cadastroSocial(provedor) {
    mostrarMensagem(`Redirecionando para cadastro com ${provedor}...`, 'info');
    
    // Em produção, implementar OAuth real
    setTimeout(() => {
        mostrarMensagem('Funcionalidade em desenvolvimento. Use o cadastro tradicional.', 'info');
    }, 1500);
}

// ===== FUNÇÕES UTILITÁRIAS =====

// Toggle de visibilidade da senha
function toggleSenhaVisibilidade(idCampo, botao) {
    const campo = document.getElementById(idCampo);
    const icone = botao.querySelector('i');
    
    if (campo.type === 'password') {
        campo.type = 'text';
        icone.classList.remove('fa-eye');
        icone.classList.add('fa-eye-slash');
    } else {
        campo.type = 'password';
        icone.classList.remove('fa-eye-slash');
        icone.classList.add('fa-eye');
    }
}

// Limpar classe de erro ao digitar
function limparErroAoDigitar(idCampo) {
    const campo = document.getElementById(idCampo);
    if (campo) {
        campo.addEventListener('input', function() {
            this.classList.remove('erro');
        });
    }
}

// Verificar se usuário está logado
function verificarSessao() {
    const usuarioLogado = localStorage.getItem('usuarioLogado') || sessionStorage.getItem('usuarioLogado');
    
    if (usuarioLogado) {
        const dados = JSON.parse(usuarioLogado);
        return dados;
    }
    
    return null;
}

// Fazer logout
function fazerLogout() {
    if (confirm('Tem certeza que deseja sair?')) {
        localStorage.removeItem('usuarioLogado');
        sessionStorage.removeItem('usuarioLogado');
        
        // Mostrar mensagem de sucesso
        alert('Logout realizado com sucesso!');
        
        // Redirecionar para home
        window.location.href = 'index.html';
    }
}

// ===== ATUALIZAÇÃO DINÂMICA DO HEADER COM STATUS DE LOGIN =====

function atualizarHeaderComUsuario() {
    const usuario = verificarSessao();
    const nav = document.querySelector('nav ul');
    
    if (!nav) return;
    
    // Encontrar o item de login no menu
    const itensMenu = nav.querySelectorAll('li');
    let itemLogin = null;
    
    itensMenu.forEach(item => {
        const link = item.querySelector('a');
        if (link && link.href.includes('login.html')) {
            itemLogin = item;
        }
    });
    
    if (usuario && itemLogin) {
        // Usuário está logado - substituir "Login" por menu de usuário
        itemLogin.innerHTML = `
            <a href="#" class="link-usuario" onclick="toggleMenuUsuario(event)">
                <i class="fas fa-user-circle"></i> ${usuario.nome.split(' ')[0]}
                <i class="fas fa-chevron-down" style="font-size: 0.8rem; margin-left: 0.3rem;"></i>
            </a>
            <div class="menu-dropdown-usuario" id="menu-usuario" style="display: none;">
                <a href="dashboard.html"><i class="fas fa-chart-bar"></i> Meu Dashboard</a>
                <a href="#" onclick="event.preventDefault(); verPerfil();"><i class="fas fa-user"></i> Meu Perfil</a>
                <a href="#" onclick="event.preventDefault(); fazerLogout();"><i class="fas fa-sign-out-alt"></i> Sair</a>
            </div>
        `;
        
        // Adicionar estilo inline para o menu dropdown (ou adicionar no CSS)
        const style = document.createElement('style');
        style.textContent = `
            .menu-dropdown-usuario {
                position: absolute;
                top: 100%;
                right: 0;
                background: var(--branco);
                border-radius: var(--raio-borda);
                box-shadow: var(--sombra-hover);
                min-width: 200px;
                margin-top: 0.5rem;
                z-index: 1000;
                overflow: hidden;
            }
            
            .menu-dropdown-usuario a {
                display: block;
                padding: 0.75rem 1rem;
                color: var(--texto-escuro) !important;
                text-decoration: none;
                transition: var(--transicao);
                background: transparent !important;
            }
            
            .menu-dropdown-usuario a:hover {
                background: var(--verde-claro) !important;
                color: var(--cor-primaria) !important;
            }
            
            .menu-dropdown-usuario a i {
                margin-right: 0.5rem;
                width: 20px;
                text-align: center;
            }
            
            nav ul li {
                position: relative;
            }
            
            .link-usuario {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
        `;
        
        if (!document.getElementById('estilo-menu-usuario')) {
            style.id = 'estilo-menu-usuario';
            document.head.appendChild(style);
        }
        
    } else if (!usuario && itemLogin) {
        // Usuário não está logado - garantir que mostra "Login"
        const link = itemLogin.querySelector('a');
        if (link && !link.href.includes('login.html')) {
            itemLogin.innerHTML = '<a href="login.html"><i class="fas fa-sign-in-alt"></i> Login</a>';
        }
    }
}

// Toggle do menu dropdown do usuário
function toggleMenuUsuario(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const menu = document.getElementById('menu-usuario');
    if (menu) {
        menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    }
}

// Fechar menu ao clicar fora
document.addEventListener('click', function(event) {
    const menu = document.getElementById('menu-usuario');
    const linkUsuario = document.querySelector('.link-usuario');
    
    if (menu && linkUsuario) {
        if (!linkUsuario.contains(event.target) && !menu.contains(event.target)) {
            menu.style.display = 'none';
        }
    }
});

// Função para ver perfil (pode ser implementada depois)
function verPerfil() {
    alert('Funcionalidade de perfil em desenvolvimento.\n\nAqui você poderá editar seus dados pessoais.');
}

// ===== INICIALIZAÇÃO DA AUTENTICAÇÃO =====

function inicializarAutenticacao() {
    // ===== PÁGINA DE CADASTRO =====
    const formularioCadastro = document.getElementById('formulario-cadastro');
    if (formularioCadastro) {
        formularioCadastro.addEventListener('submit', processarCadastro);
        
        // Monitorar força da senha
        const senhaCadastro = document.getElementById('senha-cadastro');
        if (senhaCadastro) {
            senhaCadastro.addEventListener('input', function() {
                atualizarIndicadorForcaSenha(this.value);
            });
        }
        
        // Limpar erros ao digitar
        limparErroAoDigitar('nome-cadastro');
        limparErroAoDigitar('email-cadastro');
        limparErroAoDigitar('senha-cadastro');
        limparErroAoDigitar('confirmar-senha');
    }
    
    // ===== PÁGINA DE LOGIN =====
    const formularioLogin = document.getElementById('formulario-login');
    if (formularioLogin) {
        formularioLogin.addEventListener('submit', processarLogin);
        
        // Limpar erros ao digitar
        limparErroAoDigitar('email-login');
        limparErroAoDigitar('senha-login');
    }
    
    // ===== MODAL DE RECUPERAÇÃO =====
    const formularioRecuperacao = document.getElementById('formulario-recuperacao');
    if (formularioRecuperacao) {
        formularioRecuperacao.addEventListener('submit', processarRecuperacao);
    }
    
    // Fechar modal ao clicar fora
    const modalOverlay = document.getElementById('modal-recuperacao');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === this) {
                fecharRecuperacaoSenha();
            }
        });
    }
    
    // ===== PROTEÇÃO DE PÁGINAS =====
    // Verificar se está em página protegida (dashboard)
    const paginaProtegida = window.location.pathname.includes('dashboard.html');
    
    if (paginaProtegida) {
        const usuario = verificarSessao();
        
        if (!usuario) {
            // Redirecionar para login se não estiver logado
            window.location.href = 'login.html';
        } else {
            // Atualizar nome do usuário no dashboard (se houver elemento)
            const elementoNome = document.querySelector('.nome-usuario');
            if (elementoNome) {
                elementoNome.textContent = usuario.nome;
            }
        }
    }
    
    // ===== MOSTRAR AVISO SE JÁ ESTIVER LOGADO =====
    const paginaAuth = window.location.pathname.includes('login.html') || 
                       window.location.pathname.includes('cadastro.html');
    
    if (paginaAuth) {
        const usuario = verificarSessao();
        if (usuario) {
            // Mostrar mensagem informativa
            setTimeout(() => {
                const mensagem = `Você já está logado como ${usuario.nome}. ` +
                                `<a href="dashboard.html" style="color: var(--cor-destaque); text-decoration: underline;">Ir para Dashboard</a> ou ` +
                                `<a href="#" onclick="fazerLogout(); return false;" style="color: var(--cor-destaque); text-decoration: underline;">Fazer Logout</a>`;
                
                const elemento = document.getElementById('mensagem-feedback');
                if (elemento) {
                    elemento.innerHTML = mensagem;
                    elemento.className = 'mensagem-feedback info';
                    elemento.style.display = 'block';
                }
            }, 500);
        }
    }
}

// ===== DADOS DE DEMONSTRAÇÃO =====
// Adicionar alguns usuários de exemplo (apenas para demonstração)
// REMOVER EM PRODUÇÃO!
if (usuarios.length === 0) {
    usuarios = [
        {
            id: 1,
            nome: 'Usuário Demo',
            email: 'demo@carbontecho.com',
            empresa: 'Carbon Techo',
            senha: 'demo123',
            dataCadastro: new Date().toISOString()
        }
    ];
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
}