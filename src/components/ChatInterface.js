import groqService from '../api/groq.js';

export class ChatInterface {
  constructor(containerId) {
    this.container = document.querySelector(containerId);
    this.chatMessages = null;
    this.userInput = null;
    this.sendButton = null;
    this.init();
  }

  init() {
    this.render();
    this.bindEvents();
    this.addWelcomeMessage();
  }

  render() {
    this.container.innerHTML = `
      <div class="chat-container">
        <div id="chat-messages" class="chat-messages"></div>
        
        <div class="input-container">
          <input type="text" id="user-input" placeholder="Tulis pesan Anda..." />
          <button id="send-button">Kirim</button>
        </div>
      </div>
    `;

    this.chatMessages = this.container.querySelector('#chat-messages');
    this.userInput = this.container.querySelector('#user-input');
    this.sendButton = this.container.querySelector('#send-button');
  }

  bindEvents() {
    this.sendButton.addEventListener('click', () => this.sendMessage());
    this.userInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.sendMessage();
      }
    });
  }

  addMessage(content, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
    messageDiv.textContent = content;
    this.chatMessages.appendChild(messageDiv);
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }

  addStreamingMessage() {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ai-message';
    messageDiv.id = 'streaming-message';
    this.chatMessages.appendChild(messageDiv);
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    return messageDiv;
  }

  async sendMessage() {
    const message = this.userInput.value.trim();
    if (!message) return;

    // Add user message
    this.addMessage(message, true);
    this.userInput.value = '';
    this.sendButton.disabled = true;

    try {
      // Create streaming message container
      const streamingDiv = this.addStreamingMessage();
      let fullResponse = '';

      // Stream response from Groq
      await groqService.streamChat(message, (chunk) => {
        fullResponse += chunk;
        streamingDiv.textContent = fullResponse;
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
      });

      // Remove streaming id
      streamingDiv.removeAttribute('id');

    } catch (error) {
      console.error('Error:', error);
      this.addMessage('Maaf, terjadi kesalahan. Silakan coba lagi.');
    } finally {
      this.sendButton.disabled = false;
    }
  }

  addWelcomeMessage() {
    this.addMessage('Halo! Saya adalah AI assistant yang didukung oleh Groq. Silakan tanya apa saja!');
  }
}
