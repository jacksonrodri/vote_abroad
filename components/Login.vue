<template>
  <div class="notification is-semitransparent">
    <h1 class="title is-1 is-hidden-mobile is-spaced has-text-danger">
      <span class="has-text-weight-semibold">{{ $t('homepage.title') }}</span>
    </h1>
    <div v-if="!isAuthenticated">
      <h2 class="subtitle is-1 is-size-3-mobile has-text-danger">
        {{ $t('homepage.subtitle') }}
      </h2>
      <phone-email-two
        ref="phoneOrEmail"
        key="phoneOrEmail"
        fieldName="phoneOrEmail"
        v-model="phoneOrEmail"
        :v="$v.phoneOrEmail"
        :loading="authenticating"
        @delayTouch="delayTouch($v.phoneOrEmail)"></phone-email-two>
      <div class="buttons is-right is-marginless">
        <button @click.prevent="startAuth" :class="['button', 'is-large', 'is-danger', {'is-loading': authenticating}]">{{ $t('homepage.start') }}</button>
      </div>
      <div class="buttons is-right">
        <button @click.prevent="anonymousStart" class="button is-text has-text-black is-paddingless" exact ><span>{{ $t('homepage.anonymous') }}</span></button>
        <button @click.prevent="toggleInfo" class="button is-transparent is-small">
          <span>
            <b-icon
              type="is-info"
              icon="info-circle"></b-icon>
          </span>
        </button>
      </div>
      <b-message v-if="toolTipContent" type="is-info" has-icon :active.sync="isInfoOpen">
        <p v-html="toolTipContent"></p>
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
</template>

<script>
import PhoneEmailTwo from '~/components/PhoneEmailTwo'
import snarkdown from 'snarkdown'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
const touchMap = new WeakMap()

export default {
  name: 'LogIn',
  components: {
    PhoneEmailTwo
  },
  data () {
    return {
      phoneOrEmail: '',
      toolTipOpen: false,
      isInfoOpen: false,
      authenticating: false
    }
  },
  computed: {
    toolTipContent () { return this.$te(`request.phoneOrEmail.tooltip`) ? snarkdown(this.$t(`request.phoneOrEmail.tooltip`)) : null },
    isAuthenticated: function () { return this.$store.getters['userauth/isAuthenticated'] },
    user () { return this.$store.state.userauth.user },
    requests () { return this.$store.state.requests.requests },
    name () { return this.user && this.user.firstName ? this.user.firstName : this.requests && this.requests[0] && this.requests[0].firstName ? this.requests[0].firstName : 'guest' },
    ...mapGetters('data', ['isValidEmail', 'isValidNumber']),
    ...mapState('userauth', ['authState'])
  },
  methods: {
    toggleInfo () { this.isInfoOpen = !this.isInfoOpen },
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
        this.sendSmsCode()
      }
      if (this.isValidEmail(this.phoneOrEmail)) {
        this.updateUser({emailAddress: this.phoneOrEmail})
        this.sendEmailLink()
      }
      if (!this.isValidNumber(this.phoneOrEmail) && !this.isValidEmail(this.phoneOrEmail)) {
        console.log(this.isValidNumber(this.phoneOrEmail), this.isValidEmail(this.phoneOrEmail))
        this.$refs.phoneOrEmail.$refs.phoneOrEmail.focus()
        return
      }
      this.authenticating = true
      // this.authStart(this.localePath({ name: 'request-stage', params: { stage: 'your-information' } }))
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
      'sendSmsCode',
      'sendEmailLink'
    ]),
    ...mapMutations('userauth', ['updateUser', 'updateAuthState'])
  },
  mounted () {
    if (process.browser && window.location.hash && window.location.hash.includes('access_token')) {
      this.updateAuthState('loading')
    }
  },
  validations: {
    phoneOrEmail: {
      async validPhoneOrEmail () {
        return this.isValidNumber(this.phoneOrEmail) || this.isValidEmail(this.phoneOrEmail)
      }
    }
  }

}
</script>

<style>

</style>
