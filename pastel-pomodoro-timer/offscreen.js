// offscreen.js

// Ensure Tone.js is loaded and ready
if (typeof Tone === 'undefined') {
    console.error("Tone.js is not loaded. Sound playback will not work.");
} else {
    // Initialize a simple synth. We can make it sound like an "oven ding"
    // A simple metallic sound can be achieved with a MembraneSynth or MetalSynth
    // For a classic "ding", a simple sine wave with a decay envelope is often used.
    const synth = new Tone.Synth({
        oscillator: {
            type: 'sine' // A clear tone
        },
        envelope: {
            attack: 0.005,
            decay: 0.2, // Short decay for a "ding"
            sustain: 0.01,
            release: 0.3
        }
    }).toDestination();


    // Function to play the "oven ding" sound
    function playOvenDing() {
        if (Tone.context.state !== 'running') {
            Tone.start().then(() => {
                console.log("AudioContext started by Tone.js in offscreen document.");
                triggerSound();
            }).catch(e => console.error("Error starting Tone.js AudioContext:", e));
        } else {
            triggerSound();
        }
    }

    function triggerSound() {
        try {
            // A simple C5 note, or a sequence for a more distinct sound
            synth.triggerAttackRelease("C5", "8n", Tone.now()); // A short C5 note
            // For a more "oven-like" sound, you might play two quick notes
            // synth.triggerAttackRelease("E5", "16n", Tone.now());
            // synth.triggerAttackRelease("G5", "16n", Tone.now() + Tone.Time("16n").toSeconds());
            console.log("Oven ding sound played via offscreen document.");
        } catch (error) {
            console.error("Error playing sound with Tone.js:", error);
        }
    }


    // Listen for messages from the background script
    chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
        if (message.target !== 'offscreen') {
            return; // Message not for us
        }

        if (message.command === 'playSound') {
            if (message.soundType === 'ovenDing') {
                playOvenDing();
                sendResponse({ success: true, message: "Sound command received." });
            } else {
                sendResponse({ success: false, message: "Unknown sound type." });
            }
        }
        return true; // Keep message channel open for async response
    });

    console.log("Offscreen document script loaded and ready for audio playback.");
}
