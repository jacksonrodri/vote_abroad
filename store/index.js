import VuexPersistence from 'vuex-persist'
import { Dialog, Snackbar, Toast } from 'buefy'
// LoadingProgrammatic, ModalProgrammatic, also available from buefy

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
  language: null,
  isMenuOpen: false
})

export const mutations = {
  RESTORE_MUTATION (state, payload) {
    vuexLocal.RESTORE_MUTATION(state, payload)
  },
  addUpcomingElections (state, data) {
    state.upcomingElections = data
    // state.upcomingElections.push(data)
  },
  closeMenu (state) {
    state.isMenuOpen = false
  },
  toggleNav (state) {
    state.isMenuOpen = !state.isMenuOpen
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
  },
  toasty () {
    Snackbar.open(`Your age is: toast`)
  },
  promptCode ({ rootState }) {
    Dialog.prompt({
      title: 'Authentication',
      message: `Enter the code we sent to ${rootState.userauth.user.emailAddress}`,
      inputAttrs: {
        type: 'text',
        placeholder: 'Type the code.',
        minlength: 6,
        maxlength: 6
      },
      onConfirm: (value) => Toast.open({
        message: `Your age is: ${value}`,
        type: 'is-warning',
        position: 'is-top',
        actionText: 'Retry'
      })
    })
  }
}
