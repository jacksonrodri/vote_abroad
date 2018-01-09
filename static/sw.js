importScripts('/_nuxt/workbox.476439e0.js')

const workboxSW = new self.WorkboxSW({
  "cacheId": "votefromabroad",
  "clientsClaim": true,
  "directoryIndex": "/"
})

workboxSW.precache([
  {
    "url": "/_nuxt/0.4ea563f85a5ac5ac4e60.js",
    "revision": "b2472d8c2f41a6467e03c38a7db247be"
  },
  {
    "url": "/_nuxt/1.e9388f1b1784d404809d.js",
    "revision": "b12aa198757b6efa6ccbd7c641dfcda7"
  },
  {
    "url": "/_nuxt/app.186fbd5a5da05c1aa39a.js",
    "revision": "8510874a9a58fb1aa270f306c04929e8"
  },
  {
    "url": "/_nuxt/layouts/default.a12b2ba82efbafd1e356.js",
    "revision": "325c31c35e900f2db3fc2e1ac0a58bd5"
  },
  {
    "url": "/_nuxt/manifest.4689e81f3ac0fa591d3a.js",
    "revision": "ebf994d406d2037afe1d58dbe0edef35"
  },
  {
    "url": "/_nuxt/vendor.079dfd9a489db030eadd.js",
    "revision": "5fb8343ad585ab9f13b3092b841122ee"
  }
])


workboxSW.router.registerRoute(new RegExp('/_nuxt/.*'), workboxSW.strategies.cacheFirst({}), 'GET')

workboxSW.router.registerRoute(new RegExp('/.*'), workboxSW.strategies.networkFirst({}), 'GET')

