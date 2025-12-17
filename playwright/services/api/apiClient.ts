import axios from "axios";
import { env } from "../../core/environment";
import { injectable } from "tsyringe";

@injectable()
export class ApiClient {
  client = axios.create({ baseURL: env.apiUrl });

  get(url: string) {
    return this.client.get(url);
  }
  post(url: string, data: any) {
    return this.client.post(url, data);
  }
}
