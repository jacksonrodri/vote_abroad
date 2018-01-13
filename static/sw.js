importScripts('/_nuxt/workbox.476439e0.js')

const workboxSW = new self.WorkboxSW({
  "cacheId": "votefromabroad",
  "clientsClaim": true,
  "directoryIndex": "/"
})

workboxSW.precache([
  {
    "url": "/_nuxt/0.0ab24ea965a8d1acf027.js",
    "revision": "628fbb5bcb24d29c4802ac43e7adbdaa"
  },
  {
    "url": "/_nuxt/1.3e2da95e3106d11896a9.js",
    "revision": "b83197db5cfaaeb58905465e9643236f"
  },
  {
    "url": "/_nuxt/2.4559404a740f947fca9d.js",
    "revision": "7fe0ffa8c7189f56432a8592f1a95ca3"
  },
  {
    "url": "/_nuxt/3.1e8a5816e5b54920720f.js",
    "revision": "633a6f3b042608c351e856c0d3a00d44"
  },
  {
    "url": "/_nuxt/4.f6083871a04e2feebfdb.js",
    "revision": "dcb83f00843c9fbeec0d5b2a1bb37d2c"
  },
  {
    "url": "/_nuxt/app.8ccb149ee486a49cb158.js",
    "revision": "0649d1a47763892d5aa667725b09ad97"
  },
  {
    "url": "/_nuxt/layouts/default.703a62ba96c531c158eb.js",
    "revision": "a5e614c6c1a4e4185e6e8fe6e3725ce2"
  },
  {
    "url": "/_nuxt/manifest.6704d1ad5364c44bae16.js",
    "revision": "28326ee2c78ec9f0b248a79dd1008ae8"
  },
  {
    "url": "/_nuxt/vendor.a24c46e32c5f6ed90962.js",
    "revision": "048686c5cf6192ddfe47796fd7aab5f7"
  }
])


workboxSW.router.registerRoute(new RegExp('/_nuxt/.*'), workboxSW.strategies.cacheFirst({}), 'GET')

workboxSW.router.registerRoute(new RegExp('/.*'), workboxSW.strategies.networkFirst({}), 'GET')

