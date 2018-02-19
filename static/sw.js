importScripts('/_nuxt/workbox.476439e0.js')

const workboxSW = new self.WorkboxSW({
  "cacheId": "votefromabroad",
  "clientsClaim": true,
  "directoryIndex": "/"
})

workboxSW.precache([
  {
    "url": "/_nuxt/0.45481e469ff7f51545da.js",
    "revision": "f3fb493a0ec61ec6901a2e54d08bfed9"
  },
  {
    "url": "/_nuxt/1.98c7886bbeff7dd69732.js",
    "revision": "550138a74a544543ba0b47e5f92cfcd4"
  },
  {
    "url": "/_nuxt/10.d6581e03ac9778d6dc7e.js",
    "revision": "63532cc0067514fb7e78854aa4cef134"
  },
  {
    "url": "/_nuxt/11.b44b9539c848fd41e3a8.js",
    "revision": "031be78dacb52476c18c79e1e59776ef"
  },
  {
    "url": "/_nuxt/12.bfedac95291b5c8a9cf5.js",
    "revision": "0accc02d1b6cbe2012351f6bf9932341"
  },
  {
    "url": "/_nuxt/13.79d61e25e36ce68172b9.js",
    "revision": "19052b325ac161d23eacd1f8771b4ad2"
  },
  {
    "url": "/_nuxt/15.6870b8f320ac694c0175.js",
    "revision": "d316b0a5599c5bfe9a33dd5c3c94dd81"
  },
  {
    "url": "/_nuxt/4.4da666ae96eb57f8f8fd.js",
    "revision": "12595706bfda8bd62ec1c56c9c74921c"
  },
  {
    "url": "/_nuxt/5.480660944aacf3ae50cf.js",
    "revision": "55701fb25208f0f8726a5ab426d8def7"
  },
  {
    "url": "/_nuxt/6.584a27677cb3366e5c64.js",
    "revision": "1a1edfd17c934ad7e156f8449cc2a997"
  },
  {
    "url": "/_nuxt/7.44520d2abb1fe315e021.js",
    "revision": "c69302b7bba1376b995adf862a1006ed"
  },
  {
    "url": "/_nuxt/8.c357c52d1c82aed4f2e5.js",
    "revision": "014469c8bbe902d68b24e3f77baee013"
  },
  {
    "url": "/_nuxt/9.dd0aa315dcbe17c3d306.js",
    "revision": "72ee83b6b676ba814baa1a2a01b11777"
  },
  {
    "url": "/_nuxt/app.baeb22dabdf73c608a08.js",
    "revision": "8befd9ac7c1363124d6bafb04df72552"
  },
  {
    "url": "/_nuxt/layouts/default.8af4c9a75a047c43c65e.js",
    "revision": "90a546ed91357f431b65cf5c9b6394b9"
  },
  {
    "url": "/_nuxt/layouts/olddefault.331cd6fb0af1b3081baa.js",
    "revision": "36a96794cef98c12cb6d185ae40b1d3b"
  },
  {
    "url": "/_nuxt/layouts/vfa.929d48a94f9d5fee17be.js",
    "revision": "7deb4d14dbc6d47588779217d554d20d"
  },
  {
    "url": "/_nuxt/manifest.7b32c83f93880b64d236.js",
    "revision": "9b834f841cb1ca3b7755b34688172df5"
  },
  {
    "url": "/_nuxt/vendor.919012f83202f64a34a7.js",
    "revision": "962af9895dd66928935a9f474d29d98e"
  }
])


workboxSW.router.registerRoute(new RegExp('/_nuxt/.*'), workboxSW.strategies.cacheFirst({}), 'GET')

workboxSW.router.registerRoute(new RegExp('/.*'), workboxSW.strategies.networkFirst({}), 'GET')

