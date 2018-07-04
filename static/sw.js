importScripts('/_nuxt/workbox.3de3418b.js')

const workboxSW = new self.WorkboxSW({
  "cacheId": "votefromabroad",
  "clientsClaim": true,
  "directoryIndex": "/"
})

workboxSW.precache([
  {
    "url": "/_nuxt/10.19d742d7d601eb9e83a0.js",
    "revision": "cb7f06379f45b67d1c6da39592e9ed20"
  },
  {
    "url": "/_nuxt/11.114ae3b8523a88499cb2.js",
    "revision": "be7aa90fe85ec620f497bcd7a2ab338b"
  },
  {
    "url": "/_nuxt/12.51cd706001151db8fc66.js",
    "revision": "d25aa2a2ed84485638a3ea0df3cd3fb3"
  },
  {
    "url": "/_nuxt/13.150307a24514a2fd5090.js",
    "revision": "080fc044b82f69042f3d44422f41bae5"
  },
  {
    "url": "/_nuxt/14.40ab97360013324e5424.js",
    "revision": "17570f3d81554fe8bd601c60ca564dc0"
  },
  {
    "url": "/_nuxt/15.97781c567d347aaeb61f.js",
    "revision": "acf90b106e4a59e33ac0ad540dd679db"
  },
  {
    "url": "/_nuxt/16.6213c0064b485c31eac0.js",
    "revision": "403b546055508b135e5666e885ed2a7b"
  },
  {
    "url": "/_nuxt/17.482250c317b62e699236.js",
    "revision": "2a4a9cb09c1d3442408d5c504231bd4d"
  },
  {
    "url": "/_nuxt/18.926cb96765c0cd800eb6.js",
    "revision": "cf2b2eed75b52079c0d081873fd2b827"
  },
  {
    "url": "/_nuxt/19.6ec1adc5a4969e465f42.js",
    "revision": "326fada231de75b4b830e41208ca3dc6"
  },
  {
    "url": "/_nuxt/20.ed378678d0cb3a336312.js",
    "revision": "10fac39872d3df00d4685134544224de"
  },
  {
    "url": "/_nuxt/21.c145682d877b0c5a407a.js",
    "revision": "f6f6953524cae3c0fc840919bf3ef72e"
  },
  {
    "url": "/_nuxt/22.686337a1cc48bc884e3b.js",
    "revision": "b5e5083061e7377f5c214d043a49e04a"
  },
  {
    "url": "/_nuxt/23.91d9b15ffa5e7336c689.js",
    "revision": "2438ffa8aef426b535f4b01b89661855"
  },
  {
    "url": "/_nuxt/26.d49f1fb7636206dc33ff.js",
    "revision": "e0507c69a03b9d99e2ebc2f1aece4ab8"
  },
  {
    "url": "/_nuxt/3.3c4f307c4b29de094885.js",
    "revision": "40340c98c4a15a4b348b2b8a50818955"
  },
  {
    "url": "/_nuxt/4.9c7971737394e0789394.js",
    "revision": "a079b66fb64e455d229ab2a1755a79bc"
  },
  {
    "url": "/_nuxt/5.463d68b2299b7206e2e8.js",
    "revision": "e7b726d8cb52bda002f0bbcbdc9febbf"
  },
  {
    "url": "/_nuxt/6.1c93cba97a004551ea7a.js",
    "revision": "0ac2c072d8fba67a40e8a6a10c965510"
  },
  {
    "url": "/_nuxt/7.81314084cc4cd8a12435.js",
    "revision": "d9a1ed9da7e4b6e6c553f16f6d1ab44e"
  },
  {
    "url": "/_nuxt/9.566e308513b78863d7ec.js",
    "revision": "f58c88bd9a7a588b5ba5cc9622789ed5"
  },
  {
    "url": "/_nuxt/app.84505e57d8323eb2c81556e40b7077c3.css",
    "revision": "84505e57d8323eb2c81556e40b7077c3"
  },
  {
    "url": "/_nuxt/app.bde1b5111ce5a3bb9120.js",
    "revision": "02ab60b4acf8984fdcbd4995a8bcf0ef"
  },
  {
    "url": "/_nuxt/countrydata.9ab8425bac4325f5c261.js",
    "revision": "f5c315ef1bf694f06301879243266aba"
  },
  {
    "url": "/_nuxt/lang-en-US.dae9515a594d2acf421a.js",
    "revision": "c475aa22863c50084f0a69202a0044d4"
  },
  {
    "url": "/_nuxt/lang-es-ES.2a305dafce63cd971420.js",
    "revision": "c1d94e3acf1ca3ee2a1c23eb28f8ddbf"
  },
  {
    "url": "/_nuxt/layouts/default.66f3f0f4e8e8ab677546.js",
    "revision": "d81d79bb4119d574c7a18266c5491a5d"
  },
  {
    "url": "/_nuxt/libphone.7950f98ebe915bcb1d62.js",
    "revision": "66caae3d605f05d800812ef0dd85d84b"
  },
  {
    "url": "/_nuxt/manifest.3e45d3dd2dcb8d2e1882.js",
    "revision": "cfbe285edbafbadc8719307ba9d3ffac"
  },
  {
    "url": "/_nuxt/vendor.527ba9d92a22012b5d9a.js",
    "revision": "711b91f969d404b8beb554de577dc3fd"
  }
])


workboxSW.router.registerRoute(new RegExp('/_nuxt/.*'), workboxSW.strategies.cacheFirst({}), 'GET')

workboxSW.router.registerRoute(new RegExp('/.*'), workboxSW.strategies.networkFirst({}), 'GET')

