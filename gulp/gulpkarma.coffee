module.exports = (_, gulp, coffee, concat, rename, log, clean, gulpif, coffeelint, serve, ignore, es, debug, help, ourUtils, replace, gzip, tar, insert, mocha, ourPackage, karma, open, covDeps = [], mainTask = 'spec', browser = 'Google Chrome', conf = 'karma.conf.coffee', coveragePath = 'http://localhost:3000/coverage/chrome/index.html', dashes = '--', coverageTask = 'open_coverage') ->
  log "#{dashes} Karma Setup #{dashes} for task: #{mainTask}"

  runner = () ->
    karma(
      configFile: conf
      action: 'run'
      noOverrideFiles: true
        #Make sure failed tests cause gulp to exit non-zero
    ).on 'error', (err) ->
      throw err #new Error("Karma Specs failed!")

  gulp.task mainTask, ->
    gulp.src ''
    .pipe runner()

  covDeps = covDeps.concat [mainTask]
#  log "Karma Coverage Deps #{covDeps}"

  gulp.task coverageTask, covDeps, ->
    options =
      url: coveragePath
      app: browser #osx , linux: google-chrome, windows: chrome
    gulp.src "dist/ns2.js"
    .pipe open('', options)

  #log "#{dashes} END: Karma Setup #{dashes} for task: #{mainTask}"
  spec: 'karma'
  coverage: coverageTask
  runner: runner

#
# NOTICE:
# noOverrideFiles -
#
# see issue https://github.com/lazd/gulp-karma/pull/18, why I forked to nmccready
# otherwise you will need the src below in gulpspec.coffee , spec task
