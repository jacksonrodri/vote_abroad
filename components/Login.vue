<template>
  <div class="notification is-semitransparent">
    <h1 class="title is-1 is-hidden-mobile is-spaced has-text-danger">
      <span class="has-text-weight-semibold">{{ $t('homepage.title') }}</span>
    </h1>
    <div v-if="authState === 'loggedIn'">
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
    <div v-else-if="authState === 'enteringCode'">
      <!-- <b-field>
        <b-field>
          <b-input placeholder="Type your code..."
            type="tel"
            icon="lock"
            expanded
            autocomplete="off"
            size="is-medium"
            max=999999
            pattern="[0-9]{6}"
            v-model="code"
            @keyup.native.enter="confirmCode"
            required>
          </b-input>
        </b-field>
        <p class="control">
          <a @click="confirmCode" class="button is-primary is-medium">
            <span class="icon is-small">
              <i class="fas fa-arrow-right"></i>
            </span>
          </a>
        </p>
      </b-field> -->
      <code-input
        ref="codeInput"
        key="codeInput"
        fieldName="codeInput"
        v-model="code"
        :loading="authenticating"></code-input>
      <div class="field is-grouped is-grouped-centered">
        <p class="control">
          <a v-show="seconds > 25" @click="currently = 'retrying'" class="button is-vfa is-inverted is-small">
            Did not get the code?
          </a>
          <a v-show="seconds <= 25" class="button is-vfa is-inverted is-small" disabled>
            Did not get the code? <span class="tag is-help">0:{{ 25 - parseInt(seconds) | two_digits }}</span>
          </a>
        </p>
      </div>
      <div class="buttons is-right is-marginless">
        <button @click.prevent="confirmCode" :class="['button', 'is-large', 'is-danger', {'is-loading': authState === 'loading'}]">{{ $t('homepage.start') }}</button>
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
    </div>
    <div v-else>
      <h2 class="subtitle is-1 is-size-3-mobile has-text-danger">
        {{ $t('homepage.subtitle') }}
      </h2>
      <phone-email-two
        ref="phoneOrEmail"
        key="phoneOrEmail"
        fieldName="phoneOrEmail"
        v-model="phoneOrEmail"
        :v="$v.phoneOrEmail"
        @pressEnter="startAuth"
        :loading="authState === 'loading'"
        @delayTouch="delayTouch"></phone-email-two>
      <div class="buttons is-right is-marginless">
        <button @click.prevent="startAuth" :class="['button', 'is-large', 'is-danger', {'is-loading': authState === 'loading'}]">{{ $t('homepage.start') }}</button>
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
  </div>
</template>

<script>
import PhoneEmailTwo from '~/components/PhoneEmailTwo'
import CodeInput from '~/components/CodeInput'
import snarkdown from 'snarkdown'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
const touchMap = new WeakMap()

export default {
  name: 'LogIn',
  components: {
    PhoneEmailTwo,
    CodeInput
  },
  data () {
    return {
      phoneOrEmail: '',
      code: '',
      now: Math.trunc((new Date()).getTime() / 1000),
      date: Math.trunc((new Date()).getTime() / 1000),
      toolTipOpen: false,
      isInfoOpen: false,
      authenticating: false,
      didYouKnow: [
        'Did you know around 9 million Americans live abroad?',
        'Request your ballot every calendar year to get full Federal Protection for all federal elections each year.',
        'Americans have been political abroad since Thomas Jefferson.  He drafted the Bill of Rights while in Paris.'
      ]
    }
  },
  computed: {
    toolTipContent () { return this.$te(`request.phoneOrEmail.tooltip`) ? snarkdown(this.$t(`request.phoneOrEmail.tooltip`)) : null },
    isAuthenticated: function () { return this.$store.getters['userauth/isAuthenticated'] },
    user () { return this.$store.state.userauth.user },
    requests () { return this.$store.state.requests.requests },
    name () { return this.user && this.user.firstName ? this.user.firstName : this.requests && this.requests[0] && this.requests[0].firstName ? this.requests[0].firstName : 'guest' },
    seconds () {
      return (this.now - this.date)
    },
    ...mapGetters('data', ['isValidEmail', 'isValidNumber']),
    ...mapState('userauth', ['authState'])
  },
  filters: {
    two_digits (value) {
      if (value.toString().length <= 1) {
        return '0' + value.toString()
      }
      return value.toString()
    }
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
        // console.log('sending sms')
        this.sendSmsCode()
      }
      if (this.isValidEmail(this.phoneOrEmail)) {
        this.updateUser({emailAddress: this.phoneOrEmail})
        // console.log('sending email')
        this.sendEmailLink()
      }
      if (!this.isValidNumber(this.phoneOrEmail) && !this.isValidEmail(this.phoneOrEmail)) {
        // console.log(this.isValidNumber(this.phoneOrEmail), this.isValidEmail(this.phoneOrEmail))
        this.$refs.phoneOrEmail.$refs.phoneOrEmail.focus()
        return
      }
      this.authenticating = true
      // this.authStart(this.localePath({ name: 'request-stage', params: { stage: 'your-information' } }))
      setTimeout(() => {
        this.authenticating = false
      }, 5000)
    },
    confirmCode () {
      if (this.$store.state.userauth.user.emailAddress) {
        this.$store.dispatch('userauth/loginEmailVerify', this.code)
      } else if (this.$store.state.userauth.user.mobileIntFormat) {
        this.$store.dispatch('userauth/loginSmsVerify', this.code)
      }
    },
    resetDate () {
      this.date = Math.trunc((new Date()).getTime() / 1000)
    },
    delayTouch () {
      this.$v.phoneOrEmail.$reset()
      if (touchMap.has(this.$v.phoneOrEmail)) {
        clearTimeout(touchMap.get(this.$v.phoneOrEmail))
      }
      touchMap.set(this.$v.phoneOrEmail, setTimeout(this.$v.phoneOrEmail.$touch, 1000))
    },
    ...mapActions('userauth', [
      'sendSmsCode',
      'sendEmailLink'
    ]),
    ...mapMutations('userauth', ['updateUser', 'updateAuthState'])
  },
  mounted () {
    this.resetDate()
    if (process.browser && window.location.hash && window.location.hash.includes('access_token')) {
      this.updateAuthState('authenticating')
    }
    if (process.browser) {
      window.setInterval(() => {
        this.now = Math.trunc((new Date()).getTime() / 1000)
      }, 1000)
    }
  },
  validations: {
    phoneOrEmail: {
      validPhoneOrEmail () {
        return this.isValidNumber(this.phoneOrEmail) || this.isValidEmail(this.phoneOrEmail)
      }
      // validPhone () {
      //   return this.isValidNumber(this.phoneOrEmail)
      // },
      // validEmail () {
      //   return this.isValidEmail(this.phoneOrEmail)
      // }
    }
  }

}
</script>

<style>

</style>
