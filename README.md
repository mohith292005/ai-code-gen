# ⚡ AI Code Generator

Plain English → Python · C · Java — simultaneously

[![RUNBOT](https://img.shields.io/badge/RUNBOT-ff5f57?style=for-the-badge&logo=render&logoColor=white)](https://ai-code-gen-imc9.onrender.com)

![Node.js + Express](https://img.shields.io/badge/Node.js_+_Express-1a1a1a?style=flat-square&color=111111&labelColor=1a1a1a&logo=node.js&logoColor=ff5f57)
![OpenRouter API](https://img.shields.io/badge/OpenRouter_API-1a1a1a?style=flat-square&color=111111&labelColor=1a1a1a&logoColor=ff5f57)
![Llama 3.1 8B](https://img.shields.io/badge/Llama_3.1_8B-1a1a1a?style=flat-square&color=111111&labelColor=1a1a1a&logoColor=ff5f57)
![Render](https://img.shields.io/badge/Render-1a1a1a?style=flat-square&color=111111&labelColor=1a1a1a&logo=render&logoColor=ff5f57)

---

## // Features

- ▸ Multi-language output — Python, C, and Java at once
- ▸ Syntax highlighting via Highlight.js
- ▸ Step-by-step code explanation in a slide-in panel
- ▸ Typewriter effect — code types out live character by character
- ▸ Copy button — copy any language's code instantly
- ▸ Secure API — key stored server-side, never in the browser

---

## // How It Works

```
User types a description
        ↓
Frontend sends request to Express server
        ↓
Server adds API key and calls OpenRouter
        ↓
Llama 3.1 generates code in 3 languages
        ↓
Code appears with typewriter effect + syntax highlighting
```

---

## // Run Locally

```bash
# 1. Clone the repo
git clone https://github.com/mohith292005/ai-code-gen.git

# 2. Install dependencies
cd ai-code-gen && npm install

# 3. Add your API key
echo "OPENROUTER_API_KEY=your-key-here" > .env

# 4. Start the server
npm run dev  →  http://localhost:3000
```

---

## // Usage

1. Open the app and type what you want to build
2. Press Enter — code generates in Python, C, and Java
3. Switch tabs to view each language's output
4. Click **explain** for a step-by-step breakdown
5. Click **copy** to copy any language's code

---

## // Project Structure

```
ai-code-gen/
├── index.html   — UI structure
├── style.css    — terminal theme styling
├── app.js       — frontend logic + API calls
├── server.js    — Express backend + API key proxy
├── .env         — API key (not pushed to GitHub)
└── package.json — project config and scripts
```

---

## // Tech Stack

`HTML/CSS/JS` `Node.js` `Express` `OpenRouter` `Highlight.js` `Render`

---

Author — **Mohith A**
