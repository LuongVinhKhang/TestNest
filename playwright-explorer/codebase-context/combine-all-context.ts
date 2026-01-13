import fs from 'fs';
import path from 'path';

/**
 * Combines all summaries and site-intro.md into a single context file for the agent.
 */
function combineAllContext({
  siteIntroPath,
  summariesDir,
  outputFile
}: {
  siteIntroPath: string,
  summariesDir: string,
  outputFile: string
}) {
  let combined = '';
  if (fs.existsSync(siteIntroPath)) {
    combined += fs.readFileSync(siteIntroPath, 'utf-8') + '\n\n';
  }
  const summaryFiles = fs.readdirSync(summariesDir).filter(f => f.endsWith('.md'));
  for (const file of summaryFiles) {
    combined += `\n---\n# ${file}\n`;
    combined += fs.readFileSync(path.join(summariesDir, file), 'utf-8') + '\n';
  }
  // Ensure output directory exists
  const outDir = path.dirname(outputFile);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  fs.writeFileSync(outputFile, combined);
  console.log(`Combined context written to ${outputFile}`);
}

// Usage: ts-node combine-all-context.ts <site-intro.md> <summaries-dir> <site-context.md>
if (require.main === module) {
  const [,, siteIntro, summariesDir, outFile] = process.argv;
  if (!siteIntro || !summariesDir || !outFile) {
    console.error('Usage: ts-node combine-all-context.ts <site-intro.md> <summaries-dir> <site-context.md>');
    process.exit(1);
  }
  combineAllContext({ siteIntroPath: siteIntro, summariesDir, outputFile: outFile });
}

export { combineAllContext };
