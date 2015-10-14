
var gulp = require('gulp')
var sourcemaps = require('gulp-sourcemaps')
var babel = require('gulp-babel')


gulp.task('babel', function () {
  return gulp.src(['**/*.js', '!gulpfile.js', '!build/**/*.*'])
    .pipe(sourcemaps.init())
    .pipe(babel({
      optional: [
        'es7.asyncFunctions',
        'es7.exportExtensions'
      ]
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build'))
})

gulp.task('default', ['babel'])
