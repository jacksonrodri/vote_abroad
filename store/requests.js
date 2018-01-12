export const state = () => ({
  currentRequest: 0,
  requests: []
})

export const getters = {
  getRequestById: (state) => (id) => {
    return state.requests.find(request => request.id === id)
  }
}

export const mutations = {
  changeCurrent (state, index) {
    state.currentRequest = index
  },
  add (state) {
    state.requests.push({
      id: (function b (a) { return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, b) })()
    })
  },
  refresh (state, commit) {
    state.requests.push({})
    state.requests.splice(state.requests.length - 1, 1)
    console.log(state.requests.length)
    if (state.requests.length === 0) {
      commit('add')
    }
  },
  remove (state, { todo }) {
    state.requests.splice(state.requests.indexOf(todo), 1)
  },
  removeLast (state) {
    state.requests.splice(state.length - 1, 1)
  },
  removeCurrent (state) {
    let cur = state.currentRequest
    state.currentRequest = cur ? cur - 1 : 0
    state.requests.splice(cur, 1)
  },
  update (state, {...args} = {}) {
    state.requests.splice(state.currentRequest, 1, Object.assign({}, state.requests[state.currentRequest], args))
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
  addOrUpdate ({ commit, state }, {id, ...args} = {}) {
    if (!state.requests.findIndex(x => x.id === id) || !id) {
      // add request
      commit('add')
      id = state.requests[state.requests.length - 1].id
    }
    commit('update', ...args)
  },
  refresh ({ commit, state }) {
    commit('add')
    commit('removeLast')
    if (state.requests.length === 0) {
      commit('add')
    }
  },
  removeCurrent ({ commit, state }) {
    commit('removeCurrent')
    if (state.requests.length === 0) {
      commit('add')
    }
  }
}
