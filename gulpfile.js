/*

    wtf is this?

        edit source/helios-frame-runner.js, using gulp watch.
        It'll auto-compile into different versions.

*/

var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    replace = require('gulp-replace'),
    rename = require('gulp-rename'),
    fs = require('fs');

var content = fs.readFileSync('source/helios-frame-runner.js', 'utf8');

gulp.task('build', function(){
    
    content = fs.readFileSync('source/helios-frame-runner.js', 'utf8')

    return gulp.src(['source/wrapper.standalone.js'])
        .pipe(replace('%%% REPLACE %%%', content))
        .pipe(rename({ basename: 'helios-frame-runner' }))
        .pipe(gulp.dest('.'))
        .pipe(uglify({ mangle: false }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('.'))
})

gulp.task('build-ng', function(){
    return gulp.src(['source/wrapper.angular.js'])
        .pipe(replace('%%% REPLACE %%%', content))
        .pipe(rename({
            basename: 'helios-frame-runner.angular'
        }))
        .pipe(gulp.dest('.'))
})

gulp.task('build-require', function(){
    return gulp.src(['source/wrapper.require.js'])
        .pipe(replace('%%% REPLACE %%%', content))
        .pipe(rename({
            basename: 'helios-frame-runner.require'
        }))
        .pipe(gulp.dest('.'))
        .pipe(uglify({ mangle: false }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('.'))
})


gulp.task('default', ['build', 'build-ng', 'build-require']);

gulp.task('watch',function(){

    gulp.watch('source/helios-frame-runner.js', ['build', 'build-ng', 'build-require']);

})