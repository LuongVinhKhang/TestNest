import fs from 'fs';
import path from 'path';

/**
 * Combines site-intro.md, fe-summary.md, and be-summary.md into site-context.md
 */
function combineContext(siteIntro: string, feSummary: string, beSummary: string, outputFile: string) {
  let combined = '';
  if (fs.existsSync(siteIntro)) {
    combined += fs.readFileSync(siteIntro, 'utf-8') + '\n\n';
  }
  if (fs.existsSync(feSummary)) {
    combined += fs.readFileSync(feSummary, 'utf-8') + '\n\n';
  }
  if (fs.existsSync(beSummary)) {
    combined += fs.readFileSync(beSummary, 'utf-8') + '\n\n';
  }
  fs.writeFileSync(outputFile, combined);
  console.log(`Combined context written to ${outputFile}`);
}

// Usage: node combine-context.js <site-intro.md> <fe-summary.md> <be-summary.md> <site-context.md>
if (require.main === module) {
  const [,, siteIntro, feSummary, beSummary, outFile] = process.argv;
  if (!siteIntro || !feSummary || !beSummary || !outFile) {
    console.error('Usage: ts-node combine-context.ts <site-intro.md> <fe-summary.md> <be-summary.md> <site-context.md>');
    process.exit(1);
  }
  combineContext(siteIntro, feSummary, beSummary, outFile);
}

export { combineContext };
