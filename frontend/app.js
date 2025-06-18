const API_URL = 'http://127.0.0.1:8000/sessions/';

let minutes = 25;
let seconds = 0;
let timer;
let isRunning = false;
let cycle = 1;
let totalFocusCycles = 0;
let totalFullCycles = 0;

// Elementos DOM
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');
const progressBar = document.getElementById('progress-bar');
const statusEl = document.getElementById('status');
const cycleEl = document.getElementById('cycle');
const totalCyclesEl = document.getElementById('focus-count');      // Ciclos curtos
const fullCycleCountEl = document.getElementById('full-cycle-count'); // Ciclos completos (4/4)
const powerSelect = document.getElementById('power-select');
const fireAttackBtn = document.getElementById('fire-attack');
const attackEffect = document.getElementById('attack-effect');

// Inputs de configuração
const focusInput = document.getElementById('focus-time');
const shortBreakInput = document.getElementById('short-break');
const longBreakInput = document.getElementById('long-break');

// ============ DISPLAY ============
function updateDisplay() {
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
    cycleEl.textContent = `Ciclo: ${cycle}/4`;
    totalCyclesEl.textContent = `Ciclos Curtos Concluídos: ${totalFocusCycles}`;
    fullCycleCountEl.textContent = `Ciclos Completos (4/4): ${totalFullCycles}`;
}

// ============ PROGRESS ============
function updateProgress() {
    // Corrigido para pegar o tempo correto dependendo do status e ciclo
    let totalMinutes;
    if (statusEl.textContent.includes('Foco')) {
        totalMinutes = parseInt(focusInput.value);
    } else if (statusEl.textContent.includes('Pausa Longa')) {
        totalMinutes = parseInt(longBreakInput.value);
    } else {
        totalMinutes = parseInt(shortBreakInput.value);
    }
    const total = totalMinutes * 60;

    const elapsed = total - (minutes * 60 + seconds);
    const percentage = (elapsed / total) * 100;
    progressBar.style.width = `${percentage}%`;
}

// ============ TIMER ============
function startTimer() {
    if (isRunning) return;
    isRunning = true;

    timer = setInterval(() => {
        if (seconds === 0) {
            if (minutes === 0) {
                clearInterval(timer);
                isRunning = false;
                handleSessionEnd();
                return;
            } else {
                minutes--;
                seconds = 59;
            }
        } else {
            seconds--;
        }

        updateDisplay();
        updateProgress();
    }, 1000);
}

function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    minutes = parseInt(focusInput.value);
    seconds = 0;
    statusEl.textContent = 'Modo: Foco';
    cycle = 1;
    totalFocusCycles = 0;
    totalFullCycles = 0;
    updateDisplay();
    updateProgress();
}

// ============ FINAL DA SESSÃO ============
function handleSessionEnd() {
    salvarSessaoNaAPI(true, minutes);

    if (statusEl.textContent.includes('Foco')) {
        totalFocusCycles++;

        cycle++;
        if (cycle > 4) {
            totalFullCycles++;
            cycle = 1;
            minutes = parseInt(longBreakInput.value);
            statusEl.textContent = 'Modo: Pausa Longa';
        } else {
            minutes = parseInt(shortBreakInput.value);
            statusEl.textContent = 'Modo: Pausa Curta';
        }

        executarAtaque('ZAKERU');
    } else {
        minutes = parseInt(focusInput.value);
        statusEl.textContent = 'Modo: Foco';
    }

    seconds = 0;
    updateDisplay();
    updateProgress();
}

// ============ ATAQUE ============
function executarAtaque(poder) {
    const video = document.getElementById('attack-video');
    let startTime = 0;
    let endTime = 0;

    // Definindo os tempos conforme o poder selecionado
    switch (poder.toUpperCase()) {
        case 'ZAKERU':
            startTime = 1;
            endTime = 13;
            break;
        case 'RASHIRUDO':
            startTime = 14;
            endTime = 25;
            break;
        case 'JIKERUDO':
            startTime = 27;
            endTime = 57;
            break;
        case 'BAO ZAKERUGA':
            startTime = 58;
            endTime = 73; // 1:13 é 73 segundos
            break;
        default:
            startTime = 1;
            endTime = 13;
            break;
    }

    // Configura e executa o vídeo
    video.currentTime = startTime;
    video.classList.add('show-attack');
    video.play();

    const checkTime = () => {
        if (video.currentTime >= endTime) {
            video.pause();
            video.classList.remove('show-attack');
            video.removeEventListener('timeupdate', checkTime);
        }
    };

    video.addEventListener('timeupdate', checkTime);
}






// ============ API ============
function salvarSessaoNaAPI(completed = true, duration = 25, session_type = 'focus') {
    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user: 1,
            session_type: session_type,  // <<< Aqui!
            duration: duration,
            completed: completed
        })
    })
    .then(res => {
        if (!res.ok) {
            // caso a API retorne erro, tenta mostrar o erro detalhado
            return res.json().then(err => {throw err});
        }
        return res.json();
    })
    .then(data => console.log('Sessão salva:', data))
    .catch(err => console.error('Erro na API:', err));
}


// ============ EVENTOS ============
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

fireAttackBtn.addEventListener('click', () => {
    const poder = powerSelect.value;
    executarAtaque(poder);
});

// ============ INICIAL ============
minutes = parseInt(focusInput.value);
updateDisplay();
updateProgress();
