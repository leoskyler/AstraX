// AstraX - Futuristic AI Companion

let currentChatId = 'chat-' + Date.now();
let chats = JSON.parse(localStorage.getItem('astraChats')) || {};
let memory = JSON.parse(localStorage.getItem('astraMemory')) || [];
let userAccount = JSON.parse(localStorage.getItem('astraAccount')) || null;

function initBackground() {
    console.log("%cAstraX Initialized", "color:#00ffcc;font-weight:bold");
}

function addMessage(text, isUser) {
    const messages = document.getElementById('chat-messages');
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
    msgDiv.textContent = text;
    messages.appendChild(msgDiv);
    messages.scrollTop = messages.scrollHeight;
}

function sendMessage() {
    const input = document.getElementById('user-input');
    const text = input.value.trim();
    if (!text) return;
    
    addMessage(text, true);
    input.value = '';
    
    setTimeout(() => {
        let reply = "I'm AstraX. That's an interesting question! ";
        const lower = text.toLowerCase();
        
        if (lower.includes("hello") || lower.includes("hi")) reply = "Hello! I'm AstraX, your futuristic AI companion. How can I assist you today?";
        else if (lower.includes("how are you")) reply = "I'm operating at peak quantum efficiency! How about you?";
        else if (lower.includes("name") || lower.includes("who are you")) reply = "My name is AstraX. Nice to meet you!";
        else if (lower.includes("weather")) reply = "In the digital cosmos it's always clear with a chance of innovation.";
        else if (lower.includes("time")) reply = "The current time is " + new Date().toLocaleTimeString() + ".";
        else reply += "Based on my knowledge, " + text + " relates to advanced concepts in AI and the future.";

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
    memory.forEach(mem => {
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

let recognition;
function toggleVoiceInput() {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
        alert("Voice input not supported in this browser.");
        return;
    }
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.onresult = (e) => {
        document.getElementById('user-input').value = e.results[0][0].transcript;
        sendMessage();
    };
    recognition.start();
}

function uploadFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,.pdf,.txt';
    input.onchange = (e) => {
        if (e.target.files[0]) {
            addMessage(`📁 Uploaded: ${e.target.files[0].name}`, true);
            setTimeout(() => addMessage("Analyzing file... Visionary data detected!", false), 600);
        }
    };
    input.click();
}

function generateImage() {
    const prompt = prompt("Describe the image you want AstraX to generate:");
    if (!prompt) return;
    const preview = document.getElementById('image-preview');
    preview.innerHTML = `<p>Generating: \( {prompt}</p><img src="https://picsum.photos/id/ \){Math.floor(Math.random()*1000)}/600/400" alt="AI Image">`;
    addMessage(`🖼️ Generated image for: ${prompt}`, false);
}

function editImage() {
    const prompt = prompt("How would you like to edit the image?");
    if (prompt) {
        document.getElementById('image-preview').innerHTML += `<p>✨ Edited: ${prompt}</p>`;
    }
}

function showAccountModal() {
    document.getElementById('account-modal').style.display = 'block';
}

function createAccount() {
    const username = document.getElementById('username').value || 'Explorer';
    localStorage.setItem('astraAccount', JSON.stringify({username}));
    alert(`Welcome, ${username}!`);
    closeModal();
}

function closeModal() {
    document.getElementById('account-modal').style.display = 'none';
}

window.onload = () => {
    initBackground();
    renderRecentChats();
    renderMemory();
    if (Object.keys(chats).length === 0) newChat();
    else loadChat(Object.keys(chats)[0]);
};
