#!/usr/bin/env node
import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { rmSync } from 'node:fs';
import sveltePlugin from 'esbuild-svelte';
import { sassPlugin } from 'esbuild-sass-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const isProduction = process.env.NODE_ENV === 'production';

try {
  rmSync(resolve('public', 'build'), { recursive: true });
  rmSync(resolve('public', '_metadata'), { recursive: true });
} catch {
  //
}

build({
  entryPoints: [
    resolve(__dirname, 'source', 'service-worker', 'service-worker.js'),
    resolve(__dirname, 'source', 'options', 'options.js'),
  ],
  bundle: true,
  minify: false,
  format: 'esm',
  splitting: true,
  watch: !isProduction,
  sourcemap: isProduction ? false : 'inline',
  target: ['chrome96'],
  outdir: resolve(__dirname, 'public', 'build'),
  logLevel: 'info',
  legalComments: 'none',
  plugins: [sassPlugin(), sveltePlugin()],
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
