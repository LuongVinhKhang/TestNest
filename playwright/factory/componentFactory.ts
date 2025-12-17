import { container } from "tsyringe";

export class ComponentFactory {
  get<T>(token: symbol): T {
    return container.resolve<T>(token);
  }
}
