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
		'./_src/js/f.js',
		'./_src/js/contact.js',
		'./_src/js/installery.js',
		'./_src/js/menu.js',
		'./_src/js/nav.js',
		'./_src/js/main.js'
	];

imgfiles = 'img/*';

// CSS

gulp.task('css', function() {
	gulp.src('./_src/css/*.css')
		.pipe(concatCSS('lalolla.css'))
		.pipe(gulp.dest('./public/dist/css'))
		.pipe(plumber())
		.pipe(cleanCSS())
		.pipe(rename({
			extname: '.min.css'
		}))
		.pipe(gulp.dest('./public/dist/css'));
});

gulp.task('css-watch', ['css'], function () {
	watch('./_src/css/*.css', batch(function (events, done) {
		gulp.start('css', done);
		browserSync.reload();
	}));
});

// JS

gulp.task('js', function() {
	gulp.src('./_src/js/*.js')
		.pipe(concat('lalolla.js'))
		.pipe(gulp.dest('./public/dist/js'))
		.pipe(plumber())
		.pipe(uglify({
			preserveComments: 'some'
		}))
		.pipe(rename({
			extname: '.min.js'
		}))
		.pipe(gulp.dest('./public/dist/js/'));
});

gulp.task('js-watch', ['js'], function () {
	watch('./_src/js/*.js', batch(function (events, done) {
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
			baseDir: "./public/",
			index: "index.html",
			routes: {
				"/home": "./index.html"
			}
		}
	});

	gulp.watch('./public/*.html').on('change', browserSync.reload);

});

gulp.task('default', ['serve', 'css-watch', 'js-watch']);