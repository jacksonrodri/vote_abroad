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
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  modules: [
    '@nuxtjs/pwa',
    ['nuxt-i18n', I18N],
    'nuxtent'
  ],
  manifest: {
    name: 'Vote From Abroad',
    short_name: 'Vote Abroad',
    lang: 'en'
  },
  css: [
    '@/assets/css/main.scss'
  ],
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  generate: {
    minify: {
      collapseWhitespace: false
    },
    routes: function () {
      return axios.get('http://localhost:3000/content-api/elections/elections')
      .then(({data}) => {
        return data.body.map((election) => {
          return `/elections/${election.state}`
        })
      })
    }
  },
  plugins: ['~/plugins/buefy', '~/plugins/vuelidate'],
  /*
  ** Build configuration
  */
  build: {
    postcss: {
      plugins: {
        'postcss-custom-properties': false
      }
    },
    /*
    ** Run ESLint on save
    */
    extend (config, ctx) {
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
