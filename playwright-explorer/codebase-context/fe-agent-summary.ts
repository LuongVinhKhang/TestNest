import fs from 'fs';
import path from 'path';
import { Project, SyntaxKind } from 'ts-morph';

/**
 * This agent parses Next.js src/app, src/routes, and src/components to extract:
 * - Route paths (from folder/file names)
 * - Component names and their props (from TypeScript/JSX)
 * - Optionally, can be extended to call an LLM for summaries
 */
async function summarizeNextJsFE(rootDir: string, outputFile: string) {
  let summary = `# Next.js Frontend Deep Summary\n`;
  const appDir = path.join(rootDir, 'src', 'app');
  const routesDir = path.join(rootDir, 'src', 'routes');
  const componentsDir = path.join(rootDir, 'src', 'components');

  // Summarize routes (folder/file names)
  if (fs.existsSync(appDir)) {
    summary += '\n## App Directory Routes (src/app)\n';
    summary += summarizeRoutes(appDir, rootDir);
  }
  if (fs.existsSync(routesDir)) {
    summary += '\n## File-based Routes (src/routes)\n';
    summary += summarizeRoutes(routesDir, rootDir);
  }

  // Summarize components (names, props)
  if (fs.existsSync(componentsDir)) {
    summary += '\n## Components (src/components)\n';
    summary += await summarizeComponents(componentsDir, rootDir);
  }

  fs.writeFileSync(outputFile, summary);
  console.log(`Deep FE summary written to ${outputFile}`);
}

function summarizeRoutes(dir: string, rootDir: string): string {
  let out = '';
  const entries = fs.readdirSync(dir);
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      out += `- /${path.relative(rootDir, fullPath).replace(/\\/g, '/')} (folder)\n`;
      out += summarizeRoutes(fullPath, rootDir);
    } else if (entry.endsWith('.js') || entry.endsWith('.ts') || entry.endsWith('.jsx') || entry.endsWith('.tsx')) {
      out += `- /${path.relative(rootDir, fullPath).replace(/\\/g, '/')}\n`;
    }
  }
  return out;
}

async function summarizeComponents(dir: string, rootDir: string): Promise<string> {
  let out = '';
  const files = fs.readdirSync(dir);
  const project = new Project();
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      out += await summarizeComponents(fullPath, rootDir);
    } else if (file.endsWith('.tsx') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.js')) {
      try {
        const sourceFile = project.addSourceFileAtPath(fullPath);
        const exports = sourceFile.getExportedDeclarations();
        for (const [name, decls] of exports) {
          for (const decl of decls) {
            if (decl.getKind() === SyntaxKind.FunctionDeclaration || decl.getKind() === SyntaxKind.ClassDeclaration) {
              out += `- Component: ${name} (${path.relative(rootDir, fullPath)})\n`;
              // Try to extract props for function/class
              let props: any[] = [];
              if (typeof (decl as any).getParameters === 'function') {
                props = (decl as any).getParameters();
              }
              if (props.length > 0) {
                out += `  - Props: ${props.map((p: any) => p.getName()).join(', ')}\n`;
              }
            }
          }
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
  }
  return out;
}

// Usage: ts-node fe-agent-summary.ts <zenfe-root> <output-md>
if (require.main === module) {
  const [,, feRoot, outFile] = process.argv;
  if (!feRoot || !outFile) {
    console.error('Usage: ts-node fe-agent-summary.ts <zenfe-root> <output-md>');
    process.exit(1);
  }
  summarizeNextJsFE(feRoot, outFile);
}

export { summarizeNextJsFE };
