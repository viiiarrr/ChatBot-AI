# Groq AI Chat Application

A modern chat application powered by Groq AI API for ultra-fast AI responses.

🌟 **Live Demo**: 
- **Vercel**: https://chatbot-khy8mucfi-aimanyoviars-projects.vercel.app/
- **Surge.sh**: https://chatbot-viar.surge.sh/

## Features

- ⚡ Real-time streaming responses
- 🎨 Modern and responsive UI
- 🌙 Dark/Light mode support
- 🔒 Secure API key management
- 📱 Mobile-friendly design

## Project Structure

```
groq-ai-chat/
├── .env                 # Environment variables (API keys)
├── .gitignore          # Git ignore rules
├── index.html          # Main HTML file
├── package.json        # Dependencies and scripts
└── src/
    ├── main.js         # Application entry point
    ├── style.css       # Global styles
    ├── javascript.svg  # JavaScript logo
    ├── api/
    │   └── groq.js     # Groq API service
    ├── components/
    │   └── ChatInterface.js  # Chat UI component
    └── utils/
        └── helpers.js  # Utility functions
```

## Quick Start

🚀 **Just want to try it?** Visit: https://chatbot-viar.surge.sh/

No installation needed! Just open the link and start chatting with AI.

## For Developers

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/viiiarrr/ChatBot-AI.git
   cd ChatBot-AI
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file with your Groq API key:
   ```
   VITE_GROQ_API_KEY=your_api_key_here
   ```

4. Run development server:
   ```bash
   npm run dev
   ```

### Get Your API Key

1. Visit [Groq Console](https://console.groq.com/keys)
2. Sign up for a free account
3. Generate a new API key
4. Add it to your `.env` file

## Technologies

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Build Tool**: Vite
- **AI API**: Groq (LLaMA models)
- **Deployment**: Ready for Vercel, Netlify, etc.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Deployment

This project is configured for easy deployment on:
- **Vercel**: Deploy with zero configuration
- **Surge.sh**: Simple static hosting
- **Netlify**: Automatic deployments from Git

### Environment Variables for Deployment

Make sure to set your `VITE_GROQ_API_KEY` in your deployment platform's environment variables.

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request
