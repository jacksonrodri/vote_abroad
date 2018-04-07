<template>
  <section  class="hero-body">
    <!-- <div class="hero is-medium"> -->
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-9 is-12-touch">
            <div class="notification is-semitransparent">
              <h1 class="title is-1 is-hidden-mobile is-spaced has-text-danger">
                <span class="has-text-weight-semibold">{{ $t('homepage.title') }}</span>
              </h1>
              <h2 class="subtitle is-1 is-size-3-mobile has-text-danger">
                {{ $t('homepage.subtitle') }}
                <!-- Request a ballot <span class="has-text-weight-semibold">now!</span> -->
              </h2>
              <div class="content">
                <span class="is-flex"><label class="label">{{ $t('homepage.loginInstructions') }}</label><span @click="toolTipOpen = !toolTipOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span></span>
                <phone-email
                  size="is-medium"
                  v-model="phoneOrEmail">
                </phone-email>
                <div class="buttons is-right is-marginless">
                  <button @click="authStart('/request/your-information')" class="button is-large is-danger">{{ $t('homepage.start') }}</button>
                </div>
                <div class="buttons is-right">
                  <nuxt-link :to="localePath({ name: 'request-stage', params: { stage: 'your-information'} })" class="button is-text has-text-black is-paddingless" exact ><span>{{ $t('homepage.anonymous') }}</span></nuxt-link><span @click="toolTipOpen = !toolTipOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span>
                </div>
              </div>
              <b-message title="What is this?" type="is-info" has-icon :active.sync="toolTipOpen">
                {{ $t('homepage.tooltip')}}
              </b-message>
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
  // head: {
  //   script: [
  //     { src: 'https://identity.netlify.com/v1/netlify-identity-widget.js' }
  //   ]
  // },
  components: {
    PhoneEmail
  },
  // mounted () {
  //   if (process.browser) {
  //     window.onNuxtReady((app) => {
  //       if (window.netlifyIdentity) {
  //         window.netlifyIdentity.on('init', user => {
  //           if (!user) {
  //             window.netlifyIdentity.on('login', () => {
  //               document.location.href = '/admin/'
  //             })
  //           }
  //         })
  //       }
  //     })
  //   }
  // },
  data () {
    return {
      phoneOrEmail: {},
      toolTipOpen: false
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
  transition: 'test',
  middleware: 'account'
}
</script>
