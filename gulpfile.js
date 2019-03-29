var gulp = require("gulp");

var babel = require("rollup-plugin-babel");
var concat = require("gulp-concat");
var declare = require("gulp-declare");
var header = require("gulp-header");
var sass = require("gulp-sass");
var sourcemaps = require("gulp-sourcemaps");
var rename = require("gulp-rename");
var rollup = require("gulp-better-rollup");
var uglify = require("gulp-uglify");

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
                    name: "Tetrjs"
                }
            )
        )
        .pipe(sourcemaps.write())
        .pipe(rename("tetrjs.js"))
        .pipe(gulp.dest("dist/"));
});

gulp.task("watch", function() {
    gulp.watch(
        "src/tetrjs.scss",
        { ignoreInitial: false },
        gulp.series(["compile:sass"])
    );
    gulp.watch(
        "src/**/*.js",
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
