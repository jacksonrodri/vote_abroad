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
                </h2>
                <!-- <span class="is-flex"><label class="label">{{ $t('homepage.loginInstructions') }}</label><span @click="toolTipOpen = !toolTipOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span></span> -->
                <!-- <phone-input ref="pe"
                  key="pe"
                  :label="$t('homepage.loginInstructions')"
                  :accepts="['phone', 'email']"
                  @input="val => $store.commit('userauth/updateUser', {emailAddress: val.isValidEmail ? val.rawInput : '', mobileIntFormat: val.intNumber})"
                  @pressEnter="startAuth"
                  v-model="phoneOrEmail">
                </phone-input> -->
                <phone-five
                  ref="phoneOrEmail"
                  key="phoneOrEmail"
                  fieldName="phoneOrEmail"
                  v-model="phoneOrEmail"
                  :v="$v.phoneOrEmail"
                  @delayTouch="delayTouch($v.phoneOrEmail)"></phone-five>
                <!-- <phone-email
                  size="is-medium"
                  ref="pe"
                  @pressEnter="startAuth"
                  v-model="phoneOrEmail">
                </phone-email> -->
                <div class="buttons is-right is-marginless">
                  <button @click.prevent="startAuth" :class="['button', 'is-large', 'is-danger', {'is-loading': authenticating}]">{{ $t('homepage.start') }}</button>
                </div>
                <div class="buttons is-right">
                  <button @click.prevent="anonymousStart" class="button is-text has-text-black is-paddingless" exact ><span>{{ $t('homepage.anonymous') }}</span></button>
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
                  <button @click.prevent="$store.dispatch('userauth/logout')" class="button is-light">
                    <b-icon
                      pack="fas"
                      icon="sign-out-alt"
                      size="is-small">
                    </b-icon>
                    <span>{{ $t('menu.logout')}}</span>
                  </button>
                  <nuxt-link :to="localePath({ name: 'request-stage', params: { stage: 'your-information'} })" class="button is-primary" exact >Continue my request</nuxt-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  </section>
</template>

<script>
// import PhoneEmail from '~/components/PhoneEmail.vue'
// import PhoneInput from '~/components/PhoneInput'
import PhoneFive from '~/components/PhoneFive'

import { mapActions, mapGetters, mapMutations } from 'vuex'
const touchMap = new WeakMap()

export default {
  layout: 'default',
  // head: {
  //   script: [
  //     { src: 'https://identity.netlify.com/v1/netlify-identity-widget.js' }
  //   ]
  // },
  components: {
    // PhoneEmail,
    // PhoneInput,
    PhoneFive
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
    name () { return this.user && this.user.firstName ? this.user.firstName : this.requests && this.requests[0] && this.requests[0].firstName ? this.requests[0].firstName : 'guest' },
    ...mapGetters('data', ['isValidEmail', 'isValidNumber'])
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
      if (this.isValidNumber(this.phoneOrEmail)) {
        this.updateUser({mobileIntFormat: this.phoneOrEmail})
      }
      if (this.isValidEmail(this.phoneOrEmail)) {
        this.updateUser({emailAddress: this.phoneOrEmail})
      }
      if (!this.isValidNumber(this.phoneOrEmail) && !this.isValidEmail(this.phoneOrEmail)) {
        console.log(this.isValidNumber(this.phoneOrEmail), this.isValidEmail(this.phoneOrEmail))
        this.$refs.phoneOrEmail.$refs.phoneOrEmail.focus()
        return
      }
      this.authenticating = true
      this.authStart(this.localePath({ name: 'request-stage', params: { stage: 'your-information' } }))
      setTimeout(() => {
        this.authenticating = false
      }, 5000)
    },
    delayTouch ($v) {
      $v.$reset()
      if (touchMap.has($v)) {
        clearTimeout(touchMap.get($v))
      }
      touchMap.set($v, setTimeout($v.$touch, 1000))
    },
    ...mapActions('userauth', [
      'sendEmailCode',
      'sendEmailLink',
      'promptCode',
      'authStart'
    ]),
    ...mapMutations('userauth', ['updateUser'])
  },
  transition: 'test',
  validations: {
    phoneOrEmail: {
      async validPhoneOrEmail () {
        // if (this.$refs && this.$refs.tel) {
        //   return this.$refs.tel.validatePhone
        // } else return this.tel && this.tel.rawInput ? this.tel.isValidPhone : true
        return this.isValidNumber(this.phoneOrEmail) || this.isValidEmail(this.phoneOrEmail)
      }
    }
  }
}
</script>
