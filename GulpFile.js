var gulp = require('gulp'),
	concat = require('gulp-concat'),
	concatCss = require('gulp-concat-css'),
	jshint = require('gulp-jshint'),
	minifycss = require('gulp-minify-css'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify'),
	tinypng = require('gulp-tinypng');

var cssfiles = 'css/*.css',
	imgfiles = 'img/*',
	jsfiles = [
		'js/f.js',
		'js/contact.js',
		'js/installery.js',
		'js/menu.js',
		'js/nav.js',
		'js/main.js'
	];

imgfiles = 'img/*';

gulp.task('css', function() {
	gulp.src('css/*')
		.pipe(concatCss("lalolla.css"))
		.pipe(gulp.dest('dist/css'));
	gulp.src('dist/css/lalolla.css')
		.pipe(minifycss())
		.pipe(rename({
			extname: '.min.css'
		}))
		.pipe(gulp.dest('dist/css'));
});

gulp.task('js', function() {
	gulp.src(jsfiles)
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(uglify({
			preserveComments: 'some'
		}))
		.pipe(rename({
			extname: '.min.js'
		}))
		.pipe(gulp.dest('dist/js/app'))
		.pipe(concat('app.js'))
		.pipe(gulp.dest('dist/js/app'));
});

gulp.task('tinypng', function () {
	gulp.src(imgfiles)
		.pipe(tinypng('8eNoFlUv4wHzam_8GleKHdhH2YFk9xAd'))
		.pipe(gulp.dest('dist/img'));
});

gulp.task('default', function() {
	var css = ['villa', 'mowe', 'wtal'];
	var js = ['js'];
	gulp.watch(cssfiles, css);
	gulp.watch(jsfiles, ['js']);
});

gulp.task('watch', function() {
	gulp.watch(jsfiles, ['js']);
});