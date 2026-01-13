import fs from 'fs';
import path from 'path';
import { LLMAction } from './llmClient';

const GENERATED_DIR = path.join(__dirname, '../tests/generated');
const GENERATED_FILE = path.join(GENERATED_DIR, 'ai-generated.spec.ts');

export class TestWriter {
  private seen: Set<string> = new Set();

  constructor() {
    if (!fs.existsSync(GENERATED_DIR)) {
      fs.mkdirSync(GENERATED_DIR, { recursive: true });
    }
    if (!fs.existsSync(GENERATED_FILE)) {
      fs.writeFileSync(GENERATED_FILE, this.header());
    }
  }

  private header(): string {
    return `import { test, expect } from '@playwright/test';\n\n`;
  }

  appendTest(actions: LLMAction[], step: number) {
    const hash = JSON.stringify(actions);
    if (this.seen.has(hash)) return;
    this.seen.add(hash);
    const testName = `AI generated test step ${step}`;
    let body = `test('${testName}', async ({ page }) => {\n`;
    for (const action of actions) {
      if (action.type === 'click') {
        body += `  await page.click('${action.selector}');\n`;
      } else if (action.type === 'fill' && action.value) {
        body += `  await page.fill('${action.selector}', '${action.value}');\n`;
      } else if (action.type === 'navigate' && action.value) {
        body += `  await page.goto('${action.value}');\n`;
      }
      if (action.assertion) {
        body += `  ${action.assertion}\n`;
      }
    }
    body += `});\n\n`;
    fs.appendFileSync(GENERATED_FILE, body);
  }
}
