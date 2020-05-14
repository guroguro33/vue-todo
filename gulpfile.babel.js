import gulp from 'gulp';
import sass from 'gulp-sass';
import cleanCss from 'gulp-clean-css';
import rename from 'gulp-rename';
import sourcemaps from 'gulp-sourcemaps';
import webpackConfig from './webpack.config.js';
import webpack from 'webpack-stream';
import browserSync from 'browser-sync';
import notify from 'gulp-notify';
import plumber from 'gulp-plumber';
import eslint from 'gulp-eslint';

// npmで出るエラー、警告集
// https://qiita.com/M-ISO/items/d693ac892549fc95c14c
// chromeのreact-dev-toolをインストールしておくといい
// https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi/related

// gulpタスクの作成
gulp.task('build', done => {
  gulp.src('src/js/app.js')
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('dist/js/'));
    done();
});
gulp.task('browser-sync', done => {
  browserSync.init({
    server: {
      baseDir: "./", // 対象ディレクトリ
      index: "index.html" //indexファイル名
    }
  });
  done();
});
gulp.task('bs-reload', done => {
  browserSync.reload();
  done();
});
gulp.task('eslint', () => {
  return gulp.src(['src/**/*.js']) // lint のチェック先を指定
    .pipe(plumber({
      // エラーをハンドル
      errorHandler: function(error) {
        const taskName = 'eslint';
        const title = '[task]' + taskName + ' ' + error.plugin;
        const errorMsg = 'error: ' + error.message;
        // ターミナルにエラーを出力
        console.error(title + '\n' + errorMsg);
        // エラーを通知
        notify.onError({
          title: title,
          message: errorMsg,
          time: 3000
        });
      }
    }))
    .pipe(eslint({ useEslintrc: true })) // .eslintrc を参照
    .pipe(eslint.format())
    .pipe(eslint.failOnError())
    .pipe(plumber.stop());
});
gulp.task('sass', done => {
  gulp.src("src/scss/app.scss")
      .pipe(plumber({
        errorHandler: notify.onError("Error: <%= error.message %>")
      }))
      // .pipe(sourcemaps.init())  // とりあえずなし
      .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
      // .pipe(sourcemaps.write("./"))　// とりあえずなし
      .pipe(gulp.dest('./dist/css/'))
      .pipe(cleanCss())
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest('./dist/css/'));
      done();
})

// Gulpを使ったファイルの監視
gulp.task('default', gulp.series( gulp.parallel('eslint', 'build', 'browser-sync'), function(){
  gulp.watch('./src/**/*.js', gulp.task('build'));
  gulp.watch("./*.html", gulp.task('bs-reload'));
  gulp.watch("./dist/**/*.+(js|css)", gulp.task('bs-reload'));
  gulp.watch("./src/**/*.js", gulp.task('eslint'));
  gulp.watch("./src/**/*.scss", gulp.task('sass'));
}));
