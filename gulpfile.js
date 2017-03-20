'use strict';

let browserify = require('browserify'),
    gulp = require('gulp'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    gutil = require('gulp-util'),
    uglify = require('gulp-uglify'),
    del = require('del'),
    sass = require('gulp-sass');

gulp.task('clean', [], function () {
    return del([
        "public/js/**/*"
    ]);
});

gulp.task('cleancss', [], function () {
    return del([
        "public/css/**/*"
    ]);
});

gulp.task('js', ['clean'], function () {
    let b = browserify({
        entries: ['./src/js/main.js'],
        paths: ['./node_modules', './bower_components', './src/js/desktop'],
        debug: true,
        transform: [
            ["babelify", {"presets": ["es2015"]}]
        ]
    });

    return b.bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        //.pipe(uglify())
        .on('error', gutil.log)
        .pipe(gulp.dest('./public/js/'));
});


gulp.task('sass', ['cleancss'], function () {
    return gulp.src('./src/sass/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./public/css/'));
});


gulp.task('watch', function () {
    gulp.watch('./src/js/**/*.js', ['js']);
    gulp.watch('./src/sass/main.scss', ['sass']);
});