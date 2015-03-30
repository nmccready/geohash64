should = require 'should'
_ = require 'lodash'
geohash64 = require '../dist/index.js'

#deps be loaded by the browser or by node
describe 'sanity', ->
  it 'should.js exist', ->
    throw new Error() unless should

  it 'lodash exists', ->
    throw new Error 'lodash or underscore undefined' unless _?

  it 'this project is loaded', ->
    throw new Error ('THIS MAIN PROJECT IS NOT LOADED!') if not geohash64
