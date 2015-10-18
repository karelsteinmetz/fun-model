var gulp = require('gulp');
var ts = require('gulp-typescript');
var jasmine = require('gulp-jasmine');
var exec = require('child_process').exec

var distDir = 'dist'
var testDir = 'tests'

gulp.task('default', ['runTests', 'srcTsCopy', 'tsCompilation']);

gulp.task('tsCompilation', function (cb) {
    exec('tsc --p ./', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('runTests', ['testTsCompilation', 'jamsineCoreCopy', 'testResourcesCopy'], function () {
    return gulp.src(testDir + '/spec/**/*.spec.js')
        .pipe(jasmine({
            verbose: true,
            includeStackTrace: true
        }));
});

gulp.task('testTsCompilation', function (cb) {
  exec('tsc --p ./ --module commonjs --target es3 --outDir ' + testDir , function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      cb(err);
  });
});

gulp.task('srcTsCopy', function () {
    return gulp.src('src/**/*.ts')
        .pipe(gulp.dest(distDir + '/src'));
});

gulp.task('jamsineCoreCopy', function () {
    return gulp.src('node_modules/jasmine-core/lib/jasmine-core/**/*')
        .pipe(gulp.dest(distDir + '/jasmine-core'));
});

gulp.task('jamsineCoreCopy', function () {
    return gulp.src('node_modules/jasmine-core/lib/jasmine-core/**/*')
        .pipe(gulp.dest(distDir + '/jasmine-core'));
});

gulp.task('testResourcesCopy', ['systemjsCopy'], function () {
    return gulp.src('resources/test/**/*')
        .pipe(gulp.dest(distDir));
});

gulp.task('systemjsCopy', function () {
    return gulp.src('node_modules/systemjs/dist/system.js')
        .pipe(gulp.dest(distDir));
});
