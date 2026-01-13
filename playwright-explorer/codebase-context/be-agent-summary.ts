import fs from 'fs';
import path from 'path';

/**
 * This agent parses dotnet backend (C#) to extract:
 * - Controller names
 * - Route attributes (e.g., [Route], [HttpGet], etc.)
 * - Action method names and parameters
 */
function summarizeDotnetBE(rootDir: string, outputFile: string) {
  let summary = `# Dotnet Backend Deep Summary\n`;
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

  for (const ctrl of controllers) {
    summary += `\n## Controller: ${path.relative(rootDir, ctrl)}\n`;
    const content = fs.readFileSync(ctrl, 'utf-8');
    // Extract class name
    const classMatch = content.match(/class\s+(\w+)/);
    if (classMatch) {
      summary += `- Class: ${classMatch[1]}\n`;
    }
    // Extract route attributes
    const routeMatches = [...content.matchAll(/\[(Route|Http(Get|Post|Put|Delete|Patch))(\("([^"]*)"\))?\]/g)];
    for (const match of routeMatches) {
      summary += `- [${match[1]}] ${match[4] || ''}\n`;
    }
    // Extract public method names and parameters
    const methodMatches = [...content.matchAll(/public\s+(?:async\s+)?(?:Task<\w+>|void|\w+)\s+(\w+)\s*\(([^)]*)\)/g)];
    for (const m of methodMatches) {
      summary += `- Method: ${m[1]}(${m[2]})\n`;
    }
  }

  fs.writeFileSync(outputFile, summary);
  console.log(`Deep BE summary written to ${outputFile}`);
}

// Usage: ts-node be-agent-summary.ts <zenbe-root> <output-md>
if (require.main === module) {
  const [,, beRoot, outFile] = process.argv;
  if (!beRoot || !outFile) {
    console.error('Usage: ts-node be-agent-summary.ts <zenbe-root> <output-md>');
    process.exit(1);
  }
  summarizeDotnetBE(beRoot, outFile);
}

export { summarizeDotnetBE };
