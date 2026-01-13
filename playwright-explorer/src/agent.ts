
import { chromium } from '@playwright/test';
import { LLMClient, LLMClientOptions } from './llmClient';
import Explorer from './explorer';
import { TestWriter } from './testWriter';
import { loadEnv } from './env';
loadEnv();

const BASE_URL = process.env.BASE_URL || 'http://localhost:3032';
const LLM_PROVIDER = (process.env.LLM_PROVIDER as 'openai' | 'local' | 'gemini' | 'claude') || 'local';
let LLM_ENDPOINT = process.env.LLM_ENDPOINT;
let LLM_API_KEY = process.env.LLM_API_KEY;

if (!LLM_ENDPOINT) {
  if (LLM_PROVIDER === 'openai') {
    LLM_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
  } else if (LLM_PROVIDER === 'gemini') {
    LLM_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
  } else {
    LLM_ENDPOINT = 'http://localhost:11434/v1/chat/completions';
  }
}

const llmOptions: LLMClientOptions = {
  endpoint: LLM_ENDPOINT,
  apiKey: LLM_API_KEY,
  provider: LLM_PROVIDER
};

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  const explorer = new Explorer(page);
  const llm = new LLMClient(llmOptions);
  const testWriter = new TestWriter();

  // Read combined site context from agent-context/site-context.md
  const fs = await import('fs/promises');
  let siteContext = '';
  try {
    siteContext = await fs.readFile('./agent-context/site-context.md', 'utf8');
  } catch (e) {
    siteContext = '';
  }

  let url = BASE_URL;
  let step = 1;
  let loggedIn = false;
  for (let i = 0; i < 6; i++) { // Allow more steps for deeper exploration
    console.log(`\n--- Exploration Step ${step} ---`);
    await page.goto(url);
    const context = await explorer.extractContext();
    // Detect login page
    let credentials = '';
    const isLoginPage = /login|username|password/i.test(context);
    if (isLoginPage && !loggedIn) {
      const testEmail = process.env.TEST_EMAIL || 'user@example.com';
      const testPassword = process.env.TEST_PASSWORD || 'password123';
      credentials = `\nLogin credentials for this site:\n- username: ${testEmail}\n- password: ${testPassword}`;
    }
    const prompt = `${siteContext}\n\nYou are an expert QA test generator. You must reply with ONLY valid JSON in this format (no explanation, no markdown):\\n{\\n  \"actions\": [\\n    {\\n      \"type\": \"click | fill | navigate\",\\n      \"selector\": \"CSS selector\",\\n      \"value\": \"optional text\",\\n      \"assertion\": \"Playwright expect() statement\"\\n    }\\n  ]\\n}\\nPage context:\n${context}${credentials}`;
    let actions;
    try {
      const resp = await llm.getActions(prompt);
      actions = resp.actions;
    } catch (e) {
      console.error('LLM error:', e);
      break;
    }
    if (!actions || actions.length === 0) {
      console.log('No actions returned by LLM.');
      break;
    }
    // If already logged in, filter out login actions and navigation to /auth/login
    const pageUrl = page.url();
    const isOnLoginPage = /\/auth\/login/.test(pageUrl);
    if (loggedIn || !isLoginPage) {
      actions = actions.filter(a => {
        if (a.type === 'navigate' && typeof a.value === 'string' && /\/auth\/login/.test(a.value)) return false;
        if (a.type === 'fill' && /email|user|pass/i.test(a.selector)) return false;
        if (a.type === 'click' && /login/i.test(a.selector)) return false;
        return true;
      });
    }
    // If not on login page, filter out any navigation to /auth/login
    if (!isOnLoginPage) {
      actions = actions.filter(a => !(a.type === 'navigate' && typeof a.value === 'string' && /\/auth\/login/.test(a.value)));
    }
    const logs: string[] = await explorer.executeActions(actions);
    logs.forEach((log: string) => console.log(log));
    testWriter.appendTest(actions, step);
    // If a navigate action, update URL
    const nav = actions.find((a: any) => a.type === 'navigate' && a.value);
    if (nav) url = nav.value!;
    // Detect successful login by URL or context
    if (!loggedIn && !isLoginPage && /dashboard|home|main|patient|app/i.test(pageUrl + context)) {
      loggedIn = true;
      console.log('Login successful, starting exploration.');
    }
    step++;
  }
  await browser.close();
})();
