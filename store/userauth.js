import { WebAuth } from 'auth0-js'
import axios from 'axios'
import { Dialog, Snackbar, LoadingProgrammatic } from 'buefy'
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
    return state.expirationDate ? state.expirationDate < new Date().getTime() : null
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
    commit('updateUser', {country: state.user.country !== 'US' && state.user.country ? state.user.country : state.session.country})
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
  loginEmailVerify ({commit, dispatch, state}, code) {
    const loadingComponent = LoadingProgrammatic.open()
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
          loadingComponent.close()
          Dialog.prompt({
            title: 'Authentication',
            message: `That code is incorrect, please try again. Enter the code we sent to ${state.user.emailAddress}`,
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
          reject(err)
        }
        loadingComponent.close()
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
  async setSession ({ commit, dispatch }) {
    function parseHash () {
      return new Promise((resolve, reject) => {
        webAuth.parseHash({ hash: window.location.hash }, function (err, authResult) {
          window.location.hash = ''
          if (err) {
            reject(err)
          }
          resolve(authResult)
        })
      })
    }
    function checkSession () {
      return new Promise((resolve, reject) => {
        webAuth.checkSession({
          scope: 'openid profile email offline_access'
        }, function (err, authResult) {
          if (err) {
            console.log(err)
            dispatch('clearData')
            return
          }
          resolve(authResult)
        })
      })
    }
    function renewAuth () {
      return new Promise((resolve, reject) => {
        webAuth.renewAuth({
          usePostMessage: true
        }, (error, authResult) => {
          if (error) {
            console.log(error)
          }
          resolve(authResult)
        })
      })
    }
    let hasHash = window.location.hash && window.location.hash.indexOf('access_token') > -1
    let authResult = hasHash ? await parseHash() : await checkSession()
    if (authResult.expiresIn * 1000 > Date.now()) {
      authResult = await renewAuth()
      console.log('renewing auth', authResult.expiresIn * 1000, Date.now())
    }
    let idToken = authResult.idToken
    commit('updateIdToken', idToken)
    commit('updateExpirationDate', new Date(authResult.expiresIn * 1000).getTime())
    commit('updateGcToken', jwtDecode(idToken)['https://graph.cool/token'])
    Snackbar.open({
      message: `Your graphcool token is: ${jwtDecode(idToken)['https://graph.cool/token']}`,
      type: 'is-info',
      position: 'is-top',
      actionText: 'Retry',
      duration: 8000
    })
  },
  clearData ({ commit, dispatch }) {
    commit('updateGcToken', null)
    commit('updateIdToken', null)
    commit('updateExpirationDate', null)
    commit('updateUser', {
      country: null,
      emailAddress: null
    })
    commit('updateSessionGeo', {
      city: null,
      country: null,
      ip: null,
      loc: null,
      region: null
    })
    dispatch('getUser')
  },
  async logout ({ dispatch }) {
    await webAuth.logout({
      returnTo: 'http://localhost:3000',
      clientID: '0Wy4khZcuXefSfrUuYDUP0Udag4FqL2u'
    })
    dispatch('clearData')
  }
}
