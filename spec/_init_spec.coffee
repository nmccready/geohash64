if isNode
  ns2 = require 'ns2'
  should = require 'should'
  _ = require 'lodash'
  bigint = require 'bigint'
  base64 = require 'base-64'
  project = require './index'

#deps be loaded by the browser or by node
describe 'sanity', ->
  it 'should.js exist', ->
    throw new Error() unless should

  it 'lodash exists', ->
    throw new Error 'lodash or underscore undefined' unless _

  it 'ns2 is loaded', ->
    throw new Error('ns2 is missing') if not ns2

  it 'bigint is loaded', ->
    throw new Error('ns2 is missing') if not bigint

  it 'base64 is loaded', ->
    throw new Error('ns2 is missing') if not base64

  it 'this project is loaded', ->
    throw new Error ('THIS MAIN PROJECT IS NOT LOADED!') if not project