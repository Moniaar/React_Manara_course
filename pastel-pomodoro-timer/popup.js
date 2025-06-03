// popup.js
document.addEventListener('DOMContentLoaded', () => {
    const timerDisplay = document.getElementById('timer-display');
    const currentModeDisplay = document.getElementById('current-mode-display');
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const modeButtons = document.querySelectorAll('.mode-btn');
    const timerDisplayContainer = document.getElementById('timer-display-container');
    const bodyElement = document.body;
    const messageBox = document.getElementById('message-box');

    const MODE_DETAILS = {
        pomodoro: { time: 25, name: "Focus Time", gradient: "from-rose-100 via-orange-100 to-amber-100", color: "text-rose-600", titleColor: "text-rose-500", activeBtnClass: "bg-rose-500" },
        shortBreak: { time: 5, name: "Short Break", gradient: "from-sky-100 via-cyan-100 to-teal-100", color: "text-sky-600", titleColor: "text-sky-500", activeBtnClass: "bg-sky-500" },
        longBreak: { time: 15, name: "Long Break", gradient: "from-emerald-100 via-green-100 to-lime-100", color: "text-emerald-600", titleColor: "text-emerald-500", activeBtnClass: "bg-emerald-500" },
    };

    // Function to update UI elements based on mode and timer state
    function updateUI(state) {
        if (!state) return;

        const minutes = Math.floor(state.timeLeft / 60);
        const seconds = state.timeLeft % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        const modeDetail = MODE_DETAILS[state.currentMode];
        if (modeDetail) {
            currentModeDisplay.textContent = modeDetail.name;
            // Update body gradient (remove old, add new)
            bodyElement.className = `text-slate-700 flex flex-col items-center justify-center p-6 transition-colors duration-500 ${modeDetail.gradient}`;
            timerDisplay.className = `text-7xl font-thin tracking-wider p-4 rounded-lg shadow-inner bg-white/50 ${modeDetail.color}`;
            document.querySelector('h1').className = `text-3xl font-light mb-6 ${modeDetail.titleColor}`;

            modeButtons.forEach(btn => {
                btn.classList.remove(MODE_DETAILS.pomodoro.activeBtnClass, MODE_DETAILS.shortBreak.activeBtnClass, MODE_DETAILS.longBreak.activeBtnClass);
                btn.classList.remove('active'); // Generic active class from CSS
                if (btn.dataset.mode === state.currentMode) {
                    btn.classList.add(modeDetail.activeBtnClass); // Specific color active class
                    btn.classList.add('active'); // Generic active class for CSS
                }
            });
        }

        if (state.isRunning) {
            startBtn.classList.add('hidden');
            pauseBtn.classList.remove('hidden');
            timerDisplayContainer.classList.add('timer-active');
        } else {
            startBtn.classList.remove('hidden');
            pauseBtn.classList.add('hidden');
            timerDisplayContainer.classList.remove('timer-active');
        }
    }

    // Request initial state from background script
    chrome.runtime.sendMessage({ command: 'getState' }, (response) => {
        if (chrome.runtime.lastError) {
            console.error("Error getting state:", chrome.runtime.lastError.message);
            showMessageBox("Error connecting to timer service. Try reloading the extension.", "error");
            // Fallback to a default initial state for UI if background is not ready
            updateUI({
                timeLeft: MODE_DETAILS.pomodoro.time * 60,
                currentMode: 'pomodoro',
                isRunning: false
            });
            return;
        }
        if (response) {
            updateUI(response);
        } else {
             // If response is undefined, background might not be ready. Initialize with default.
            console.warn("No response from background for getState. Initializing with default.");
            updateUI({
                timeLeft: MODE_DETAILS.pomodoro.time * 60,
                currentMode: 'pomodoro',
                isRunning: false
            });
        }
    });

    // Listen for updates from background script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.command === 'updateUI') {
            updateUI(message.data);
        }
        return true; // Keep the message channel open for asynchronous response if needed
    });

    // Event listeners for control buttons
    startBtn.addEventListener('click', () => {
        chrome.runtime.sendMessage({ command: 'startTimer' }, updateUI);
    });

    pauseBtn.addEventListener('click', () => {
        chrome.runtime.sendMessage({ command: 'pauseTimer' }, updateUI);
    });

    resetBtn.addEventListener('click', () => {
        chrome.runtime.sendMessage({ command: 'resetTimer' }, updateUI);
    });

    // Event listeners for mode buttons
    modeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const mode = button.dataset.mode;
            chrome.runtime.sendMessage({ command: 'changeMode', data: { mode } }, updateUI);
        });
    });

    function showMessageBox(message, type = 'info') {
        messageBox.textContent = message;
        messageBox.className = `mt-4 p-3 text-sm text-center rounded-lg ${type}`; // Base classes
        messageBox.classList.remove('hidden');
        
        // Clear message after a few seconds
        setTimeout(() => {
            messageBox.classList.add('hidden');
        }, 5000);
    }
});
