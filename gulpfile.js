
var gulp = require('gulp');
var hoganCompiler = require('gulp-hogan-precompile');
var declare = require('gulp-declare');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var header = require('gulp-header');
 
gulp.task('compile-templates', function() {
  gulp.src('templates/**/*.mustache')
      .pipe(hoganCompiler())
      .pipe(declare({
        namespace: 'templates',
        noRedeclare: true
      }))
      .pipe(concat('dist/tetrjs.templates.js'))
      .pipe(gulp.dest('.'));
});

gulp.task('watch', function() {
    gulp.start('compile-templates');
    gulp.watch('templates/**/*.mustache', ['compile-templates']);
});


// using data from package.json 
var pkg = require('./package.json');
var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @author <%= pkg.author %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n');

gulp.task('uglify-js', function(){
    gulp.src(['dist/tetrjs.blocks.js', 'dist/tetrjs.templates.js', 'dist/tetrjs.js'])
        .pipe(concat('tetrjs.min.js'))
        .pipe(uglify())
        .pipe(header(banner, { pkg : pkg } ))
        .pipe(gulp.dest('./dist'));
});