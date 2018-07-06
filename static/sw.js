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
    "url": "/_nuxt/13.0770c699727c27f745bf.js",
    "revision": "63cf999ec544ee72aa0dc32c0d1a0085"
  },
  {
    "url": "/_nuxt/14.10f78118a74f7a3896b0.js",
    "revision": "40fbd47ac34e190afe60bdae8dee5385"
  },
  {
    "url": "/_nuxt/15.ea85c8d9b06b25234df1.js",
    "revision": "e87f2e8c40e401744edc2432da53d6f3"
  },
  {
    "url": "/_nuxt/16.8e0098b78759fc8efe61.js",
    "revision": "e5ccf6c4e3c1400c75ec92d0cee0b328"
  },
  {
    "url": "/_nuxt/17.b0c24c8970c598f657ec.js",
    "revision": "a8f71df76f77f4430cfcec099a9b4024"
  },
  {
    "url": "/_nuxt/18.d8095995b40d15b0202a.js",
    "revision": "dde03eeee0edb415ec39bfabb58a4459"
  },
  {
    "url": "/_nuxt/19.974403116069de06919f.js",
    "revision": "7d6bd36508c3c88d975be9e41ad5874d"
  },
  {
    "url": "/_nuxt/20.b6c53060c1348e6f9a37.js",
    "revision": "3238058ee96eafc72f0963aecf8f5396"
  },
  {
    "url": "/_nuxt/21.99535071a442d7e04c66.js",
    "revision": "4c95fa72244125b61664d5be36dfd94e"
  },
  {
    "url": "/_nuxt/22.60fed83134b66695683b.js",
    "revision": "1ed858ec425908cb6acbb8826d0db092"
  },
  {
    "url": "/_nuxt/23.43e35807ee4ab8cf3b81.js",
    "revision": "036199259ad092bce549f5631efd8b2f"
  },
  {
    "url": "/_nuxt/24.b069ea51920deb51c5f6.js",
    "revision": "dfdacf82c5adcde361707ef132b15096"
  },
  {
    "url": "/_nuxt/27.3d119bd0122960dd28f7.js",
    "revision": "826ee9a5ab3794170634932dbb5444d5"
  },
  {
    "url": "/_nuxt/28.5c8a35f3802e26ae8eb7.js",
    "revision": "404f0ca15e58fd28becfea547e0d698e"
  },
  {
    "url": "/_nuxt/3.64994f540c0771a9c146.js",
    "revision": "97b3aa4bb7139a8028b8fc36d1f65e23"
  },
  {
    "url": "/_nuxt/4.94bbe79e087661b90a49.js",
    "revision": "6bee911b3efb4187ea73e92f41694b4a"
  },
  {
    "url": "/_nuxt/5.9f3da507ebe626b7dabb.js",
    "revision": "141b15cc6ce6c17a31728ee0407a73ac"
  },
  {
    "url": "/_nuxt/6.e14a2efc01c27f51686f.js",
    "revision": "64c3f27d00f35c6a2ff7bb899ebd4b12"
  },
  {
    "url": "/_nuxt/7.f7d2cfcc095205316614.js",
    "revision": "798bb3d2cb9a0286e05c24a6cc49e3ce"
  },
  {
    "url": "/_nuxt/9.566e308513b78863d7ec.js",
    "revision": "f58c88bd9a7a588b5ba5cc9622789ed5"
  },
  {
    "url": "/_nuxt/app.23480ce83297f01fdf02.js",
    "revision": "ca4daa0dd3cf1a8b72c12735317fd920"
  },
  {
    "url": "/_nuxt/app.84505e57d8323eb2c81556e40b7077c3.css",
    "revision": "84505e57d8323eb2c81556e40b7077c3"
  },
  {
    "url": "/_nuxt/countrydata.16f41bc0bc5b845a8bf6.js",
    "revision": "415fb197ab0e08db72e24090306bd03a"
  },
  {
    "url": "/_nuxt/lang-en-US.897961cfaf6bded02d8a.js",
    "revision": "102f9ae36c3b07b49e21cb2a8c28fead"
  },
  {
    "url": "/_nuxt/lang-es-ES.2380d4a8765404b70740.js",
    "revision": "5c91b05ba35b6c674f1c548e9e06b0e5"
  },
  {
    "url": "/_nuxt/layouts/default.f902b0bd63db89d751fa.js",
    "revision": "d775a9ff0c74a62e227f3955e39cda82"
  },
  {
    "url": "/_nuxt/libphone.7950f98ebe915bcb1d62.js",
    "revision": "66caae3d605f05d800812ef0dd85d84b"
  },
  {
    "url": "/_nuxt/manifest.c9ea196d6be0e4e90132.js",
    "revision": "13b8adad5eeca5e09b0b68256ae6e1e4"
  },
  {
    "url": "/_nuxt/vendor.25272a4c1617a940105a.js",
    "revision": "3d1287fe9faaac4726ed82e22f9c1c83"
  }
])


workboxSW.router.registerRoute(new RegExp('/_nuxt/.*'), workboxSW.strategies.cacheFirst({}), 'GET')

workboxSW.router.registerRoute(new RegExp('/.*'), workboxSW.strategies.networkFirst({}), 'GET')

