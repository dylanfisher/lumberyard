import esbuild from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import notifier from 'node-notifier';

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
        notifier.notify({
          title: 'esbuild error',
          message: result.pluginName
        });
      } else {
        console.log(`Built at ${new Date().toLocaleTimeString()}`);
      }
    });
  },
}, sassPlugin({
  async transform(source, resolveDir) {
    const { css } = await postcss([autoprefixer]).process(source, { from: undefined });
    return css
  }
})];

const ctx = await esbuild.context({ ...buildOptions, plugins });
await ctx.watch();
