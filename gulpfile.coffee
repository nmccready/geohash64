contains = (toSearch,searchStr) ->
  toSearch.indexOf(searchStr) != -1

gulp = require 'gulp'
coffee = require 'gulp-coffee'
concat = require 'gulp-concat'
{log} = require 'gulp-util'
gulpif = require 'gulp-if'
coffeelint = require 'gulp-coffeelint'
debug = require 'gulp-debug'
del = require 'del'
insert = require 'gulp-insert'
mocha = require 'gulp-mocha'
ourPackage = require './package.json'

coffeeOptions =
  bare: true
date = new Date()
header =
  """
  /**
   *  #{ourPackage.name}
   *
   * @version: #{ourPackage.version}
   * @author: #{ourPackage.author}
   * @date: #{date.toString()}
   * @license: #{ourPackage.license}
   */
  """

gulp.task 'clean', (cb) ->
  del 'dist', cb

gulp.task 'cleanDistSrc', (cb) ->
  del 'dist/src', cb

gulp.task 'build', gulp.series ->
  gulp.src([
    'src/_init*'
    'src/lat_lon*'
    'src/coord*'
    'src/geo*'
    'src/google_coder*'
    'src/goog*'
    'src/to_export*'
  ], {base: 'src'})
  .pipe gulpif(/[.]coffee$/,coffeelint())
  .pipe gulpif(/[.]coffee$/,coffeelint.reporter())
  .pipe gulpif(/[.]coffee$/,coffee(coffeeOptions).on('error', log))
  .pipe(gulp.dest('dist/src'))
  .pipe(concat('index.js'))
  .pipe(insert.prepend('\n(function(){'))
  .pipe(insert.append('\n})();'))
  .pipe(insert.prepend(header))
  .pipe(gulp.dest('dist'))
, 'cleanDistSrc'

gulp.task 'spec', ->
  gulp.src('spec/*.coffee')
  .pipe mocha(reporter: 'spec')

gulp.task 'watch', ->
  gulp.watch 'src/**/*', gulp.series 'default'
  gulp.watch 'spec/**/*', gulp.series 'spec'

gulp.task 'default', gulp.series 'clean', 'build', 'spec', 'watch'
