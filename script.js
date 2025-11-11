function alternarMenuMobile() {
    const menuNavegacao = document.getElementById('menu-navegacao');
    menuNavegacao.classList.toggle('mostrar');
}

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

    inicializarAutenticacao();
    
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

/* ===== SISTEMA DE AUTENTICAÇÃO ===== */

let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];


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