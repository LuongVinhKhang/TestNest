You are a senior QA automation architect and AI agent engineer.

Your task is to generate a FULLY RUNNABLE, OPEN-SOURCE Playwright + TypeScript project
that implements an AI-driven web test exploration agent.

CONSTRAINTS (MUST FOLLOW):
- Use TypeScript ONLY (no JavaScript).
- Use Playwright Test.
- No enterprise / paid SaaS tools.
- Must work against a local website (e.g. http://localhost:3032).
- The project must be runnable with `pnpm install` + `npx playwright test`.
- Do NOT output pseudocode.
- Do NOT leave placeholder or empty files.
- Every file must contain real, working code.
- The agent must generate real Playwright test cases automatically.


GOAL:
Build an autonomous test exploration agent that:
1. Launches a browser with Playwright
2. Visits a starting URL
3. Extracts DOM + visible text
4. Sends page context to an LLM
5. Receives suggested actions + assertions
6. Executes the actions
7. Generates Playwright test cases in TypeScript
8. Saves them under `tests/generated/`
9. Can be extended to explore multiple pages


IMPORTANT: SYSTEM WILL FAIL IF YOU DO NOT OUTPUT ONLY VALID JSON.

STRICT LLM OUTPUT INSTRUCTIONS (READ CAREFULLY):
You MUST output ONLY a single valid JSON object matching the schema below. DO NOT include any commentary, explanation, markdown, or extra text. DO NOT wrap the JSON in code blocks. DO NOT output anything except the JSON object. If you cannot generate valid actions, output {"actions": []} and nothing else.

FAIL IF YOU OUTPUT ANYTHING OTHER THAN THE JSON OBJECT. DO NOT explain your reasoning. DO NOT include any preamble or postamble. DO NOT output markdown. DO NOT output any text except the JSON object. If you output anything else, the system will fail and your output will be discarded.

REPEAT: OUTPUT ONLY THE JSON OBJECT. NOTHING ELSE. NO MARKDOWN. NO EXPLANATION. NO MULTIPLE OBJECTS. NO PREAMBLE. NO POSTAMBLE. NO COMMENTARY. NO CODE BLOCKS. NO EXTRA TEXT. ONLY THE JSON OBJECT.

FAIL IF YOU OUTPUT ANYTHING EXCEPT THE JSON OBJECT.

REQUIRED JSON SCHEMA:
{
  "actions": [
    {
      "type": "click | fill | navigate",
      "selector": "CSS selector",
      "value": "optional text",
      "assertion": "Playwright expect() statement"
    }
  ]
}


EXAMPLES:
// Valid output:
{
  "actions": [
    { "type": "fill", "selector": "#username", "value": "user@example.com" },
    { "type": "fill", "selector": "#password", "value": "hunter2" },
    { "type": "click", "selector": "button[type=submit]" }
  ]
}
{
  "actions": [
    { "type": "fill", "selector": "input[name='email']", "value": "qa@company.com" },
    { "type": "fill", "selector": "input[type='password']", "value": "secret123" },
    { "type": "click", "selector": "button.login-btn" }
  ]
}
{
  "actions": [
    { "type": "fill", "selector": "#login-username", "value": "admin" },
    { "type": "fill", "selector": "#login-password", "value": "letmein" },
    { "type": "click", "selector": "#login-submit" }
  ]
}
{
  "actions": [
    { "type": "fill", "selector": "input[name='user']", "value": "testuser" },
    { "type": "fill", "selector": "input[name='pass']", "value": "passw0rd" },
    { "type": "click", "selector": "button[type='submit']" }
  ]
}

// Invalid output (DO NOT DO THIS):
// ```json
// { "actions": [...] }
// ```
// Here are your actions: ...
// <any commentary>
// <any markdown>
// <multiple JSON objects>

If you understand, output ONLY the required JSON object and nothing else.

PROJECT STRUCTURE (REQUIRED):
- package.json
- playwright.config.ts
- tsconfig.json
- src/
  - agent.ts
  - explorer.ts
  - llmClient.ts
  - testWriter.ts
- tests/
  - generated/
    - ai-generated.spec.ts
- README.md

LLM REQUIREMENTS:
- Implement an abstraction that supports:
  - Local LLM (e.g. Ollama / HTTP endpoint)
  - OR OpenAI-compatible API
- The agent must construct a strict prompt requiring JSON output:
  {
    "actions": [
      {
        "type": "click | fill | navigate",
        "selector": "CSS selector",
        "value": "optional text",
        "assertion": "Playwright expect() statement"
      }
    ]
  }

AGENT LOGIC REQUIREMENTS:
- Parse LLM JSON safely
- Validate selectors exist before acting
- Execute actions with Playwright
- Append valid TypeScript Playwright tests
- Avoid duplicate test generation
- Log each exploration step to console

TEST OUTPUT REQUIREMENTS:
- Generated tests must:
  - Import Playwright test + expect
  - Use async/await
  - Be valid TypeScript
  - Be runnable immediately with Playwright

README REQUIREMENTS:
- Explain how the agent works
- How to run it
- How to switch LLM providers
- How to point it to a local website

DELIVERABLE:
Output the COMPLETE project with:
- All files
- All code
- No explanations before the code
- Use proper Markdown code blocks per file

This is NOT a demo — this is a real working AI test exploration agent.
