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
  }
}
