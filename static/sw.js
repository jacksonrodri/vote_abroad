importScripts('/_nuxt/workbox.476439e0.js')

const workboxSW = new self.WorkboxSW({
  "cacheId": "votefromabroad",
  "clientsClaim": true,
  "directoryIndex": "/"
})

workboxSW.precache([
  {
    "url": "/_nuxt/0.71db2a0df7093f2846d1.js",
    "revision": "02eb462778521eb9b76adcba21ddf6e4"
  },
  {
    "url": "/_nuxt/1.cf8a664769a483a91344.js",
    "revision": "6c425bc71ef3e7740217d1e9fa616948"
  },
  {
    "url": "/_nuxt/10.a863efbac54ba71971c2.js",
    "revision": "47b9d1802b23985e448c65a809ead933"
  },
  {
    "url": "/_nuxt/11.218b0683d62ca7c00925.js",
    "revision": "b5492a8026172c31419302191c50cf41"
  },
  {
    "url": "/_nuxt/2.7921bbc05eba1b8c7506.js",
    "revision": "0e3fa76e8f86af96754094a57532a23d"
  },
  {
    "url": "/_nuxt/3.41b8816c2136b228274f.js",
    "revision": "e7371bb959fc7248190e73bcf07f5c8e"
  },
  {
    "url": "/_nuxt/5.1322ea09b19766a769a3.js",
    "revision": "506e149138a472c2a426772bd7dbc5a1"
  },
  {
    "url": "/_nuxt/6.1cef2f0e84402f26d170.js",
    "revision": "0cb4fb807a0743de147620a38d409e52"
  },
  {
    "url": "/_nuxt/7.89b097a07474f986fcff.js",
    "revision": "c841a25fbfae323adeb9f0c5e0edce0a"
  },
  {
    "url": "/_nuxt/8.9d2e0946179a61e9cd25.js",
    "revision": "f87d2f374f82992b42ae8727c01a0e5f"
  },
  {
    "url": "/_nuxt/9.a49c4f52ab94ced50554.js",
    "revision": "a4d4495d81ebc859f3ddff09aac16dec"
  },
  {
    "url": "/_nuxt/app.ea90cc43a7d1227a1953.js",
    "revision": "f719be6129ad8969cb35d46f8acac6b7"
  },
  {
    "url": "/_nuxt/layouts/default.60aadf2934cdf5179f6f.js",
    "revision": "dd8df475d2c63f23ae796e2a9fcdfe3f"
  },
  {
    "url": "/_nuxt/manifest.32c51934164cbf204c7c.js",
    "revision": "d10546bcc9d8917978338e36255edf1e"
  },
  {
    "url": "/_nuxt/vendor.afb8f7c371be28d5e565.js",
    "revision": "78547d97d405562cea4a02e69b656bd8"
  }
])


workboxSW.router.registerRoute(new RegExp('/_nuxt/.*'), workboxSW.strategies.cacheFirst({}), 'GET')

workboxSW.router.registerRoute(new RegExp('/.*'), workboxSW.strategies.networkFirst({}), 'GET')

