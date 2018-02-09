importScripts('/_nuxt/workbox.476439e0.js')

const workboxSW = new self.WorkboxSW({
  "cacheId": "votefromabroad",
  "clientsClaim": true,
  "directoryIndex": "/"
})

workboxSW.precache([
  {
    "url": "/_nuxt/0.f859f30c3f18408f1340.js",
    "revision": "69c3bee432bdc552d9698f931aa41c60"
  },
  {
    "url": "/_nuxt/1.8e0cafd6a76f9815ba76.js",
    "revision": "3298e99c8959f6c1a821fb68dc4cc40b"
  },
  {
    "url": "/_nuxt/10.740e44dd4a0a6199c56f.js",
    "revision": "aef1e409271d0ef7e220122592bfa099"
  },
  {
    "url": "/_nuxt/11.73c3ff7e48cdc3cd12b2.js",
    "revision": "1b88f953dc9227ac2a228df7647f4956"
  },
  {
    "url": "/_nuxt/12.423545cc9a3cf5a3ba63.js",
    "revision": "eb5516115a4ddd5fd3a729364c2aca81"
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
    "url": "/_nuxt/4.7885273f09a01058a418.js",
    "revision": "1aee537cbe575cde2c6304c98be9b3a4"
  },
  {
    "url": "/_nuxt/5.d41a485e63ad40d8c412.js",
    "revision": "17520c46bae69457868ff666455fc993"
  },
  {
    "url": "/_nuxt/6.437766fa23bf1f7ac028.js",
    "revision": "d77727ef0c1893d5d6cb5f045929d71f"
  },
  {
    "url": "/_nuxt/7.f99662c8594c649d1275.js",
    "revision": "44ff0831c5e8e144d12c30fec104baf8"
  },
  {
    "url": "/_nuxt/8.c73ab7492bdc91beefaa.js",
    "revision": "57ede1d3ba3fae5889815aa0468baceb"
  },
  {
    "url": "/_nuxt/9.6e4198468e14a4b39dfd.js",
    "revision": "dc04d91aaf36b401db31a056b057c6ef"
  },
  {
    "url": "/_nuxt/app.ca84440df2a5666b40e7.js",
    "revision": "a09e5137dca6993a1e2b95a7b88710a9"
  },
  {
    "url": "/_nuxt/layouts/default.099065470240d4b8c1a7.js",
    "revision": "15a3bcf9bce602fdeba154afab41547a"
  },
  {
    "url": "/_nuxt/layouts/olddefault.ee81aabe8523cfdc79a6.js",
    "revision": "6eeec0489ebf3d482bbeb59b6ec479fe"
  },
  {
    "url": "/_nuxt/layouts/vfa.3fa784cfb12cdddc7b95.js",
    "revision": "09a18fb13c06d57c8b86ac11b0256b6c"
  },
  {
    "url": "/_nuxt/manifest.805ec5c2a75d61da8d81.js",
    "revision": "bbb7fce6f79e5e773e49c851a3171d30"
  },
  {
    "url": "/_nuxt/vendor.283e4016038f817bb43d.js",
    "revision": "742545f566e260f84f6effac7061a28e"
  }
])


workboxSW.router.registerRoute(new RegExp('/_nuxt/.*'), workboxSW.strategies.cacheFirst({}), 'GET')

workboxSW.router.registerRoute(new RegExp('/.*'), workboxSW.strategies.networkFirst({}), 'GET')

