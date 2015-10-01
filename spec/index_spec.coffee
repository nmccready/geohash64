should = require 'should'
geohash64 = require '../dist/index.js'

# encoding: utf-8
###
ported from @a_dat's geohash64Test.py
MIT license.
###
describe 'geohash64', ->
  after ->
    crap = ''#to make coffeelint happy
    art = """#{crap}
                     .__                  .__      ________   _____
   ____   ____  ____ |  |__ _____    _____|  |__  /  _____/  /  |  |
  / ___\\_/ __ \\/  _ \\|  |  \\\\__  \\  /  ___/  |  \\/   __  \\  /   |  |_
 / /_/  >  ___(  <_> )   Y  \\/ __ \\_\\___ \\|   Y  \\  |__\\  \\/    ^   /
 \\___  / \\___  >____/|___|  (____  /____  >___|  /\\_____  /\\____   |
/_____/     \\/           \\/     \\/     \\/     \\/       \\/      |__|
"""

    console.log art
    console.log "\nname:#{geohash64.name}, version: #{geohash64.version}"

  it 'exists', ->
    geohash64.should.be.ok

  describe 'LatLon', ->
    it 'exists', ->
      geohash64.LatLon.should.be.ok

    it 'can be created', ->
      ll = new geohash64.LatLon(35.4, 135.5)
      ll.lat.should.be.eql 35.4
      ll.lon.should.be.eql 135.5

    it 'should throw range error', ->
      ( ->
        new geohash64.LatLon(110, 135)).should.throw()
      ( ->
        new geohash64.LatLon(45.1, -190)).should.throw()

  describe 'GoogleLatLon', ->

    describe 'can create', ->
      it 'normal lat lon args', ->
        ll = new geohash64.GoogleLatLon(35.4, 135.5)
        ll.lat.should.be.eql 35.4
        ll.lon.should.be.eql 135.5

      it 'array arg1', ->
        ll = new geohash64.GoogleLatLon([35.4, 135.5])
        ll.lat.should.be.eql 35.4
        ll.lon.should.be.eql 135.5

      it 'array arg2', ->
        ll = new geohash64.GoogleLatLon([35.4, 135.5], [36.4, 136.5])
        ll.lat.should.be.eql 35.4
        ll.lon.should.be.eql 135.5
        ll.from.lat.should.be.eql 36.4
        ll.from.lon.should.be.eql 136.5
        ll.magnitude.lat.should.be.eql -1
        ll.magnitude.lon.should.be.eql -1

      it 'mismatch should throw num, array', ->
        fn = ->
          new geohash64.GoogleLatLon(5,[35.4, 135.5])

        (fn).should.throw()

      it 'mismatch should throw array, num', ->
        fn = ->
          new geohash64.GoogleLatLon([35.4, 135.5], 5)

        (fn).should.throw()

      it 'undefined array on arg1 (undefined,array)', ->
        fn = ->
          new geohash64.GoogleLatLon(undefined,[35.4, 135.5])

        (fn).should.throw()

      it 'either undefined (number, undefined)', ->
        fn = ->
          new geohash64.GoogleLatLon(35.4, undefined)

        (fn).should.throw()

      it 'either undefined (undefined,number)', ->
        fn = ->
          new geohash64.GoogleLatLon(undefined,5)

        (fn).should.throw()


    it 'should throw range error', ->
      ( ->
        new geohash64.LatLon(110, 135)).should.throw()
      ( ->
        new geohash64.LatLon(45.1, -190)).should.throw()

    manyPoints = [
      [45, -179.98321]
    ]

    googlesPoints = [
      [38.5, -120.2]
      [40.7, -120.95]
      [43.252, -126.453]
    ]
    manyPoints = manyPoints.concat(googlesPoints)

    manyHashes = ['_atqG`~oia@', '_p~iF~ps|U', '_flwFn`faV', '_t~fGfzxbW']

    googlesAnswer = ['_p~iF~ps|U' ,'_ulLnnqC', '_mqNvxq`@']

    fullHash = manyHashes.reduce((prev, current) ->
      prev + current)

    googlesFullHash = googlesAnswer.reduce((prev, current) ->
      prev + current)

    describe 'GoogleHash64', ->
      describe 'encode', ->
        describe 'via LatLon Object', ->
          describe 'individual hashses', ->
            manyPoints.forEach (point, i) ->
              it point, ->
                #individually without previous consideration
                (new geohash64.GoogleLatLon(point)).getGeoHash().hash.should.be.eql(manyHashes[i])

          describe 'known google hashes, via encode method', ->
            it manyPoints, ->
              geohash64.encode(googlesPoints).should.eql googlesFullHash

            it 'another long set', ->
              geohash64.encode([
                [30.90040,-87.51309],
                [30.59827,-81.64640],
                [27.05724,-80.06436],
                [25.16325,-80.61368],
                [26.01539,-81.82218],
                [27.85663,-82.81095],
                [29.07352,-82.83299],
                [30.04824,-84.06339],
                [29.70529,-85.14005],
                [30.48472,-86.48038],
                [30.21927,-87.82071],
                [30.91926,-87.99649],
                [30.87372,-87.51384]
              ])
              .should.eql 'ofr{DxkcuOh_z@yyxb@lrrTw~sHl|pJfhjB{leDb`kFwrfJxb`EqtlFvhC_k}D~hoFl~aAbhqEmfwC`xdG`zr@`xdG}ugCria@r{Gqg}A'

          it 'smaller', ->
            geohash64.encode([
              [27.05724,-80.06436],
              [25.16325,-80.61368]
            ]).should.be.eql  'wrcdDfqtgNl|pJfhjB'
            #every dupe adds two '??'
            it 'can deal with dupes', ->
              geohash64.encode([[43.252,-126.453],[40.7,-120.95],[40.7,-120.95]])
              .should.eql '_t~fGfzxbW~lqNwxq`@??'

              geohash64.encode([[43.252,-126.453],[40.7,-120.95],[40.7,-120.95],[40.7,-120.95]])
              .should.eql '_t~fGfzxbW~lqNwxq`@????'



      describe 'decode', ->
        describe 'known google hashes', ->
          manyPoints.forEach (point, i) ->
            it point, ->
              new geohash64.GoogleHash64(manyHashes[i]).center_ll.toEqual(new geohash64.GoogleLatLon(point...)).should.be.ok

        describe 'via decode method', ->
          it "#{googlesFullHash} to #{googlesPoints}", ->
            geohash64.decode(googlesFullHash,true).should.eql googlesPoints
          it 'smaller', ->
            # console.log geohash64, true
            geohash64.decode('wrcdDfqtgNl|pJfhjB',true).should.eql [
              [27.05724,-80.06436], #tested with googles decoder
              [25.16325,-80.61368]
            ]


    zoomLevels = [174,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
    zoomHashes = ['mD','?','@','A','B','C','D','E','F','G','H','I','J','K','L','M','N']
    #https://developers.google.com/maps/documentation/utilities/polylinealgorithm at bottom page
    describe 'zoomLevel', ->
      describe 'GoogleCoder', ->
        describe 'encode', ->
          describe 'single value coord - (floating lat or lon +/-)', ->
            it manyPoints[0][1], ->
              geohash64.GoogleCoder.encode(manyPoints[0][0]).should.be.equal('_atqG')
              geohash64.GoogleCoder.encode(manyPoints[0][1]).should.be.equal('`~oia@')
          describe 'zoomLevels', ->
            zoomLevels.forEach (l,i) ->
              it l, ->
                geohash64.GoogleCoder.encode(l,true).should.be.equal zoomHashes[i]
        describe 'decode', ->
          describe 'decode single coord - (floating lat or lon +/-)', ->
            it manyPoints[0][1], ->
              geohash64.GoogleCoder.decode('`~oia@', isZoom = false, isSingle = true).should.be.equal manyPoints[0][1]
          describe 'zoomeHashes', ->
            zoomHashes.forEach (h,i) ->
              it h, ->
                geohash64.GoogleCoder.decode(h,isZoom = true, isSingle = true).should.be.equal zoomLevels[i]

      describe 'geohash64 encodeZoom/decodeZoom Interfaces', ->
        describe 'geohash64.decodeZoom', ->
          describe 'zoomLevels', ->
            zoomLevels.forEach (l,i) ->
              it l, ->
                geohash64.encodeZoom(l).should.be.equal zoomHashes[i]
        describe 'geohash64.decodeZoom', ->
          describe 'zoomHashes', ->
            zoomHashes.forEach (h,i) ->
              it h, ->
                geohash64.decodeZoom(h).should.be.equal zoomLevels[i]

      describe 'multiple hashed coords', ->
        it 'return multiple points', ->
          array = geohash64.decode('_yr~Cn}grNfw@wcA', true)

          array.should.be.eql [
            [26.152,-81.802],
            [26.143,-81.791]
          ]
###
  Fix these specs later for other base64 algo
###
#  it 'hash', ->
#    ll = new geohash64.LatLon(35.026131, 135.780673)
#    ( -> geohash64.encode [ll], precision=0).should.throw()
#    encoded = geohash64.encode([ll], precision=2)
#    console.log "WTF #{geohash64.decode(encoded)}"
#
#    encoded.should.be.eql '3g'


#  self.assertEqual(
#    geohash64.encode(ll, precision=6),
#    "3gLiVI")

#  self.assertEqual(
#    geohash64.encode(ll, precision=12),
#    "3gLiVIlRVX_O")

#def test_decode(self):
#"""hash->LatLon"""
#precise_ll = geohash64.LatLon(35.026131, 135.780673)
#
#ll = geohash64.decode("3g")
#self.assertAlmostEqual(ll.lat, precise_ll.lat, -1)
#self.assertAlmostEqual(ll.lon, precise_ll.lon, -1)
#
#ll = geohash64.decode("3gL")
#self.assertAlmostEqual(ll.lat, precise_ll.lat, 0)
#self.assertAlmostEqual(ll.lon, precise_ll.lon, 0)
#
#ll = geohash64.decode("3gLiVI")
#self.assertAlmostEqual(ll.lat, precise_ll.lat, 2)
#self.assertAlmostEqual(ll.lon, precise_ll.lon, 2)
#
#def test_distance_from(self):
#ll1 = geohash64.LatLon(35.65500, 139.74472)
#ll2 = geohash64.LatLon(33.59532, 130.36208)
#self.assertAlmostEqual(
#  ll1.distance_from(ll2),
#  890233.064304, 5)
#
#self.assertAlmostEqual(
#  ll1.distance_to(ll2),
#  890233.064304, 5)
#
#self.assertRaises(
#  geohash64.InvalidArgumentError,
#  ll1.distance_to, "not LatLon Object")
#
