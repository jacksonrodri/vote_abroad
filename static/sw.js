importScripts('/_nuxt/workbox.476439e0.js')

const workboxSW = new self.WorkboxSW({
  "cacheId": "votefromabroad",
  "clientsClaim": true,
  "directoryIndex": "/"
})

workboxSW.precache([
  {
    "url": "/_nuxt/0.f3b3dde6f0566ab640fa.js",
    "revision": "5b5d9f102225305eb042355530a6db79"
  },
  {
    "url": "/_nuxt/1.b120d350686e5b9c88d6.js",
    "revision": "afa730054d959af1fe4da68f2146b075"
  },
  {
    "url": "/_nuxt/10.9d47cb62afe9f19cf9d2.js",
    "revision": "cb789a0320358590d458eec8a1fea31f"
  },
  {
    "url": "/_nuxt/11.6f7a24ab2a084eef3131.js",
    "revision": "74821f84ef8b802beb253f4e5b910723"
  },
  {
    "url": "/_nuxt/12.1ac3e9547517933b5e1a.js",
    "revision": "5c07fdb452fdc59e85992edd4d3cf81b"
  },
  {
    "url": "/_nuxt/2.421b33e2f28f58fdf19e.js",
    "revision": "389450666da6eee57c8a65ba7b25e387"
  },
  {
    "url": "/_nuxt/3.41b8816c2136b228274f.js",
    "revision": "e7371bb959fc7248190e73bcf07f5c8e"
  },
  {
    "url": "/_nuxt/5.b5205649a9ebff76c8d6.js",
    "revision": "975d18e9038df157a445829de48be6d4"
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
    "url": "/_nuxt/app.13becc512edf19fab2b0.js",
    "revision": "30f8849e33bbd0c98b81497106478e6c"
  },
  {
    "url": "/_nuxt/layouts/default.36b35952a5b5b4f1eeff.js",
    "revision": "babcc0889461468f0cf61484baa29d78"
  },
  {
    "url": "/_nuxt/manifest.ffccf05b2247d23e677e.js",
    "revision": "717c4998eeb02074593b8b2ac5a4ffd7"
  },
  {
    "url": "/_nuxt/vendor.80c3e948b729d295f1c4.js",
    "revision": "7b643aac3af4a11482f310570c3f7803"
  }
])


workboxSW.router.registerRoute(new RegExp('/_nuxt/.*'), workboxSW.strategies.cacheFirst({}), 'GET')

workboxSW.router.registerRoute(new RegExp('/.*'), workboxSW.strategies.networkFirst({}), 'GET')

