import VuexPersistence from 'vuex-persist'

let vuexLocal

const vuexLocalPlugin = store => {
  // called when the store is initialized
  if (process.browser) {
    window.onNuxtReady(nuxt => {
      vuexLocal = new VuexPersistence({
        strictMode: true,
        storage: window.localStorage
      })
      return (vuexLocal.plugin)(store)
    })
  }
  store.subscribe((mutation, state) => {
    if (mutation.type === 'RESTORE_MUTATION') {
      console.log('Restoring State')
      store.dispatch('userauth/getUser')
    }
  })
}

export const plugins = [vuexLocalPlugin]

export const state = () => ({
  upcomingElections: [],
  currentRequestId: null,
  language: null
})

export const mutations = {
  RESTORE_MUTATION (state, payload) {
    vuexLocal.RESTORE_MUTATION(state, payload)
  },
  addUpcomingElections (state, data) {
    state.upcomingElections = data
    // state.upcomingElections.push(data)
  }
}

export const actions = {
  async nuxtServerInit ({ commit, app }) {
    let sortedElections = (await this.app.$content('/elections').get('elections')).body
      .filter(x => new Date(x.date).getTime() > Date.now())
      .sort(function (a, b) {
        var dateA = new Date(a.date).getTime()
        var dateB = new Date(b.date).getTime()
        return dateA - dateB
      })
    commit('addUpcomingElections', sortedElections.slice(0, 9))
  }
}
