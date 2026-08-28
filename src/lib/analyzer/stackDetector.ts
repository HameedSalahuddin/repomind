import { FileTreeNode } from '@/types/repo';

export interface StackDetectionInput {
  fileTreePaths: string[];
  importantFileContents: Record<string, string>;
  primaryLanguage: string;
  languages: Record<string, number>;
}

export function detectTechStack(input: StackDetectionInput): string[] {
  const detected = new Set<string>();
  const paths = new Set(input.fileTreePaths);
  const files = input.importantFileContents;

  // 1. Language Stats Detection
  if (input.primaryLanguage) {
    detected.add(input.primaryLanguage);
  }
  Object.keys(input.languages || {}).forEach((lang) => {
    if (['TypeScript', 'JavaScript', 'Python', 'Rust', 'Go', 'Java', 'C++', 'Ruby', 'PHP', 'Swift', 'Kotlin'].includes(lang)) {
      detected.add(lang);
    }
  });

  // 2. JavaScript / Node.js Ecosystem Analysis
  if (paths.has('package.json') && files['package.json']) {
    detected.add('Node.js');
    try {
      const pkg = JSON.parse(files['package.json']);
      const allDeps = {
        ...(pkg.dependencies || {}),
        ...(pkg.devDependencies || {}),
      };

      if (allDeps['next']) detected.add('Next.js');
      if (allDeps['react']) detected.add('React');
      if (allDeps['vue']) detected.add('Vue.js');
      if (allDeps['svelte']) detected.add('Svelte');
      if (allDeps['express']) detected.add('Express');
      if (allDeps['@nestjs/core']) detected.add('NestJS');
      if (allDeps['prisma'] || allDeps['@prisma/client']) detected.add('Prisma');
      if (allDeps['tailwindcss']) detected.add('TailwindCSS');
      if (allDeps['typescript']) detected.add('TypeScript');
      if (allDeps['graphql']) detected.add('GraphQL');
      if (allDeps['pg'] || allDeps['postgres']) detected.add('PostgreSQL');
      if (allDeps['redis'] || allDeps['ioredis']) detected.add('Redis');
    } catch {
      // Ignore JSON parse errors
    }
  }

  // 3. TypeScript
  if (paths.has('tsconfig.json')) {
    detected.add('TypeScript');
  }

  // 4. Python Ecosystem
  if (paths.has('requirements.txt') || paths.has('pyproject.toml') || paths.has('Pipfile')) {
    detected.add('Python');
    const pythonContent = (files['requirements.txt'] || '') + (files['pyproject.toml'] || '');
    if (/fastapi/i.test(pythonContent)) detected.add('FastAPI');
    if (/django/i.test(pythonContent)) detected.add('Django');
    if (/flask/i.test(pythonContent)) detected.add('Flask');
    if (/torch/i.test(pythonContent)) detected.add('PyTorch');
    if (/tensorflow/i.test(pythonContent)) detected.add('TensorFlow');
    if (/langchain/i.test(pythonContent)) detected.add('LangChain');
  }

  // 5. Rust
  if (paths.has('Cargo.toml')) {
    detected.add('Rust');
  }

  // 6. Go
  if (paths.has('go.mod')) {
    detected.add('Go');
  }

  // 7. Java / Kotlin
  if (paths.has('pom.xml')) detected.add('Maven');
  if (paths.has('build.gradle') || paths.has('build.gradle.kts')) detected.add('Gradle');

  // 8. Docker
  if (paths.has('Dockerfile') || paths.has('docker-compose.yml') || paths.has('docker-compose.yaml')) {
    detected.add('Docker');
  }

  return Array.from(detected);
}

export function detectEntryPoints(paths: string[], importantFiles?: Record<string, string>): string[] {
  const found: string[] = [];
  const pathSet = new Set(paths);

  // Check package.json main/exports/bin fields
  if (importantFiles && importantFiles['package.json']) {
    try {
      const pkg = JSON.parse(importantFiles['package.json']);
      if (pkg.main && typeof pkg.main === 'string') {
        const cleanMain = pkg.main.replace(/^\.\//, '');
        if (pathSet.has(cleanMain)) found.push(cleanMain);
      }
      if (pkg.bin && typeof pkg.bin === 'string') {
        const cleanBin = pkg.bin.replace(/^\.\//, '');
        if (pathSet.has(cleanBin)) found.push(cleanBin);
      }
    } catch {
      // Ignore
    }
  }

  const candidateEntryPoints = [
    'src/app/page.tsx',
    'src/app/layout.tsx',
    'src/pages/index.tsx',
    'src/index.ts',
    'src/index.js',
    'src/main.ts',
    'src/main.rs',
    'main.go',
    'app.py',
    'main.py',
    'src/App.tsx',
    'index.js',
    'index.ts',
    'server.js',
    'app.js',
  ];

  for (const candidate of candidateEntryPoints) {
    if (pathSet.has(candidate) && !found.includes(candidate)) {
      found.push(candidate);
    }
  }

  // Fallback: search for top-level or src files with main/index/app
  if (found.length === 0) {
    const fallbacks = paths.filter((p) =>
      /^(src\/|app\/|lib\/)?[a-zA-Z0-9_-]+\/(index|main|app|entry)\.[a-z]+$/i.test(p) ||
      /^(index|main|app|server)\.[a-z]+$/i.test(p)
    );
    found.push(...fallbacks.slice(0, 3));
  }

  return found.length > 0 ? found : (pathSet.has('README.md') ? ['README.md'] : []);
}
