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
    "url": "/_nuxt/18.598d446267c3fd8f3a9a.js",
    "revision": "7ece340d79e289d9c7398c5cd070ae9a"
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
    "url": "/_nuxt/4.0ce15d758099eb34af46.js",
    "revision": "23699878f5fd24f74a7e9c9a7e1469db"
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
    "url": "/_nuxt/app.15fa042abebe2b55066df79acac2596d.css",
    "revision": "15fa042abebe2b55066df79acac2596d"
  },
  {
    "url": "/_nuxt/app.9d0e962f556cd28994a8.js",
    "revision": "5ecb2408b6303a2b2792d0aab58377c7"
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
    "url": "/_nuxt/layouts/default.8904219a44d3de33c16d.js",
    "revision": "fa275c8493eb65ce70bc817cc38cc9c9"
  },
  {
    "url": "/_nuxt/libphone.7950f98ebe915bcb1d62.js",
    "revision": "66caae3d605f05d800812ef0dd85d84b"
  },
  {
    "url": "/_nuxt/manifest.15bcc218b6e34770ec9a.js",
    "revision": "3c42605eb16f889bfbcf85a5fba07ccd"
  },
  {
    "url": "/_nuxt/vendor.b4c5355669095568f6b6.js",
    "revision": "7ddc507fc9f75559f221b2d78e994a06"
  }
])


workboxSW.router.registerRoute(new RegExp('/_nuxt/.*'), workboxSW.strategies.cacheFirst({}), 'GET')

workboxSW.router.registerRoute(new RegExp('/.*'), workboxSW.strategies.networkFirst({}), 'GET')

