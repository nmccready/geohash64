String.prototype.contains = (searchStr) ->
  this.indexOf(searchStr) != -1

_ = require 'lodash'
gulp = require "gulp"
coffee = require 'gulp-coffee'
concat = require "gulp-concat"
rename = require "gulp-rename"
gutil = require "gulp-util"
log = gutil.log
clean = require "gulp-rimraf"
gulpif = require "gulp-if"
coffeelint = require "gulp-coffeelint"
serve = require "gulp-serve"
open = require "gulp-open"
ignore = require 'gulp-ignore'
es = require 'event-stream'
debug = require 'gulp-debug'
help = require 'gulp-task-listing' #command avail cgulp help (shows all tasks)
ourUtils = require './gulp/gulputils'
replace = require 'gulp-replace'
gzip = require 'gulp-gzip'
tar = require 'gulp-tar'
insert = require 'gulp-insert'
mocha = require 'gulp-mocha'
ourPackage = require './package.json'
karma = require 'gulp-karma'
open = require 'gulp-open'

main = require('./gulp/gulpmain')(_, gulp, coffee, concat, rename, log, clean, gulpif, coffeelint, serve, ignore, es,
    debug, help, ourUtils, replace, gzip, tar, insert, mocha, ourPackage, karma, open)

#karma = require('./gulpkarma')(_, gulp, coffee, concat, rename, log, clean, gulpif, coffeelint, serve, ignore, es,
#    debug, help, ourUtils, replace, gzip, tar, insert, mocha, ourPackage, karma, open, ['serve_build'],
#    mainTask = 'karma')
