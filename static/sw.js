importScripts('/_nuxt/workbox.476439e0.js')

const workboxSW = new self.WorkboxSW({
  "cacheId": "votefromabroad",
  "clientsClaim": true,
  "directoryIndex": "/"
})

workboxSW.precache([
  {
    "url": "/_nuxt/0.55322defaf271e974fb9.js",
    "revision": "b1a6241af53f647789f297b1258b319f"
  },
  {
    "url": "/_nuxt/10.993530598f241c97c5ea.js",
    "revision": "06c3e272173b245a047aee72e9b6bf54"
  },
  {
    "url": "/_nuxt/11.9dd5582d13fe166b9dec.js",
    "revision": "5d52645b5adf41c42ae83ae56edc465c"
  },
  {
    "url": "/_nuxt/12.423545cc9a3cf5a3ba63.js",
    "revision": "987ea5ecb95b1c56e2d7d4f538cb3770"
  },
  {
    "url": "/_nuxt/13.27b28333b94e573bc0c6.js",
    "revision": "edf0d95461841b9ec30817d8e9fb3b3c"
  },
  {
    "url": "/_nuxt/14.4b1e3c1a39da15549936.js",
    "revision": "1eacec61fbdb03dfd115159d3a635977"
  },
  {
    "url": "/_nuxt/16.d2d622604e35be54f309.js",
    "revision": "8513a582fb17f2511b43dec41636c3a3"
  },
  {
    "url": "/_nuxt/3.d78e17e4eec34d645dca.js",
    "revision": "12e20161eac4c1db06265b9b2929b333"
  },
  {
    "url": "/_nuxt/4.50ae3c21be02a2be73b1.js",
    "revision": "8d8912e75cda6723df2035d2f0e0437a"
  },
  {
    "url": "/_nuxt/5.ff18b227154cdf7d2128.js",
    "revision": "e9c74e8ca142bce5e79985299f893725"
  },
  {
    "url": "/_nuxt/6.f7ed7d5f3b559054a94a.js",
    "revision": "3a359a51f6eb581b580bff08aca48d40"
  },
  {
    "url": "/_nuxt/7.3f744920d574fa3b4bb2.js",
    "revision": "fdd3326cb3efd23f8944ffa6892ab86a"
  },
  {
    "url": "/_nuxt/8.024a7710aa141e05a321.js",
    "revision": "bfa88f4d5c83fe626f6a3176cbaf04b0"
  },
  {
    "url": "/_nuxt/9.2d8e2648899f47af8f08.js",
    "revision": "29d9589edd76783f12e94a3ff1e798d4"
  },
  {
    "url": "/_nuxt/app.58b33f540fee4b98df8a.js",
    "revision": "26c048a9302e086a2a23cf3153e1c91c"
  },
  {
    "url": "/_nuxt/layouts/default.ea1a2d8797ab49b5c6ce.js",
    "revision": "5198bd35237276c5c22ffe66743a2f36"
  },
  {
    "url": "/_nuxt/layouts/olddefault.ee81aabe8523cfdc79a6.js",
    "revision": "6eeec0489ebf3d482bbeb59b6ec479fe"
  },
  {
    "url": "/_nuxt/layouts/vfa.9ace2ad1b2d8304b9748.js",
    "revision": "db14206cbf54dd9789f1ee59d015c2a9"
  },
  {
    "url": "/_nuxt/manifest.27ce46e54c3366f1677d.js",
    "revision": "f0cb12d37339b06739ad3d4f725181cb"
  },
  {
    "url": "/_nuxt/vendor.5b4ca8d401eecf9bc155.js",
    "revision": "681c5727ccf6d3ab4160560691c9d6cc"
  }
])


workboxSW.router.registerRoute(new RegExp('/_nuxt/.*'), workboxSW.strategies.cacheFirst({}), 'GET')

workboxSW.router.registerRoute(new RegExp('/.*'), workboxSW.strategies.networkFirst({}), 'GET')

