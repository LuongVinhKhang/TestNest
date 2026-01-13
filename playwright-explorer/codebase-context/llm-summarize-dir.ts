import fs from 'fs';
import path from 'path';
import { summarizeWithLLM } from './llm-summarizer';

/**
 * LLM-powered summarizer for code files.
 * Reads all files in a directory (recursively), sends code to LLM, and writes summaries.
 */
async function llmSummarizeDir(dir: string, outputFile: string, filePattern = /\.(ts|tsx|js|jsx|cs)$/) {
  let summary = `# LLM-Powered Code Summary for ${dir}\n`;
  const files = listFilesRecursive(dir).filter(f => filePattern.test(f));
  for (const file of files) {
    const code = fs.readFileSync(file, 'utf-8');
    const rel = path.relative(dir, file);
    summary += `\n## ${rel}\n`;
    try {
      const llmSummary = await summarizeWithLLM(code, rel);
      summary += llmSummary + '\n';
    } catch (e) {
      summary += 'LLM summarization failed.\n';
    }
  }
  fs.writeFileSync(outputFile, summary);
  console.log(`LLM summary written to ${outputFile}`);
}

function listFilesRecursive(dir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(listFilesRecursive(filePath));
    } else {
      results.push(filePath);
    }
  }
  return results;
}

// Usage: ts-node llm-summarize-dir.ts <dir> <output-md>
if (require.main === module) {
  (async () => {
    const [,, codeDir, outFile] = process.argv;
    if (!codeDir || !outFile) {
      console.error('Usage: ts-node llm-summarize-dir.ts <code-dir> <output-md>');
      process.exit(1);
    }
    await llmSummarizeDir(codeDir, outFile);
  })();
}

export { llmSummarizeDir };
