import { WebAuth } from 'auth0-js'
import axios from 'axios'
import { Dialog, Toast, LoadingProgrammatic, ModalProgrammatic } from 'buefy'
// Snackbar,
import AWSExports from '../aws-exports'
import AuthenticateCode from '~/components/AuthenticateCode'
const jwtDecode = require('jwt-decode')
// const redirectUri = `https://amplify-appsync--votefromabroad.netlify.com`
// const redirectUri = `http://localhost:3000`
const redirectUri = process.env.url

const webAuth = new WebAuth({
  domain: 'montg.auth0.com',
  redirectUri: redirectUri + '/request/your-information/',
  clientID: '0Wy4khZcuXefSfrUuYDUP0Udag4FqL2u',
  responseType: 'token id_token'
})

export const state = () => ({
  idToken: null,
  expirationDate: null,
  gcToken: null,
  IdentityId: null,
  redirectPath: null,
  modal: null,
  authState: 'enteringCode',
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
    this.$raven.setUserContext()
    this.$raven.setUserContext(Object.assign({}, {user: state.user}, {email: state.user.emailAddress}, {id: state.IdentityId}, {device: state.device}))
  },
  updateUser (state, userObj) {
    state.user = Object.assign({}, state.user, userObj)
    this.$raven.setUserContext()
    this.$raven.setUserContext(Object.assign({}, {user: state.user}, {email: state.user.emailAddress}, {id: state.IdentityId}, {device: state.device}))
  },
  updateRedirectPath (state, path) {
    state.redirectPath = path
  },
  updateIdentityId (state, id) {
    state.IdentityId = id
    this.$raven.setUserContext()
    this.$raven.setUserContext(Object.assign({}, {user: state.user}, {email: state.user.emailAddress}, {id: state.IdentityId}, {device: state.device}))
  },
  updateAuthState (state, authState) {
    state.authState = authState
  }
}

export const actions = {
  launchModal ({ state, dispatch, commit }, loginType) {
    let msg = loginType === 'sms' ? `An sms with the code has been sent to ${state.user.mobileIntFormat}.` : `We sent you a link and code to ${state.user.emailAddress}. Click the link in the email or enter the code here to sign in.`
    ModalProgrammatic.open({
      parent: window.$nuxt,
      component: AuthenticateCode,
      hasModalCard: true,
      active: /inActive|loggedIn|loggedOut/.test(state.authState),
      width: 360,
      props: {
        email: state.user.emailAddress || null,
        phone: state.user.mobileIntFormat || null,
        // isLoading: false,
        // currently: state.authState,
        msg
      },
      events: {
        confirmCode: (value) => {
          // alert(value)
          if (state.user.emailAddress) {
            dispatch('loginEmailVerify', value)
          } else if (state.user.mobileIntFormat) {
            dispatch('loginSmsVerify', value)
          }
        },
        startAuth: () => dispatch('authStart')
      }
    })
  },
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
          commit('updateAuthState', 'retrying')
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
        phoneNumber: state.user.mobileIntFormat.replace(/\s/g, '')
      }, function (err, res) {
        if (err) {
          commit('updateAuthState', 'retrying')
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
    // commit('updateRedirectPath', redirectPath)
    let loginType
    commit('updateAuthState', 'enteringCode')
    if (state.user.emailAddress) {
      loginType = 'email'
      await dispatch('launchModal', loginType)
      await dispatch('sendEmailLink')
    } else if (state.user.mobileIntFormat) {
      loginType = 'sms'
      await dispatch('launchModal', loginType)
      await dispatch('sendSmsCode')
    }
    // await dispatch('promptCode', loginType)
    // await dispatch('launchModal', loginType)
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
  loginEmailVerify ({app, commit, dispatch, state}, code) {
    let Analytics = this.app.$Analytics
    commit('updateAuthState', 'loading')
    // dispatch('launchModal')
    // const loadingComponent = LoadingProgrammatic.open()
    return new Promise((resolve, reject) => {
      webAuth.passwordlessVerify({
        connection: 'email',
        email: state.user.emailAddress,
        verificationCode: code,
        scope: 'openid profile email'
      }, (err, authResult) => {
        if (err) {
          Analytics.record('_userauth.auth_fail')
          // loadingComponent.close()
          commit('updateAuthState', 'enteringCode')
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
        // loadingComponent.close()
        // Snackbar.open({
        //   message: `${authResult}`,
        //   type: 'is-info',
        //   position: 'is-top',
        //   actionText: 'Retry',
        //   duration: 8000
        // })
        // alert('authResult', authResult)
        // this.setSession(authResult)
        // Auth tokens in the result or an error
        resolve()
      })
    })
  },
  loginSmsVerify ({app, commit, dispatch, state}, code) {
    let Analytics = this.app.$Analytics
    const loadingComponent = LoadingProgrammatic.open()
    return new Promise((resolve, reject) => {
      webAuth.passwordlessVerify({
        connection: 'sms',
        phoneNumber: state.user.mobileIntFormat.replace(/\s/g, ''),
        verificationCode: code,
        scope: 'openid profile email'
      }, (err, authResult) => {
        if (err) {
          Analytics.record('_userauth.auth_fail')
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
    // const loadingComponent = LoadingProgrammatic.open()
    commit('updateAuthState', 'loading')
    this.app.Amplify.configure(AWSExports)
    function parseHash () {
      return new Promise((resolve, reject) => {
        webAuth.parseHash({ hash: window.location.hash }, function (err, authResult) {
          window.location.hash = ''
          if (err) {
            reject(err)
          }
          // console.log('authResult', authResult)
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
            // let name = state.user.firstName || Auth.credentials_source
            commit('updateIdentityId', id)
            // commit('updateUser', { firstName: name })
            // let user = await Auth.currentAuthenticatedUser()
            // let res = await Auth.updateUserAttributes(user, {
            //   'email': 'me@anotherdomain.com',
            //   'family_name': 'Lastname'
            // })
            // console.log('updateuserresult', res)
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
    if (hasHash) dispatch('launchModal')
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
    // console.log('[https://demsabroad.org/user]', jwtDecode(idToken))
    commit('updateUser', {isDA: jwtDecode(idToken)['https://demsabroad.org/isDA'], da: jwtDecode(idToken)['https://demsabroad.org/user']})
    await this.app.$Auth.federatedSignIn(
      'montg.auth0.com',
      {
        token: idToken,
        expires_at: jwtDecode(idToken).exp
      },
      // a user object
      {
        name: jwtDecode(idToken)['https://demsabroad.org/isDA'] ? jwtDecode(idToken)['https://demsabroad.org/user'].lastName : '',
        email: jwtDecode(idToken)['https://demsabroad.org/isDA'] ? jwtDecode(idToken)['https://demsabroad.org/user'].email : ''
      }
    )
    // .then(async (result) => {
    //   let user = await this.app.$Auth.currentAuthenticatedUser()

    //   Analytics.updateEndpoint({
    //     UserId: user.id,
    //     Attributes: {
    //       country: state.user.country,
    //       isDA: state.user.isDA,
    //       email: user.email,
    //       firstName: state.user.firstName
    //     }
    //     // },
    //     // // Custom user attributes
    //     // UserAttributes: {
    //     //   hobbies: ['piano', 'hiking', 'logging in']
    //     //   // ...
    //     // }
    //   })
    // })
    // loadingComponent.close()
    await dispatch('requests/loadRequests', null, { root: true })
    // if (rootState.requests.requests[rootState.requests.currentRequest].)
    // console.log('rootState.requests', rootState.requests)
    if (jwtDecode(idToken)['https://demsabroad.org/isDA'] && (!rootState.requests || rootState.requests.requests.length === 0 || !rootState.requests.requests[rootState.requests.currentRequest].lastName)) {
      console.log('jwtdata', jwtDecode(idToken)['https://demsabroad.org/user'])
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
          // dispatch('redirect', state.redirectPath || '/request/your-information')
        }
      })
    }
    if (!rootState.requests || rootState.requests.requests.length === 0) {
      let newRequest = {}
      if (state.user.mobileIntFormat && state.user.country) {
        newRequest.tel = {isValidPhone: true, rawInput: state.user.mobileIntFormat, type: 'MOBILE', isValidEmail: false, intNumber: state.user.mobileIntFormat, country: state.user.country}
      }
      if (state.user.emailAddress) {
        newRequest.email = state.user.emailAddress
      }
      if (state.user.country || (state.session && state.session.country)) {
        newRequest.abrAdr = {countryiso: state.user.country || state.session.country}
      }
      commit('requests/update', newRequest, { root: true })
    }
    this.$raven.setUserContext({
      email: state.user.emailAddress || null,
      id: state.user.IdentityId || null
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
    this.$raven.setUserContext()
    dispatch('getUser')
  },
  async logout ({ app, dispatch }) {
    this.app.$Analytics.record('logout')
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
