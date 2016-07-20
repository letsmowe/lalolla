var gulp = require('gulp'),
	concatCss = require('gulp-concat-css'),
	jshint = require('gulp-jshint'),
	watch = require('gulp-watch'),
	batch = require('gulp-batch'),
	print = require('gulp-print'),
	plumber = require('gulp-plumber'),
	concat = require('gulp-concat'),
	concatCSS = require('gulp-concat-css'),
	cleanCSS = require('gulp-clean-css'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify'),
	imageResize = require('gulp-image-resize'),
	tinypng = require('gulp-tinypng'),

	browserSync = require('browser-sync').create();

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

// CSS

gulp.task('css', function() {
	gulp.src('./css/*.css')
		.pipe(concatCSS('lalolla.css'))
		.pipe(gulp.dest('./dist/css'))
		.pipe(plumber())
		.pipe(cleanCSS())
		.pipe(rename({
			extname: '.min.css'
		}))
		.pipe(gulp.dest('./dist/css'));
});

gulp.task('css-watch', ['css'], function () {
	watch('./css/*.css', batch(function (events, done) {
		gulp.start('css', done);
		browserSync.reload();
	}));
});

// JS

gulp.task('js', function() {
	gulp.src('./js/*.js')
		.pipe(concat('lalolla.js'))
		.pipe(gulp.dest('./dist/js'))
		.pipe(plumber())
		.pipe(uglify({
			preserveComments: 'some'
		}))
		.pipe(rename({
			extname: '.min.js'
		}))
		.pipe(gulp.dest('./dist/js/'));
});

gulp.task('js-watch', ['js'], function () {
	watch('./js/*.js', batch(function (events, done) {
		gulp.start('js', done);
		browserSync.reload();
	}));
});

// IMAGES

gulp.task('tinypng', function () {
	gulp.src(imgfiles)
		.pipe(tinypng('8eNoFlUv4wHzam_8GleKHdhH2YFk9xAd'))
		.pipe(gulp.dest('dist/img'));
});

// SERVER

gulp.task('serve', function () {

	// Serve files from the root of this project
	browserSync.init({
		server: {
			baseDir: "./",
			index: "index.html",
			routes: {
				"/home": "./index.html"
			}
		}
	});

	gulp.watch('./*.html').on('change', browserSync.reload);

});

gulp.task('default', ['serve', 'css-watch', 'js-watch']);