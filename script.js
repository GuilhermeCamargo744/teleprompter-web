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

    // Atualiza o conteúdo do teleprompter
    prompterContent.textContent = text;
    
    // Reseta a posição de scroll
    scrollPosition = 0;
    prompterScreen.scrollTop = 0;
    
    // Desabilita o botão iniciar
    startBtn.disabled = true;
    
    // Mostra o overlay do contador
    countdownOverlay.classList.add('show');
    
    // Inicia o contador regressivo
    let count = 3;
    countdownNumber.textContent = count;
    
    const countdownInterval = setInterval(() => {
        count--;
        
        if (count > 0) {
            countdownNumber.textContent = count;
        } else {
            // Quando o contador chega a zero, esconde o overlay e inicia o scroll
            clearInterval(countdownInterval);
            countdownOverlay.classList.remove('show');
            startActualScroll();
        }
    }, 1000); // Atualiza a cada 1 segundo
}

// Função para iniciar o scroll (chamada após o contador)
function startActualScroll() {
    // Usa requestAnimationFrame para garantir que o scroll seja aplicado após o conteúdo ser renderizado
    requestAnimationFrame(() => {
        prompterScreen.scrollTop = 0;
        
        // Pequeno delay para garantir que o scroll está no topo
        setTimeout(() => {
            prompterScreen.scrollTop = 0;
            scrollPosition = 0;
            
            // Inicia o scroll automático
            isRunning = true;
            pauseBtn.disabled = false;
            
            scrollInterval = setInterval(() => {
                scrollPosition += currentSpeed;
                prompterScreen.scrollTop = scrollPosition;
                
                // Para quando chegar ao final
                if (scrollPosition >= prompterScreen.scrollHeight - prompterScreen.clientHeight) {
                    pauseScroll();
                }
            }, 50); // Atualiza a cada 50ms para scroll suave
        }, 100);
    });
}

// Função para iniciar o scroll (mantida para compatibilidade, mas agora chama o contador)
function startScroll() {
    startCountdown();
}

// Função para pausar o scroll
function pauseScroll() {
    if (scrollInterval) {
        clearInterval(scrollInterval);
        scrollInterval = null;
    }
    isRunning = false;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
}

// Função para resetar
function resetScroll() {
    pauseScroll();
    scrollPosition = 0;
    countdownOverlay.classList.remove('show');
    requestAnimationFrame(() => {
        prompterScreen.scrollTop = 0;
        setTimeout(() => {
            prompterScreen.scrollTop = 0;
        }, 50);
    });
    prompterContent.textContent = 'Digite ou cole o texto na área acima e clique em "Iniciar" para começar.';
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

// Função para alternar tela cheia
function toggleFullscreen() {
    if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement) {
        // Entrar em tela cheia
        if (prompterScreen.requestFullscreen) {
            prompterScreen.requestFullscreen();
        } else if (prompterScreen.webkitRequestFullscreen) {
            prompterScreen.webkitRequestFullscreen();
        } else if (prompterScreen.mozRequestFullScreen) {
            prompterScreen.mozRequestFullScreen();
        } else if (prompterScreen.msRequestFullscreen) {
            prompterScreen.msRequestFullscreen();
        } else {
            // Fallback: usar modo tela cheia customizado
            document.body.classList.add('fullscreen-mode');
            fullscreenIcon.textContent = '⛶';
            fullscreenText.textContent = 'Sair da Tela Cheia';
        }
    } else {
        // Sair da tela cheia
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

// Atualizar ícone quando entrar/sair do fullscreen
document.addEventListener('fullscreenchange', updateFullscreenButton);
document.addEventListener('webkitfullscreenchange', updateFullscreenButton);
document.addEventListener('mozfullscreenchange', updateFullscreenButton);
document.addEventListener('MSFullscreenChange', updateFullscreenButton);

function updateFullscreenButton() {
    const isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || document.body.classList.contains('fullscreen-mode'));
    
    if (isFullscreen) {
        fullscreenIcon.textContent = '⛶';
        fullscreenText.textContent = 'Sair da Tela Cheia';
    } else {
        fullscreenIcon.textContent = '⛶';
        fullscreenText.textContent = 'Tela Cheia';
        document.body.classList.remove('fullscreen-mode');
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
