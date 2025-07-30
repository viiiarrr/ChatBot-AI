// src/api/groq.js
class GroqAPI {
    constructor() {
        this.apiKey = import.meta.env.VITE_GROQ_API_KEY;
        this.baseURL = 'https://api.groq.com/openai/v1';
        
        if (!this.apiKey) {
            console.error('GROQ API key not found! Check your .env file');
        }
    }
    
    async sendMessage(message, conversationHistory = [], imageData = null) {
        try {
            let messages = [
                {
                    role: 'system',
                    content: 'Anda adalah asisten AI yang helpful dan ramah. Jawab dalam bahasa Indonesia dengan informatif. Jika ada gambar, analisis dengan detail.'
                },
                ...conversationHistory
            ];

            // Jika ada gambar, gunakan model vision
            if (imageData) {
                messages.push({
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: message || 'Tolong analisis gambar ini dengan detail.'
                        },
                        {
                            type: 'image_url',
                            image_url: {
                                url: imageData
                            }
                        }
                    ]
                });
            } else {
                messages.push({
                    role: 'user',
                    content: message
                });
            }

            const response = await fetch(`${this.baseURL}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: imageData ? 'llava-v1.5-7b-4096-preview' : 'llama-3.1-8b-instant',
                    messages: messages,
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