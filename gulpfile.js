
var path = require('path')
var gulp = require('gulp')
var sourcemaps = require('gulp-sourcemaps')
var babel = require('gulp-babel')


var paths = {
  es6: ['**/*.js', '!gulpfile.js', '!build/**/*.*', '!node_modules/**/*.*'],
  es5: 'build',
  // must be absolute or relative to source map
  sourceRoot: path.join(__dirname)
}

gulp.task('babel', function () {
  return gulp.src(paths.es6)
    .pipe(sourcemaps.init())
    .pipe(babel({
      optional: [
        'es7.asyncFunctions',
        'es7.exportExtensions'
      ]
    }))
    .pipe(sourcemaps.write('.', {sourceRoot: paths.sourceRoot}))
    .pipe(gulp.dest(paths.es5))
})

gulp.task('watch', function () {
  gulp.watch(paths.es6, ['babel'])
})

gulp.task('default', ['watch'])
