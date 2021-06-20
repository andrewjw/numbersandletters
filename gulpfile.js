const del = require('del');
const { dest, series, src, watch } = require('gulp');
const ts = require('gulp-typescript')

function clean() {
    return del("built/**");
}

function build() {
    return src("src/**/*.ts")
        .pipe(ts({
            noImplicitAny: true,
            outFile: 'code.js'
        }))
        .pipe(dest('built/static'));
}

function watchfiles() {
    watch("src/**/*.ts", build);
}

exports.build = build;
exports.watch = watchfiles;
exports.default = series(clean, build);
