'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const gulpIf = require('gulp-if');
const browserSync = require('browser-sync').create();
const notify = require('gulp-notify');
const plumber = require('gulp-plumber')

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

gulp.task('styles', function () {
	return gulp.src('./src/**/main.scss')
		.pipe(plumber({
			errorHandler: notify.onError(function (err) {
				return {
					title: 'Styles',
					message: err.message
				}
			})
		}))
		.pipe(gulpIf(isDevelopment, sourcemaps.init()))
		.pipe(sass())
		.pipe(gulpIf(isDevelopment, sourcemaps.write()))
		.pipe(gulp.dest('./public'))
});

gulp.task('clean', function () {
	return del('./public')
});

gulp.task('assets', function () {
	return gulp.src('./src/assets/**', {since: gulp.lastRun('assets')})
		.pipe(gulp.dest('./public'));
});

gulp.task('build', gulp.series(
	'clean',
	gulp.parallel('styles', 'assets')
));


gulp.task('watch', function () {
	gulp.watch('./src/styles/**/*.*', gulp.series('styles'));
	gulp.watch('./src/assets/**/*.*', gulp.series('assets'));
});


gulp.task('serve', function () {
	browserSync.init({
		server: './'
	});

	browserSync
		.watch(['./public/**/*.*', './index.html'])
		.on('change', browserSync.reload);
});

gulp.task('dev', gulp.series(
	'build',
	gulp.parallel('watch', 'serve')
));
