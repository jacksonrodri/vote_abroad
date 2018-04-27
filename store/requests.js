export const state = () => ({
  currentRequest: 0,
  requests: []
})

export const getters = {
  getRequestById: (state) => (id) => {
    return state.requests.find(request => request.id === id)
  },
  getCurrent: (state) => {
    return state.requests[state.currentRequest]
  }
}

export const mutations = {
  changeCurrent (state, index) {
    state.currentRequest = index
  },
  clearRequests (state) {
    state.requests = []
  },
  add (state) {
    state.requests.push({
      id: (function b (a) { return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, b) })()
    })
  },
  // refresh (state, commit) {
  //   state.requests.push({})
  //   state.requests.splice(state.requests.length - 1, 1)
  //   console.log(state.requests.length)
  //   if (state.requests.length === 0) {
  //     commit('add')
  //   }
  // },
  remove (state, { todo }) {
    state.requests.splice(state.requests.indexOf(todo), 1)
  },
  removeLast (state) {
    state.requests.splice(state.requests.length - 1, 1)
  },
  removeCurrent (state) {
    let cur = state.currentRequest
    state.currentRequest = cur ? cur - 1 : 0
    state.requests.splice(cur, 1)
  },
  update (state, {...args} = {}) {
    state.requests.splice(state.currentRequest, 1, Object.assign({}, state.requests[state.currentRequest], args))
    // Vue.set(state.requests, state.currentRequest, Object.assign({}, state.requests[state.currentRequest], args))
  },
  // update (state, {id, ...args} = {}) {
  //   let thisIndex = state.requests.findIndex(x => x.id === id)
  //   state.requests.splice(thisIndex, 1, Object.assign({}, state.requests[thisIndex], args))
  // },
  toggle (state, todo) {
    todo.done = !todo.done
  }
}

export const actions = {
  async updateRequest ({commit, state, app}) {
    const API = this.app.$API
    const graphqlOperation = this.app.$graphqlOperation
    const CreateRequest = `mutation CreateRequest($input: CreateRequestInput!){
      createRequest(input: $input) {
        id
        firstName
        middleName
        lastName
        abrAdr{
          premise
        }
      }
    }`
    // const requestInput = {
    //   input: {
    //     firstName: 'Tomorrow',
    //     middleName: 'Party',
    //     lastName: 'Montgomery',
    //     abrAdr: {
    //       premise: 'Flat 7, 27/f Block C, Greenwood Garden',
    //       thoroughfare: '7-11 Shakok St',
    //       locality: 'Shatin',
    //       administrativearea: 'New Territories',
    //       countryiso: 'HK',
    //       country: 'Hong Kong'
    //     }
    //   }
    // }
    let currentRequestState = Object.assign({}, state.requests[0])
    if (currentRequestState.identification) delete currentRequestState.identification
    const stateRequestInput = {input: currentRequestState}
    const newRequest = await API.graphql(graphqlOperation(CreateRequest, stateRequestInput))
    console.log('id', newRequest.data.createRequest.id)
    commit('update', {id: newRequest.data.createRequest.id})
    return newRequest.data
  },
  addOrUpdate ({ commit, state }, {id, ...args} = {}) {
    if (!state.requests.findIndex(x => x.id === id) || !id) {
      // add request
      commit('add')
      id = state.requests[state.requests.length - 1].id
    }
    commit('update', ...args)
  },
  refresh ({ commit, state, rootState }) {
    commit('add')
    commit('removeLast')
    if (state.requests.length === 0) {
      commit('add')
      commit('update', {
        email: rootState.userauth.user.emailAddress,
        tel: {
          intNumber: rootState.userauth.user.mobileIntFormat || '',
          country: rootState.userauth.session.country || ''
        },
        abrAdr: {
          countryiso: rootState.userauth.session.country
        }
      })
    }
  },
  removeCurrent ({ commit, state, rootState }) {
    commit('removeCurrent')
    if (state.requests.length === 0) {
      commit('add')
      commit('update', {
        email: rootState.userauth.user.emailAddress,
        country: rootState.userauth.session.country
      })
    }
  }
}
