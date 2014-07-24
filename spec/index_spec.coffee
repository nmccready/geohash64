# encoding: utf-8
###
ported from @a_dat's geohash64Test.py
MIT license.
###
describe 'LatLon', ->
  it 'can be created', ->
    ll = new geohash64.LatLon(35.4, 135.5)
    ll.lat.should.be.eql 35.4
    ll.lon.should.be.eql 135.5

  it 'should throw range error', ->
    ( ->
      new geohash64.LatLon(110, 135)).should.throw()
    ( ->
      new geohash64.LatLon(45.1, -190)).should.throw()

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

describe 'GoogleLatLon', ->
  manyPoints = [
    [38.5, -120.2],
    [45, -179.98321],
    [40.7, -120.95],
    [43.252, -126.453]
  ]
  manyHashes = ['_p~iF~ps|U', '_atqG`~oia@', '_flwFn`faV', '_t~fGfzxbW']
  fullHash = manyHashes.reduce((prev, current) ->
    prev + current)
  #website states[2] _ulLnnqC, but using their encoding tool it is not right, the below test is what it should be
  #again website [3] is incorrect states answer is _mqNvxq`@ ... wrong!
  it 'can be created', ->
    ll = new geohash64.GoogleLatLon(35.4, 135.5)
    ll.lat.should.be.eql 35.4
    ll.lon.should.be.eql 135.5

  it 'should throw range error', ->
    ( ->
      new geohash64.LatLon(110, 135)).should.throw()
    ( ->
      new geohash64.LatLon(45.1, -190)).should.throw()

  describe 'encode', ->
    describe 'via LatLon Object', ->
      describe 'known google hashes', ->
        manyPoints.forEach (point, i) ->
          it point, ->
            (new geohash64.GoogleLatLon(point...)).getGeoHash().hash.should.be.eql(manyHashes[i])
    describe 'via encode method', ->
      it manyPoints, ->
        geohash64.encode(manyPoints).should.eql fullHash

  describe 'decode', ->
    describe 'known google hashes', ->
      manyPoints.forEach (point, i) ->
        it point, ->
          new geohash64.GoogleHash64(manyHashes[i]).center_ll.toEqual(new geohash64.GoogleLatLon(point...)).should.be.ok
    describe 'via decode method', ->
      it "#{fullHash} to #{manyPoints}", ->
        geohash64.decode(fullHash,true).should.eql manyPoints