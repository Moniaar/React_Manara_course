// background.js

const DEFAULT_TIMES = {
    pomodoro: 25 * 60, // 25 minutes
    shortBreak: 5 * 60,  // 5 minutes
    longBreak: 15 * 60   // 15 minutes
};

let timerState = {
    timeLeft: DEFAULT_TIMES.pomodoro,
    currentMode: 'pomodoro', // 'pomodoro', 'shortBreak', 'longBreak'
    isRunning: false,
    pomodorosCompleted: 0
};

const ALARM_NAME = 'pomodoroTimerAlarm';
const OFFSCREEN_DOCUMENT_PATH = 'offscreen.html';

// Function to ensure offscreen document exists
async function ensureOffscreenDocument() {
    const existingContexts = await chrome.runtime.getContexts({
        contextTypes: ['OFFSCREEN_DOCUMENT'],
        documentUrls: [chrome.runtime.getURL(OFFSCREEN_DOCUMENT_PATH)]
    });
    if (existingContexts.length > 0) {
        return;
    }
    await chrome.offscreen.createDocument({
        url: OFFSCREEN_DOCUMENT_PATH,
        reasons: [chrome.offscreen.Reason.AUDIO_PLAYBACK],
        justification: 'To play timer notification sounds using Tone.js'
    });
}

// Load initial state from storage
chrome.storage.local.get(['timerState'], (result) => {
    if (result.timerState) {
        timerState = result.timerState;
        // If timer was running, we need to decide if we should resume it or reset.
        // For simplicity, if it was running, we'll set it to paused but retain time.
        // A more complex solution would calculate elapsed time while extension was inactive.
        if (timerState.isRunning) {
            timerState.isRunning = false; // Start in a paused state on load
        }
    }
    // Ensure the UI is updated if a popup is open
    sendStateToPopup();
});

// Listen for messages from popup or other parts of the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.command) {
        case 'startTimer':
            startTimer();
            sendResponse(timerState);
            break;
        case 'pauseTimer':
            pauseTimer();
            sendResponse(timerState);
            break;
        case 'resetTimer':
            resetTimer(timerState.currentMode); // Reset to current mode's default time
            sendResponse(timerState);
            break;
        case 'changeMode':
            if (message.data && message.data.mode) {
                changeMode(message.data.mode);
            }
            sendResponse(timerState);
            break;
        case 'getState':
            sendResponse(timerState);
            break;
        case 'playSound': // Message from offscreen.js if needed, or directly call playSound from here
            if (message.soundType === 'timerEnd') {
                // This case is if offscreen needed to tell background something.
                // Usually background tells offscreen to play.
            }
            break;
        default:
            console.warn("Unknown command received in background:", message.command);
            sendResponse({ error: "Unknown command" });
            break;
    }
    return true; // Indicates that the response will be sent asynchronously for some commands
});

// Listen for the alarm
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === ALARM_NAME) {
        if (timerState.isRunning && timerState.timeLeft > 0) {
            timerState.timeLeft--;
            saveState();
            sendStateToPopup();

            if (timerState.timeLeft === 0) {
                handleTimerEnd();
            }
        }
    }
});

function startTimer() {
    if (!timerState.isRunning) {
        timerState.isRunning = true;
        // Create alarm that fires every second.
        // Note: Chrome alarms are not exact for periods less than 1 minute.
        // For a precise second-by-second countdown, a popup-based setInterval is more accurate
        // if the popup is open. Background alarms are good for longer intervals.
        // Using 1 minute period for alarm, and internal decrementing might be an option,
        // but for simplicity, we'll use a 1-second alarm, acknowledging its limitations.
        // A more robust approach for background timers is to set alarm for timeLeft,
        // and update display frequently if popup is open.
        // For this implementation, we'll make it fire every second.
        chrome.alarms.create(ALARM_NAME, { periodInMinutes: 1 / 60 });
        saveState();
        sendStateToPopup(); // Update UI immediately
    }
}

function pauseTimer() {
    if (timerState.isRunning) {
        timerState.isRunning = false;
        chrome.alarms.clear(ALARM_NAME);
        saveState();
        sendStateToPopup();
    }
}

function resetTimer(mode = timerState.currentMode, resetPomodoros = false) {
    timerState.isRunning = false;
    timerState.currentMode = mode;
    timerState.timeLeft = DEFAULT_TIMES[mode];
    if (resetPomodoros) {
        timerState.pomodorosCompleted = 0;
    }
    chrome.alarms.clear(ALARM_NAME);
    saveState();
    sendStateToPopup();
}

function changeMode(newMode) {
    if (DEFAULT_TIMES[newMode]) {
        timerState.isRunning = false;
        timerState.currentMode = newMode;
        timerState.timeLeft = DEFAULT_TIMES[newMode];
        chrome.alarms.clear(ALARM_NAME);
        saveState();
        sendStateToPopup();
    }
}

async function handleTimerEnd() {
    timerState.isRunning = false;
    chrome.alarms.clear(ALARM_NAME);

    // Play sound using offscreen document
    await ensureOffscreenDocument();
    chrome.runtime.sendMessage({
        target: 'offscreen',
        command: 'playSound',
        soundType: 'ovenDing'
    });
    
    // Show notification
    const modeName = timerState.currentMode.charAt(0).toUpperCase() + timerState.currentMode.slice(1).replace('B', ' B');
    chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon128.png', // Make sure you have this icon
        title: `${modeName} Finished!`,
        message: getNotificationMessage(),
        priority: 2
    });

    // Logic for switching modes
    if (timerState.currentMode === 'pomodoro') {
        timerState.pomodorosCompleted++;
        if (timerState.pomodorosCompleted % 4 === 0) { // Every 4 Pomodoros, take a long break
            changeMode('longBreak');
        } else {
            changeMode('shortBreak');
        }
    } else { // If a break ended, switch back to Pomodoro
        changeMode('pomodoro');
    }
    // The changeMode function already calls saveState and sendStateToPopup
}

function getNotificationMessage() {
    if (timerState.currentMode === 'pomodoro') {
        return timerState.pomodorosCompleted % 4 === 0 ? 'Time for a long break!' : 'Time for a short break!';
    } else if (timerState.currentMode === 'shortBreak' || timerState.currentMode === 'longBreak') {
        return 'Break is over. Time to focus!';
    }
    return 'Timer finished!';
}


function saveState() {
    chrome.storage.local.set({ timerState });
}

// Function to send current state to popup (if open)
function sendStateToPopup() {
    chrome.runtime.sendMessage({ command: 'updateUI', data: timerState }, (response) => {
        if (chrome.runtime.lastError) {
            // This error often means the popup is not open, which is fine.
            // console.log("Popup not open or error sending message:", chrome.runtime.lastError.message);
        }
    });
}

// Initial setup if needed (e.g., on extension install/update)
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install") {
        // Set initial state on first install
        resetTimer('pomodoro', true); // Reset with pomodoro mode and 0 completed
        console.log("Pastel Pomodoro Timer installed.");
    } else if (details.reason === "update") {
        // Handle updates if necessary, e.g., migrating stored data
        console.log("Pastel Pomodoro Timer updated.");
        // Ensure alarm is cleared if it was running from an old version
        chrome.alarms.clear(ALARM_NAME, (wasCleared) => {
            if (wasCleared) console.log("Cleared existing alarm on update.");
        });
         // Reload current state to ensure consistency
        chrome.storage.local.get(['timerState'], (result) => {
            if (result.timerState) {
                timerState = result.timerState;
                timerState.isRunning = false; // Ensure it's paused after update
                saveState();
            } else {
                resetTimer('pomodoro', true); // If no state, initialize
            }
            sendStateToPopup();
        });
    }
    ensureOffscreenDocument(); // Prepare offscreen document on install/update
});

// Keep alive for service worker for alarms (less critical with Manifest V3 if alarms are used correctly)
// However, ensuring the offscreen document is ready on startup is good.
chrome.runtime.onStartup.addListener(() => {
    console.log("Extension started up.");
    // Reload current state to ensure consistency
    chrome.storage.local.get(['timerState'], (result) => {
        if (result.timerState) {
            timerState = result.timerState;
            // If timer was running and timeLeft > 0, it should have been handled by alarms persisting.
            // If timeLeft is 0, it means it finished while inactive.
            // For simplicity, we'll ensure it's paused.
            if (timerState.isRunning) {
                 // If it was running, the alarm should still be active if set with periodInMinutes.
                 // If not, then it means the timer might have completed or browser restarted.
                 // We'll set isRunning to false and let user restart.
                 // This logic can be more sophisticated to check if alarm exists.
                chrome.alarms.get(ALARM_NAME, (alarm) => {
                    if (!alarm && timerState.timeLeft > 0) {
                        // Alarm doesn't exist but timer was running and time left.
                        // This might happen after a browser crash/restart.
                        // We'll set it to paused.
                        timerState.isRunning = false;
                        console.log("Timer was running but alarm not found. Setting to paused.");
                    } else if (!alarm && timerState.timeLeft === 0) {
                        // Timer likely finished while inactive.
                        timerState.isRunning = false;
                         console.log("Timer seems to have finished while inactive.");
                        // Potentially trigger handleTimerEnd logic here if appropriate,
                        // or just reset to next state. For now, just pause.
                    }
                });
            }
        } else {
            resetTimer('pomodoro', true); // Initialize if no state found
        }
        saveState();
        sendStateToPopup();
    });
    ensureOffscreenDocument();
});
