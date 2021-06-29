const del = require('del');
const { dest, series, src, parallel, watch } = require('gulp');
const ts = require('gulp-typescript');
const browserify = require("browserify");
const source = require("vinyl-source-stream");
const tsify = require("tsify");
const browserSync = require('browser-sync').create();

function clean() {
    return del("built/**");
}

function buildTs() {
    return browserify({
      basedir: ".",
      debug: true,
      entries: ["src/index.tsx"],
      cache: {},
      packageCache: {},
    })
      .plugin(tsify, {jsx: "react"})
      .bundle()
      .pipe(source("code.js"))
      .pipe(dest("built/static"));
}

function buildHTML() {
    return src("static/**/*.html")
           .pipe(dest("built/"))
}

function buildImages() {
    return src("static/**/*.png")
           .pipe(dest("built/"))
}

const build = parallel(buildTs, buildHTML, buildImages);

function watchfiles() {
    watch(["src/**/*.ts", "src/**/*.tsx", "static/**/*.html"], series(build, browserSyncReload));
}

function browserSyncTask(cb) {
    browserSync.init({
        server: {
            baseDir: "./built"
        }
    });
    cb();
}

function browserSyncReload(cb) {
    browserSync.reload();
    cb();
}

exports.build = build;
exports.watch = watchfiles;
exports.default = series(clean, build, parallel(watchfiles, browserSyncTask));
