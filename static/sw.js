importScripts('/_nuxt/workbox.476439e0.js')

const workboxSW = new self.WorkboxSW({
  'cacheId': 'votefromabroad',
  'clientsClaim': true,
  'directoryIndex': '/'
})

workboxSW.precache([
  {
    'url': '/_nuxt/0.5bc5c2ea280f33b9fdee.js',
    'revision': '83a692301ec27083136728e832873b60'
  },
  {
    'url': '/_nuxt/1.0007cebed032153abca5.js',
    'revision': 'ac8f544c5565d5cc75b0ddb8646d0594'
  },
  {
    'url': '/_nuxt/10.9aef051268a6348b14a5.js',
    'revision': 'a4bc1016ac9f7d998ff1bcc6179ac3fc'
  },
  {
    'url': '/_nuxt/11.40e2e8208b44148d2a5d.js',
    'revision': '2b9c9628bb0c37859a1da7bd240e92c4'
  },
  {
    'url': '/_nuxt/12.5771a73790b4cb78775b.js',
    'revision': '70c0cd172a4d34aa1e77b5de33f021e4'
  },
  {
    'url': '/_nuxt/13.7e2b4167f450efc3440f.js',
    'revision': '412dd946c6a9f0455da2bc2502d2514f'
  },
  {
    'url': '/_nuxt/14.7494f97d5cf0055a741d.js',
    'revision': '30dee9d289f0a9b2de8065b82ad90334'
  },
  {
    'url': '/_nuxt/15.ce65dc33a5eb52173a57.js',
    'revision': '3fca4051d13590a25b6287cd2553ad18'
  },
  {
    'url': '/_nuxt/16.aebc01a47c42620e526f.js',
    'revision': 'dea31881788faaf54dc82b67151cc557'
  },
  {
    'url': '/_nuxt/17.9829df36cfb9e51a73e2.js',
    'revision': '752122fa4b8a68fe41d7def9fb205cb4'
  },
  {
    'url': '/_nuxt/18.02fb71f2ea078f5726b0.js',
    'revision': '33538e3006dbdabaaa23b5a1bd64b747'
  },
  {
    'url': '/_nuxt/19.9cf51d803f787cdebbe9.js',
    'revision': '4f40a3ded43846c38e7d58ce557f6404'
  },
  {
    'url': '/_nuxt/2.f08e077ebd123e2bc737.js',
    'revision': '9f90a450dbd07aa54cdae9777bfa5e43'
  },
  {
    'url': '/_nuxt/20.f543e16717c5a0a13ae3.js',
    'revision': 'bf826226122b1faee5ae4c6afb86a27e'
  },
  {
    'url': '/_nuxt/4.4cdd118c72709616aaf9.js',
    'revision': 'd8d2fd9f2a24f3af29ac1d11c5f1eadf'
  },
  {
    'url': '/_nuxt/5.7341043733469003ecab.js',
    'revision': '706228cd36d03c411b19e2b3ce1d84e9'
  },
  {
    'url': '/_nuxt/6.5f75f9a4fd72dd9e1e5f.js',
    'revision': '0cdcd85894bb845a5535d10ec997beb3'
  },
  {
    'url': '/_nuxt/7.d8e5d3861ecc3d78f89c.js',
    'revision': 'ad37b4a3bf4c8253a842b34b90defa35'
  },
  {
    'url': '/_nuxt/8.da3f20df485b56df2d8c.js',
    'revision': '9a6a18516bdeb77a682965ee73f88e1f'
  },
  {
    'url': '/_nuxt/9.6f35e0e79ddfcbe59422.js',
    'revision': 'b13ce9073a038069caadb81569cc0b1f'
  },
  {
    'url': '/_nuxt/app.7b9354086bc49edaad876acbdb1cbe3e.css',
    'revision': '7b9354086bc49edaad876acbdb1cbe3e'
  },
  {
    'url': '/_nuxt/app.ae2738d9bfffd9e6fec6.js',
    'revision': 'c7dd5a6ae498450e4c99901398745cfe'
  },
  {
    'url': '/_nuxt/countrydata.0435539d0848484737ec.js',
    'revision': 'f2efc5bd4f6bb670833efa181f9efc31'
  },
  {
    'url': '/_nuxt/layouts/default.14e926a064729206e2f3.js',
    'revision': '5b1505f47bdd6726b558cf44e7b9848e'
  },
  {
    'url': '/_nuxt/leodata0.2dcb3002518308e27ba7.js',
    'revision': 'a31c30e13dd88af6277245143e17ce67'
  },
  {
    'url': '/_nuxt/leodata1.d30b1135233f74478105.js',
    'revision': 'd13245ffd603d3866abc57e956daaf00'
  },
  {
    'url': '/_nuxt/leodata10.3880929a1eac920abd6c.js',
    'revision': 'e2bc1e2b922d5fd4baec7890e1e03893'
  },
  {
    'url': '/_nuxt/leodata11.497d8a49783a52532ee4.js',
    'revision': 'b31e51db15713bca6b23c1ccb93b8587'
  },
  {
    'url': '/_nuxt/leodata12.fe6deb9f197be64a746c.js',
    'revision': 'e8341b516fa3ae580c72aa0cdf1f7641'
  },
  {
    'url': '/_nuxt/leodata13.840772ee22b10ebcfc7c.js',
    'revision': 'c6bbdd4791c9e72bbe84da42bba3ba39'
  },
  {
    'url': '/_nuxt/leodata14.a407fc3bcbd209c6e977.js',
    'revision': '814b8d5fe0ef96bbfcfc2766ca3706ec'
  },
  {
    'url': '/_nuxt/leodata15.6323716e5ed64c76d0e4.js',
    'revision': '9a679c6fc4f8a2f8611d8da403931d90'
  },
  {
    'url': '/_nuxt/leodata16.5c16249ed8a947fd7961.js',
    'revision': 'ac6f16cfdccdb0d430aa6d34cc1e887a'
  },
  {
    'url': '/_nuxt/leodata17.6914d496ebe4e36f81bb.js',
    'revision': 'a70132c964f39412d1510c0df43ff87c'
  },
  {
    'url': '/_nuxt/leodata18.1dcf5361d0e817315f9e.js',
    'revision': '19a9acfb09239154634cf8f0f7ae207b'
  },
  {
    'url': '/_nuxt/leodata19.49d3c8d97c26f6ba0d87.js',
    'revision': '392fdab7fdc6a560297520429869d70d'
  },
  {
    'url': '/_nuxt/leodata2.e1b0f45d7a67b92f2748.js',
    'revision': '704711f1d5926a3669d947e14c8576a4'
  },
  {
    'url': '/_nuxt/leodata20.d25596d442b538a0aa42.js',
    'revision': '3af94f30d3bf57c40c9fb1546bca7e65'
  },
  {
    'url': '/_nuxt/leodata21.5986da59acee41b4a52c.js',
    'revision': '4bd52163789b1c1779c65da8e548530b'
  },
  {
    'url': '/_nuxt/leodata22.fa23bfd3ade082bdb44d.js',
    'revision': '5ebf3d7ed4193e3e5d8bf830daaaea82'
  },
  {
    'url': '/_nuxt/leodata23.b85a32606c708b0991fe.js',
    'revision': 'ea6f519bf7f16a25bd16e39089c5738c'
  },
  {
    'url': '/_nuxt/leodata24.79f2857f1f6b8ba8197b.js',
    'revision': '4a4586b242cc2cf61e55184ef731f834'
  },
  {
    'url': '/_nuxt/leodata25.e4334a867d559a93fed3.js',
    'revision': 'b99198aac28928397eb1b666e3ffc6ab'
  },
  {
    'url': '/_nuxt/leodata26.06b78f04dd865e316587.js',
    'revision': 'dc0a0b59eddeb6e39440bab1975b5924'
  },
  {
    'url': '/_nuxt/leodata27.664996f7cf85ccb0cd2e.js',
    'revision': 'd4d2ab13da12280644579e4a50d4ab16'
  },
  {
    'url': '/_nuxt/leodata28.897ff01aa8537a1919f2.js',
    'revision': '95cc9ed14047a853dc743cae688d463a'
  },
  {
    'url': '/_nuxt/leodata29.b3021f2d79ab1310a073.js',
    'revision': '59d685c348b0585b70bd45c462aefd62'
  },
  {
    'url': '/_nuxt/leodata3.2e476b502ac0a900e2d3.js',
    'revision': '250b5dc72a0f38ed31dfb362975364e5'
  },
  {
    'url': '/_nuxt/leodata30.5c440e67b6b291097bb7.js',
    'revision': '962f8b6efcc9e2056fb8e8994375b873'
  },
  {
    'url': '/_nuxt/leodata31.5256ed73f572abe522e0.js',
    'revision': '57f7261646482d2a0cd7d55c1c27c70c'
  },
  {
    'url': '/_nuxt/leodata32.9cc9c63b14bd7fdead88.js',
    'revision': 'bc7d4e01e7a0aeb12ba89039ed76a77a'
  },
  {
    'url': '/_nuxt/leodata33.7cd22fda0a0db158ae30.js',
    'revision': '2f13f896e1200ac5d2ff47f544496d22'
  },
  {
    'url': '/_nuxt/leodata34.47410818061963b94c8a.js',
    'revision': '1566704ec7359d80c14b203bc9079f71'
  },
  {
    'url': '/_nuxt/leodata35.d9996e15df4f10dc95b8.js',
    'revision': '319d63f5299e76f6bf642c240d2900da'
  },
  {
    'url': '/_nuxt/leodata36.4f798abef683337b064e.js',
    'revision': 'ff9d395e3ffebcc9695c9006d9ce16a0'
  },
  {
    'url': '/_nuxt/leodata37.4dcbb39305c7e2ec9c6d.js',
    'revision': '8171f3f3929e7f4651fa0719325f41ed'
  },
  {
    'url': '/_nuxt/leodata38.d1a9479813385ca92ea0.js',
    'revision': '324dbb581a5f44b8f207ff05ba8ecad0'
  },
  {
    'url': '/_nuxt/leodata39.d42dd096fccbba95a138.js',
    'revision': '80e8d25db8c125db27bca7efcfceca08'
  },
  {
    'url': '/_nuxt/leodata4.26e3007180260fef0cb0.js',
    'revision': 'e22356a4545e4bad5b13c871e51010d2'
  },
  {
    'url': '/_nuxt/leodata40.88dce989065e8995c20c.js',
    'revision': 'c5bacc6af7cb567ed6325697d3ccf261'
  },
  {
    'url': '/_nuxt/leodata41.e5662130d3b73f80eb1b.js',
    'revision': '8e521c2c3b247c304bcaf1d399a1925b'
  },
  {
    'url': '/_nuxt/leodata42.12dd82a4bd53b4d0e7a3.js',
    'revision': '3b6cf89f797072d471d0e182c75d9062'
  },
  {
    'url': '/_nuxt/leodata43.02037860530c50b7546d.js',
    'revision': 'e407df6ec886e400b690ef8febe8f7c6'
  },
  {
    'url': '/_nuxt/leodata44.4cffa5563ae78855ea19.js',
    'revision': '3a2b15dd2f0e3d2d1fbfed8e1a5d14ee'
  },
  {
    'url': '/_nuxt/leodata45.8be4f76aded8d9ff6340.js',
    'revision': '9095fa8b5fb26af1cbc88aa417963cc2'
  },
  {
    'url': '/_nuxt/leodata46.160fd2f6da4c168ee21c.js',
    'revision': 'e8db77d6644ab0df19ce27ff7c262fc1'
  },
  {
    'url': '/_nuxt/leodata47.b820ea203734ea8cda34.js',
    'revision': '4b556454cbc9e00443a1a94ef7ad572c'
  },
  {
    'url': '/_nuxt/leodata48.d3d7eaa9c640f6929d47.js',
    'revision': 'e81e5b96c67c416b46cb1fa7d94e8080'
  },
  {
    'url': '/_nuxt/leodata49.1f075aec7b97c6413e64.js',
    'revision': '727c6f809f00682321c61a1deef453d9'
  },
  {
    'url': '/_nuxt/leodata5.405c085b9adc3872c128.js',
    'revision': 'fb214df5bfb66385a6aa4752848aaa46'
  },
  {
    'url': '/_nuxt/leodata50.4a193640708555633c1b.js',
    'revision': 'f1c7c8f7d2d71aa21ccf1c2db5f56803'
  },
  {
    'url': '/_nuxt/leodata51.aca3d46c5c44123479d4.js',
    'revision': 'c73c913aec0acc16b1c5e3eeae07056f'
  },
  {
    'url': '/_nuxt/leodata52.2f790c6d1e6af8774eb5.js',
    'revision': '5c9af93a7bc0b63353e8a43405f581af'
  },
  {
    'url': '/_nuxt/leodata53.fd6877c7e120ebcf6750.js',
    'revision': 'e33749a3d309f3c8801c635987c67907'
  },
  {
    'url': '/_nuxt/leodata54.dc3f38956ea7f25c2c3e.js',
    'revision': '2a81d2a3b6e99dcf48f9186353ba2733'
  },
  {
    'url': '/_nuxt/leodata6.1c625fcc84c54097f4c7.js',
    'revision': '936a4bde9ff0bf26abca4f2eb8633a4f'
  },
  {
    'url': '/_nuxt/leodata7.04b55ec684f3d06ce1e7.js',
    'revision': 'a42cc298f5b3904f2d2ef05c38ebe8a1'
  },
  {
    'url': '/_nuxt/leodata8.250ef826728a62ebb040.js',
    'revision': '35b29f35580b58060d577f573fc47a9c'
  },
  {
    'url': '/_nuxt/leodata9.690ffe4dfe90a633a1a7.js',
    'revision': '261814fa98c5b7cde24f5c3383decf2c'
  },
  {
    'url': '/_nuxt/libphone.f2e32db8c649ee8e9dd7.js',
    'revision': 'fb856d24994a0274a93ab80c29d5b7f3'
  },
  {
    'url': '/_nuxt/manifest.0587d03c7dd510d3e784.js',
    'revision': '023c1b18fc855223ac72712ffd67022a'
  },
  {
    'url': '/_nuxt/vendor.d3ff2c4dde29f262a123.js',
    'revision': '6db58e8f1be519cec5d9f6b5a946ed0f'
  }
])

workboxSW.router.registerRoute(new RegExp('/_nuxt/.*'), workboxSW.strategies.cacheFirst({}), 'GET')

workboxSW.router.registerRoute(new RegExp('/.*'), workboxSW.strategies.networkFirst({}), 'GET')
