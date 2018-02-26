var gulp = require('gulp');
var sass = require('gulp-sass');
var del = require('del');
var svgmin = require('gulp-svgmin');
var gap = require('gulp-append-prepend');
const autoprefixer = require('gulp-autoprefixer');

// Configuration
var configuration = {
    paths: {
        src: {
            html: './src/*.html',
            scripts: './src/scripts/*.js',
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
    gulp.src('./src/favicon.ico')
        .pipe(gulp.dest(configuration.paths.dist));
    gulp.src(configuration.paths.src.scripts)
        .pipe(gulp.dest(configuration.paths.dist + '/scripts'));
    gulp.src(configuration.paths.src.fonts)
        .pipe(gulp.dest(configuration.paths.dist + '/fonts'));
    done();
}
htmlTask.description = 'Copy HTML files to output';
gulp.task('html', htmlTask);

// Gulp task to clean SVG sprites
function svgSpritesTask(done) {
    gulp.src('./src/images/sprites.svg')
        .pipe(svgmin({
            js2svg: {
                pretty: true
            }
        }))
        .pipe(gap.prependText([
            '<?xml version="1.0" standalone="no"?>',
            '<?xml-stylesheet type="text/css" href="../css/styles.css"?>'
        ]))
        .pipe(gulp.dest(configuration.paths.dist + '/images'));
    done();
}
htmlTask.description = 'Clean SVG sprites and copy to output';
gulp.task('svgSprites', svgSpritesTask);

// Gulp task to generate CSS from SCSS files
function sassTask() {
    return gulp.src(configuration.paths.src.scss)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
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
gulp.task('build', gulp.series('html', 'svgSprites', 'sass'));
