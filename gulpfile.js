var gulp = require('gulp');
var ts = require('gulp-typescript');
var jasmine = require('gulp-jasmine');
var exec = require('child_process').exec

var buildDir = 'build'
var testDir = 'tests'

gulp.task('default', ['runTests', 'tsCompilation']);

gulp.task('tsCompilation', function (cb) {
    exec('tsc --p ./ --outDir ' + buildDir, function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('runTests', ['jamsineCoreCopy', 'testResourcesCopy'], function (cb) {
    exec('tsc --p ./ --outDir ' + buildDir, function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
        gulp.src(buildDir + '/spec/**/*.spec.js')
            .pipe(jasmine({
                verbose: true,
                includeStackTrace: true
            }));
    });
});

gulp.task('jamsineCoreCopy', function () {
    return gulp.src('node_modules/jasmine-core/lib/jasmine-core/**/*')
        .pipe(gulp.dest(buildDir + '/jasmine-core'));
});

gulp.task('testResourcesCopy', ['systemjsCopy'], function () {
    return gulp.src('resources/test/**/*')
        .pipe(gulp.dest(buildDir));
});

gulp.task('systemjsCopy', function () {
    return gulp.src('node_modules/systemjs/dist/system.js')
        .pipe(gulp.dest(buildDir));
});

// Dist
var distDir = 'dist'

gulp.task('dist', ['srcTsCopy'], function () {
    return gulp.src(buildDir + '/src/**/*')
        .pipe(gulp.dest(distDir));
});

gulp.task('srcTsCopy', function () {
    return gulp.src('src/**/*.ts')
        .pipe(gulp.dest(distDir));
});
