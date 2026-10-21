
const btn = document.querySelector('.talk');
const content = document.querySelector('.content');
const imageContainer = document.querySelector('.image-container');
const textInput = document.getElementById('assistantInput');
const sendButton = document.getElementById('sendCommand');

let isRecognitionActive = false;
let isAwaitingCommand = false;
let autoListenEnabled = true;

function setContent(message) {
    if (content) {
        content.textContent = message;
    }
}

function resetListeningState() {
    isRecognitionActive = false;
    isAwaitingCommand = false;
    btn?.classList.remove('listening');
    imageContainer?.classList.remove('listening');
}

function activateListeningMode() {
    isAwaitingCommand = true;
    isRecognitionActive = true;
    btn?.classList.add('listening');
    imageContainer?.classList.add('listening');
    setContent('Listening...');
}

function handleUnknownCommand(command) {
    const value = (command || '').trim();
    if (!value) {
        return;
    }

    if (value.length < 3) {
        setContent('I did not catch that. Please try again.');
        return;
    }

    setContent('I did not understand that command.');
    speak('I did not understand that command. Please try again.');
}

function speak(text) {
    if (!text) {
        return;
    }

    if (!('speechSynthesis' in window)) {
        setContent('Voice support is not available in this browser.');
        return;
    }

    const textSpeak = new SpeechSynthesisUtterance(text);
    textSpeak.rate = 1;
    textSpeak.volume = 1;
    textSpeak.pitch = 1.2;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(textSpeak);
}

function wishMe() {
    const day = new Date();
    const hour = day.getHours();

    if (hour >= 0 && hour < 12) {
        speak('Good morning boss...');
    } else if (hour >= 12 && hour < 17) {
        speak('Good afternoon, master...');
    } else {
        speak('Good evening, sir...');
    }
}

window.addEventListener('load', () => {
    setContent('Initializing CRECENT...');

    if ('speechSynthesis' in window && window.isSecureContext) {
        wishMe();
    }
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
        const result = event.results[event.resultIndex];
        const transcript = (result[0]?.transcript || '').trim();

        if (!transcript) {
            return;
        }

        const normalized = transcript.toLowerCase();

        if (!isAwaitingCommand) {
            const isWakeWord = /(hey\s+crecent|hello\s+crecent|wake\s+up\s+crecent|crescent)/i.test(normalized);

            if (!isWakeWord) {
                return;
            }

            activateListeningMode();
            speak('Yes sir, how may I help you?');
            return;
        }

        setContent(transcript);
        takeCommand(normalized);
        isAwaitingCommand = false;
        resetListeningState();
    };

    recognition.onerror = (event) => {
        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
            autoListenEnabled = false;
            setContent('Microphone permission is blocked. Please allow it and try again.');
        } else if (event.error === 'no-speech') {
            if (autoListenEnabled) {
                setContent('Listening for wake word...');
            } else {
                setContent('No speech was detected. Please try again.');
            }
        } else {
            setContent('I could not understand that. Please try again.');
        }

        resetListeningState();
    };

    recognition.onstart = () => {
        isRecognitionActive = true;
        btn?.classList.add('listening');
        imageContainer?.classList.add('listening');
    };

    recognition.onend = () => {
        if (autoListenEnabled) {
            try {
                recognition.start();
            } catch (error) {
                // Ignore restart issues while the browser is still settling.
            }
            return;
        }

        resetListeningState();
    };

    btn.addEventListener('click', () => {
        if (!window.isSecureContext) {
            setContent('Open this app through localhost or HTTPS, then allow microphone access.');
            return;
        }

        if (isRecognitionActive) {
            try {
                recognition.stop();
            } catch (error) {
                // Ignore repeated stop requests.
            }
            return;
        }

        activateListeningMode();
        speak('Yes sir, how may I help you?');
        autoListenEnabled = true;

        try {
            recognition.start();
        } catch (error) {
            setContent('The microphone is still starting. Please click again.');
            resetListeningState();
        }
    });

    if (window.isSecureContext) {
        try {
            recognition.start();
        } catch (error) {
            setContent('The microphone is still starting. Please wait a moment.');
        }
    }

    const submitTextCommand = () => {
        const typedCommand = textInput?.value?.trim();

        if (!typedCommand) {
            return;
        }

        setContent(typedCommand);
        takeCommand(typedCommand.toLowerCase());
        if (textInput) {
            textInput.value = '';
        }
    };

    textInput?.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            submitTextCommand();
        }
    });

    sendButton?.addEventListener('click', submitTextCommand);
} else {
    setContent('Speech recognition is not supported in this browser.');
    btn.disabled = true;
    btn.title = 'Browser unsupported';
}

function openWebsite(url, label) {
    window.open(url, '_blank');
    speak(`Opening ${label}...`);
}

function searchWeb(query) {
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    window.open(url, '_blank');
    speak(`Searching for ${query} on Google.`);
}

function searchMusic(query) {
    const cleanQuery = query
        .replace(/^(play|search|find|listen to|music|song|track)/gi, '')
        .replace(/^(for|the|a|an)/gi, '')
        .trim();

    if (!cleanQuery) {
        return;
    }

    const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(cleanQuery)}`;
    window.open(youtubeUrl, '_blank');
    speak(`Searching for ${cleanQuery} on YouTube.`);
}

function takeCommand(message) {
    const command = message.trim();

    if (!command) {
        return;
    }

    if (command.includes('hey') || command.includes('hello') || command.includes('hi')) {
        speak('Hello sir, how may I help you?');
    } else if (command.includes('what can you do') || command.includes('what are you')) {
        speak('I can search the web, open websites, tell time and date, play music, answer simple questions, and help you with everyday tasks like Alexa.');
    } else if (command.includes('thank you') || command.includes('thanks')) {
        speak('You are welcome, sir.');
    } else if (command.includes('bye') || command.includes('goodbye') || command.includes('stop')) {
        speak('Goodbye, sir. Have a great day.');
    } else if (command.includes('who are you') || command.includes('your name') || command.includes('founder') || command.includes('developed')) {
        speak('Hello sir, my name is Crescent AI developed by Sir Bheesham Mahesh Maharaj.');
    } else if (command.includes('developer name') || command.includes('you founder') || command.includes('developer')) {
        speak('Sir Bheesham Mahesh Maharaj, Sateej Mathrani, and Mahaveer Ramani.');
    } else if (command.includes('what is neuron')) {
        speak('Neuron is a special type of cell that coordinates different organs and parts of the body.');
    } else if (command.includes('what is physics')) {
        speak('Physics is the study of matter, energy, and their mutual interaction.');
    } else if (command.includes('open google')) {
        openWebsite('https://google.com', 'Google');
    } else if (command.includes('open youtube')) {
        openWebsite('https://youtube.com', 'YouTube');
    } else if (command.includes('open facebook')) {
        openWebsite('https://facebook.com', 'Facebook');
    } else if (command.includes('open whatsapp') || command.includes('open whatshapp')) {
        openWebsite('https://web.whatsapp.com', 'WhatsApp');
    } else if (command.includes('open gmail')) {
        openWebsite('https://mail.google.com', 'Gmail');
    } else if (command.includes('open maps') || command.includes('open google maps')) {
        openWebsite('https://maps.google.com', 'Google Maps');
    } else if (command.includes('open copilot') || command.includes('open github copilot')) {
        openWebsite('https://copilot.microsoft.com', 'Microsoft Copilot');
    } else if (command.includes('open chatgpt')) {
        openWebsite('https://chat.openai.com', 'ChatGPT');
    } else if (command.includes('play music') || command.includes('play song') || command.includes('play a song')) {
        openWebsite('https://music.youtube.com', 'YouTube Music');
    } else if (/\b(play|search|find|listen to)\b/.test(command) && /(song|music|track|album)/.test(command)) {
        const query = command
            .replace(/\b(play|search|find|listen to)\b/gi, '')
            .replace(/\b(song|music|track|album)\b/gi, '')
            .trim();
        searchMusic(query || command);
    } else if (/\b(play|search|find|listen to)\b/.test(command) && !/\b(open|google|youtube|facebook|whatsapp|gmail|maps|weather|news|calculator)\b/.test(command)) {
        const query = command
            .replace(/\b(play|search|find|listen to)\b/gi, '')
            .trim();
        searchMusic(query || command);
    } else if (command.includes('news')) {
        openWebsite('https://news.google.com', 'Google News');
    } else if (command.includes('weather')) {
        openWebsite('https://www.google.com/search?q=weather', 'weather');
    } else if (command.includes('time')) {
        const time = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
        speak(time);
    } else if (command.includes('date')) {
        const date = new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
        speak(date);
    } else if (command.includes('calculator')) {
        window.open('Calculator:///');
        speak('Opening Calculator');
    } else if (command.includes('search for')) {
        const query = command.replace(/search for/gi, '').trim();
        if (query) {
            searchWeb(query);
        }
    } else if (command.includes('what is') || command.includes('who is') || command.includes('what are')) {
        searchWeb(command);
    } else if (command.includes('wikipedia')) {
        const query = command.replace(/wikipedia/gi, '').trim();
        const url = `https://en.wikipedia.org/wiki/${encodeURIComponent(query)}`;
        window.open(url, '_blank');
        const finalText = 'This is what I found on Wikipedia regarding ' + command;
        speak(finalText);
    } else if (command.includes('timer') || command.includes('alarm')) {
        const match = command.match(/(\d+)\s*(minute|minutes|min|second|seconds|hour|hours)/i);
        if (match) {
            const value = Number(match[1]);
            const unit = match[2].toLowerCase();
            const ms = unit.startsWith('min') ? value * 60 * 1000 : unit.startsWith('sec') ? value * 1000 : value * 60 * 60 * 1000;
            setTimeout(() => {
                speak('Timer is complete.');
            }, ms);
            speak(`Timer set for ${value} ${unit}.`);
        } else {
            speak('Please say the timer time clearly, like five minutes or ten seconds.');
        }
    } else if (command.includes('shutdown') || command.includes('shut down') || command.includes('turn off pc') || command.includes('turn off computer')) {
        speak('Shutting down the computer now.');
        if (navigator.appVersion.includes('Win')) {
            window.open('https://www.google.com/search?q=shutdown+windows+computer', '_blank');
        } else {
            window.open('https://www.google.com/search?q=shutdown+linux+computer', '_blank');
        }
    } else if (command.includes('call me') || command.includes('my name is')) {
        const name = command.replace(/call me|my name is/gi, '').trim();
        speak(`Nice to meet you, ${name || 'sir'}.`);
    } else if (command.includes('how are you')) {
        speak('I am doing very well, sir. How can I help you today?');
    } else {
        handleUnknownCommand(command);
    }
}

// ChatBox
// async function fetchGPTResponse(prompt) {
//     const apiKey = 'YOUR_OPENAI_API_KEY'; // Replace with your actual OpenAI API key
//
//     const response = await fetch('https://api.openai.com/v1/chat/completions', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${apiKey}`
//         },
//         body: JSON.stringify({
//             model: 'gpt-3.5-turbo',
//             messages: [
//                 { role: 'user', content: prompt }
//             ],
//             max_tokens: 100,
//             temperature: 0.7
//         })
//     });
//
//     const data = await response.json();
//     return data.choices[0].message.content;
// }

// document.getElementById('submitButton').addEventListener('click', async () => {
//     const prompt = document.getElementById('inputPrompt').value;
//     const output = await fetchGPTResponse(prompt);
//     document.getElementById('output').innerText = output;
// });

