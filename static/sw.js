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
    "url": "/_nuxt/2.8948ad576a5a04b02351.js",
    "revision": "5b3e0e93073841080e21f609e2a0fc9d"
  },
  {
    "url": "/_nuxt/3.e87ba8d56d06b7ed78cd.js",
    "revision": "355370bc9938ea16bb9920438e3ffa35"
  },
  {
    "url": "/_nuxt/4.87111430bd762ffb8453.js",
    "revision": "29a0cdd1fbfd52dd462d6b3ebb6d34b9"
  },
  {
    "url": "/_nuxt/5.05ac18dece9fdb573229.js",
    "revision": "501582d26d55ef24f113a82ebc6842f4"
  },
  {
    "url": "/_nuxt/6.f0e2813d8386b94f0cf3.js",
    "revision": "bc5cab52b5a99b368aa53c51083ee9fe"
  },
  {
    "url": "/_nuxt/app.58f258e29b62a043f629.js",
    "revision": "43ce204cb0a523fd49efd3e12430ab86"
  },
  {
    "url": "/_nuxt/layouts/default.4b6d9fef854cbff9fd1c.js",
    "revision": "fc3e881c142f392e11be86d701ae6531"
  },
  {
    "url": "/_nuxt/manifest.66be6c5e8c5fa143d4d5.js",
    "revision": "cbbbab83beb3ccfad240489d17c13943"
  },
  {
    "url": "/_nuxt/vendor.34fa1e39f08a3835bbb0.js",
    "revision": "26fa363c523cd21057f846cfaa2e2b9c"
  }
])


workboxSW.router.registerRoute(new RegExp('/_nuxt/.*'), workboxSW.strategies.cacheFirst({}), 'GET')

workboxSW.router.registerRoute(new RegExp('/.*'), workboxSW.strategies.networkFirst({}), 'GET')

