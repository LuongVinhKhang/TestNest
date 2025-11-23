import dotenv from "dotenv";
import path from "path";

// Load env file
const envFile = process.env.ENV_FILE || ".env.local";
dotenv.config({ path: path.resolve(__dirname, envFile) });

// Validate and export variables
function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env variable: ${name}`);
  return value;
}

export const ENV = {
  URL: getEnvVar("URL"),
};
