// Store generated code for each language
const generatedCode = {
  python: '',
  c: '',
  java: ''
};

let activeLang = 'python';

// ── Tab switching ──
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    activeLang = tab.dataset.lang;
    showCode(activeLang);
  });
});

function showCode(lang) {
  const output = document.getElementById('code-output');
  const code = generatedCode[lang] || '// No code generated yet for ' + lang;

  // Split into individual lines, each gets its own <code> tag
  output.innerHTML = code
    .split('\n')
    .map(line => {
      const el = document.createElement('code');
      el.className = lang === 'c' ? 'language-c' : 'language-' + lang;
      el.textContent = line || ' '; // empty lines need a space to render
      return el.outerHTML;
    })
    .join('');

  // Highlight each line individually
  output.querySelectorAll('code').forEach(block => {
    block.removeAttribute('data-highlighted');
    hljs.highlightElement(block);
  });
}
// ── Copy button ──
document.getElementById('copy-btn').addEventListener('click', () => {
  const code = generatedCode[activeLang];
  if (!code) return;
  navigator.clipboard.writeText(code);
  const btn = document.getElementById('copy-btn');
  btn.textContent = 'Copied!';
  setTimeout(() => btn.textContent = 'Copy', 2000);
});
document.getElementById('explain-btn').addEventListener('click', explainCode);
document.getElementById('close-explain-btn').addEventListener('click', () => {
document.getElementById('explain-panel').classList.remove('open');
});

const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const messages = document.getElementById('messages');

form.addEventListener('submit', async function(e) {
  e.preventDefault();

  const userText = input.value.trim();
  if (!userText) return;

  addMessage('user', userText);
  input.value = '';

  const thinking = addMessage('bot', 'Generating code...');

  try {
  const response = await fetch('/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'meta-llama/llama-3.1-8b-instruct',
      messages: [
        {
          role: 'system',
          content: `You are a code generator. When the user describes a task,
you MUST respond in exactly this format and nothing else:

PYTHON:
\`\`\`python
<python code here>
\`\`\`

C:
\`\`\`c
<c code here>
\`\`\`

JAVA:
\`\`\`java
<java code here>
\`\`\`

Write clean, working code with comments explaining each step.`
        },
        {
          role: 'user',
          content: userText
        }
      ]
    })
  });

  // Check if the HTTP request itself failed
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || 'HTTP ' + response.status);
  }

  const data = await response.json();

  // Check if response has the expected structure
  if (!data.choices || data.choices.length === 0) {
    throw new Error('No response from model. Try a different model.');
  }

  const reply = data.choices[0].message.content;

// Extract all three languages first
const pythonCode = extractCode(reply, 'python');
const cCode      = extractCode(reply, 'c');
const javaCode   = extractCode(reply, 'java');

// Type out the active language first, then silently store the rest
typeWriter(pythonCode, 'python', () => {
  // After python finishes typing, silently store C and Java
  generatedCode.c    = cCode;
  generatedCode.java = javaCode;

  thinking.textContent = '✓ code generated — switch tabs to view all languages';
  thinking.classList.add('success');
});

// If user is already on C or Java tab, type that one instead
if (activeLang === 'c') {
  generatedCode.python = pythonCode;
  typeWriter(cCode, 'c', () => {
    generatedCode.java = javaCode;
    thinking.textContent = 'code generated successfully';
    thinking.classList.add('success');
  });
} else if (activeLang === 'java') {
  generatedCode.python = pythonCode;
  generatedCode.c      = cCode;
  typeWriter(javaCode, 'java', () => {
    thinking.textContent = 'code generated successfully';
    thinking.classList.add('success');
  });
}

} catch (err) {
  thinking.textContent = '✗ ' + err.message;
  thinking.classList.add('error');
  console.error('Full error:', err);
}
});

function extractCode(text, lang) {
  // Pulls code from ```language ... ``` blocks
  const regex = new RegExp('```' + lang + '\\s*([\\s\\S]*?)```', 'i');
  const match = text.match(regex);
  return match ? match[1].trim() : 'Could not generate ' + lang + ' code.';
}

function addMessage(role, text, type = '') {
  const div = document.createElement('div');
  div.className = 'msg ' + role + (type ? ' ' + type : '');
  div.textContent = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
  return div;
}
function typeWriter(text, lang, onDone) {
  let index = 0;
  generatedCode[lang] = '';

  const interval = setInterval(() => {
    generatedCode[lang] += text[index];
    index++;
    showCode(lang);

    if (index >= text.length) {
      clearInterval(interval);
      if (onDone) onDone();
    }
  }, 8); // speed: lower = faster, higher = slower
}
async function explainCode() {
  const code = generatedCode[activeLang];

  if (!code || code.startsWith('//')) {
    addMessage('bot', '✗ generate some code first before explaining.');
    return;
  }

  // Open the panel
  const panel = document.getElementById('explain-panel');
  const body  = document.getElementById('explain-body');
  panel.classList.add('open');

  // Show loading state
  body.innerHTML = '<div class="explain-loading">// analyzing code...</div>';

  const btn = document.getElementById('explain-btn');
  btn.disabled = true;
  btn.textContent = 'explaining...';

  try {
    const response = await fetch('/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.1-8b-instruct',
        messages: [
          {
            role: 'system',
            content: `You are a code explainer. Explain the given code in exactly this JSON format and nothing else:
{
  "overview": "one sentence of what this code does",
  "steps": [
    { "title": "STEP 01", "text": "explanation of this part" },
    { "title": "STEP 02", "text": "explanation of this part" }
  ],
  "output": "what the program prints or returns"
}
Return only valid JSON. No markdown, no backticks, no extra text.`
          },
          {
            role: 'user',
            content: `Explain this ${activeLang} code:\n\n${code}`
          }
        ]
      })
    });

    const data = await response.json();

    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response from model.');
    }

    const raw = data.choices[0].message.content;
    const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());

    // Clear loading
    body.innerHTML = '';

    // Overview block
    const overviewBlock = document.createElement('div');
    overviewBlock.className = 'explain-block';
    overviewBlock.innerHTML = `
      <div class="block-num">OVERVIEW</div>
      <div class="block-text">${parsed.overview}</div>
    `;
    body.appendChild(overviewBlock);

    // Step blocks
    parsed.steps.forEach(step => {
      const block = document.createElement('div');
      block.className = 'explain-block';
      block.innerHTML = `
        <div class="block-num">${step.title}</div>
        <div class="block-text">${step.text}</div>
      `;
      body.appendChild(block);
    });

    // Output block
    const outputBlock = document.createElement('div');
    outputBlock.className = 'explain-block';
    outputBlock.innerHTML = `
      <div class="block-num">OUTPUT</div>
      <div class="block-text">${parsed.output}</div>
    `;
    body.appendChild(outputBlock);

  } catch (err) {
    body.innerHTML = `<div class="explain-block"><div class="block-text" style="color:#ff5f57">✗ ${err.message}</div></div>`;
  } finally {
    btn.disabled = false;
    btn.textContent = 'explain';
  }
}