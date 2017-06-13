const { mix } = require('laravel-mix');
const fs = require('fs');
const env = fs.readFileSync('.env', { encoding: 'utf-8' });
const url = env.match(/(APP_URL=)([\w|://|.]*)/)[2];

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

// mix.js('resources/assets/js/app.js', 'public/js')
mix
  .webpackConfig({
    devtool: 'source-map',
    externals: {
      gapi: 'gapi'
    }
  })
  .sass('resources/assets/sass/app.scss', 'public/css')
  .react('resources/assets/js/app.jsx', 'public/js')
  .browserSync({
    // proxy: url
  });
