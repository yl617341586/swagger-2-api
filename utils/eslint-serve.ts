import { ESLint } from 'eslint';
export default async (outputDir: string) => {
  const eslint = new ESLint({ fix: true });
  const results = await eslint.lintFiles(outputDir);
  ESLint.outputFixes(results);
};
