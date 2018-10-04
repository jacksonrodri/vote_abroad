const { API_ROOT, I18N } = require('./config')
const axios = require('axios')

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'Vote from Abroad',
    // script: [
    //   {src: 'http://10.0.1.12:8098'}
    // ],
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
    isStudentSite: process.env.IS_STUDENT_SITE || false,
    branch: process.env.BRANCH || 'dev'
  },
  modules: [
    // '@nuxtjs/sentry',
    // '@nuxtjs/localtunnel',
    '@nuxtjs/google-analytics',
    '@nuxtjs/pwa',
    'nuxtent',
    ['nuxt-i18n', I18N],
    '@nuxtjs/proxy'
  ],
  'google-analytics': {
    id: 'UA-126220374-1',
    set: [
      { field: 'dimension1', value: process.env.BRANCH || 'dev' }
    ],
    debug: {
      sendHitTask: process.env.DEVSTAGE !== 'dev',
      enabled: process.env.DEVSTAGE === 'dev'
    },
    commands: {
      trackFormAction: function trackFormAction (fieldName = 'unknown') { this.$ga.event('formAction', 'focus/select', 'field', fieldName) }
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
    routes: ['request/your-information', 'request/canvas', 'request/voting-information', 'request/id-and-contact-information', 'privacy', 'terms-of-use', '/es/states/AL/', '/es/elections/AL/', '/es/states/AK/', '/es/elections/AK/', '/es/states/AS/', '/es/elections/AS/', '/es/states/AZ/', '/es/elections/AZ/', '/es/states/AR/', '/es/elections/AR/', '/es/states/CA/', '/es/elections/CA/', '/es/states/CO/', '/es/elections/CO/', '/es/states/CT/', '/es/elections/CT/', '/es/states/DE/', '/es/elections/DE/', '/es/states/DC/', '/es/elections/DC/', '/es/states/FL/', '/es/elections/FL/', '/es/states/GA/', '/es/elections/GA/', '/es/states/GU/', '/es/elections/GU/', '/es/states/HI/', '/es/elections/HI/', '/es/states/ID/', '/es/elections/ID/', '/es/states/IL/', '/es/elections/IL/', '/es/states/IN/', '/es/elections/IN/', '/es/states/IA/', '/es/elections/IA/', '/es/states/KS/', '/es/elections/KS/', '/es/states/KY/', '/es/elections/KY/', '/es/states/LA/', '/es/elections/LA/', '/es/states/ME/', '/es/elections/ME/', '/es/states/MD/', '/es/elections/MD/', '/es/states/MA/', '/es/elections/MA/', '/es/states/MI/', '/es/elections/MI/', '/es/states/MN/', '/es/elections/MN/', '/es/states/MS/', '/es/elections/MS/', '/es/states/MO/', '/es/elections/MO/', '/es/states/MT/', '/es/elections/MT/', '/es/states/NE/', '/es/elections/NE/', '/es/states/NV/', '/es/elections/NV/', '/es/states/NH/', '/es/elections/NH/', '/es/states/NJ/', '/es/elections/NJ/', '/es/states/NM/', '/es/elections/NM/', '/es/states/NY/', '/es/elections/NY/', '/es/states/NC/', '/es/elections/NC/', '/es/states/ND/', '/es/elections/ND/', '/es/states/OH/', '/es/elections/OH/', '/es/states/OK/', '/es/elections/OK/', '/es/states/OR/', '/es/elections/OR/', '/es/states/PA/', '/es/elections/PA/', '/es/states/PR/', '/es/elections/PR/', '/es/states/RI/', '/es/elections/RI/', '/es/states/SC/', '/es/elections/SC/', '/es/states/SD/', '/es/elections/SD/', '/es/states/TN/', '/es/elections/TN/', '/es/states/TX/', '/es/elections/TX/', '/es/states/UT/', '/es/elections/UT/', '/es/states/VT/', '/es/elections/VT/', '/es/states/VI/', '/es/elections/VI/', '/es/states/VA/', '/es/elections/VA/', '/es/states/WA/', '/es/elections/WA/', '/es/states/WV/', '/es/elections/WV/', '/es/states/WI/', '/es/elections/WI/', '/es/states/WY/', '/es/elections/WY/']
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
    { src: '~/plugins/i18n.js' },
    // { src: '~/plugins/devtools', ssr: false },
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
