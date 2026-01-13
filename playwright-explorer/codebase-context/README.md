# Codebase Context Scripts

This folder contains scripts to extract and summarize information from your frontend (Next.js) and backend (dotnet) codebases. The output can be used to provide richer context to the AI agent for test generation.

## Scripts
- `extract-fe-summary.ts`: Summarizes the Next.js frontend (routes, components, API calls, etc).
- `extract-be-summary.ts`: Summarizes the dotnet backend (controllers, endpoints, models, etc).
- `combine-context.ts`: Combines FE/BE summaries and site documentation into a single context file for the agent.

## Usage
1. Place these scripts in this folder.
2. Run each script as needed to update summaries.
3. Use `combine-context.ts` to generate `site-context.md` for the agent.

---

You can extend or customize these scripts for your project structure.
