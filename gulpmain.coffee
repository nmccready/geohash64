module.exports = (_, gulp, coffee, concat, rename, log, clean, gulpif, coffeelint, serve, ignore, es,
                  debug, help, ourUtils, replace, gzip, tar, insert, mocha, ourPackage, karma, open) ->
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
  gulp.task "clean_app", ->
    gulp.src(["dist/*.js"
              "dist/*.min.js"
              "dist/*.gz"]
    , read: false)
    .pipe clean()

  stripIsNode = (pipe) ->
    pipe.pipe gulpif(/[.]js$/,replace('(function() {',''))
    .pipe gulpif(/[.]js$/,replace('module.exports = ',''))
    .pipe gulpif(/[.]js$/,replace('}).call(this);',''))
  ###
  Compile main source
  ###
  gulp.task "build", ->
    stripIsNode gulp.src(["node_modules/isnode/isnode.js"].concat(require './src_pipeline.json'), {base: "src"})
    .pipe gulpif(/[.]coffee$/,coffeelint())
    .pipe gulpif(/[.]coffee$/,coffeelint.reporter())
    .pipe gulpif(/[.]coffee$/,coffee().on('error', log))
    .pipe(ourUtils.onlyDirs(es))
    .pipe(gulp.dest("dist/src"))
    .pipe(concat("index.js"))
    .pipe(insert.prepend("\nisNode ="))
    .pipe(insert.prepend(header))
    .pipe(gulp.dest("dist"))

  gulp.task "scripts", ["build"]

  gulp.task 'spec_build', ['scripts'], ->
    stripIsNode gulp.src(['node_modules/isnode/isnode.js',"spec/**/*.coffee"], {base: "spec"})
    .pipe gulpif(/[.]js$/,replace('module.exports = ',''))
    .pipe gulpif(/[.]coffee$/,coffeelint())
    .pipe gulpif(/[.]coffee$/,coffeelint.reporter())
    .pipe gulpif(/[.]coffee$/,coffee().on('error', log))
    .pipe(ourUtils.onlyDirs(es))
    .pipe(gulp.dest("dist/spec"))
    .pipe(concat("spec.js"))
    .pipe(insert.prepend("\nisNode ="))
    .pipe(insert.prepend(header))
    .pipe(gulp.dest("dist"))

  gulp.task 'spec', ['spec_build'], ->
    gulp.src('dist/spec.js', read: false)
    .pipe mocha(reporter: 'spec')

  gulp.task "clean", ->
    gulp.src(['dist', 'build'], read: false)
    .pipe clean()

  gulp.task "serve_build", serve
    root: ["dist/public"]
    port: 3000

  gulp.task "serve_prod", serve
    root: ["dist/public"]
    port: 80

  thingToOpen = ->
    options =
      url: "http://localhost:3000/version.json"
      app: "Google Chrome" #osx , linux: google-chrome, windows: chrome
    gulp.src("")
    .pipe(open("", options))

  gulp.task "open_build", ["watch"], ->
    thingToOpen()

  gulp.task "open", ["watch_fast"], ->
    thingToOpen()

  #BEGIN BASE TASKS

  gulp.task "serve_fast", ["serve_build", "open"]

  gulp.task "default", ["clean"], ->
    gulp.start "scripts", "watch", "spec" #, "karma"

  gulp.task "serve", ["clean"], ->
    gulp.start "default", "serve_fast"

  gulp.task('help', help.withFilters(/:/))

  thingsToWatch = ->
    gulp.watch "src/**/*", ["default"]
    gulp.watch "spec/**/*", ["spec_build", "spec"]#, "karma"]

  gulp.task "watch", ["scripts"], ->
    thingsToWatch()

  gulp.task "watch_fast", ->
    thingsToWatch()

  #BEGIN ALIASES
  gulp.task "s", ["serve"]
  gulp.task "build_app", ["scripts"]
  gulp.task "app_build", ["scripts"]
  # gulp.task 'mocks_build', ["build_mocks"]
  #END ALIASES

  pack = ->
    es.merge(gulp.src(["dist/*.html", "!dist/*.js", "dist/*.min.css", "dist/*.gz", "dist/**/*", "public/*",
                       "public/**/*",
                       "!dist/assets/**"]),
        gulp.src("dist/*.min.js"))#then includ the *.min.js post filter as to not null each other out( !*.js, *.min.js)
    .pipe(ourUtils.onlyDirs(es))

  gulp.task "package_dry", ->
    pack()
    .pipe(ourUtils.logFile(es))

  gulp.task "package", ["clean_app"], ->
    gulp.start "prod", ->
      pack()
      .pipe(tar("#{ourPackage.name}.tar"))
      .pipe(gzip())
      .pipe(gulp.dest('build/'))
