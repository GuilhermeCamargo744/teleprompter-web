// Elementos do DOM
const textInput = document.getElementById('textInput');
const prompterContent = document.getElementById('prompterContent');
const prompterScreen = document.getElementById('prompterScreen');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const speedSlider = document.getElementById('speedSlider');
const speedValue = document.getElementById('speedValue');
const fontSizeSlider = document.getElementById('fontSizeSlider');
const fontSizeValue = document.getElementById('fontSizeValue');
const countdownOverlay = document.getElementById('countdownOverlay');
const countdownNumber = document.getElementById('countdownNumber');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const fullscreenIcon = document.getElementById('fullscreenIcon');
const fullscreenText = document.getElementById('fullscreenText');

// Variáveis de controle
let isRunning = false;
let scrollInterval = null;
let currentSpeed = 5;
let scrollPosition = 0;

// Inicialização
speedSlider.addEventListener('input', (e) => {
    currentSpeed = parseInt(e.target.value);
    speedValue.textContent = currentSpeed;
    if (isRunning) {
        restartScroll();
    }
});

fontSizeSlider.addEventListener('input', (e) => {
    const size = parseInt(e.target.value);
    fontSizeValue.textContent = size + 'px';
    prompterContent.style.fontSize = size + 'px';
});

// Função para iniciar o contador regressivo
function startCountdown() {
    const text = textInput.value.trim();
    
    if (!text) {
        alert('Por favor, digite ou cole um texto antes de iniciar.');
        return;
    }

    // Para o scroll completamente se estiver rodando
    if (isRunning) {
        pauseScroll();
    }
    
    // Limpa qualquer intervalo ativo
    if (scrollInterval) {
        clearInterval(scrollInterval);
        scrollInterval = null;
    }
    
    // Garante que está parado
    isRunning = false;
    scrollPosition = 0;
    
    // Remove o overlay do contador se estiver visível
    countdownOverlay.classList.remove('show');
    
    // Atualiza o conteúdo do teleprompter
    prompterContent.textContent = text;
    
    // Garante que o scroll está no topo e parado
    requestAnimationFrame(() => {
        prompterScreen.scrollTop = 0;
        scrollPosition = 0;
        
        // Aguarda um frame adicional para garantir no iPad
        requestAnimationFrame(() => {
            prompterScreen.scrollTop = 0;
            scrollPosition = 0;
            isRunning = false;
            
            // Desabilita o botão iniciar
            if (startBtn) {
                startBtn.disabled = true;
            }
            
            // Mostra o overlay do contador
            countdownOverlay.classList.add('show');
            
            // Pequeno delay para garantir que o overlay está visível no iPad
            setTimeout(() => {
                // Inicia o contador regressivo
                let count = 5;
                countdownNumber.textContent = count;
                
                const countdownInterval = setInterval(() => {
                    count--;
                    
                    if (count > 0) {
                        countdownNumber.textContent = count;
                    } else {
                        // Quando o contador chega a zero, esconde o overlay e inicia o scroll
                        clearInterval(countdownInterval);
                        countdownOverlay.classList.remove('show');
                        
                        // Pequeno delay antes de iniciar o scroll para garantir que o overlay foi removido
                        setTimeout(() => {
                            startActualScroll();
                        }, 200);
                    }
                }, 1000); // Atualiza a cada 1 segundo
            }, 100);
        });
    });
}

// Função para iniciar o scroll (chamada após o contador)
function startActualScroll() {
    // Garante que não há intervalos rodando
    if (scrollInterval) {
        clearInterval(scrollInterval);
        scrollInterval = null;
    }
    
    // Garante que está parado antes de iniciar
    isRunning = false;
    scrollPosition = 0;
    
    // Usa requestAnimationFrame para garantir que o scroll seja aplicado após o conteúdo ser renderizado
    requestAnimationFrame(() => {
        prompterScreen.scrollTop = 0;
        scrollPosition = 0;
        
        // Pequeno delay para garantir que o scroll está no topo (especialmente no iPad)
        setTimeout(() => {
            prompterScreen.scrollTop = 0;
            scrollPosition = 0;
            
            // Garante novamente que não há intervalos rodando
            if (scrollInterval) {
                clearInterval(scrollInterval);
                scrollInterval = null;
            }
            
            // Inicia o scroll automático
            isRunning = true;
            if (pauseBtn) {
                pauseBtn.disabled = false;
            }
            
            scrollInterval = setInterval(() => {
                scrollPosition += currentSpeed;
                prompterScreen.scrollTop = scrollPosition;
                
                // Para quando chegar ao final
                if (scrollPosition >= prompterScreen.scrollHeight - prompterScreen.clientHeight) {
                    pauseScroll();
                }
            }, 50); // Atualiza a cada 50ms para scroll suave
        }, 150); // Aumentado para 150ms para dar mais tempo no iPad
    });
}

// Função para iniciar o scroll (mantida para compatibilidade, mas agora chama o contador)
function startScroll() {
    startCountdown();
}

// Função para pausar o scroll
function pauseScroll() {
    // Limpa qualquer intervalo ativo
    if (scrollInterval) {
        clearInterval(scrollInterval);
        scrollInterval = null;
    }
    
    // Atualiza o estado
    isRunning = false;
    
    // Atualiza os botões
    if (startBtn) {
        startBtn.disabled = false;
    }
    if (pauseBtn) {
        pauseBtn.disabled = true;
    }
}

// Função para resetar
function resetScroll(keepText = false) {
    pauseScroll();
    scrollPosition = 0;
    countdownOverlay.classList.remove('show');
    requestAnimationFrame(() => {
        prompterScreen.scrollTop = 0;
        setTimeout(() => {
            prompterScreen.scrollTop = 0;
        }, 50);
    });
    if (!keepText) {
        prompterContent.textContent = 'Digite ou cole o texto na área acima e clique em "Iniciar" para começar.';
    }
}

// Função para reiniciar o scroll (quando a velocidade muda)
function restartScroll() {
    if (isRunning) {
        pauseScroll();
        startScroll();
        // Restaura a posição atual
        prompterScreen.scrollTop = scrollPosition;
    }
}

// Event listeners dos botões
startBtn.addEventListener('click', startScroll);
pauseBtn.addEventListener('click', pauseScroll);
resetBtn.addEventListener('click', resetScroll);

// Atalhos de teclado
document.addEventListener('keydown', (e) => {
    // Espaço para pausar/continuar
    if (e.code === 'Space' && !e.target.matches('textarea')) {
        e.preventDefault();
        if (isRunning) {
            pauseScroll();
        } else if (textInput.value.trim()) {
            startScroll();
        }
    }
    
    // Escape para resetar
    if (e.code === 'Escape' && !e.target.matches('textarea')) {
        resetScroll();
    }
});

// Permite ajustar velocidade com setas quando o teleprompter está rodando
document.addEventListener('keydown', (e) => {
    if (!e.target.matches('textarea') && isRunning) {
        if (e.code === 'ArrowUp') {
            e.preventDefault();
            if (currentSpeed < 10) {
                speedSlider.value = currentSpeed + 1;
                speedSlider.dispatchEvent(new Event('input'));
            }
        } else if (e.code === 'ArrowDown') {
            e.preventDefault();
            if (currentSpeed > 1) {
                speedSlider.value = currentSpeed - 1;
                speedSlider.dispatchEvent(new Event('input'));
            }
        }
    }
});

// Salva o texto no localStorage
textInput.addEventListener('input', () => {
    localStorage.setItem('teleprompterText', textInput.value);
});

// Função para iniciar automaticamente após entrar em tela cheia
function startAfterFullscreen() {
    const text = textInput.value.trim();
    
    if (text) {
        // Para o scroll completamente se estiver rodando
        if (isRunning) {
            pauseScroll();
        }
        
        // Limpa qualquer intervalo que possa estar rodando
        if (scrollInterval) {
            clearInterval(scrollInterval);
            scrollInterval = null;
        }
        
        // Reseta o scroll primeiro, mas mantém o texto
        resetScroll(true);
        
        // Garante que o scroll está parado e no topo
        scrollPosition = 0;
        prompterScreen.scrollTop = 0;
        isRunning = false;
        
        // Aguarda mais tempo no iPad/iOS para garantir que a tela cheia foi aplicada completamente
        setTimeout(() => {
            // Garante novamente que está parado
            if (scrollInterval) {
                clearInterval(scrollInterval);
                scrollInterval = null;
            }
            scrollPosition = 0;
            prompterScreen.scrollTop = 0;
            isRunning = false;
            
            // Inicia o contador regressivo e depois o scroll
            startCountdown();
        }, 500); // Aumentado para 500ms para dar mais tempo no iPad
    }
}

// Função para alternar tela cheia
function toggleFullscreen() {
    if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement && !document.body.classList.contains('fullscreen-mode')) {
        // Entrar em tela cheia - marca para iniciar automaticamente
        shouldAutoStartOnFullscreen = true;
        
        if (prompterScreen.requestFullscreen) {
            prompterScreen.requestFullscreen().catch(() => {
                // Se falhar, tenta o modo customizado
                document.body.classList.add('fullscreen-mode');
                fullscreenIcon.textContent = '⛶';
                fullscreenText.textContent = 'Sair da Tela Cheia';
                startAfterFullscreen();
            });
        } else if (prompterScreen.webkitRequestFullscreen) {
            prompterScreen.webkitRequestFullscreen();
            startAfterFullscreen();
        } else if (prompterScreen.mozRequestFullScreen) {
            prompterScreen.mozRequestFullScreen();
            startAfterFullscreen();
        } else if (prompterScreen.msRequestFullscreen) {
            prompterScreen.msRequestFullscreen();
            startAfterFullscreen();
        } else {
            // Fallback: usar modo tela cheia customizado
            document.body.classList.add('fullscreen-mode');
            fullscreenIcon.textContent = '⛶';
            fullscreenText.textContent = 'Sair da Tela Cheia';
            startAfterFullscreen();
        }
    } else {
        // Sair da tela cheia - para o scroll se estiver rodando
        if (isRunning) {
            pauseScroll();
        }
        
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else {
            // Fallback: remover modo tela cheia customizado
            document.body.classList.remove('fullscreen-mode');
            fullscreenIcon.textContent = '⛶';
            fullscreenText.textContent = 'Tela Cheia';
        }
    }
}

// Variável para controlar se deve iniciar automaticamente ao entrar em fullscreen
let shouldAutoStartOnFullscreen = false;

// Atualizar ícone quando entrar/sair do fullscreen
document.addEventListener('fullscreenchange', () => {
    const isEnteringFullscreen = !!document.fullscreenElement;
    updateFullscreenButton();
    
    if (isEnteringFullscreen && shouldAutoStartOnFullscreen) {
        shouldAutoStartOnFullscreen = false;
        startAfterFullscreen();
    } else if (!isEnteringFullscreen) {
        // Ao sair do fullscreen, para o scroll
        if (isRunning) {
            pauseScroll();
        }
    }
});

document.addEventListener('webkitfullscreenchange', () => {
    const isEnteringFullscreen = !!document.webkitFullscreenElement;
    updateFullscreenButton();
    
    if (isEnteringFullscreen && shouldAutoStartOnFullscreen) {
        shouldAutoStartOnFullscreen = false;
        startAfterFullscreen();
    } else if (!isEnteringFullscreen) {
        if (isRunning) {
            pauseScroll();
        }
    }
});

document.addEventListener('mozfullscreenchange', () => {
    const isEnteringFullscreen = !!document.mozFullScreenElement;
    updateFullscreenButton();
    
    if (isEnteringFullscreen && shouldAutoStartOnFullscreen) {
        shouldAutoStartOnFullscreen = false;
        startAfterFullscreen();
    } else if (!isEnteringFullscreen) {
        if (isRunning) {
            pauseScroll();
        }
    }
});

document.addEventListener('MSFullscreenChange', () => {
    const isEnteringFullscreen = !!document.msFullscreenElement;
    updateFullscreenButton();
    
    if (isEnteringFullscreen && shouldAutoStartOnFullscreen) {
        shouldAutoStartOnFullscreen = false;
        startAfterFullscreen();
    } else if (!isEnteringFullscreen) {
        if (isRunning) {
            pauseScroll();
        }
    }
});

function updateFullscreenButton() {
    const isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || document.body.classList.contains('fullscreen-mode'));
    
    if (isFullscreen) {
        fullscreenIcon.textContent = '⛶';
        fullscreenText.textContent = 'Sair da Tela Cheia';
    } else {
        fullscreenIcon.textContent = '⛶';
        fullscreenText.textContent = 'Tela Cheia';
        document.body.classList.remove('fullscreen-mode');
        // Se saiu do fullscreen e está rodando, para o scroll
        if (isRunning) {
            pauseScroll();
        }
    }
}

// Event listener do botão de tela cheia
fullscreenBtn.addEventListener('click', toggleFullscreen);

// Atalho F11 para tela cheia
document.addEventListener('keydown', (e) => {
    if (e.key === 'F11' && !e.target.matches('textarea')) {
        e.preventDefault();
        toggleFullscreen();
    }
});

// Carrega o texto salvo ao carregar a página
window.addEventListener('load', () => {
    const savedText = localStorage.getItem('teleprompterText');
    if (savedText) {
        textInput.value = savedText;
    }
});
