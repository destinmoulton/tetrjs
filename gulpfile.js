var gulp = require("gulp");

var babel = require("rollup-plugin-babel");
var concat = require("gulp-concat");
var declare = require("gulp-declare");
var header = require("gulp-header");
var hoganCompiler = require("gulp-hogan-precompile");
var sass = require("gulp-sass");
var sourcemaps = require("gulp-sourcemaps");
var rollup = require("gulp-better-rollup");
var uglify = require("gulp-uglify");

gulp.task("compile:templates", function() {
    return gulp
        .src("templates/**/*.mustache")
        .pipe(hoganCompiler())
        .pipe(
            declare({
                namespace: "templates",
                noRedeclare: true
            })
        )
        .pipe(concat("dist/tetrjs.templates.js"))
        .pipe(gulp.dest("."));
});

gulp.task("compile:sass", function() {
    return gulp
        .src("src/tetrjs.scss")
        .pipe(sass())
        .pipe(gulp.dest("dist/"));
});

gulp.task("compile:js", function() {
    return gulp
        .src("src/index.js")
        .pipe(sourcemaps.init())
        .pipe(
            rollup(
                {
                    plugins: [
                        babel({
                            presets: ["@babel/env"],
                            plugins: ["@babel/plugin-proposal-class-properties"]
                        })
                    ]
                },
                {
                    format: "umd",
                    name: "Tetrjs",
                    file: "tetrjs.js"
                }
            )
        )
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("dist/"));
});

gulp.task("watch", function() {
    gulp.watch(
        "templates/**/*.mustache",
        { ignoreInitial: false },
        gulp.series(["compile:templates"])
    );
    gulp.watch(
        "src/tetrjs.scss",
        { ignoreInitial: false },
        gulp.series(["compile:sass"])
    );
    gulp.watch(
        "src/index.js",
        { ignoreInitial: false },
        gulp.series(["compile:js"])
    );
});

// using data from package.json
var pkg = require("./package.json");
var banner = [
    "/**",
    " * <%= pkg.name %> - <%= pkg.description %>",
    " * @author <%= pkg.author %>",
    " * @version v<%= pkg.version %>",
    " * @link <%= pkg.homepage %>",
    " * @license <%= pkg.license %>",
    " */",
    ""
].join("\n");

gulp.task("uglify-js", function() {
    gulp.src([
        "dist/tetrjs.blocks.js",
        "dist/tetrjs.templates.js",
        "dist/tetrjs.js"
    ])
        .pipe(concat("tetrjs.min.js"))
        .pipe(uglify())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest("./dist"));
});
