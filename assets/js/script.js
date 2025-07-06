// Check if the browser supports the Web Speech API
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!window.SpeechRecognition) {
    alert("Your browser does not support the Web Speech API. Please try Chrome or another supported browser.");
} else {
    // Initialize speech recognition
    const recognition = new SpeechRecognition();
    recognition.continuous = true; // Keep listening even after a pause
    recognition.interimResults = true; // Show results as you speak
    recognition.lang = 'en-US'; // Set the language

    const startButton = document.getElementById('startButton');
    const transcriptionOutput = document.getElementById('transcription-output');
    const transcriptionContainer = document.getElementById('transcription-container');

    let isTranscribing = false;

    // Event listener for the start button
    startButton.addEventListener('click', () => {
        if (isTranscribing) {
            recognition.stop();
        } else {
            recognition.start();
        }
    });

    // When recognition starts
    recognition.onstart = () => {
        isTranscribing = true;
        startButton.textContent = 'Stop Transcription';
        transcriptionContainer.classList.remove('hide');
        transcriptionOutput.textContent = 'Listening...';
    };

    // When recognition ends
    recognition.onend = () => {
        isTranscribing = false;
        startButton.textContent = 'Start Transcription';
        if (transcriptionOutput.textContent === 'Listening...') {
            transcriptionOutput.textContent = 'Click "Start Transcription" to begin.';
        }
    };

    // When a result is received
    recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = 0; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript + ' ';
            } else {
                interimTranscript += transcript;
            }
        }
        
        // Update the display with the latest transcription
        transcriptionOutput.textContent = finalTranscript + interimTranscript;
    };

    // Handle errors
    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        transcriptionOutput.textContent = 'Error during transcription. Please try again.';
    };
}