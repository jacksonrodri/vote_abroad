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
    "url": "/_nuxt/11.218b0683d62ca7c00925.js",
    "revision": "b5492a8026172c31419302191c50cf41"
  },
  {
    "url": "/_nuxt/3.d78e17e4eec34d645dca.js",
    "revision": "12e20161eac4c1db06265b9b2929b333"
  },
  {
    "url": "/_nuxt/4.ac9dde8ab129b5015e18.js",
    "revision": "fc1f10f3d49cc3a5b6c7fbabcb06ada6"
  },
  {
    "url": "/_nuxt/5.27d2157b7ee6a6485319.js",
    "revision": "fab652dd0d5362877ba39b239566b820"
  },
  {
    "url": "/_nuxt/6.a13085cc371037fc2ff8.js",
    "revision": "7d30da0dc3e04e878217ed5068bde5e7"
  },
  {
    "url": "/_nuxt/7.38ee25011f76a0e6d858.js",
    "revision": "bf338144905b89e081f2c28bdca698c9"
  },
  {
    "url": "/_nuxt/8.384f7d776c1bc9c48047.js",
    "revision": "0ded767204b34810f0bd2fb6c2bffd95"
  },
  {
    "url": "/_nuxt/9.604e8f27f0b80b9581da.js",
    "revision": "bf23b3eaf888f3a98a0264c07896c927"
  },
  {
    "url": "/_nuxt/app.7551ed49bcf848075cf6.js",
    "revision": "8f3e4a12bfea6d78aad8c33d24549a4e"
  },
  {
    "url": "/_nuxt/layouts/default.6cd2464a668dd6815c8f.js",
    "revision": "e5e82c8a3d96c8e1965b43e7f2026306"
  },
  {
    "url": "/_nuxt/layouts/olddefault.1d51fb070182d8da81aa.js",
    "revision": "1995ba40bbf9b6734e41bdb01697b1bc"
  },
  {
    "url": "/_nuxt/layouts/vfa.8c95592c7095ccf5a07e.js",
    "revision": "37cd1d38db86854864dad7452032401a"
  },
  {
    "url": "/_nuxt/manifest.f800520d906a36b7b395.js",
    "revision": "2718f99489d33d55c6d135a48b071d04"
  },
  {
    "url": "/_nuxt/vendor.bc52ebffaf26811c60f6.js",
    "revision": "8700fe572d471f36853539f3a564d455"
  }
])


workboxSW.router.registerRoute(new RegExp('/_nuxt/.*'), workboxSW.strategies.cacheFirst({}), 'GET')

workboxSW.router.registerRoute(new RegExp('/.*'), workboxSW.strategies.networkFirst({}), 'GET')

