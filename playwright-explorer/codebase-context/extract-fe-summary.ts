import fs from 'fs';
import path from 'path';

/**
 * Extracts a summary of Next.js frontend routes, pages, and components.
 * Outputs a markdown summary to fe-summary.md.
 */
function extractNextJsSummary(rootDir: string, outputFile: string) {
  // Support both root and src/ for Next.js structure
  const candidates = [
    { label: 'Pages (pages/)', dir: path.join(rootDir, 'pages') },
    { label: 'App Directory (app/)', dir: path.join(rootDir, 'app') },
    { label: 'Components (components/)', dir: path.join(rootDir, 'components') },
    { label: 'Routes (routes/)', dir: path.join(rootDir, 'routes') },
    { label: 'Pages (src/pages/)', dir: path.join(rootDir, 'src', 'pages') },
    { label: 'App Directory (src/app/)', dir: path.join(rootDir, 'src', 'app') },
    { label: 'Components (src/components/)', dir: path.join(rootDir, 'src', 'components') },
    { label: 'Routes (src/routes/)', dir: path.join(rootDir, 'src', 'routes') },
  ];
  let summary = `# Frontend (Next.js) Summary\n`;

  for (const { label, dir } of candidates) {
    if (fs.existsSync(dir)) {
      summary += `\n## ${label}\n`;
      const files = listFilesRecursive(dir);
      for (const file of files) {
        summary += `- ${path.relative(rootDir, file)}\n`;
      }
    }
  }

  // API routes (pages/api or src/pages/api)
  const apiDirs = [
    path.join(rootDir, 'pages', 'api'),
    path.join(rootDir, 'src', 'pages', 'api'),
  ];
  for (const apiDir of apiDirs) {
    if (fs.existsSync(apiDir)) {
      summary += '\n## API Routes\n';
      const apis = listFilesRecursive(apiDir);
      for (const file of apis) {
        summary += `- ${path.relative(rootDir, file)}\n`;
      }
    }
  }

  fs.writeFileSync(outputFile, summary);
  console.log(`FE summary written to ${outputFile}`);
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

// Usage: node extract-fe-summary.js /path/to/nextjs /path/to/output/fe-summary.md
if (require.main === module) {
  const [,, feRoot, outFile] = process.argv;
  if (!feRoot || !outFile) {
    console.error('Usage: ts-node extract-fe-summary.ts <nextjs-root> <output-md>');
    process.exit(1);
  }
  extractNextJsSummary(feRoot, outFile);
}

export { extractNextJsSummary };
