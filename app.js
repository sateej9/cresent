
const btn = document.querySelector('.talk')
const content = document.querySelector('.content')

function speak(text) {
    const text_speak = new SpeechSynthesisUtterance(text);
    text_speak.rate = 1;
    text_speak.volume = 1;
    text_speak.pitch = 2; // Adjusted pitch for a more feminine voice

    window.speechSynthesis.speak(text_speak);
}


function wishMe() {
    var day = new Date();
    var hour = day.getHours();

    if (hour >= 0 && hour < 12) {
        speak("Good Morning Boss...")
    }

    else if (hour > 12 && hour < 17) {
        speak("Good Afternoon Master...")
    }

    else {
        speak("Good Evenining Sir...")
    }

}

window.addEventListener('load', () => {
    speak("Initializing CRECENT..");
    wishMe();
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();

recognition.onresult = (event) => {
    const currentIndex = event.resultIndex;
    const transcript = event.results[currentIndex][0].transcript;
    content.textContent = transcript;
    takeCommand(transcript.toLowerCase());

}

btn.addEventListener('click', () => {
    content.textContent = "Listening...."
    recognition.start();
})

function takeCommand(message) {
    if (message.includes('hey') || message.includes('hello')) {
        speak("Hello Sir, How May I Help You?");
    } else if (message.includes("What is Neuron")) {
        // window.open("https://whatshapp.web.com", "_blank");
        speak("Neuron is special type of cell which cordinate the diffrent organs and diffrent parts of body")
    }
    else if (message.includes("What is physics")) {
        speak("physics is a study of metter and energy and there matual interection")
    }
    else if (message.includes("open google")) {
        window.open("https://google.com", "_blank");
        speak("Opening Google...")
    }
    else if (message.includes('founder') || message.includes('your name') || message.includes('developed')) {
        speak("Hello Sir My Name is Crecent AI Developed by Sir Bheesham mahesh maharaj")
    }
    else if (message.includes('developed name') || message.includes('you founder') || message.includes('developer name')) {
        speak("Sir Bheesham mahesh maharaj,Sateej Mathrani and Mahaveer Ramani ")
    }
    else if (message.includes("open youtube")) {
        window.open("https://youtube.com", "_blank");
        speak("Opening Youtube...")
    }
    else if (message.includes("open facebook")) {
        window.open("https://facebook.com", "_blank");
        speak("Opening Facebook...")
    }
    else if (message.includes("open whatshapp")) {
        window.open("https://whatshapp.web.com", "_blank");
        speak("Opening Whatshapp...")
    }
    else if (message.includes('what is') || message.includes('who is') || message.includes('what are')) {
        window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
        const finalText = "This is what i found on internet regarding " + message;
        speak(finalText);
    }

    else if (message.includes('wikipedia')) {
        window.open(`https://en.wikipedia.org/wiki/${message.replace("wikipedia", "")}`, "_blank");
        const finalText = "This is what i found on wikipedia regarding " + message;
        speak(finalText);
    }

    else if (message.includes('time')) {
        const time = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" })
        const finalText = time;
        speak(finalText);
    }

    else if (message.includes('date')) {
        const date = new Date().toLocaleString(undefined, { month: "short", day: "numeric" })
        const finalText = date;
        speak(finalText);
    }

    else if (message.includes('calculator')) {
        window.open('Calculator:///')
        const finalText = "Opening Calculator";
        speak(finalText);
    }

    else {
        window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
        const finalText = "I found some information for " + message + " on google";
        speak(finalText);
    }
}

// ChatBox
// async function fetchGPTResponse(prompt) {
//     const apiKey = 'YOUR_OPENAI_API_KEY'; // Replace with your actual OpenAI API key

//     const response = await fetch('https://api.openai.com/v1/chat/completions', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${apiKey}`
//         },
//         body: JSON.stringify({
//             model: "gpt-3.5-turbo", // or "gpt-4" if you're using GPT-4
//             messages: [
//                 { role: "user", content: prompt }
//             ],
//             max_tokens: 100,
//             temperature: 0.7
//         })
//     });

//     const data = await response.json();
//     return data.choices[0].message.content;
// }

// // Example usage
// document.getElementById("submitButton").addEventListener("click", async () => {
//     const prompt = document.getElementById("inputPrompt").value;
//     const output = await fetchGPTResponse(prompt);
//     document.getElementById("output").innerText = output;
// });
