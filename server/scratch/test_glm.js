require('dotenv').config();
const OpenAI = require('openai');

const client = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

console.log('API Key:', process.env.NVIDIA_API_KEY ? 'Loaded (' + process.env.NVIDIA_API_KEY.slice(0, 15) + '...)' : 'MISSING!');

async function test() {
  try {
    const r = await client.chat.completions.create({
      model: 'z-ai/glm-5.1',
      messages: [{ role: 'user', content: 'Say: {"status":"ok","model":"glm-5.1"} — reply with only that JSON.' }],
      temperature: 0.1,
      max_tokens: 100,
      stream: false,
    });
    console.log('SUCCESS! Response:', r.choices[0].message.content);
  } catch (e) {
    console.error('FAILED:', e.message);
    if (e.status) console.error('HTTP Status:', e.status);
  }
}

test();
