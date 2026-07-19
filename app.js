// AstraX - Futuristic AI Companion

let currentChatId = 'chat-' + Date.now();
let chats = JSON.parse(localStorage.getItem('astraChats')) || {};
let memory = JSON.parse(localStorage.getItem('astraMemory')) || [];
let userAccount = JSON.parse(localStorage.getItem('astraAccount')) || null;

// Background Canvas - Floating Glowing Words
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let particles = [];

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 20 + 10;
        this.speed = Math.random() * 0.5 + 0.2;
        this.word = ['AstraX', 'Neural', 'Quantum', 'Cosmos', 'Echo', 'Nexus', 'Void', 'Pulse'][Math.floor(Math.random()*8)];
        this.color = ['#00ffcc', '#ff00cc', '#ffff00', '#00ccff'][Math.floor(Math.random()*4)];
        this.opacity = Math.random() * 0.6 + 0.3;
    }
    update() {
        this.y -= this.speed;
        if (this.y < 0) this.reset();
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.color;
        ctx.font = `${this.size}px Arial`;
        ctx.fillText(this.word, this.x, this.y);
        ctx.restore();
    }
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function animateBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateBackground);
}

// Initialize Particles
function initBackground() {
    resizeCanvas();
    particles = [];
    for (let i = 0; i < 35; i++) {
        particles.push(new Particle());
    }
    window.addEventListener('resize', resizeCanvas);
    animateBackground();
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
    
    // Simulate AI response
    setTimeout(() => {
        const responses = [
            "Understood. Processing through quantum layers...",
            "Fascinating query. Here's my synthesis: The universe aligns with your thought.",
            "AstraX here. Accessing multidimensional knowledge base.",
            "Echoing through the neural cosmos: " + text.split(' ').reverse().join(' ') + " resonates deeply."
        ];
        const reply = responses[Math.floor(Math.random() * responses.length)];
        addMessage(reply, false);
        saveChat();
    }, 800);
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

// Voice Input
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
    localStorage.setItem('astraAccount', JSON.stringify({ username, joined: new Date().toLocaleDateString() }));
    alert(`Welcome, ${username}!`);
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
