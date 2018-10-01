const { API_ROOT, I18N } = require('./config')
const axios = require('axios')

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
      { rel: 'preconnect', href: 'https://cognito-identity.us-east-1.amazonaws.com' },
      { rel: 'preload', as: 'image', href: 'https://res.cloudinary.com/democratsabroad/image/upload/f_auto,q_auto/v1521002249/votefromabroad-bg.jpg' }
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
    auth0clientID: process.env.DEVSTAGE === 'prod' ? 'Kwfswc0R3zV4Zw6hPOR1hibG4IKxztjU' : '0Wy4khZcuXefSfrUuYDUP0Udag4FqL2u',
    commitRef: process.env.COMMIT_REF || '',
    offline: process.env.OFFLINE || false,
    stage: process.env.DEVSTAGE || 'dev',
    isStudentSite: process.env.IS_STUDENT_SITE || false
  },
  modules: [
    // '@nuxtjs/sentry',
    '@nuxtjs/google-analytics',
    '@nuxtjs/pwa',
    'nuxtent',
    ['nuxt-i18n', I18N],
    '@nuxtjs/proxy'
  ],
  'google-analytics': {
    id: 'UA-126220374-1',
    debug: {
      sendHitTask: process.env.DEVSTAGE !== 'dev'
    }
  },
  proxy: {
    '/api/mailer/dev': {
      target: 'https://uf25owq668.execute-api.us-east-1.amazonaws.com/dev/mailer',
      pathRewrite: {
        '^/api/mailer/dev': '/'
      }
    },
    '/api/fpca/dev': {
      target: 'https://uf25owq668.execute-api.us-east-1.amazonaws.com/dev/pdf',
      pathRewrite: {
        '^/api/fpca/dev': '/'
      }
    },
    '/api/mailer': {
      target: 'https://37aze90rvd.execute-api.us-east-1.amazonaws.com/prod/mailer',
      // target: 'https://uf25owq668.execute-api.us-east-1.amazonaws.com/dev/mailer',
      pathRewrite: {
        '^/api/mailer': '/'
      }
    },
    '/api/fpca': {
      target: 'https://37aze90rvd.execute-api.us-east-1.amazonaws.com/prod/pdf',
      pathRewrite: {
        '^/api/fpca': '/'
      }
    },
    '/api/fpcaByEmail': {
      target: 'https://uf25owq668.execute-api.us-east-1.amazonaws.com/dev/fpcaByEmail',
      pathRewrite: {
        '^/api/fpcaByEmail': '/'
      }
    },
    '/api/place/**': {
      target: 'https://maps.googleapis.com/maps/api/place',
      pathRewrite: {
        '^/api/place/': '/'
      }
    }
  },
  sentry: {
    dsn: 'https://7a6424adb4fd425d871eaf79e2a0afce@sentry.io/1223778',
    config: {
      release: process.env.COMMIT_REF || '',
      environment: process.env.CONTEXT || 'development'
    }
  },
  manifest: {
    name: 'Vote From Abroad',
    short_name: 'Vote Abroad',
    lang: 'en',
    theme_color: '#172559',
    background_color: '#172559',
    ogHost: process.env.DEPLOY_PRIME_URL
  },
  css: [
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
  },
  router: {
    linkActiveClass: 'is-active',
    linkExactActiveClass: 'is-active',
    middleware: 'menu-helper'
  },
  plugins: [
    {src: '~/plugins/plugged', ssr: false },
    {src: '~/plugins/buefy'},
    {src: '~/plugins/vuelidate'},
    {src: '~/plugins/croppa'},
    {src: '~/plugins/intercom'},
    { src: '~plugins/i18n.js' },
    {src: '~plugins/vue-cookie', ssr: false, injectAs: 'cookie'}
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
      'mailcheck',
      'auth0-js',
      'libphonenumber-js/custom',
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
      './lang/',
      '~/config/index.js'
    ]
  }
}
