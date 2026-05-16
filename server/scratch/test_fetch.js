require('dotenv').config({ path: '../.env' });
const url = 'https://integrate.api.nvidia.com/v1/chat/completions';
const key = process.env.NVIDIA_API_KEY;

fetch(url, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${key}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'z-ai/glm-5.1',
    messages: [{ role: 'user', content: 'Reply with JSON: {"status": "ok"}' }],
    max_tokens: 100,
    stream: false,
    temperature: 0.1
  })
}).then(res => res.json()).then(data => console.log(JSON.stringify(data, null, 2))).catch(err => console.error(err));
