"use strict";

const path = require('path'),
    fs = require('fs'),
    mkdirp = require('mkdirp'),
    gulp = require('gulp'),
    util = require('gulp-util'),
    gulpif = require('gulp-if'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    browserify = require('browserify'),
    babelify = require('babelify'),
    uglifyify = require('uglifyify'),
    exorcist = require('exorcist'),
    templateCache = require('gulp-angular-templatecache'),
    concat = require('gulp-concat'),
    config = {
        isProduction: util.env.production,
        publicDir: './lib',
    };

gulp.task('build-sass', () => {
    return gulp.src('./src/styles/index.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed',
            includePaths: ['./src/styles/']
        }).on('error', sass.logError))
        .pipe(gulpif(!config.isProduction, sourcemaps.write()))
        .pipe(rename('storm-ui-core.min.css'))
        .pipe(gulp.dest(`${config.publicDir}`));
});

gulp.task('build-template', function () {
    return gulp.src(`./src/**/*.html`)
        .pipe(templateCache(
            {
                module: 'ds-core',
                filename: 'template.js',
                root: 'dsCore'
            }))
        .pipe(gulp.dest('./dist/temp'));
});

gulp.task('build-js', function () {
    const distPath = config.publicDir;

    mkdirp(config.publicDir, err => {
        if (err) {
            return util.log(util.colors.green.bold(JSON.stringify(err)));
            process.exit();
        }

        var browserifyInstance = browserify(
            {
                entries: `./src/index.js`,
                debug: !config.isProduction
            })

        // var deps = require('./package.json').dependencies;

        // Object.keys(deps).forEach(key => browserifyInstance.exclude(key));

        return browserifyInstance
            .transform({
                global: true,
                mangle: false,
                comments: true,
                compress: {
                    angular: true
                }
            }, 'uglifyify')
            .bundle()
            .pipe(fs.createWriteStream(path.join(distPath, 'code.js'), 'utf8'));
    });
});

gulp.task('concat', function () {
    return gulp.src(['./dist/temp/code.js', './dist/temp/template.js'])
        .pipe(concat('index.js'))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('ngdocs', [], function () {
    var gulpDocs = require('gulp-ngdocs');
    var options = {
        html5Mode: true,
        title: "STORM UI Core Documentation",
        image: "./logo.png",
        startPage: '/'
    }
    return gulp.src('./src/**/*.js')
        .pipe(gulpDocs.process(options))
        .pipe(gulp.dest('./docs'));
});

gulp.task('default', [
    'build-sass',
    'build-template',
    'build-js'
]);
