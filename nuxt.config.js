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
    routes: ['/elections/AL', '/elections/AK', '/elections/AS', '/elections/AZ', '/elections/AR', '/elections/CA', '/elections/CO', '/elections/CT', '/elections/DE', '/elections/DC', '/elections/FL', '/elections/GA', '/elections/GU', '/elections/HI', '/elections/ID', '/elections/IL', '/elections/IN', '/elections/IA', '/elections/KS', '/elections/KY', '/elections/LA', '/elections/ME', '/elections/MD', '/elections/MA', '/elections/MI', '/elections/MN', '/elections/MS', '/elections/MO', '/elections/MT', '/elections/NE', '/elections/NV', '/elections/NH', '/elections/NJ', '/elections/NM', '/elections/NY', '/elections/NC', '/elections/ND', '/elections/OH', '/elections/OK', '/elections/OR', '/elections/PA', '/elections/undefined', '/elections/RI', '/elections/SC', '/elections/SD', '/elections/TN', '/elections/TX', '/elections/UT', '/elections/VT', '/elections/VI', '/elections/VA', '/elections/WA', '/elections/WV', '/elections/WI', '/elections/WY', 'request/your-information']
    // routes: function () {
    //   return axios.get('http://localhost:3000/content-api/elections/elections')
    //   .then(({data}) => {
    //     return data.body.map((election) => {
    //       return `/elections/${election.state}`
    //     })
    //   })
    // }
  },
  router: {
    linkActiveClass: 'is-active',
    linkExactActiveClass: 'is-active',
    middleware: 'menu-helper'
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
