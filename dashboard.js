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

// Inicializar dashboard quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.conteiner-dashboard')) {
        inicializarDashboard();
    }
});