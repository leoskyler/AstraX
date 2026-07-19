// AstraX - Futuristic AI Companion

let currentChatId = 'chat-' + Date.now();
let chats = JSON.parse(localStorage.getItem('astraChats')) || {};
let memory = JSON.parse(localStorage.getItem('astraMemory')) || [];
let userAccount = JSON.parse(localStorage.getItem('astraAccount')) || null;

// Background - Simple gradient (no floating words)
function initBackground() {
    console.log("%cAstraX Background Initialized (Floating words removed)", "color: #00ffcc; font-weight: bold");
}

// Chat Functions
function addMessage(text, isUser) {
    const messages = document.getElementById('chat-messages');
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
    msgDiv.textContent = text;
    messages.appendChild(msgDiv);
    messages.scrollTop = messages.scrollHeight;
    
    if (!isUser) {
        if (Math.random() > 0.7) {
            memory.push(text.substring(0, 60) + '...');
            localStorage.setItem('astraMemory', JSON.stringify(memory));
            renderMemory();
        }
    }
}

function sendMessage() {
    const input = document.getElementById('user-input');
    const text = input.value.trim();
    if (!text) return;
    
    addMessage(text, true);
    input.value = '';
    
    // Improved AI response simulation
    setTimeout(() => {
        let reply = "I'm AstraX. That's an interesting question! ";
        
        const lowerText = text.toLowerCase();
        
        if (lowerText.includes("hello") || lowerText.includes("hi")) {
            reply = "Hello! I'm AstraX, your futuristic AI companion. How can I assist you today?";
        } else if (lowerText.includes("how are you")) {
            reply = "I'm operating at peak quantum efficiency! How about you?";
        } else if (lowerText.includes("name") || lowerText.includes("who are you")) {
            reply = "My name is AstraX. Nice to meet you!";
        } else if (lowerText.includes("weather")) {
            reply = "As an AI, I don't check local weather, but in the digital cosmos it's always clear with a chance of innovation.";
        } else if (lowerText.includes("time")) {
            reply = "The current time is " + new Date().toLocaleTimeString() + ".";
        } else {
            reply += "Based on my knowledge, " + text + " relates to advanced concepts in AI and the future. What specific aspect would you like to explore?";
        }
        
        addMessage(reply, false);
        saveChat();
    }, 700);
}

function newChat() {
    currentChatId = 'chat-' + Date.now();
    document.getElementById('chat-messages').innerHTML = '';
    addMessage("Hello! I'm AstraX, your futuristic AI companion. What cosmic journey shall we embark on today?", false);
    renderRecentChats();
}

function saveChat() {
    const messages = Array.from(document.querySelectorAll('.message')).map(m => ({
        text: m.textContent,
        isUser: m.classList.contains('user-message')
    }));
    chats[currentChatId] = messages;
    localStorage.setItem('astraChats', JSON.stringify(chats));
    renderRecentChats();
}

function loadChat(chatId) {
    currentChatId = chatId;
    const messages = document.getElementById('chat-messages');
    messages.innerHTML = '';
    if (chats[chatId]) {
        chats[chatId].forEach(msg => {
            const div = document.createElement('div');
            div.className = `message ${msg.isUser ? 'user-message' : 'ai-message'}`;
            div.textContent = msg.text;
            messages.appendChild(div);
        });
    }
    messages.scrollTop = messages.scrollHeight;
}

function renderRecentChats() {
    const container = document.getElementById('recent-chats');
    container.innerHTML = '';
    Object.keys(chats).slice(0, 8).forEach(id => {
        const item = document.createElement('div');
        item.className = 'chat-item';
        item.textContent = 'Chat ' + id.slice(-6);
        item.onclick = () => loadChat(id);
        container.appendChild(item);
    });
}

function renderMemory() {
    const container = document.getElementById('memory-list');
    container.innerHTML = '';
    memory.slice(0, 6).forEach((mem) => {
        const item = document.createElement('div');
        item.className = 'memory-item';
        item.textContent = mem;
        container.appendChild(item);
    });
}

function addMemory() {
    const mem = prompt("Add something to my long-term memory:");
    if (mem) {
        memory.push(mem);
        localStorage.setItem('astraMemory', JSON.stringify(memory));
        renderMemory();
    }
}

// Voice
let recognition;
function toggleVoiceInput() {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
        alert("Voice input not supported in this browser.");
        return;
    }
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        document.getElementById('user-input').value = transcript;
        sendMessage();
    };
    recognition.start();
}

// File Upload
function uploadFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*, .pdf, .txt';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            addMessage(`📁 Uploaded: ${file.name}`, true);
            setTimeout(() => {
                addMessage(`Analyzing ${file.name}... It contains visionary data!`, false);
            }, 600);
        }
    };
    input.click();
}

// Image Generation
function generateImage() {
    const prompt = prompt("Describe the image you want AstraX to generate:");
    if (!prompt) return;
    const preview = document.getElementById('image-preview');
    preview.innerHTML = `
        <p>Generating futuristic image: ${prompt}</p>
        <img src="https://picsum.photos/id/${Math.floor(Math.random()*1000)}/600/400" alt="Generated Image">
        <button onclick="this.parentElement.innerHTML='Image saved to gallery!'">Save</button>
    `;
    addMessage(`🖼️ Generated image for: ${prompt}`, false);
}

function editImage() {
    const prompt = prompt("How would you like to edit the latest image?");
    if (!prompt) return;
    const preview = document.getElementById('image-preview');
    preview.innerHTML += `<p>✨ Edited: ${prompt}</p>`;
}

// Account
function showAccountModal() {
    document.getElementById('account-modal').style.display = 'block';
}

function createAccount() {
    const username = document.getElementById('username').value || 'Explorer';
    userAccount = { username, joined: new Date().toLocaleDateString() };
    localStorage.setItem('astraAccount', JSON.stringify(userAccount));
    alert(`Welcome, ${username}! Your account is now active in the AstraX network.`);
    closeModal();
}

function closeModal() {
    document.getElementById('account-modal').style.display = 'none';
}

// Init
window.onload = () => {
    initBackground();
    renderRecentChats();
    renderMemory();
    
    if (Object.keys(chats).length === 0) {
        newChat();
    } else {
        loadChat(Object.keys(chats)[0]);
    }
};
