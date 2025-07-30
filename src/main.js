// src/main.js
import './style.css'
import GroqAPI from './api/groq.js'

// Initialize Groq API
const groq = new GroqAPI();
let conversationHistory = [];
let isLoading = false;

// Create chat interface
document.querySelector('#app').innerHTML = `
  <div class="chat-container">
    <div class="chat-header">
      <div class="status-indicator" id="statusIndicator"></div>
      <h1>AI Assistant</h1>
      <p>Powered by Groq AI - Super Fast Response</p>
    </div>
    
    <div class="chat-messages" id="chatMessages">
      <div class="message ai-message">
        Hi, saya akan membantu anda. Silakan tanyakan apa saja yang Anda butuhkan!
      </div>
    </div>
    
    <div class="input-area">
      <textarea 
        class="message-input" 
        id="messageInput" 
        placeholder="Ketik pesan Anda di sini..."
        rows="1"
      ></textarea>
      <button class="send-button" id="sendButton">
        Kirim
      </button>
    </div>
  </div>
`;

// DOM elements
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const chatMessages = document.getElementById('chatMessages');
const statusIndicator = document.getElementById('statusIndicator');

// Event listeners
sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keydown', handleKeyDown);
messageInput.addEventListener('input', autoResize);

// Test connection on load
testGroqConnection();

async function testGroqConnection() {
    const isConnected = await groq.testConnection();
    if (isConnected) {
        statusIndicator.style.background = '#4ade80'; // Green
        console.log('✅ Groq API connected successfully');
    } else {
        statusIndicator.style.background = '#ef4444'; // Red
        console.error('❌ Groq API connection failed');
        addMessage('⚠️ Koneksi ke AI bermasalah. Periksa API key Anda.', 'ai');
    }
}

async function sendMessage() {
    const message = messageInput.value.trim();
    
    if (!message || isLoading) return;
    
    // Add user message
    addMessage(message, 'user');
    conversationHistory.push({ role: 'user', content: message });
    
    // Clear input
    messageInput.value = '';
    autoResize();
    
    // Show loading state
    setLoading(true);
    showTypingIndicator();
    
    try {
        // Call Groq API
        const result = await groq.sendMessage(message, conversationHistory);
        
        hideTypingIndicator();
        
        if (result.success) {
            addMessage(result.message, 'ai');
            conversationHistory.push({ role: 'assistant', content: result.message });
            
            // Log usage for debugging
            if (result.usage) {
                console.log('📊 Token usage:', result.usage);
            }
        } else {
            addMessage(result.message, 'ai');
            console.error('Groq API Error:', result.error);
        }
        
    } catch (error) {
        hideTypingIndicator();
        addMessage('Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi.', 'ai');
        console.error('Unexpected error:', error);
    } finally {
        setLoading(false);
        messageInput.focus();
    }
}

function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.textContent = text;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
        AI sedang mengetik
        <span class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
        </span>
    `;
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.remove();
    }
}

function setLoading(loading) {
    isLoading = loading;
    sendButton.disabled = loading;
    messageInput.disabled = loading;
    
    if (loading) {
        sendButton.textContent = 'Mengirim...';
        statusIndicator.style.background = '#f59e0b'; // Orange
    } else {
        sendButton.textContent = 'Kirim';
        statusIndicator.style.background = '#4ade80'; // Green
    }
}

function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

function autoResize() {
    messageInput.style.height = 'auto';
    messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + 'px';
}

// Focus input on load
window.addEventListener('load', () => {
    messageInput.focus();
});

// Add some helpful startup logs
console.log('🚀 Groq AI Chat initialized');
console.log('💡 Tips: Press Enter to send, Shift+Enter for new line');