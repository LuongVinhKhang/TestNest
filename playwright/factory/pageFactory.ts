import { container } from "tsyringe";
import { TYPES } from "../core/types";
import { Page } from "@playwright/test";

export class PageFactory {
  constructor(page: Page) {
    container.registerInstance(TYPES.Page, page);
  }

  get<T>(token: symbol): T {
    return container.resolve<T>(token);
  }
}
