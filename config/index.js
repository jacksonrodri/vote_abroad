const en = require('../lang/en-US.js')
// const fr = require('../lang/fr-FR.js')
const es = require('../lang/es-ES.js')

// const API_ROOT = 'https://jsonplaceholder.typicode.com/';
const API_ROOT = 'http://localhost:3000/content-api';

const I18N = {
  locales: [
    {
      code: 'en',
      iso: 'en-US',
      name: 'English'
    },
    // {
    //   code: 'fr',
    //   iso: 'fr-FR',
    //   name: 'Français'
    // },
    {
      code: 'es',
      iso: 'es-ES',
      name: 'Español'
    }
  ],
  defaultLocale: 'en',
  routes: {
    // page: {
    //   en: '/:page?'
    // },
    // about: {
    //   // fr: '/a-propos',
    //   en: '/about-us'
    // },
    // posts: {
    //   fr: '/articles'
    // },
    // 'post-id': {
    //   // fr: '/article/:id?',
    //   es: '/articulo/:id?'
    // },
    // 'elections-state': {
    //   es: '/elecciones/:state'
    // },
    // 'request': {
    //   en: '/request',
    //   es: '/requesto'
    // }
    // 'request-stage': {
    //   en: '/:stage',
    //   es: '/:stage'
    // }
    // 'your-information': {
    //   en: '/request/your-information',
    //   es: '/request/your-information',
    //   fr: '/request/your-information'
    // },
    // 'voting-information': {
    //   en: '/request/voting-information',
    //   es: '/request/voting-information',
    //   fr: '/request/voting-information'
    // }
  },
  vueI18n: {
    fallbackLocale: 'en',
    messages: { en, es }
  }
}

module.exports = {
  API_ROOT,
  I18N
}
