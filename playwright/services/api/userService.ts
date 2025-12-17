import { injectable, inject } from "tsyringe";
import { ApiClient } from "./apiClient";

@injectable()
export class UserService {
  constructor(private api: ApiClient) {}

  createUser(data: any) {
    return this.api.post("/users", data);
  }
}
