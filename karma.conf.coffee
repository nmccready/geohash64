# Karma configuration
# Generated on Tue May 27 2014 15:17:04 GMT-0400 (EDT)

module.exports = (config) ->
  config.set

    # base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: ''

    # frameworks to use
    # available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha']

    # preprocess matching files before serving them to the browser
    # available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'dist/application.js': ['coverage']
    }

    coverageReporter:
      reporters:[
        { type : 'html', dir : 'dist/coverage/', middlePathDir: "application" }
        { type : 'cobertura', dir : 'dist/coverage/', middlePathDir: "application" }
      ]

    # list of files / patterns to load in the browser
    files: [
      'bower_components/should/should.js'
      'bower_components/lodash/dist/lodash.js'

      #do not include those specs for jasmine html runner by karma kama_jasmine_runner.html
      {pattern:'dist/coverage/**', included: false}
      'dist/ns2.js'
      'dist/spec.js'
     ]

    # list of files to exclude
    exclude: [
      'dist/src/**'
      'dist/spec/**'
    ]

    # test results reporter to use
    # possible values: 'dots', 'progress'
    # available reporters: https://npmjs.org/browse/keyword/karma-reporter
    # NOTE , TODO 'html' reporter use if you want to hit the karma jasmine runner (frequently causes karma to blow up at the end of run),
    reporters: ['progress','coverage', 'dots'] #'html']

    # web server port
    port: 9876


    # enable / disable colors in the output (reporters and logs)
    colors: true


    # level of logging
    # possible values:
    # - config.LOG_DISABLE
    # - config.LOG_ERROR
    # - config.LOG_WARN
    # - config.LOG_INFO
    # - config.LOG_DEBUG
    logLevel: config.LOG_ERROR


    # enable / disable watching file and executing tests whenever any file changes
    autoWatch: true


    # start these browsers
    # available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS']


    # Continuous Integration mode
    # if true, Karma captures browsers, runs the tests and exits
    singleRun: true

    plugins: [
      'karma-coverage'
      'karma-mocha'
      'karma-html2js-preprocessor'
      'karma-fixture'
      'karma-chrome-launcher'
      'karma-phantomjs-launcher'
      'karma-coffee-preprocessor'
    ]


  urlRoot: "base/dist/karma_html/chrome/index.html"
