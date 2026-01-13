import fs from 'fs';
import path from 'path';

/**
 * Extracts a summary of dotnet backend controllers and endpoints.
 * Outputs a markdown summary to be-summary.md.
 */
function extractDotnetSummary(rootDir: string, outputFile: string) {
  let summary = `# Backend (dotnet) Summary\n`;
  const controllers: string[] = [];

  function findControllers(dir: string) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        findControllers(filePath);
      } else if (file.endsWith('Controller.cs')) {
        controllers.push(filePath);
      }
    }
  }

  findControllers(rootDir);

  summary += '\n## Controllers\n';
  for (const ctrl of controllers) {
    summary += `- ${path.relative(rootDir, ctrl)}\n`;
    // Optionally, extract route info
    const content = fs.readFileSync(ctrl, 'utf-8');
    const matches = content.matchAll(/\[Http(Get|Post|Put|Delete)(\("([^"]*)"\))?\]/g);
    for (const match of matches) {
      summary += `  - [${match[1]}] ${match[3] || ''}\n`;
    }
  }

  fs.writeFileSync(outputFile, summary);
  console.log(`BE summary written to ${outputFile}`);
}

// Usage: node extract-be-summary.js /path/to/dotnet /path/to/output/be-summary.md
if (require.main === module) {
  const [,, beRoot, outFile] = process.argv;
  if (!beRoot || !outFile) {
    console.error('Usage: ts-node extract-be-summary.ts <dotnet-root> <output-md>');
    process.exit(1);
  }
  extractDotnetSummary(beRoot, outFile);
}

export { extractDotnetSummary };
