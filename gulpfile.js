const gulp = require('gulp');
const sass = require('gulp-sass');
const del = require('del');
const svgsprite = require('gulp-svg-sprite');
const autoprefixer = require('gulp-autoprefixer');
const uglifycss = require('gulp-uglifycss');
const uglify = require('gulp-uglify');
const inject = require('gulp-inject-string');
const webpack = require('webpack');
const gulpWebpack = require('webpack-stream');

// Configuration
var configuration = {
    paths: {
        entry: './src/index.js',
        src: {
            html: './src/*.html',
            scripts: './src/scripts/*.js',
            fonts: [ './src/fonts/*.ttf',
                './src/fonts/*.woff',
                './src/fonts/*.woff2' ],
            images: './src/images/*.*',
            svgs: '.src/images/svg/*.svg',
            scss: ['./src/sass/*.scss',
                './src/sass/*css']
        },
        dist: './dist'
    }
};

// Gulp task to copy HTML files to output directory
function htmlTask() {
    return gulp.src('build/images/symbol/svg/sprite.symbol.svg')
        .on('data', (data, error) => {
            const svgString = data.contents
                .toString();
            gulp.src(configuration.paths.src.html)
                .pipe(inject.replace('<!-- SVG SPRITES -->', svgString))
                .pipe(gulp.dest(configuration.paths.dist));
            gulp.src('./src/favicon.ico')
                .pipe(gulp.dest(configuration.paths.dist));
            gulp.src(configuration.paths.src.scripts)
                .pipe(uglify())
                .pipe(gulp.dest(configuration.paths.dist + '/scripts'));
            gulp.src(configuration.paths.src.fonts)
                .pipe(gulp.dest(configuration.paths.dist + '/fonts'));
        });
}
htmlTask.description = 'Copy HTML files to output';
gulp.task('html', htmlTask);

// Gulp task to create SVG sprites
function svgSpritesTask() {
    const svgConfig = {
        mode: {
            symbol: true,
            inline: true
        },
        svg: {
            xmlDeclaration: false,
            doctypeDeclaration: false,
            namespaceIDs: false,
            namespaceClassnames: false
        }
    };
    return gulp.src('src/images/svg/*.svg')
        .pipe(svgsprite(svgConfig))
        .pipe(gulp.dest('build/images'));
}
svgSpritesTask.description = 'Create SVG sprites';
gulp.task('svgSprites', svgSpritesTask);

// Gulp task to generate CSS from SCSS files
function sassTask() {
    return gulp.src(configuration.paths.src.scss)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(uglifycss({ maxLineLen: 80, expandVars: true }))
        .pipe(gulp.dest(configuration.paths.dist + '/css'));
};
sassTask.description = 'Preprocess scss files';
gulp.task('sass', sassTask);

// Gulp task to generate CSS from SCSS files
function sassTaskDev() {
    return gulp.src(configuration.paths.src.scss)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(gulp.dest(configuration.paths.dist + '/css'));
};
sassTask.description = 'Preprocess scss files (dev)';
gulp.task('sass-dev', sassTaskDev);

gulp.task('sass:watch', function() {
    gulp.watch('./sass/**/*.scss', ['sass']);
});

// Gulp clean task
function cleanTask() {
    return del([configuration.paths.dist.slice(2) + '/**/*']);
}
cleanTask.description = 'Clean dist folder';
gulp.task('clean', cleanTask);

// Gulp build components task
function buildComponents(webpackFile) {
    return gulp.src(configuration.paths.entry)
        .pipe(gulpWebpack(require(webpackFile), webpack))
        .pipe(gulp.dest(configuration.paths.dist));
}
buildComponents.description = 'Build components';
gulp.task('components', buildComponents.bind(this, './webpack.prod.js'));
gulp.task('components-dev', buildComponents.bind(this, './webpack.dev.js'));

// Gulp build task
gulp.task('build', gulp.series('svgSprites', 'html', 'sass', 'components'));
gulp.task('build-dev', gulp.series('svgSprites', 'html', 'sass-dev', 'components-dev'));
