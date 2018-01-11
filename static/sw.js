importScripts('/_nuxt/workbox.476439e0.js')

const workboxSW = new self.WorkboxSW({
  "cacheId": "votefromabroad",
  "clientsClaim": true,
  "directoryIndex": "/"
})

workboxSW.precache([
  {
    "url": "/_nuxt/0.4a3507f29583580267a4.js",
    "revision": "e4c7e2b3e0ef16ec8175f257946bd8db"
  },
  {
    "url": "/_nuxt/1.c8688244300f1bd1622f.js",
    "revision": "c76078ab081803cf56661f55a60851eb"
  },
  {
    "url": "/_nuxt/2.aa6b4107f1de5682a552.js",
    "revision": "81fe63cb41a3d5b8729eb6ce98d90d86"
  },
  {
    "url": "/_nuxt/app.1478b4a6a321e725830f.js",
    "revision": "c24afe918a34a84c16c24354a6a3c831"
  },
  {
    "url": "/_nuxt/layouts/default.20d6c59f36dadcdb1e00.js",
    "revision": "2ad46aa1daa4bc6ab5e4d1b93b80b9f5"
  },
  {
    "url": "/_nuxt/manifest.c59ebb54b318fd7926b2.js",
    "revision": "662600b9bbff19b22bee80b12ebc85e5"
  },
  {
    "url": "/_nuxt/vendor.8af87a5a860fb91c82c0.js",
    "revision": "396f07f417e5ebf6391d083ea8897ddc"
  }
])


workboxSW.router.registerRoute(new RegExp('/_nuxt/.*'), workboxSW.strategies.cacheFirst({}), 'GET')

workboxSW.router.registerRoute(new RegExp('/.*'), workboxSW.strategies.networkFirst({}), 'GET')

