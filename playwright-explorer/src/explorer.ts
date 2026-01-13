


import { Page } from '@playwright/test';
import { LLMAction } from './llmClient';
const BASE_URL = process.env.BASE_URL || 'http://localhost:3032';

class Explorer {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async extractContext(): Promise<string> {
    const dom = await this.page.content();
    const text = await this.page.evaluate(() => document.body.innerText);
    return `DOM:\n${dom}\n\nVisible Text:\n${text}`;
  }

  async executeActions(actions: LLMAction[]): Promise<string[]> {
    const logs: string[] = [];
    for (const action of actions) {
      if (action.type === 'navigate') {
        if (typeof action.value === 'string') {
          let navUrl = action.value;
          // If relative URL, resolve to absolute
          if (/^\//.test(navUrl)) {
            navUrl = BASE_URL.replace(/\/$/, '') + navUrl;
          }
          if (/^(https?:\/\/)/.test(navUrl)) {
            await this.page.goto(navUrl);
            logs.push(`Navigated to ${navUrl}`);
          } else {
            logs.push(`Skipped invalid navigate value: ${action.value}`);
          }
        } else {
          logs.push(`Skipped invalid navigate value: ${action.value}`);
        }
        continue;
      }
      // Validate selector exists for click/fill
      const exists = await this.page.$(action.selector);
      if (!exists) {
        logs.push(`Selector not found: ${action.selector}`);
        continue;
      }
      if (action.type === 'click') {
        await this.page.click(action.selector);
        logs.push(`Clicked ${action.selector}`);
      } else if (action.type === 'fill' && action.value) {
        await this.page.fill(action.selector, action.value);
        logs.push(`Filled ${action.selector} with '${action.value}'`);
      }
      if (action.assertion) {
        logs.push(`Assertion: ${action.assertion}`);
      }
    }
    return logs;
  }
}

export default Explorer;
