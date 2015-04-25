var gulp = require('gulp'),
    nodemon = require('gulp-nodemon');

gulp.task('default', function() {

});

gulp.task('start', function() {
    nodemon({
        script: 'server.js'
    })
});

gulp.task('default', ['start']);