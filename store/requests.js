export const state = () => ({
  requests: []
})

export const getters = {
  getRequestById: (state) => (id) => {
    return state.requests.find(request => request.id === id)
  }
}

export const mutations = {
  add (state, text) {
    state.requests.push({
      id: 1,
      text: text,
      done: false
    })
  },
  remove (state, { todo }) {
    state.requests.splice(state.requests.indexOf(todo), 1)
  },
  update (state, {text, ...args} = {}) {
    let thisIndex = state.requests.findIndex(x => x.text === text)
    state.requests.splice(thisIndex, 1, Object.assign({}, state.requests[thisIndex], args))
  },
  toggle (state, todo) {
    todo.done = !todo.done
  }
}
