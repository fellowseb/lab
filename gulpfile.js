var gulp = require('gulp');
var sass = require('gulp-sass');
var del = require('del');

// Configuration
var configuration = {
    paths: {
        src: {
            html: './src/*.html',
            fonts: [ './src/fonts/*.ttf',
                './src/fonts/*.woff',
                './src/fonts/*.woff2' ],
            images: './src/images/*.*',
            scss: './src/sass/*.scss'
        },
        dist: './dist'
    }
};

// Gulp task to copy HTML files to output directory
function htmlTask(done) {
    gulp.src(configuration.paths.src.html)
        .pipe(gulp.dest(configuration.paths.dist));
    gulp.src(configuration.paths.src.fonts)
        .pipe(gulp.dest(configuration.paths.dist + '/fonts'));
    gulp.src(configuration.paths.src.images)
        .pipe(gulp.dest(configuration.paths.dist + '/images'));
    done();
}
htmlTask.description = 'Copy HTML files to output';
gulp.task('html', htmlTask);

// Gulp task to generate CSS from SCSS files
function sassTask() {
    return gulp.src(configuration.paths.src.scss)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(configuration.paths.dist + '/css'));
};
sassTask.description = 'Preprocess scss files';
gulp.task('sass', sassTask);

gulp.task('sass:watch', function() {
    gulp.watch('./sass/**/*.scss', ['sass']);
});

// Gulp clean task
function cleanTask() {
    return del([configuration.paths.dist.slice(2) + '/**/*']);
}
cleanTask.description = 'Clean dist folder';
gulp.task('clean', cleanTask);

// Gulp build task
gulp.task('build', gulp.series('html', 'sass'));
