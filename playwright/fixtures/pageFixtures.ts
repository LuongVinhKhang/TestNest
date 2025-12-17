import { test as base } from "@playwright/test";
import { registerFramework } from "../core/container";
import { PageFactory } from "../factory/pageFactory";

registerFramework();

export const test = base.extend({
  factory: async ({ page }, use) => {
    await use(new PageFactory(page));
  },
});

export { expect } from "@playwright/test";
