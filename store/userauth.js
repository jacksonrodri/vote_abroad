import { WebAuth } from 'auth0-js'
import axios from 'axios'

const webAuth = new WebAuth({
  domain: 'montg.auth0.com',
  redirectUri: `http://localhost:3000`,
  clientID: 'kAUUgl04gI4FmToFJscyp9qsqeHaQyq0',
  responseType: 'token id_token'
  // audience: optons.audience || options.domain.concat('/userinfo')
})

export const state = () => ({
  idToken: null,
  expirationDate: null,
  gcToken: null,
  user: {
    firstName: null,
    middleName: null,
    lastName: null,
    emailAddress: null,
    mobilePhone: null,
    mobileIntFormat: null,
    country: 'US'
  },
  session: {
    ip: null,
    loc: null,
    city: null,
    region: null,
    country: null
  }
})

export const getters = {
  isExpired: state => {
    return state.expirationDate ? state.expirationDate < new Date() : null
  }
}

export const mutations = {
  updateIdToken (state, idToken) {
    state.idToken = idToken
  },
  updateExpirationDate (state, expirationDate) {
    state.expirationDate = expirationDate
  },
  updateGcToken (state, gcToken) {
    state.gcToken = gcToken
  },
  updateSessionGeo (state, geo) {
    state.session = geo
  },
  updateUser (state, userObj) {
    state.user = Object.assign({}, state.user, userObj)
  }
}

export const actions = {
  sendEmailCode ({commit, state}) {
    return new Promise((resolve, reject) => {
      webAuth.passwordlessStart({
        connection: 'email',
        send: 'code',
        email: state.user.emailAddress
      }, function (err, res) {
        if (err) {
          reject(err)
        }
        console.log(`Sent code to ${state.user.emailAddress}`)
        resolve()
      })
    })
  },
  sendEmailLink ({commit, state}) {
    return new Promise((resolve, reject) => {
      webAuth.passwordlessStart({
        connection: 'email',
        send: 'link',
        email: state.user.emailAddress
      }, function (err, res) {
        if (err) {
          reject(err)
        }
        console.log(`Sent code to ${state.user.emailAddress}`)
        resolve()
      })
    })
  },
  sendSmsCode ({commit, state}) {
    return new Promise((resolve, reject) => {
      webAuth.passwordlessStart({
        connection: 'sms',
        send: 'code',
        email: state.user.mobilePhone
      }, function (err, res) {
        if (err) {
          reject(err)
        }
        console.log(`Sent code to ${state.user.mobilePhone}`)
        resolve()
      })
    })
  },
  async getSessionGeo ({commit, state}) {
    if (!state.session.country) {
      let res = await axios.get('https://ipinfo.io/geo')
      commit('updateSessionGeo', res.data)
      console.log(res.data)
    }
  },
  async getUser ({commit, state, dispatch}) {
    await dispatch('getSessionGeo')
    commit('updateUser', {country: state.user.country ? state.user.country : state.session.country})
  }
}
