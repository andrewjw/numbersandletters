const del = require('del');
const { dest, series, src, parallel, watch } = require('gulp');
const ts = require('gulp-typescript')
const browserSync = require('browser-sync').create();

function clean() {
    return del("built/**");
}

function buildTs() {
    return src("src/**/*.ts")
        .pipe(ts({
            noImplicitAny: true,
            outFile: "code.js"
        }))
        .pipe(dest("built/static"));
}

function buildHTML() {
    return src("static/**/*.html")
           .pipe(dest("built/"))
}

const build = parallel(buildTs, buildHTML);

function watchfiles() {
    watch("src/**/*.ts", series(build, browserSyncReload));
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
