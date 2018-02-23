<template>
  <section  class="hero-body">
    <!-- <div class="hero is-medium"> -->
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-9 is-12-touch">
            <div class="notification is-semitransparent">
              <h1 class="title is-1 is-hidden-mobile is-spaced has-text-danger">
                <span class="has-text-weight-semibold">Vote from abroad</span>
              </h1>
              <h2 class="subtitle is-1 is-size-3-mobile has-text-danger">
                Request a ballot <span class="has-text-weight-semibold">now!</span>
              </h2>
              <div class="content">
                <phone-email
                  size="is-medium"
                  v-model="phoneOrEmail">
                </phone-email>
                <div class="buttons is-right is-marginless">
                  <button @click="authStart('/request/your-information')" class="button is-large is-danger">Start</button>
                </div>
                <div class="buttons is-right">
                  <nuxt-link :to="localePath({ name: 'request-stage', params: { stage: 'your-information'} })" class="button is-text has-text-black is-paddingless" exact >or start an anonymous session</nuxt-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  </section>
</template>

<script>
import PhoneEmail from '~/components/PhoneEmail.vue'
import { mapActions } from 'vuex'
// import FontAwesomeIcon from '@fortawesome/vue-fontawesome'

export default {
  layout: 'default',
  head: {
    script: [
      { src: 'https://identity.netlify.com/v1/netlify-identity-widget.js' }
    ]
  },
  components: {
    PhoneEmail
  },
  mounted () {
    if (process.browser) {
      window.onNuxtReady((app) => {
        if (window.netlifyIdentity) {
          window.netlifyIdentity.on('init', user => {
            if (!user) {
              window.netlifyIdentity.on('login', () => {
                document.location.href = '/admin/'
              })
            }
          })
        }
      })
    }
  },
  data () {
    return {
      phoneOrEmail: {}
    }
  },
  methods: {
    ...mapActions('userauth', [
      'sendEmailCode',
      'sendEmailLink',
      'sendEmailLink',
      'promptCode',
      'authStart'
    ])
  },
  transition: 'test'
}
</script>
