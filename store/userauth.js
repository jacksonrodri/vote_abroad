import { WebAuth } from 'auth0-js'
import axios from 'axios'
import { Dialog, Toast, Snackbar, LoadingProgrammatic } from 'buefy'
import AWSExports from '../aws-exports'
const jwtDecode = require('jwt-decode')
// const redirectUri = `https://amplify-appsync--votefromabroad.netlify.com`
// const redirectUri = `http://localhost:3000`
const redirectUri = process.env.url

const webAuth = new WebAuth({
  domain: 'montg.auth0.com',
  redirectUri: redirectUri,
  clientID: '0Wy4khZcuXefSfrUuYDUP0Udag4FqL2u',
  responseType: 'token id_token'
})

export const state = () => ({
  idToken: null,
  expirationDate: null,
  gcToken: null,
  IdentityId: null,
  redirectPath: null,
  user: {
    firstName: null,
    middleName: null,
    lastName: null,
    emailAddress: null,
    mobilePhone: null,
    mobileIntFormat: null,
    country: 'US',
    isDA: false,
    da: {}
  },
  session: {
    ip: null,
    loc: null,
    city: null,
    region: null,
    country: null
  },
  device: {
    type: null,
    orientation: null,
    os: null
  }
})

export const getters = {
  isExpired: state => {
    return state.expirationDate ? state.expirationDate * 1000 < Date.now() : null
  },
  isAuthenticated: state => {
    return Boolean(!state.isExpired && state.idToken)
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
  updateDevice (state, device) {
    state.device = Object.assign({}, state.device, device)
  },
  updateUser (state, userObj) {
    state.user = Object.assign({}, state.user, userObj)
  },
  updateRedirectPath (state, path) {
    state.redirectPath = path
  },
  updateIdentityId (state, id) {
    state.IdentityId = id
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
        resolve(`Sent login link to ${state.user.emailAddress}`)
      })
    })
  },
  sendSmsCode ({commit, state}) {
    return new Promise((resolve, reject) => {
      webAuth.passwordlessStart({
        connection: 'sms',
        send: 'code',
        phoneNumber: state.user.mobileIntFormat
      }, function (err, res) {
        if (err) {
          reject(err)
        }
        resolve()
      })
    })
  },
  async getSessionGeo ({commit, state}) {
    if (!state.session.country) {
      let res = await axios.get('https://ipinfo.io/geo')
      commit('updateSessionGeo', res.data)
    }
  },
  async getUser ({commit, state, dispatch}) {
    await dispatch('getSessionGeo')
    commit('updateUser', {country: state.user.country !== 'US' && state.user.country ? state.user.country : state.session.country})
  },
  async authStart ({commit, state, dispatch}, redirectPath) {
    commit('updateRedirectPath', redirectPath)
    let loginType
    if (state.user.emailAddress) {
      loginType = 'email'
      await dispatch('sendEmailLink')
    } else if (state.user.mobileIntFormat) {
      loginType = 'sms'
      await dispatch('sendSmsCode')
    }
    await dispatch('promptCode', loginType)
  },
  promptCode ({ state, dispatch, commit }, loginType) {
    let msg = loginType === 'sms' ? `Enter the code we sent to ${state.user.mobileIntFormat}` : `Click the login link or enter the code we sent to ${state.user.emailAddress}.`
    Dialog.prompt({
      title: 'Authentication',
      message: msg,
      inputAttrs: {
        type: 'tel',
        placeholder: 'Type the code.',
        minlength: 6,
        maxlength: 6,
        autocomplete: 'off',
        size: 6,
        max: 999999,
        pattern: '[0-9]{6}',
        title: 'enter a 6 digit code'
      },
      confirmText: 'Submit',
      cancelText: 'Cancel',
      // onCancel: () => commit('updateRedirectPath', null),
      onConfirm: (value) => {
        if (state.user.emailAddress) {
          dispatch('loginEmailVerify', value)
        } else if (state.user.mobileIntFormat) {
          dispatch('loginSmsVerify', value)
        }
      },
      onCancel: () => {}
    })
  },
  loginEmailVerify ({commit, dispatch, state}, code) {
    const loadingComponent = LoadingProgrammatic.open()
    return new Promise((resolve, reject) => {
      webAuth.passwordlessVerify({
        connection: 'email',
        email: state.user.emailAddress,
        verificationCode: code,
        scope: 'openid profile email'
      }, (err, authResult) => {
        if (err) {
          loadingComponent.close()
          Dialog.prompt({
            title: 'Authentication',
            message: `That code is incorrect, please try again. Enter the code we sent to ${state.user.emailAddress} or click the login link in that email.`,
            inputAttrs: {
              type: 'tel',
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
  loginSmsVerify ({commit, dispatch, state}, code) {
    const loadingComponent = LoadingProgrammatic.open()
    return new Promise((resolve, reject) => {
      webAuth.passwordlessVerify({
        connection: 'sms',
        phoneNumber: state.user.mobileIntFormat,
        verificationCode: code,
        scope: 'openid profile email'
      }, (err, authResult) => {
        if (err) {
          loadingComponent.close()
          Dialog.prompt({
            title: 'Authentication',
            message: `That code is incorrect, please try again. Enter the code we sent to ${state.user.mobileIntFormat}`,
            inputAttrs: {
              type: 'tel',
              placeholder: 'Type the code.',
              minlength: 6,
              maxlength: 6,
              autocomplete: 'off',
              size: 6,
              max: 999999,
              pattern: '[0-9]{6}',
              title: 'enter a 6 digit code'
            },
            onConfirm: (value) => dispatch('loginSmsVerify', value)
          })
          reject(err)
        }
        loadingComponent.close()
        // Snackbar.open({
        //   message: `${authResult}`,
        //   type: 'is-info',
        //   position: 'is-top',
        //   actionText: 'Retry',
        //   duration: 8000
        // })
        // this.setSession(authResult)
        // Auth tokens in the result or an error
        resolve()
      })
    })
  },
  async setSession ({ state, rootState, commit, dispatch, app }) {
    this.app.Amplify.configure(AWSExports)
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
    let Auth = this.app.$Auth
    let Analytics = this.app.$Analytics
    function checkSession () {
      return new Promise((resolve, reject) => {
        webAuth.checkSession({
          scope: 'openid profile email'
        }, async function (err, authResult) {
          if (err) {
            let id = await Auth.currentCredentials().then(x => x.data.IdentityId)
            // console.log(id)
            let name = Auth.credentials_source
            commit('updateIdentityId', id)
            commit('updateUser', { firstName: name })
            Analytics.updateEndpoint({
              // Customized userId
              UserId: id._identityId,
              // User attributes
              Attributes: {
                country: state.user.country,
                isDA: state.user.isDA,
                email: state.user.emailAddress,
                firstName: state.user.firstName
              },
              // Custom user attributes
              UserAttributes: {
                hobbies: ['piano', 'hiking']
                // ...
              }
            })
            // dispatch('clearData')
            return
          }
          resolve(authResult)
        })
      })
    }
    async function renewAuth () {
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
    }
    let idToken = authResult.idToken
    commit('updateIdToken', idToken)
    commit('updateExpirationDate', jwtDecode(idToken).exp)
    commit('updateGcToken', jwtDecode(idToken)['https://graph.cool/token'])
    if (state.redirectPath) {
      dispatch('redirect', state.redirectPath)
    }
    // console.log('[https://demsabroad.org/user]', jwtDecode(idToken)['https://demsabroad.org/user'])
    commit('updateUser', {isDA: jwtDecode(idToken)['https://demsabroad.org/isDA'], da: jwtDecode(idToken)['https://demsabroad.org/user']})
    if (jwtDecode(idToken)['https://demsabroad.org/isDA'] && !rootState.requests.requests[rootState.requests.currentRequest].lastName) {
      Dialog.confirm({
        title: 'Democrats Abroad Members',
        message: `As an authenticated member of Democrats Abroad, you can prefill your form with your membership data. Would you like to?`,
        cancelText: 'Start a new request',
        confirmText: 'Prefill my data',
        type: 'is-success',
        onConfirm: () => {
          commit('requests/update', jwtDecode(idToken)['https://demsabroad.org/user'], { root: true })
          Toast.open({
            message: `Your form has been pre-filled, please verify all information before submitting.`,
            type: 'is-success',
            position: 'is-top',
            duration: 8000
          })
          dispatch('redirect', state.redirectPath || '/request/your-information')
        }
      })
    }
    this.app.$Auth.federatedSignIn(
      'montg.auth0.com',
      {
        token: idToken,
        expires_at: jwtDecode(idToken).exp
      },
      // a user object
      {
        name: jwtDecode(idToken)['https://demsabroad.org/user'].lastName,
        email: jwtDecode(idToken)['https://demsabroad.org/user'].email
      }
    ).then(async (result) => {
      // console.log('result', result)
      let user = await this.app.$Auth.currentAuthenticatedUser()
      console.log('user', user)
      Analytics.updateEndpoint({
        // Customized userId
        UserId: state.user.IdentityId,
        // User attributes
        Attributes: {
          country: state.user.country,
          isDA: state.user.isDA,
          email: state.user.emailAddress,
          firstName: state.user.firstName
        },
        // Custom user attributes
        UserAttributes: {
          hobbies: ['piano', 'hiking', 'logging in']
          // ...
        }
      })
    })
  },
  clearData ({ commit, dispatch }) {
    commit('updateGcToken', null)
    commit('updateIdToken', null)
    commit('updateExpirationDate', null)
    commit('updateUser', {
      country: null,
      emailAddress: null,
      isDA: false,
      da: {}
    })
    commit('updateSessionGeo', {
      city: null,
      country: null,
      ip: null,
      loc: null,
      region: null
    })
    commit('requests/clearRequests', null, { root: true })
    dispatch('getUser')
  },
  async logout ({ dispatch }) {
    await webAuth.logout({
      returnTo: redirectUri,
      clientID: '0Wy4khZcuXefSfrUuYDUP0Udag4FqL2u'
    })
    dispatch('clearData')
  },
  redirect (ctx, path) {
    this.$router.onReady(() => this.$router.push(path))
  }
}
