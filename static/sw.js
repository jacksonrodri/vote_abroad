importScripts('/_nuxt/workbox.476439e0.js')

const workboxSW = new self.WorkboxSW({
  "cacheId": "votefromabroad",
  "clientsClaim": true,
  "directoryIndex": "/"
})

workboxSW.precache([
  {
    "url": "/_nuxt/0.dc5075b78325433698c2.js",
    "revision": "748e0740ad65e11d97ac174bc2519fab"
  },
  {
    "url": "/_nuxt/1.8e0cafd6a76f9815ba76.js",
    "revision": "3298e99c8959f6c1a821fb68dc4cc40b"
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
    "url": "/_nuxt/12.7e3c98a9d4cf41c2f701.js",
    "revision": "3e09c5c0cf78333a57aeca159fcb7b80"
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
    "url": "/_nuxt/4.7885273f09a01058a418.js",
    "revision": "1aee537cbe575cde2c6304c98be9b3a4"
  },
  {
    "url": "/_nuxt/5.33cb14f0ee48b563819a.js",
    "revision": "b8690aa0edf3e4a41c817e2ea5c96948"
  },
  {
    "url": "/_nuxt/6.f61656bcd26a17ecc46f.js",
    "revision": "0842482f159220411d8f4d7d175c4525"
  },
  {
    "url": "/_nuxt/7.44520d2abb1fe315e021.js",
    "revision": "c69302b7bba1376b995adf862a1006ed"
  },
  {
    "url": "/_nuxt/8.78a44bda07d39500633c.js",
    "revision": "7aec4f9a3ebde230f90ce030618a0c03"
  },
  {
    "url": "/_nuxt/9.dd0aa315dcbe17c3d306.js",
    "revision": "72ee83b6b676ba814baa1a2a01b11777"
  },
  {
    "url": "/_nuxt/app.f85ce0bb4b29f48fa64f.js",
    "revision": "a5e165102ad0402fba35237185d9ec3a"
  },
  {
    "url": "/_nuxt/layouts/default.099065470240d4b8c1a7.js",
    "revision": "15a3bcf9bce602fdeba154afab41547a"
  },
  {
    "url": "/_nuxt/layouts/olddefault.331cd6fb0af1b3081baa.js",
    "revision": "36a96794cef98c12cb6d185ae40b1d3b"
  },
  {
    "url": "/_nuxt/layouts/vfa.3fa784cfb12cdddc7b95.js",
    "revision": "09a18fb13c06d57c8b86ac11b0256b6c"
  },
  {
    "url": "/_nuxt/manifest.fff22dc56b992f719bc3.js",
    "revision": "c364c0190f9c2ff5c6651b57a8b273ae"
  },
  {
    "url": "/_nuxt/vendor.4ad01ef87362323c9d39.js",
    "revision": "30c1304cf08d5b04a9f5d55dbb5ba872"
  }
])


workboxSW.router.registerRoute(new RegExp('/_nuxt/.*'), workboxSW.strategies.cacheFirst({}), 'GET')

workboxSW.router.registerRoute(new RegExp('/.*'), workboxSW.strategies.networkFirst({}), 'GET')

