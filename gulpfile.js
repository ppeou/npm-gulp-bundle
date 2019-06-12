const {src, dest, series, parallel} = require('gulp');
const cssMinify = require('gulp-csso');
const uglify = require('gulp-uglify-es').default;
const concat = require('gulp-concat');
const rev = require('gulp-rev');
const revRewrite = require('gulp-rev-rewrite');
const revDel = require('gulp-rev-delete-original');
const htmlMinify = require('gulp-htmlmin');
const del = require('del');

var replace = require('gulp-replace');

const orderedJsFiles = ['src/jquery.js', 'src/core-service.js', 'src/core-service-override.js'];

function cleanup() {
  return del(['dist/**']);
}

function html() {
  return src('index.html')
    .pipe(htmlMinify({ collapseWhitespace: true }))
    .pipe(dest('dist'));
}

function css() {
  return src('src/*.css')
    .pipe(cssMinify())
    .pipe(dest('dist'));
}

function js() {
  return src(orderedJsFiles, {sourcemaps: true})
    .pipe(concat('bundle.js'))
    .pipe(uglify())
    .pipe(dest('dist', {sourcemaps: true}));
}

function reference() {
  return src('dist/index.html')
    .pipe(replace(/src\//g, ''))
    .pipe(replace(/<script[a-zA-Z\s\.=/"-]+><\/script>/g, '---~~--'))
    .pipe(replace(/---~~--/, '<script src="bundle.js"></script>'))
    .pipe(replace(/---~~--/g, ''))
    .pipe(dest('dist'));
}

exports.default = series(cleanup, parallel(html, css, js), reference);
