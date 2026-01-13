# Playwright Explorer: AI-Driven Web Test Exploration Agent

## Overview

Playwright Explorer is an autonomous agent that uses Playwright and an LLM to automatically explore a local website, generate and execute actions, and write runnable Playwright test cases in TypeScript.

## Features
- Launches a browser and visits a starting URL
- Extracts DOM and visible text
- Sends page context to an LLM (local or OpenAI-compatible)
- Receives suggested actions and assertions in strict JSON
- Executes actions and validates selectors
- Appends valid Playwright tests to `tests/generated/`
- Avoids duplicate test generation
- Logs each exploration step

## Project Structure
- `package.json`, `tsconfig.json`, `playwright.config.ts`
- `src/`
  - `agent.ts` — Main agent logic
  - `explorer.ts` — DOM extraction and action execution
  - `llmClient.ts` — LLM abstraction (local or OpenAI-compatible)
  - `testWriter.ts` — Test file writer
- `tests/generated/ai-generated.spec.ts` — Output tests

## How It Works
1. Run `pnpm install` to install dependencies.
2. Start your local website (e.g. `http://localhost:3032`).
3. Run the agent: `npx ts-node src/agent.ts` or `pnpm explore`.
4. The agent explores the site, generates actions, and writes tests.
5. Run generated tests: `npx playwright test`.

## Switching LLM Providers
- By default, uses a local LLM endpoint (e.g. Ollama) or OpenAI-compatible API.
- Configure endpoint and API key in `src/llmClient.ts` or via environment variables.

## Pointing to a Local Website
- Set the `baseURL` in `playwright.config.ts` (default: `http://localhost:3032`).
- The agent will start from this URL.

## Requirements
- Node.js >= 18
- pnpm (recommended) or npm

## License
MIT
