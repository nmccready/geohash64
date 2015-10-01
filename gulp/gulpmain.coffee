module.exports = (gulp, coffee, concat, rename, log, clean, gulpif, coffeelint, serve, ignore, es,
                  debug, help, ourUtils, replace, gzip, tar, insert, mocha, ourPackage, karma, open) ->
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

  ###
  Compile main source
  ###
  gulp.task 'build', ->
    gulp.src(require './src_pipeline.json', {base: 'src'})
    .pipe gulpif(/[.]coffee$/,coffeelint())
    .pipe gulpif(/[.]coffee$/,coffeelint.reporter())
    .pipe gulpif(/[.]coffee$/,coffee(coffeeOptions).on('error', log))
    .pipe(ourUtils.onlyDirs(es))
    .pipe(gulp.dest('dist/src'))
    .pipe(concat('index.js'))
    .pipe(insert.prepend('\n(function(){'))
    .pipe(insert.append('\n})();'))
    .pipe(insert.prepend(header))
    .pipe(gulp.dest('dist'))

  gulp.task 'scripts', ['build']

  gulp.task 'spec', ->
    gulp.src('spec/*.coffee', read: false)
    .pipe mocha(reporter: 'spec')

  gulp.task 'clean', ->
    gulp.src(['dist', 'build'], read: false)
    .pipe clean()

  gulp.task 'serve_build', serve
    root: ['dist/public']
    port: 3000

  gulp.task 'serve_prod', serve
    root: ['dist/public']
    port: 80

  thingToOpen = ->
    options =
      url: 'http://localhost:3000/version.json'
      app: 'Google Chrome' #osx , linux: google-chrome, windows: chrome
    gulp.src('')
    .pipe(open('', options))

  gulp.task 'open_build', ['watch'], ->
    thingToOpen()

  gulp.task 'open', ['watch_fast'], ->
    thingToOpen()

  #BEGIN BASE TASKS
  gulp.task 'specWatch', ['scripts'], ->
    gulp.start 'spec', 'watch'

  gulp.task 'default', ['clean'], ->
    gulp.start 'specWatch'

  gulp.task('help', help.withFilters(/:/))

  thingsToWatch = ->
    gulp.watch 'src/**/*', ['default']
    gulp.watch 'spec/**/*', ['spec_build', 'spec']

  gulp.task 'watch', ['scripts'], ->
    thingsToWatch()

  gulp.task 'watch_fast', ->
    thingsToWatch()

  #BEGIN ALIASES
  gulp.task 's', ['serve']
  gulp.task 'build_app', ['scripts']
  gulp.task 'app_build', ['scripts']
  # gulp.task 'mocks_build', ['build_mocks']
  #END ALIASES
