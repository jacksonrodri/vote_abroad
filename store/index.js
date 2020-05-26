import VuexPersistence from 'vuex-persist'
import { Toast } from 'buefy'
// LoadingProgrammatic, ModalProgrammatic, also available from buefy

let vuexLocal

const vuexLocalPlugin = store => {
  // called when the store is initialized
  if (process.browser) {
    window.onNuxtReady(nuxt => {
      vuexLocal = new VuexPersistence({
        strictMode: true,
        storage: window.sessionStorage
      })
      return (vuexLocal.plugin)(store)
    })
  }
  store.subscribe((mutation, state) => {
    if (mutation.type === 'RESTORE_MUTATION') {
      // console.log('Restoring State')
      store.dispatch('requests/refresh')
      if (!store.state.userauth.user.idToken && !window.location.hash) {
        store.dispatch('userauth/getUser')
      }
      store.dispatch('userauth/setSession')
      // if (store.state.userauth.user.idToken || window.location.hash) {
      //   store.dispatch('userauth/setSession')
      // } else {
      //   store.dispatch('userauth/getUser')
      // }
    }
  })
}

export const plugins = [vuexLocalPlugin]

export const state = () => ({
  upcomingElections: [],
  currentRequestId: null,
  isMenuOpen: false,
  isPrivacyOptInModalActive: false
})

export const strict = false

export const mutations = {
  RESTORE_MUTATION (state, payload) {
    // console.log('vuexLocal', vuexLocal)
    vuexLocal.RESTORE_MUTATION(state, payload)
  },
  addUpcomingElections (state, data) {
    state.upcomingElections = data
  },
  closeMenu (state) {
    state.isMenuOpen = false
  },
  toggleNav (state) {
    state.isMenuOpen = !state.isMenuOpen
  },
  togglePrivacyModalActiveState (state, newBool) {
    state.isPrivacyOptInModalActive = (newBool === false || newBool) ? newBool : !state.isPrivacyOptInModalActive
  }
}

export const actions = {
  async nuxtServerInit ({ commit }, { app }) {
    // console.log(process)
    const thisYearStart = new Date(parseInt(new Date().getFullYear()), 0, 1)
    let sortedElections = (await app.$content('/elections').get('elections')).body
      .filter(x => new Date(x.date).getTime() >= thisYearStart.getTime())
      .sort(function (a, b) {
        var dateA = new Date(a.date).getTime()
        var dateB = new Date(b.date).getTime()
        return dateA - dateB
      })
    commit('addUpcomingElections', sortedElections.slice(0, 10))
  },
  toasty () {
    Toast.open(`Your age is: toast`)
  }
}
