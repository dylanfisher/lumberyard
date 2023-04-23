import esbuild from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';
// TODO: is postcss working?
// https://mikefallows.com/posts/using-postcss-and-autoprefixer-with-esbuild/
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';

const buildOptions = {
  entryPoints: [
    'src/application.scss',
    'src/application.js'
  ],
  bundle: true,
  minify: true,
  format: 'iife',
  platform: 'browser',
  outdir: 'assets',
  external: ['*.woff', '*.woff2'],
};

const plugins = [{
  name: 'rebuild',
  setup(build) {
    build.onEnd(result => {
      if ( !result || result.errors.length ) {
        console.error('watch build error:', result);
      } else {
        console.log(`Built at ${new Date().toLocaleTimeString()}`);
      }
    });
  },
}, sassPlugin()];

const ctx = await esbuild.context({ ...buildOptions, plugins });
await ctx.watch();
