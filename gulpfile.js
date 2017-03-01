
var gulp = require('gulp');
var hoganCompiler = require('gulp-hogan-precompile');
var declare = require('gulp-declare');
var concat = require('gulp-concat');
 
gulp.task('templates', function() {
  gulp.src('templates/**/*.mustache')
      .pipe(hoganCompiler())
      .pipe(declare({
        namespace: 'templates',
        noRedeclare: true
      }))
      .pipe(concat('tetrjs.templates.js'))
      .pipe(gulp.dest('.'));
});