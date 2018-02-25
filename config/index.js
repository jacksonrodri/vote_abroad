const en = require('../lang/en-US.json')
const es = require('../lang/es-ES.json')

const API_ROOT = 'http://localhost:3000/content-api';

const I18N = {
  locales: [
    {
      code: 'en',
      iso: 'en-US',
      name: 'English',
      langFile: 'en-US.json'
    },
    {
      code: 'es',
      iso: 'es-ES',
      name: 'Español',
      langFile: 'es-ES.json'
    }
  ],
  loadLanguagesAsync: true,
  langDir: 'lang/',
  defaultLocale: 'en',
  seo: false,
  routes: require('./routes.js'),
  vueI18n: {
    fallbackLocale: 'en'
  }
}

module.exports = {
  API_ROOT,
  I18N
}
