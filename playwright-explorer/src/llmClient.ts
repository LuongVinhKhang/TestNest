import axios from 'axios';

export interface LLMAction {
  type: 'click' | 'fill' | 'navigate';
  selector: string;
  value?: string;
  assertion?: string;
}

export interface LLMResponse {
  actions: LLMAction[];
}

export interface LLMClientOptions {
  endpoint: string;
  apiKey?: string;
  provider: 'openai' | 'local' | 'gemini' | 'claude';
}

export class LLMClient {
  private endpoint: string;
  private apiKey?: string;
  private provider: 'openai' | 'local' | 'gemini' | 'claude';

  constructor(options: LLMClientOptions) {
    this.endpoint = options.endpoint;
    this.apiKey = options.apiKey;
    this.provider = options.provider;
  }

  async getActions(prompt: string): Promise<LLMResponse> {
    if (this.provider === 'openai') {
      const res = await axios.post(
        this.endpoint,
        {
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are an expert QA test generator.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.2,
          max_tokens: 512
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return this.safeParse(res.data.choices[0].message.content);
    } else if (this.provider === 'gemini') {
      // Gemini API (Google Generative Language)
      const res = await axios.post(
        this.endpoint + `?key=${this.apiKey}`,
        {
          contents: [
            { parts: [{ text: prompt }] }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      // Gemini returns: { candidates: [{ content: { parts: [{ text: ... }] } }] }
      const text = res.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      return this.safeParse(text);
    } else if (this.provider === 'claude') {
      // Claude API (Anthropic)
      const res = await axios.post(
        this.endpoint,
        {
          model: 'claude-3-opus-20240229',
          max_tokens: 1024,
          temperature: 0.2,
          messages: [
            { role: 'user', content: prompt }
          ]
        },
        {
          headers: {
            'x-api-key': this.apiKey,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json'
          }
        }
      );
      // Claude returns: { content: [{ text: ... }] }
      const text = res.data?.content?.[0]?.text || res.data?.content;
      return this.safeParse(text);
    } else {
      // Local LLM (Ollama HTTP endpoint, e.g. /v1/chat/completions)
      const res = await axios.post(
        this.endpoint,
        {
          model: 'mistral:latest',
          messages: [
            { role: 'user', content: prompt }
          ]
        },
        { headers: { 'Content-Type': 'application/json' } }
      );
      // Ollama returns: { choices: [{ message: { content: ... } }] }
      return this.safeParse(res.data.choices?.[0]?.message?.content || res.data.response);
    }
  }

  private safeParse(content: string): LLMResponse {
    // Log raw output for debugging
    console.log('--- Raw LLM output ---\n', content, '\n----------------------');
    // Try direct parse
    try {
      const json = JSON.parse(content);
      if (json && Array.isArray(json.actions)) {
        return this.repairActions(json);
      }
    } catch (e) {}
    // Try to extract JSON from text/code block
    const match = content.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        const json = JSON.parse(match[0]);
        if (json && Array.isArray(json.actions)) {
          return this.repairActions(json);
        }
      } catch (e) {}
    }
    // Try to extract JSON from markdown code block
    const codeBlock = content.match(/```json([\s\S]*?)```/i);
    if (codeBlock) {
      try {
        const json = JSON.parse(codeBlock[1]);
        if (json && Array.isArray(json.actions)) {
          return this.repairActions(json);
        }
      } catch (e) {}
    }
    // Fallback: extract all JSON objects, pick the largest
    try {
      const allObjects = content.match(/\{[\s\S]*?\}/g);
      if (allObjects && allObjects.length > 0) {
        let best = null;
        let bestLen = 0;
        for (const obj of allObjects) {
          try {
            const json = JSON.parse(obj);
            if (json && Array.isArray(json.actions)) {
              const len = JSON.stringify(json).length;
              if (len > bestLen) {
                best = json;
                bestLen = len;
              }
            }
          } catch (e) {}
        }
        if (best) return this.repairActions(best);
      }
    } catch (e) {}
    // Aggressive: try to repair common JSON issues (quotes, trailing commas)
    let repaired = content
      .replace(/([,{\[])(\s*)([a-zA-Z0-9_]+)(\s*):/g, '$1 "$3":') // unquoted keys
      .replace(/,\s*([}\]])/g, '$1') // trailing commas
      .replace(/\bTrue\b/g, 'true').replace(/\bFalse\b/g, 'false');
    try {
      const json = JSON.parse(repaired);
      if (json && Array.isArray(json.actions)) {
        return this.repairActions(json);
      }
    } catch (e) {}
    // Last resort: strip all non-JSON text and try again
    const onlyJson = content.replace(/^[\s\S]*?(\{[\s\S]*\})[\s\S]*$/m, '$1');
    try {
      const json = JSON.parse(onlyJson);
      if (json && Array.isArray(json.actions)) {
        return this.repairActions(json);
      }
    } catch (e) {}
    // If all else fails, synthesize login actions if credentials detected
    const lower = content.toLowerCase();
    if ((/user(name)?/.test(lower) || /email/.test(lower)) && /pass(word)?/.test(lower)) {
      // Instead of guessing selectors, return a synthetic login marker for explorer to handle
      return { actions: [ { type: 'fill', selector: '__auto_login__', value: '', assertion: '' } ] };
    }
    // Otherwise, return empty actions
    return { actions: [] };
  }

  // Aggressive post-processing: repair and validate actions, fill missing fields
  private repairActions(json: any): LLMResponse {
    const allowedTypes = ['click', 'fill', 'navigate'];
    const repaired: LLMAction[] = [];
    for (const action of json.actions) {
      if (!action || typeof action !== 'object') continue;
      // Only allow allowed types
      if (!allowedTypes.includes(action.type)) continue;
      // Must have selector
      if (!action.selector || typeof action.selector !== 'string') continue;
      // Value is optional, but must be string if present
      let value = typeof action.value === 'string' ? action.value : undefined;
      // Assertion is optional, but must be string if present
      let assertion = typeof action.assertion === 'string' ? action.assertion : undefined;
      // Fill missing value for fill actions
      if (action.type === 'fill' && !value) {
        if (/user(name)?/i.test(action.selector)) value = process.env.TEST_EMAIL || 'user@example.com';
        else if (/pass(word)?/i.test(action.selector)) value = process.env.TEST_PASSWORD || 'password123';
        else value = 'test';
      }
      // Remove extra fields
      repaired.push({
        type: action.type,
        selector: action.selector,
        value,
        assertion
      });
    }
    return { actions: repaired };
  }
}
