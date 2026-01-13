import axios from 'axios';

/**
 * summarizeWithLLM: Sends code to an LLM endpoint and returns a summary.
 * You must configure your LLM endpoint and API key via environment variables or .env.
 */
export async function summarizeWithLLM(code: string, filename: string): Promise<string> {
  const endpoint = process.env.LLM_SUMMARIZER_ENDPOINT;
  const apiKey = process.env.LLM_SUMMARIZER_API_KEY;
  if (!endpoint || !apiKey) throw new Error('LLM endpoint or API key not set');

  const prompt = `Summarize the following code file (${filename}) for a QA automation agent. Focus on routes, API endpoints, component names/props, and any business logic relevant for automated testing.\n\nCODE:\n${code}`;

  const response = await axios.post(endpoint, {
    model: process.env.LLM_SUMMARIZER_MODEL || 'gpt-4',
    messages: [
      { role: 'system', content: 'You are a senior QA automation engineer.' },
      { role: 'user', content: prompt }
    ],
    max_tokens: 512,
    temperature: 0.2
  }, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  });

  // OpenAI/compatible response
  return response.data.choices?.[0]?.message?.content?.trim() || '[No summary returned]';
}
