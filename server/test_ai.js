require('dotenv').config({ path: './.env' });
const aiService = require('./services/aiService');

const mockResume = `
John Doe
Software Engineer
Skills: React, Node.js, MongoDB, JavaScript
Experience: 3 years building web applications.
`;

const mockJD = `
We are looking for a Software Engineer with experience in React, Node.js, and MongoDB.
`;

async function test() {
  try {
    console.log('Testing aiService...');
    const result = await aiService.analyzeResumeVsJD(mockResume, mockJD);
    console.log('SUCCESS:', result);
  } catch (error) {
    console.error('FAILED:', error);
  }
}

test();
