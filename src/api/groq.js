// src/api/groq.js
class GroqAPI {
    constructor() {
        this.apiKey = import.meta.env.VITE_GROQ_API_KEY;
        this.baseURL = 'https://api.groq.com/openai/v1';
        
        if (!this.apiKey) {
            console.error('GROQ API key not found! Check your .env file');
        }
    }
    
    async sendMessage(message, conversationHistory = []) {
        try {
            const response = await fetch(`${this.baseURL}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'llama-3.1-8b-instant',
                    messages: [
                        {
                            role: 'system',
                            content: 'Anda adalah asisten AI yang helpful dan ramah. Jawab dalam bahasa Indonesia dengan informatif.'
                        },
                        ...conversationHistory,
                        {
                            role: 'user',
                            content: message
                        }
                    ],
                    max_tokens: 1500,
                    temperature: 0.7,
                    stream: false
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Groq API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
            }
            
            const data = await response.json();
            return {
                success: true,
                message: data.choices[0].message.content,
                usage: data.usage
            };
            
        } catch (error) {
            console.error('Groq API Error:', error);
            return {
                success: false,
                error: error.message,
                message: 'Maaf, terjadi kesalahan saat menghubungi AI. Silakan coba lagi.'
            };
        }
    }
    
    // Test connection
    async testConnection() {
        try {
            const result = await this.sendMessage('Hi, are you working?');
            return result.success;
        } catch (error) {
            return false;
        }
    }
}

export default GroqAPI;