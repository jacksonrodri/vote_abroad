import { WebAuth } from 'auth0-js'
import axios from 'axios'
import { Dialog, Snackbar } from 'buefy'
const jwtDecode = require('jwt-decode')

const webAuth = new WebAuth({
  domain: 'montg.auth0.com',
  redirectUri: `http://localhost:3000`,
  clientID: '0Wy4khZcuXefSfrUuYDUP0Udag4FqL2u',
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
        resolve(`Sent code to ${state.user.emailAddress}`)
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
    commit('updateUser', {country: state.user.country !== 'US' ? state.user.country : state.session.country})
  },
  async authStart ({commit, state, dispatch}) {
    await dispatch('sendEmailCode')
    await dispatch('promptCode')
  },
  promptCode ({ state, dispatch }) {
    Dialog.prompt({
      title: 'Authentication',
      message: `Enter the code we sent to ${state.user.emailAddress}`,
      inputAttrs: {
        type: 'number',
        placeholder: 'Type the code.',
        minlength: 6,
        maxlength: 6,
        autocomplete: 'off',
        size: 6,
        max: 999999,
        pattern: '[0-9]{6}',
        title: 'enter a 6 digit code'
      },
      onConfirm: (value) => dispatch('loginEmailVerify', value)
    })
  },
  loginEmailVerify ({commit, state}, code) {
    return new Promise((resolve, reject) => {
      webAuth.passwordlessVerify({
        // realm: 'Username-Password-Authentication', // connection name or HRD domain
        connection: 'email',
        email: state.user.emailAddress,
        verificationCode: code,
        scope: 'openid profile email offline_access'
        // audience: this.options.audience
      }, (err, authResult) => {
        if (err) {
          reject(err)
        }
        Snackbar.open({
          message: `${authResult}`,
          type: 'is-info',
          position: 'is-top',
          actionText: 'Retry',
          duration: 8000
        })
        // this.setSession(authResult)
        // Auth tokens in the result or an error
        resolve()
      })
    })
  },
  parseHash ({ commit }) {
    function getHashValue (key) {
      var matches = location.hash.match(new RegExp(key + '=([^&]*)'))
      return matches ? matches[1] : null
    }
    let idToken = getHashValue('id_token')
    console.log('id_token', jwtDecode(idToken))
    commit('updateIdToken', idToken)
    commit('updateGcToken', jwtDecode(idToken)['https://graph.cool/token'])
    Snackbar.open({
      message: `Your graphcool token is: ${jwtDecode(getHashValue('id_token'))['https://graph.cool/token']}`,
      type: 'is-info',
      position: 'is-top',
      actionText: 'Retry',
      duration: 8000
    })
  }
}
