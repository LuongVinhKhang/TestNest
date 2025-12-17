import { container } from "tsyringe";

export class ServiceFactory {
  get<T>(token: symbol): T {
    return container.resolve<T>(token);
  }
}
