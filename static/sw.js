importScripts('/_nuxt/workbox.476439e0.js')

const workboxSW = new self.WorkboxSW({
  "cacheId": "votefromabroad",
  "clientsClaim": true,
  "directoryIndex": "/"
})

workboxSW.precache([
  {
    "url": "/_nuxt/10.d6581e03ac9778d6dc7e.js",
    "revision": "63532cc0067514fb7e78854aa4cef134"
  },
  {
    "url": "/_nuxt/11.b44b9539c848fd41e3a8.js",
    "revision": "031be78dacb52476c18c79e1e59776ef"
  },
  {
    "url": "/_nuxt/12.0fb632a2e487f6dbbaef.js",
    "revision": "13bd28f37bcfc215cee686c47fe1bf93"
  },
  {
    "url": "/_nuxt/13.60a6ebeccd8140e85c2f.js",
    "revision": "f95651bef30d719e01d05af30b21f8f1"
  },
  {
    "url": "/_nuxt/14.eecc8fdb79bc6703ad7c.js",
    "revision": "86a4d8046a36e3ce1d8d1ccca7d64db5"
  },
  {
    "url": "/_nuxt/2.0df8f67019a05a9d3270.js",
    "revision": "2a212cbcb560bd41377cab787c1f079a"
  },
  {
    "url": "/_nuxt/3.20ea1bc49338f603be8f.js",
    "revision": "bd8340ad9476cd42842c86978d1fe5a4"
  },
  {
    "url": "/_nuxt/4.18a6564463937f8a2461.js",
    "revision": "8238b02612213e8bea93b4406992458e"
  },
  {
    "url": "/_nuxt/5.b546e86a1c716718a4e5.js",
    "revision": "d37a63c42a6cfecab157e22c0bd1abda"
  },
  {
    "url": "/_nuxt/7.ebfd979f0ba8c872dd5f.js",
    "revision": "c2cd115f6d205a0dbf3930ff68fb9246"
  },
  {
    "url": "/_nuxt/8.51f5c02b25b19356a198.js",
    "revision": "6c304cc01bbf7869cf62b690a77217d3"
  },
  {
    "url": "/_nuxt/9.dd0aa315dcbe17c3d306.js",
    "revision": "72ee83b6b676ba814baa1a2a01b11777"
  },
  {
    "url": "/_nuxt/app.f01cd0e8c4ed9b4b25ec.js",
    "revision": "fef080059e529a34dba1c88e0dd4531e"
  },
  {
    "url": "/_nuxt/lang-en-US.89b9f1e16035c5f8cce5.js",
    "revision": "245179667ece68650db122dc1e15c7ac"
  },
  {
    "url": "/_nuxt/lang-es-ES.3f377c873e7901096a77.js",
    "revision": "6a0ad5b9ffc3d42f308d7df95c68672f"
  },
  {
    "url": "/_nuxt/layouts/default.301c8afe5ee166c79b0c.js",
    "revision": "e34759f93d0c9a7f45e5206002cada1c"
  },
  {
    "url": "/_nuxt/manifest.78cab18c490f2bdbb7ac.js",
    "revision": "e34bb7e48b3d77731d41cfa0ff1368f7"
  },
  {
    "url": "/_nuxt/vendor.04c9a3462134fd01412a.js",
    "revision": "126d9ec3a237b38875195833559ffedc"
  }
])


workboxSW.router.registerRoute(new RegExp('/_nuxt/.*'), workboxSW.strategies.cacheFirst({}), 'GET')

workboxSW.router.registerRoute(new RegExp('/.*'), workboxSW.strategies.networkFirst({}), 'GET')

