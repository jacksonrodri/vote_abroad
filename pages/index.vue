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
              <div v-if="!isAuthenticated">
                <h2 class="subtitle is-1 is-size-3-mobile has-text-danger">
                  {{ $t('homepage.subtitle') }}
                  <!-- Request a ballot <span class="has-text-weight-semibold">now!</span> -->
                </h2>
                <span class="is-flex"><label class="label">{{ $t('homepage.loginInstructions') }}</label><span @click="toolTipOpen = !toolTipOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span></span>
                <span class="fa-layers fa-fw" style="background:MistyRose">
                  <i class="fas fa-calendar"></i>
                  <span class="fa-layers-text fa-inverse" data-fa-transform="shrink-8 down-3" style="font-weight:900">27</span>
                </span>

                <span class="fa-layers fa-fw" style="background:MistyRose">
                  <i class="fas fa-certificate"></i>
                  <span class="fa-layers-text fa-inverse" data-fa-transform="shrink-11.5 rotate--30" style="font-weight:900">NEW</span>
                </span>
                <span class="icon is-large">
                  <span class="fa-stack fa-lg">
                    <i class="fas fa-camera fa-stack-1x"></i>
                    <i class="fas fa-ban fa-stack-2x has-text-danger"></i>
                  </span>
                </span>
                <span class="icon is-large" style="transform: rotate(45deg);">
                  <i class="fas fa-shield-alt"></i>
                </span>
                <phone-email
                  size="is-medium"
                  v-model="phoneOrEmail">
                </phone-email>
                <div class="buttons is-right is-marginless">
                  <button @click="startAuth" :class="['button', 'is-large', 'is-danger', {'is-loading': authenticating}]">{{ $t('homepage.start') }}</button>
                </div>
                <div class="buttons is-right">
                  <!-- <nuxt-link :to="localePath({ name: 'request-stage', params: { stage: 'your-information'} })" class="button is-text has-text-black is-paddingless" exact ><span>{{ $t('homepage.anonymous') }}</span></nuxt-link> -->
                  <button @click="anonymousStart" class="button is-text has-text-black is-paddingless" exact ><span>{{ $t('homepage.anonymous') }}</span></button>
                  <span @click="toolTipOpen = !toolTipOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span>
                </div>
                <b-message title="What is this?" type="is-info" has-icon :active.sync="toolTipOpen">
                  {{ $t('homepage.tooltip')}}
                </b-message>
              </div>
              <div v-else>
                <h1 class="subtitle is-1 is-size-3-mobile has-text-danger">
                  <span class="has-text-grey-light">Welcome back, </span><span><strong>{{ name }}!</strong></span>
                </h1>
                <div class="buttons is-right">
                  <button @click="$store.dispatch('userauth/logout')" class="button is-light">
                    <b-icon
                      pack="fas"
                      icon="sign-out-alt"
                      size="is-small">
                    </b-icon>
                    <span>{{ $t('menu.logout')}}</span>
                  </button>
                  <nuxt-link :to="localePath({ name: 'request-stage', params: { stage: 'your-information'} })" class="button is-primary" exact >Continue my request</nuxt-link>
                </div>
                <!-- <div class="buttons is-right is-marginless">
                  <button @click="$store.dispatch('userauth/logout')" class="button is-medium is-light">
                    <b-icon
                      pack="fas"
                      icon="sign-out-alt"
                      size="is-small">
                    </b-icon>
                    <span>{{ $t('menu.logout')}}</span>
                  </button>
                </div> -->
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
      toolTipOpen: false,
      authenticating: false
    }
  },
  computed: {
    isAuthenticated: function () { return this.$store.getters['userauth/isAuthenticated'] },
    user () { return this.$store.state.userauth.user },
    requests () { return this.$store.state.requests.requests },
    name () { return this.user && this.user.firstName ? this.user.firstName : this.requests && this.requests[0] && this.requests[0].firstName ? this.requests[0].firstName : '' }
  },
  methods: {
    anonymousStart: function () {
      this.$toast.open({
        message: 'You have started an anonymous session.  Please close this window when you are finished to delete all data.',
        type: 'is-success',
        duration: 8000
      })
      this.$router.push(this.localePath({ name: 'request-stage', params: { stage: 'your-information' } }))
    },
    startAuth: function () {
      if (!this.phoneOrEmail.isValidEmail && !this.phoneOrEmail.isValidPhone) {
        return
      }
      this.authenticating = true
      this.authStart('/request/your-information')
      setTimeout(() => {
        this.authenticating = false
      }, 1500)
    },
    ...mapActions('userauth', [
      'sendEmailCode',
      'sendEmailLink',
      'sendEmailLink',
      'promptCode',
      'authStart'
    ])
  },
  transition: 'test'
  // middleware: 'account'
}
</script>
