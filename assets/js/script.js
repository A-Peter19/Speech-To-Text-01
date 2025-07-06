// Check if the browser supports the Web Speech API
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!window.SpeechRecognition) {
    alert("Your browser does not support the Web Speech API. Please try Chrome or another supported browser.");
} else {
    // --- ELEMENT SELECTORS ---
    const startButton = document.getElementById('startButton');
    const saveButton = document.getElementById('saveButton');
    const clearHistoryButton = document.getElementById('clearHistoryButton');
    const transcriptionOutput = document.getElementById('transcription-output');
    const transcriptionContainer = document.getElementById('transcription-container');
    const historyContainer = document.getElementById('history-container');
    const historyList = document.getElementById('history-list');

    // --- STATE AND SPEECH RECOGNITION SETUP ---
    let isTranscribing = false;
    let finalTranscript = '';
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    // --- LOCALSTORAGE FUNCTIONS ---

    /**
     * Loads transcriptions from localStorage and displays them.
     */
    const loadHistory = () => {
        const history = JSON.parse(localStorage.getItem('transcriptionHistory')) || [];
        if (history.length > 0) {
            historyList.innerHTML = ''; // Clear existing list
            history.slice().reverse().forEach(entry => {
                const li = document.createElement('li');
                li.innerHTML = `
                    ${entry.text}
                    <br>
                    <small style="color: #6c757d;">${entry.date}</small>
                `;
                historyList.appendChild(li);
            });
            historyContainer.classList.remove('hide');
        } else {
            historyContainer.classList.add('hide');
        }
    };

    /**
     * Saves a new transcription to localStorage.
     * @param {string} text - The text to save.
     */
    const saveTranscription = (text) => {
        const history = JSON.parse(localStorage.getItem('transcriptionHistory')) || [];
        history.push(text);
        localStorage.setItem('transcriptionHistory', JSON.stringify(history));
        loadHistory(); // Refresh the displayed history
    };

    // --- EVENT LISTENERS ---

    // Start/Stop transcription
    startButton.addEventListener('click', () => {
        if (isTranscribing) {
            recognition.stop();
        } else {
            finalTranscript = ''; // Clear previous transcript before starting a new one
            transcriptionOutput.textContent = '';
            recognition.start();
        }
    });

    // Save transcription
    saveButton.addEventListener('click', () => {
        if (finalTranscript) {
            saveTranscription(finalTranscript.trim());
            alert('Transcription saved!');
        }
    });

    // Clear history
    clearHistoryButton.addEventListener('click', () => {
        localStorage.removeItem('transcriptionHistory');
        historyList.innerHTML = '';
        historyContainer.classList.add('hide');
    });

    // --- SPEECH RECOGNITION EVENTS ---

    recognition.onstart = () => {
        isTranscribing = true;
        startButton.textContent = 'Stop Transcription';
        transcriptionContainer.classList.remove('hide');
        saveButton.classList.add('hide');
        transcriptionOutput.textContent = 'Listening...';
    };

    recognition.onend = () => {
        isTranscribing = false;
        startButton.textContent = 'Start Transcription';
        if (finalTranscript) {
            saveButton.classList.remove('hide');
        }
    };

    recognition.onresult = (event) => {
        let interimTranscript = '';
        finalTranscript = ''; // Reset final transcript to rebuild it

        for (let i = 0; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript + ' ';
            } else {
                interimTranscript += transcript;
            }
        }
        transcriptionOutput.textContent = finalTranscript + interimTranscript;
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        transcriptionOutput.textContent = 'Error during transcription. Please try again.';
    };

    // --- INITIALIZATION ---
    loadHistory(); // Load saved history when the page loads
}