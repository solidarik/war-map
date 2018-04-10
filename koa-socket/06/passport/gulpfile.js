const gulp = require('gulp');
const nodemon = require('gulp-nodemon');

process.on('uncaughtException', function(err) {
  console.error(err.message, err.stack, err.errors);
  process.exit(255);
});

gulp.task('nodemon', () => {
  nodemon({
    execMap: {
      js: 'node --harmony'
    },
    script: 'index.js'
  });
});

gulp.task('db:load', require('./tasks/dbLoad'));
