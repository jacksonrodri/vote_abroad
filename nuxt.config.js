const { API_ROOT, I18N } = require('./config')
const axios = require('axios')

// remove following line after buefy updates to 0.6.5
// global.HTMLElement = typeof window === 'undefined' ? Object : window.HTMLElement

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'Vote from Abroad',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Absentee ballots for US Citizens abroad' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'preconnect', href: 'https://cognito-identity.us-east-1.amazonaws.com' }
    ]
  },
  render: {
    bundleRenderer: {
      shouldPrefetch: (file, type) => {
        if (type === 'script') {
          if (/leodata.*/.test(file)) {
            return false
          }
        }
        return true
      }
    }
  },
  env: {
    baseUrl: process.env.DEPLOY_PRIME_URL || 'http://localhost:3000',
    url: process.env.URL || 'http://localhost:3000',
    autocompleteUrl: process.env.AUTOCOMPLETE_URL || 'http://localhost:3010',
    placeDetailsUrl: process.env.PLACE_DETAILS_URL || 'http://localhost:3010/details',
    placesUrl: process.env.PLACES_URL || '/',
    autocompleteEndpoint: process.env.AUTOCOMPLETE_ENDPOINT || 'api/place/autocomplete/json',
    detailsEndpoint: process.env.PLACES_ENDPOINT || 'api/place/details/json',
    placesKey: process.env.PLACES_KEY || 'AIzaSyDK4AprF-iXbiX2-eU3SAQVyovB_8kIg20',
    commitRef: process.env.COMMIT_REF || ''
  },
  modules: [
    // '@nuxtjs/sentry',
    '@nuxtjs/pwa',
    ['nuxt-i18n', I18N],
    '@nuxtjs/proxy',
    'nuxtent'
  ],
  proxy: {
    '/api/fpca': {
      target: 'https://svj2ivekgi.execute-api.us-east-1.amazonaws.com/dev/fpca',
      pathRewrite: {
        '^/api/fpca': '/'
      }
    },
    '/api/*': {
      target: 'http://localhost:9000/',
      pathRewrite: {
        '^/api/': '/'
      }
    },
    '/api/place/**': {
      target: 'https://maps.googleapis.com/maps/api/place',
      pathRewrite: {
        '^/api/place/': '/'
      }
    },
    '/api/mail': {
      target: 'https://api.mailgun.net/v3/mail.votefromabroad.org/messages',
      pathRewrite: {
        '^/api/mail': '/'
      }
    }
  },
  // sentry: {
  //   dsn: 'https://7a6424adb4fd425d871eaf79e2a0afce@sentry.io/1223778',
  //   config: {
  //     release: process.env.COMMIT_REF || '',
  //     environment: process.env.CONTEXT || 'development'
  //   }
  // },
  manifest: {
    name: 'Vote From Abroad',
    short_name: 'Vote Abroad',
    lang: 'en'
  },
  css: [
    // '@fortawesome/fontawesome/styles.css',
    {src: '@/assets/css/style.scss',
      lang: 'sass'}
  ],
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#e94e3c', height: '3px' },
  generate: {
    minify: {
      collapseWhitespace: false
    },
    routes: ['request/your-information', 'request/canvas', 'request/voting-information', 'request/id-and-contact-information', 'privacy', 'terms-of-use']
    // routes: ['/elections/AL', '/elections/AK', '/elections/AS', '/elections/AZ', '/elections/AR', '/elections/CA', '/elections/CO', '/elections/CT', '/elections/DE', '/elections/DC', '/elections/FL', '/elections/GA', '/elections/GU', '/elections/HI', '/elections/ID', '/elections/IL', '/elections/IN', '/elections/IA', '/elections/KS', '/elections/KY', '/elections/LA', '/elections/ME', '/elections/MD', '/elections/MA', '/elections/MI', '/elections/MN', '/elections/MS', '/elections/MO', '/elections/MT', '/elections/NE', '/elections/NV', '/elections/NH', '/elections/NJ', '/elections/NM', '/elections/NY', '/elections/NC', '/elections/ND', '/elections/OH', '/elections/OK', '/elections/OR', '/elections/PA', '/elections/undefined', '/elections/RI', '/elections/SC', '/elections/SD', '/elections/TN', '/elections/TX', '/elections/UT', '/elections/VT', '/elections/VI', '/elections/VA', '/elections/WA', '/elections/WV', '/elections/WI', '/elections/WY', '/request/', '/request/your-information/']
    // routes: function () {
    //   return axios.get('http://localhost:3000/content-api/elections/elections')
    //   .then(({data}) => {
    //     return data.body.map((election) => {
    //       return `/elections/${election.state}`
    //     })
    //   })
    //   .then(list => {
    //     var routes = list.filter((v,i,a)=>a.indexOf(v)==i)
    //     var esRoutes = routes.map(x => '/es'+x)
    //     console.log(routes.concat(esRoutes))
    //     return routes.concat(esRoutes)
    //   })
    // }
  },
  router: {
    linkActiveClass: 'is-active',
    linkExactActiveClass: 'is-active',
    middleware: 'menu-helper'
  },
  plugins: [
    {src: '~/plugins/plugged', ssr: false },
    {src: '~/plugins/buefy'},
    {src: '~/plugins/vuelidate'}
    // ,
    // {src: '~/plugins/intercom'}
  ],
  /*
  ** Build configuration
  */
  build: {
    extractCSS: true,
    postcss: {
      plugins: {
        'postcss-custom-properties': false
      }
    },
    /*
    ** Run ESLint on save
    */
    vendor: [
      'babel-polyfill',
      // '~/assets/countryaddresses.js',
      'mailcheck',
      'auth0-js',
      'libphonenumber-js/custom',
      // 'vue-markdown'
      'snarkdown'
    ],
    babel: {
      presets: [
        ['vue-app', {
          useBuiltIns: true,
          targets: {
            ie: 11, uglify: true
          }
        }]
      ]
    },
    extend (config, ctx) {
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    },
    watch: [
      // '~/lang/en-US.js',
      // '~/lang/es-ES.js',
      './lang/',
      '~/config/index.js'
    ]
  }
}
