import {src, dest, series} from 'gulp';
import webpackStream from 'webpack-stream';
import webpack from 'webpack';
import rename from 'gulp-rename';
import uglify from 'gulp-uglify';
import sourcemaps from 'gulp-sourcemaps';
import del from 'del';
import bump from 'gulp-bump';
import header from 'gulp-header';
import fs from 'fs';
import merge from "merge2";
import typescript from 'typescript';
import ts from 'gulp-typescript';
import insert from 'gulp-insert';

const filename = "convergence-jointjs-utils";
const distDir = "./dist";

const copyFiles = () => src(["README.md", "LICENSE.txt", 'package.json']).pipe(dest(distDir));
const copyCss = () => src(["src/css/**/*"]).pipe(dest(distDir + "/css"));
const copyImages = () => src(["src/img/**/*"]).pipe(dest(distDir + "/img"));
const copyTypes = () => src(["src/types/**/*"]).pipe(dest(distDir + "/types/"));

const typescriptCjs = () => {
  const tsProject = ts.createProject('tsconfig.json', {
    typescript: typescript,
    declaration: true
  });

  const tsResult = src('src/ts/**/*.ts')
    .pipe(sourcemaps.init())
    .pipe(tsProject());

  return merge([
    tsResult.dts
      .pipe(dest('dist/types')),
    tsResult.js
      .pipe(sourcemaps.write('.'))
      .pipe(dest('dist/lib'))
  ]);
};

const typescriptEsm = () => {
  const tsProject = ts.createProject('tsconfig.json', {
    typescript: typescript,
    module: "es6"
  });

  return src('src/ts/**/*.ts')
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .js
    .pipe(sourcemaps.write('.'))
    .pipe(dest('dist/esm'));
};

const webpackUmd = () => {
  const outputPath = `${distDir}/umd`;

  const packageJson = JSON.parse(fs.readFileSync("./package.json"));
  const headerTxt = fs.readFileSync("./copyright-header.txt");

  return src('src/ts/index.ts')
    .pipe(sourcemaps.init())
    .pipe(webpackStream(require("./webpack.config.js"), webpack))
    .pipe(header(headerTxt, {package: packageJson}))
    .pipe(sourcemaps.write('.'))
    .pipe(rename({basename: filename}))
    .pipe(dest(outputPath));
};

const declarationsNamedExport = () =>
  src("./dist/types/index.d.ts")
    .pipe(insert.append("\nexport as namespace ConvergenceJointUtils;"))
    .pipe(dest("./dist/types/"));

const minifyUmd = () => {
  return src(`${distDir}/umd/${filename}.js`)
    .pipe(sourcemaps.init())
    .pipe(uglify({
      output: {
        comments: "some"
      }
    }))
    .pipe(rename({extname: '.min.js'}))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(`${distDir}/umd/`));
};

const bumpVersion = (cb) => {
  const packageJson = require("./dist/package.json");
  if (packageJson.version.endsWith('SNAPSHOT')) {
    return src(`${distDir}/package.json`)
      .pipe(bump({version: packageJson.version + '.' + new Date().getTime()}))
      .pipe(dest(distDir));
  } else {
    cb();
  }
};

const clean = () => del([distDir]);
const dist = series([
  typescriptCjs,
  typescriptEsm,
  webpackUmd,
  minifyUmd,
  declarationsNamedExport,
  copyFiles,
  copyTypes,
  copyCss,
  copyImages,
  bumpVersion]);

export {
  dist,
  clean
}
