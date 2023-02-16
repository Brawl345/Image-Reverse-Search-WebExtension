#!/usr/bin/env node
import { rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as esbuild from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';
import sveltePlugin from 'esbuild-svelte';
import { sveltePreprocess } from 'svelte-preprocess';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProduction = process.env.NODE_ENV === 'production';

try {
  rmSync(path.resolve('public', 'build'), { recursive: true });
  rmSync(path.resolve('public', '_metadata'), { recursive: true });
} catch {
  //
}

const context = await esbuild.context({
  entryPoints: [
    path.resolve(__dirname, 'source', 'service-worker', 'service-worker.ts'),
    path.resolve(__dirname, 'source', 'options', 'options.ts'),
  ],
  bundle: true,
  minify: false,
  format: 'esm',
  splitting: true,
  sourcemap: isProduction ? false : 'inline',
  target: ['chrome120', 'firefox120'],
  outdir: path.resolve(__dirname, 'public', 'build'),
  logLevel: 'info',
  legalComments: 'none',
  plugins: [
    sassPlugin({ quietDeps: true }),
    sveltePlugin({
      preprocess: sveltePreprocess(),
    }),
  ],
});

if (isProduction) {
  await context.rebuild();
  await context.dispose();
} else {
  await context.watch();
}
