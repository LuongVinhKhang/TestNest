# Load .env if present
if [ -f .env ]; then
	export $(grep -v '^#' .env | xargs)
fi
pnpm install
mkdir -p summaries

# 1. Fast structure summaries
pnpm exec ts-node extract-fe-summary.ts "$FE_ROOT" summaries/fe-summary.md
pnpm exec ts-node extract-be-summary.ts "$BE_ROOT" summaries/be-summary.md

# 2. Deep agent-based summaries
pnpm exec ts-node fe-agent-summary.ts "$FE_ROOT" summaries/fe-agent-summary.md
pnpm exec ts-node be-agent-summary.ts "$BE_ROOT" summaries/be-agent-summary.md

# 3. LLM-powered summaries (requires LLM env vars)
# pnpm exec ts-node llm-summarize-dir.ts "$FE_ROOT" summaries/fe-llm-summary.md
# pnpm exec ts-node llm-summarize-dir.ts "$BE_ROOT" summaries/be-llm-summary.md

# 4. Combine all context for agent
pnpm exec ts-node combine-all-context.ts ../site-intro.md summaries ../agent-context/site-context.md