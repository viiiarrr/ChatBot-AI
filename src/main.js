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
        Anda juga bisa mengirim gambar untuk saya analisis 📸
      </div>
    </div>
    
    <div class="input-area">
      <div class="image-preview" id="imagePreview" style="display: none;">
        <img id="previewImg" alt="Preview" />
        <button class="remove-image" id="removeImage">×</button>
      </div>
      <div class="input-controls">
        <button class="image-button" id="imageButton" title="Upload Gambar">
          📸
        </button>
        <textarea 
          class="message-input" 
          id="messageInput" 
          placeholder="Ketik pesan Anda di sini atau upload gambar..."
          rows="1"
        ></textarea>
        <button class="send-button" id="sendButton">
          Kirim
        </button>
      </div>
      <input type="file" id="imageInput" accept="image/*" style="display: none;" />
    </div>
  </div>
`;

// DOM elements
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const chatMessages = document.getElementById('chatMessages');
const statusIndicator = document.getElementById('statusIndicator');
const imageButton = document.getElementById('imageButton');
const imageInput = document.getElementById('imageInput');
const imagePreview = document.getElementById('imagePreview');
const previewImg = document.getElementById('previewImg');
const removeImage = document.getElementById('removeImage');

let selectedImage = null;

// Event listeners
sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keydown', handleKeyDown);
messageInput.addEventListener('input', autoResize);
imageButton.addEventListener('click', () => imageInput.click());
imageInput.addEventListener('change', handleImageSelect);
removeImage.addEventListener('click', clearImage);

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
    
    if ((!message && !selectedImage) || isLoading) return;
    
    // Add user message with image if present
    if (selectedImage) {
        addMessageWithImage(message || 'Analisis gambar ini', 'user', selectedImage);
    } else {
        addMessage(message, 'user');
    }
    
    conversationHistory.push({ 
        role: 'user', 
        content: selectedImage ? `${message || 'Analisis gambar ini'} [Gambar dikirim]` : message 
    });
    
    // Clear input and image
    messageInput.value = '';
    const imageData = selectedImage;
    clearImage();
    autoResize();
    
    // Show loading state
    setLoading(true);
    showTypingIndicator();
    
    try {
        // Call Groq API with image if present
        const result = await groq.sendMessage(message || 'Analisis gambar ini', conversationHistory, imageData);
        
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

// Image handling functions
function handleImageSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran gambar terlalu besar. Maksimal 5MB.');
        return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
        alert('File harus berupa gambar.');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        selectedImage = e.target.result;
        previewImg.src = selectedImage;
        imagePreview.style.display = 'block';
        messageInput.placeholder = 'Tambahkan deskripsi untuk gambar (opsional)...';
    };
    reader.readAsDataURL(file);
}

function clearImage() {
    selectedImage = null;
    imagePreview.style.display = 'none';
    previewImg.src = '';
    imageInput.value = '';
    messageInput.placeholder = 'Ketik pesan Anda di sini atau upload gambar...';
}

function addMessageWithImage(text, sender, imageSrc) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    if (imageSrc) {
        messageDiv.innerHTML = `
            <div class="message-image">
                <img src="${imageSrc}" alt="Uploaded image" style="max-width: 200px; border-radius: 8px; margin-bottom: 8px;" />
            </div>
            <div>${text}</div>
        `;
    } else {
        messageDiv.textContent = text;
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Focus input on load
window.addEventListener('load', () => {
    messageInput.focus();
});

// Add some helpful startup logs
console.log('🚀 Groq AI Chat initialized with Vision support');
console.log('💡 Tips: Press Enter to send, Shift+Enter for new line, 📸 for images');