importScripts('/_nuxt/workbox.476439e0.js')

const workboxSW = new self.WorkboxSW({
  "cacheId": "votefromabroad",
  "clientsClaim": true,
  "directoryIndex": "/"
})

workboxSW.precache([
  {
    "url": "/_nuxt/0.f565882518662a11e6a2.js",
    "revision": "731fba554da3b257c6dd370d8fb06f8d"
  },
  {
    "url": "/_nuxt/1.c25b20c541841d3cb134.js",
    "revision": "fdebc7acc6b552df696a4c43f16506cd"
  },
  {
    "url": "/_nuxt/10.3dbb2e667961f901dc3d.js",
    "revision": "eb3bee242db14d105186049c101cd4f1"
  },
  {
    "url": "/_nuxt/11.218b0683d62ca7c00925.js",
    "revision": "b5492a8026172c31419302191c50cf41"
  },
  {
    "url": "/_nuxt/2.2e256eaa4f958d9f510b.js",
    "revision": "c2cc6e697795e176815d3781d1c7b8f4"
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
    "url": "/_nuxt/app.ad8e1a213520b53f66eb.js",
    "revision": "7afdfd59d74c66897be16fbaa4e84598"
  },
  {
    "url": "/_nuxt/layouts/default.482e8a35f19519428cf1.js",
    "revision": "d491f8a55537ae683dcff08abb49487a"
  },
  {
    "url": "/_nuxt/manifest.030784fdaaa3e24400f6.js",
    "revision": "261145a2852f247828620d657e4baca3"
  },
  {
    "url": "/_nuxt/vendor.afb8f7c371be28d5e565.js",
    "revision": "78547d97d405562cea4a02e69b656bd8"
  }
])


workboxSW.router.registerRoute(new RegExp('/_nuxt/.*'), workboxSW.strategies.cacheFirst({}), 'GET')

workboxSW.router.registerRoute(new RegExp('/.*'), workboxSW.strategies.networkFirst({}), 'GET')

