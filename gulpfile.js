//          Dependencies
//
const { src, dest, series, parallel, watch } = require('gulp');
const htmlmin = require('gulp-htmlmin');
const rigger = require('gulp-rigger');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const stylelint = require('gulp-stylelint');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const gcmq = require('gulp-group-css-media-queries');
const csso = require('gulp-csso');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const streamWebpack = require('webpack-stream');
const babel = require('gulp-babel');
const del = require('del');
const browserSync = require('browser-sync').create();

//          Refs
//
const srcFolder = 'src';
const buildFolder = 'build';

//          Functions
//
function html() {
  return src(`${srcFolder}/*html`)
    .pipe(rigger())
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest(`${buildFolder}`))
    .pipe(browserSync.stream());
}

function style() {
  return src(`${srcFolder}/sass/**/*.+(sass|scss)`)
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(
      stylelint({
        reporters: [{ formatter: 'string', console: true }],
      }),
    )
    .pipe(sass())
    .pipe(postcss([autoprefixer()]))
    .pipe(gcmq())
    .pipe(csso())
    .pipe(rename('style.min.css'))
    .pipe(sourcemaps.write())
    .pipe(dest(`${buildFolder}/css`))
    .pipe(browserSync.stream());
}

function js() {
  return src(`${srcFolder}/js/**/*.js`)
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(
      streamWebpack({
        mode: 'production',
      }),
    )
    .pipe(babel())
    .pipe(concat('index.js'))
    .pipe(uglify())
    .pipe(rename('index.min.js'))
    .pipe(sourcemaps.write())
    .pipe(dest(`${buildFolder}/js`))
    .pipe(browserSync.stream());
}

function image() {
  return src(`${srcFolder}/img/*`)
    .pipe(dest(`${buildFolder}/img`))
    .pipe(browserSync.stream());
}

function watcher(done) {
  watch(`${srcFolder}/*.html`).on('change', series(html, browserSync.reload));
  watch(`${srcFolder}/sass/*.sass`).on(
    'change',
    series(style, browserSync.reload),
  );
  watch(`${srcFolder}/js/*.js`).on('change', series(js, browserSync.reload));
  watch(`${srcFolder}/img`).on('change', series(image, browserSync.reload));

  done();
}

function server() {
  return browserSync.init({
    server: 'build',
    notify: false,
    open: true,
    cors: true,
    ui: false,
    logPrefix: 'Development_Server',
    host: 'localhost',
    port: 8080,
  });
}

function clean() {
  return del('./build');
}

const build = series(clean, parallel(html, style, js, image));
const start = series(build, watcher, server);

exports.build = build;
exports.start = start;
