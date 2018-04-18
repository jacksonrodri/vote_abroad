import { WebAuth } from 'auth0-js'
import axios from 'axios'
import { Dialog, Toast, Snackbar, LoadingProgrammatic } from 'buefy'
import * as AWS from 'aws-sdk'
import 'amazon-cognito-js'
const jwtDecode = require('jwt-decode')
// var AWS = require('aws-sdk')

AWS.config.region = 'us-east-1' // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: 'us-east-1:7bd016b9-b2ad-4ed3-bb1a-8915af42a2b5'
})
// const redirectUri = `https://votefromabroad.netlify.com`
// const redirectUri = `http://localhost:3000`
const redirectUri = process.env.url

const webAuth = new WebAuth({
  domain: 'montg.auth0.com',
  redirectUri: redirectUri,
  clientID: '0Wy4khZcuXefSfrUuYDUP0Udag4FqL2u',
  responseType: 'token id_token'
  // audience: optons.audience || options.domain.concat('/userinfo')
})

export const state = () => ({
  idToken: null,
  expirationDate: null,
  gcToken: null,
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
        // console.log(`Sent code to ${state.user.emailAddress}`)
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
        // console.log(`Sent code to ${state.user.emailAddress}`)
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
        // console.log(`Sent code to ${state.user.mobilePhone}`)
        resolve()
      })
    })
  },
  async getSessionGeo ({commit, state}) {
    if (!state.session.country) {
      let res = await axios.get('https://ipinfo.io/geo')
      commit('updateSessionGeo', res.data)
      // console.log(res.data)
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
      // message: `Enter the code we sent to ${state.user.emailAddress || state.user.mobileIntFormat}`,
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
        // realm: 'Username-Password-Authentication', // connection name or HRD domain
        connection: 'email',
        email: state.user.emailAddress,
        verificationCode: code,
        scope: 'openid profile email'
        // audience: this.options.audience
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
        // realm: 'Username-Password-Authentication', // connection name or HRD domain
        connection: 'sms',
        phoneNumber: state.user.mobileIntFormat,
        verificationCode: code,
        scope: 'openid profile email'
        // audience: this.options.audience
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
  async setSession ({ state, rootState, commit, dispatch }) {
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
          scope: 'openid profile email'
        }, function (err, authResult) {
          if (err) {
            console.log('checkSessionErr', err)
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
      // console.log('renewing auth', authResult.expiresIn * 1000, Date.now())
    }
    let idToken = authResult.idToken
    // console.log('authresult', authResult)
    commit('updateIdToken', idToken)
    commit('updateExpirationDate', jwtDecode(idToken).exp)
    commit('updateGcToken', jwtDecode(idToken)['https://graph.cool/token'])
    if (state.redirectPath) {
      dispatch('redirect', state.redirectPath)
    }
    console.log('[https://demsabroad.org/user]', jwtDecode(idToken)['https://demsabroad.org/user'])
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
    // console.log(state.redirectPath)
    // Snackbar.open({
    //   message: `Your graphcool token is: ${jwtDecode(idToken)['https://graph.cool/token']}`,
    //   type: 'is-info',
    //   position: 'is-top',
    //   actionText: 'Retry',
    //   duration: 8000
    // })
    // console.log('hi from after Snackbar.open')
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: 'us-east-1:7bd016b9-b2ad-4ed3-bb1a-8915af42a2b5',
      Logins: {
        'montg.auth0.com': idToken
      }
    })
    AWS.config.credentials.get(function () {
      var syncClient = new AWS.CognitoSyncManager()
      syncClient.openOrCreateDataset('myDataset', function (err, dataset) {
        if (err) throw (err)
        dataset.put('myKey', 'myValue', function (err, record) {
          if (err) throw (err)
          dataset.synchronize({
            onSuccess: function (data, newRecords) {
              console.log('data', data, 'newRecords', newRecords)
            }
          })
        })
      })
    })
    // var syncManager = new AWS.CognitoSyncManager()
    // let dataset
    // syncManager.openOrCreateDataset('alexData', function (err, d) {
    //   if (err) throw (err)
    //   dataset = d
    //   dataset.put('Alex', 'Montgomery', function (err, record) {
    //     if (err) console.log('datasetputerr', err)
    //     console.log(record)
    //     dataset.synchronize()
    //   })
    // })
    // console.log(dataset)
    // dataset.synchronize({
    //   onSuccess: function(dataset, newRecords) {
    //     console.log(dataset, newRecords)
    //  },
    //  onFailure: function(err) {
    //     console.log(err)
    //  }
    // })
    // dataset.put('newData', 'newValue', function (err, record) {
    //   if (err) throw (err)
    //   console.log('returned record', record)
    // })
    // dataset.synchronize()
    // syncManager.openOrCreateDataset('myDatasetName', function (err, dataset) {
    //   if (err) {
    //     console.log('ERROR-syncManager.openOrCreateDataset', err)
    //   } else {
    //     console.log('SUCCESS-syncManager.openOrCreateDataset', dataset)
    //     dataset.put('newKey', 'newValue', function (err, record) {
    //       if (err) throw (err)
    //       console.log('record', record)
    //       dataset.synchronize()
    //     })
    //   }
    // })
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
