var gulp = require('gulp'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    jshint = require('gulp-jshint'),
    minifyCSS = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    livereload = require('gulp-livereload'),
    watch = require('gulp-watch'),
    fs = require('fs-extra'),
    imageop = require('gulp-image-optimization');

var imageFiles = [
  './source/img/*.jpg',
  './source/img/*.jpeg',
  './source/img/*.png',
  './source/img/*.gif'
];

gulp.task('default', function() {
  gulp.start('styles', 'scripts', 'images');
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('./sass/**/*.scss', ['styles']);
  gulp.watch('./source/js/**/*.js', ['scripts']);
});

gulp.task('styles', ['cleanCSS'], function() {
  gulp.src('./sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest('./source/css'))
    .pipe(minifyCSS())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./dist/css'))
    .pipe(notify({ message: 'CSS - task completed'}))
    .pipe(livereload());
});

gulp.task('scripts', ['cleanJS'], function() {
  gulp.src('./source/js/**/*.js')
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./dist/js'))
    .pipe(notify({ message: 'JS - task completed'}))
    .pipe(livereload());
});

gulp.task('images', function() {
  gulp.src(imageFiles)
    .pipe(imageop({
      optimizationLevel: 5,
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('./dist/img'))
    .pipe(notify({ message: 'Images - task completed'}))
    .pipe(livereload());
});

gulp.task('cleanCSS', function() {
  fs.removeSync('./dist/css');
});

gulp.task('cleanJS', function() {
  fs.removeSync('./dist/js');
});
