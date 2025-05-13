const gulp = require("gulp");
const del = require("del");
const svgsprite = require("gulp-svg-sprite");
const uglifycss = require("gulp-uglifycss");
const inject = require("gulp-inject-string");
const webpack = require("webpack");
const gulpWebpack = require("webpack-stream");
const touch = require("touch");
const fs = require("fs");

// Configuration
var configuration = {
  paths: {
    entry: "./src/index.js",
    src: {
      html: "./src/*.html",
      scripts: "./src/scripts/*.js",
      fonts: ["./src/fonts/*.ttf", "./src/fonts/*.woff", "./src/fonts/*.woff2"],
      images: "./src/images/*.*",
      svgs: ".src/images/svg/*.svg",
    },
    dist: "./dist",
  },
};

// Gulp task to copy HTML files to output directory
function htmlTask() {
  return gulp
    .src("build/images/symbol/svg/sprite.symbol.svg")
    .on("data", (data, error) => {
      const svgString = data.contents.toString();
      gulp
        .src(configuration.paths.src.html)
        .pipe(inject.replace("<!-- SVG SPRITES -->", svgString))
        .pipe(gulp.dest(configuration.paths.dist));
      gulp
        .src(configuration.paths.src.fonts)
        .pipe(gulp.dest(configuration.paths.dist + "/fonts"));
      gulp
        .src([
          "./src/keybase.txt",
          "./src/favicon.ico",
          "./src/CNAME",
          "./src/robots.txt",
        ])
        .pipe(gulp.dest(configuration.paths.dist));
    });
}
htmlTask.description = "Copy HTML files to output";
gulp.task("html", htmlTask);

// Gulp task to create SVG sprites
function svgSpritesTask() {
  const svgConfig = {
    mode: {
      symbol: true,
      inline: true,
    },
    svg: {
      xmlDeclaration: false,
      doctypeDeclaration: false,
      namespaceIDs: false,
      namespaceClassnames: false,
    },
  };
  return gulp
    .src("src/images/svg/*.svg")
    .pipe(svgsprite(svgConfig))
    .pipe(gulp.dest("build/images"));
}
svgSpritesTask.description = "Create SVG sprites";
gulp.task("svgSprites", svgSpritesTask);

// Gulp clean task
function cleanTask() {
  return del([configuration.paths.dist.slice(2)]);
}
cleanTask.description = "Clean dist folder";
gulp.task("clean", cleanTask);

// Gulp build components task
function buildComponents(webpackFile) {
  return gulp
    .src(configuration.paths.entry)
    .pipe(
      gulpWebpack(
        require(webpackFile)(process.env.FELLOWSEB_LAB_APIURL),
        webpack,
      ),
    )
    .pipe(gulp.dest(configuration.paths.dist));
}
buildComponents.description = "Build components";
gulp.task("components", buildComponents.bind(this, "./webpack.prod.js"));
gulp.task("components-dev", buildComponents.bind(this, "./webpack.dev.js"));

// Create dist dir
const mkdist = () => {
  if (!fs.existsSync(configuration.paths.dist)) {
    fs.mkdirSync(configuration.paths.dist);
  }
};

// Create an empty .dev file in dist.
// Forbids the deployment.
const touchDev = () => {
  mkdist();
  touch(configuration.paths.dist + "/.dev");
  return Promise.resolve();
};

// Gulp build task
gulp.task("build", gulp.series("clean", "svgSprites", "html", "components"));
gulp.task(
  "build-dev",
  gulp.series("clean", touchDev, "svgSprites", "html", "components-dev"),
);
