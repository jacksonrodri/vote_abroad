import { AsYouType } from 'libphonenumber-js/custom'
const md = require('~/data/phoneMeta/bareMeta.json')

export const state = () => ({
  postal: {},
  stateRules: {},
  elections: [],
  phoneMetadata: md,
  countries: require('~/data/countries/countriesWithPhoneExamples.json'),
  phoneExamples: require('libphonenumber-js/examples.mobile.json'),
  phone: '',
  fax: '',
  email: ''
})

export const getters = {
  phoneMetadataHasCountry: (state) => (countryCode) => { return Boolean(state.phoneMetadata.countries[countryCode]) },
  postalMetadataHasCountry: (state) => (countryCode) => { return Boolean(state.postal[countryCode]) },
  phoneMetadataHasAllCountriesForPrefix: (state, getters) => (number) => {
    if (number && number.length > 1 && number.charAt(0) === '+') {
      return [2, 3, 4]
        .map(x => state.phoneMetadata.country_calling_codes[number.slice(1, x)])
        .reduce((acc, val) => acc.concat(val), [])
        .filter((v, i, a) => a.indexOf(v) === i)
        .every(country => getters.phoneMetadataHasCountry(country))
    } else return true
  },
  formattedNumber: (state) => (number, countryCode) => {
    let formatted = new AsYouType(countryCode, state.phoneMetadata)
    let text = formatted.input(number)
    console.log('formatted', formatted)
    return {text, formatted}
  },
  getPhoneFormatInfo: (state) => (number, countryCode) => {
    let formatted = new AsYouType(countryCode, state.phoneMetadata)
    formatted.input(number)
    return formatted
  }
}

export const mutations = {
  addCountryPhoneMetadata (state, payload) {
    this._vm.$set(state.phoneMetadata.countries, payload.country, payload.data)
  },
  addCountryPostalMetadata (state, payload) {
    state.postal = {...state.postal, ...payload}
  },
  updatePhone (state, number) {
    state.phone = number
  }
}

export const actions = {
  async updateCountryData ({ commit, getters }, country) {
    country = country ? country.toUpperCase() : null
    if (country && !getters.phoneMetadataHasCountry(country)) {
      let thisPhoneData = await import(`~/data/phoneMeta/${country}.json`)
      commit('addCountryPhoneMetadata', {country: country, data: thisPhoneData})
    }
    if (country && !getters.postalMetadataHasCountry(country)) {
      let thisPostalData = await import(`~/data/postal/${country.toLowerCase()}.json`)
      commit('addCountryPostalMetadata', thisPostalData)
    }
  },
  getCountryIsoFromPhonePrefix ({state, dispatch}, number) {
    if (number && number.length > 1 && number.charAt(0) === '+') {
      let callingCodes = state.phoneMetadata.country_calling_codes
      for (let i = 1; i < number.length && i < 5; i++) {
        let thisCode = number.slice(1, i)
        if (callingCodes[thisCode]) {
          callingCodes[thisCode].forEach(code => dispatch('updateCountryData', code))
          break
        }
      }
    }
  },
  updatePhone ({commit, dispatch, getters}, {val, countryIso}) {
    dispatch('getCountryIsoFromPhonePrefix', val)
    commit('updatePhone', getters.formattedNumber(val, countryIso))
  }
}
