var gulp = require('gulp');
var ts = require('gulp-typescript');
var jasmine = require('gulp-jasmine');
var exec = require('child_process').exec

var testDir = 'tests'

gulp.task('default', ['tsCompilation']);

gulp.task('tsCompilation', function (cb) {
    exec('tsc --p ./', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('runTests', ['jamsineCoreCopy', 'testResourcesCopy'], function (cb) {
    exec('tsc --p ./ --target es5 --outDir ' + testDir, function (err, stdout, stderr) {
        gulp.src(testDir + '/spec/**/*.spec.js')
            .pipe(jasmine({
                verbose: true,
                includeStackTrace: true
            }));
    });
});

gulp.task('jamsineCoreCopy', function () {
    return gulp.src('node_modules/jasmine-core/lib/jasmine-core/**/*')
        .pipe(gulp.dest(testDir + '/jasmine-core'));
});

gulp.task('testResourcesCopy', ['systemjsCopy'], function () {
    return gulp.src('resources/test/**/*')
        .pipe(gulp.dest(testDir));
});

gulp.task('systemjsCopy', function () {
    return gulp.src('node_modules/systemjs/dist/system.js')
        .pipe(gulp.dest(testDir));
});
