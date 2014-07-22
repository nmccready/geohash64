_ = require 'lodash'
gulp = require "gulp"
coffee = require 'gulp-coffee'
concat = require "gulp-concat"
rename = require "gulp-rename"
log = require("gulp-util").log
clean = require "gulp-rimraf"
replace = require 'gulp-replace'
gulpif = require "gulp-if"

jsToMin = (fileName) ->
  fileName.replace('.', '.min.')

#handle globals
String.prototype.toMin = ->
  jsToMin this

String.prototype.js = ->
  this + ".js"

String.prototype.css = ->
  this + ".css"

myClean = (fileORDirName, doMin) ->
  gulp.src(fileORDirName, read: false)
  .pipe do ->
    c = clean()
    log "cleaned #{fileORDirName}"
    c

module.exports =

  jsToMin: jsToMin

  myClean: myClean


#Only include files to prevent empty directories http://stackoverflow.com/questions/23719731/gulp-copying-empty-directories
  onlyDirs: (es) ->
    es.map (file, cb) ->
      if file?.stat?.isFile()
        cb(null, file)
      else
        cb()

  formatPipePath: (pipeObj, origPath, prependPath, doLog) ->
    #grab original info and save all matches to the appPipe.js
    origPath.dirname = origPath.dirname.replace(".", "")
    origPath.dirname = prependPath + origPath.dirname if prependPath
    toMap = if origPath.dirname != "" then "#{origPath.dirname}/#{origPath.basename}#{origPath.extname}" else "#{origPath.basename}#{origPath.extname}"
    pipeItem = toMap.replace('//', '/')
    log pipeItem if doLog
    pipeObj.mappedPipe.push pipeItem
    origPath


  insertPipelineToFile: (pipeline, isStyle, doLog) ->
    return if pipeline.length == 0
    hasError = true
    log "Initial Pipeline to insert: #{pipeline}" if doLog
    #TODO this is a hack, there should be a better callback to allow this to happen only if pipe_app.json is finished saving by scripts
    #TODO use through2 or es.map
    while hasError
      try
        toReplace = pipeline.map((f) ->
          if not isStyle
            if f.charSet
              '<script type="text/javascript" src="' + f.src + '" charset="' + f.charSet + '"></script>'
            else
              '<script type="text/javascript" src="' + f + '"></script>'
          else
            '<link href="' + f + '" media="all" rel="stylesheet" type="text/css">'
        ).reduce (prev, next) ->
          prev + '\n' + next
        hasError = false
      catch err
        log "ERROR: #{err}"
    #handle attempts
    #        log toReplace if doLog
    toReplace

  logEs : (es, toLog) ->
    es.map (file, cb) ->
      log toLog
      cb()

  logFile : (es) ->
    es.map (file, cb) ->
      log file.path
      cb()
  bang: "!!!!"
