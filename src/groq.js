import Groq from "groq-sdk";

class GroqService {
  constructor() {
    this.groq = new Groq({
      apiKey: import.meta.env.VITE_GROQ_API_KEY,
      dangerouslyAllowBrowser: true
    });
  }

  async chat(message, model = "llama3-8b-8192") {
    try {
      const chatCompletion = await this.groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
        model: model,
      });

      return chatCompletion.choices[0]?.message?.content || "";
    } catch (error) {
      console.error("Error calling Groq API:", error);
      throw error;
    }
  }

  async streamChat(message, onChunk, model = "llama3-8b-8192") {
    try {
      const stream = await this.groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
        model: model,
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          onChunk(content);
        }
      }
    } catch (error) {
      console.error("Error streaming from Groq API:", error);
      throw error;
    }
  }
}

export default new GroqService();
