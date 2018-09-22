<template>
  <div class="notification is-semitransparent">
    <h1 class="title is-1 is-hidden-mobile is-spaced has-text-danger">
      <span class="has-text-weight-semibold">{{ isStudentSite ? $t('homepage.titleStudents') : $t('homepage.title') }}</span>
    </h1>
    <div v-if="authState === 'loggedIn'">
      <i18n tag="h1" path="auth.welcomeBack" class="subtitle is-1 is-size-3-mobile has-text-grey-light">
        <strong>{{ name }}</strong>
      </i18n>
      <!-- <h1 class="subtitle is-1 is-size-3-mobile has-text-danger">
        <span class="has-text-grey-light">Welcome back, </span><span><strong>{{ name }}!</strong></span>
      </h1> -->
      <div class="buttons is-right">
        <button @click.prevent="$store.dispatch('userauth/logout')" class="button is-light">
          <b-icon
            pack="fas"
            icon="sign-out-alt"
            size="is-small">
          </b-icon>
          <span>{{ $t('menu.logout')}}</span>
        </button>
        <nuxt-link :to="localePath({ name: 'request-stage', params: { stage: 'your-information'} })" class="button is-primary" exact >{{$t('auth.continueRequest')}}</nuxt-link>
      </div>
    </div>
    <div v-else-if="authState === 'enteringCode'">
      <auth-code-input
        ref="codeInput"
        key="codeInput"
        fieldName="codeInput"
        :loginType="loginType"
        v-model="code"
        :v="$v.code"
        @pressEnter="confirmCode"
        :loading="authenticating"></auth-code-input>
      <p class="has-text-centered help has-text-vfa">
        <ul>
          <li>
            <h3 class="title is-7">{{$t('auth.notReceived', {type: $t(`auth.${loginType}`)})}}</h3>
          </li>
          <li v-if="seconds > 10 && loginType === 'email'">
            <b-icon
              type="is-vfa"
              icon="check"></b-icon>
            {{$t('auth.emailDelay')}}
          </li>
          <li v-if="seconds > 10 && loginType === 'email'">
            <b-icon
              type="is-vfa"
              icon="check"></b-icon>
              {{$t('auth.checkSpam')}}
            <!-- Check your spam folder -->
          </li>
          <li v-if="seconds > 10 && loginType === 'email'">
            <b-icon
              type="is-vfa"
              icon="check"></b-icon>
              {{$t('auth.correctEmail')}}
            <!-- Did you enter your email correctly? -->
          </li>
          <li v-if="seconds > 10 && loginType === 'sms'">
            <b-icon
              type="is-vfa"
              icon="check"></b-icon>
              {{$t('auth.notReceiveSms')}}
            <!-- Can you receive SMS messages on {{ phoneOrEmail }}? -->
          </li>
          <li v-if="seconds > 10 && loginType === 'sms'">
            <b-icon
              type="is-vfa"
              icon="check"></b-icon>
              {{$t('auth.correctNumber')}}
            <!-- Did you enter your number correctly? -->
          </li>
          <li v-if="seconds > 10 && loginType === 'sms' && /^\+91/.test(phoneOrEmail)">
            <b-icon
              type="is-vfa"
              icon="check"></b-icon>
              {{$t('auth.indiaAuth')}} <a href="http://www.nccptrai.gov.in/nccpregistry/" target="_blank">{{$t('auth.whiteList')}}</a>
            <!-- Did you enter your number correctly? -->
          </li>
          <li v-if="seconds > 25">
            <a @click="retry" class="button is-vfa is-inverted is-small">
              {{$t('auth.tryAgain')}}
              <!-- Try again -->
            </a>
          </li>
          <li v-if="seconds <= 25">
            <a @click="retry" class="button is-vfa is-inverted is-small" disabled>
              {{$t('auth.tryAgain')}}<span class="tag is-help">0:{{ 25 - parseInt(seconds) | two_digits }}</span>
            </a>
          </li>
          <li v-if="seconds > 25">
              <i18n tag="h3" class="title is-7" path="auth.trouble">
                <a click="anonymousStart">{{$t('auth.recommendation')}}</a>
              </i18n>
            <!-- Did you enter your number correctly? -->
          </li>
        </ul>
      </p>
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
      <auth-phone-email-input
        v-if="!isStudentSite"
        ref="phoneOrEmail"
        key="phoneOrEmail"
        fieldName="phoneOrEmail"
        v-model="phoneOrEmail"
        :v="$v.phoneOrEmail"
        @pressEnter="startAuth"
        :loading="authState === 'loading'"
        @delayTouch="delayTouch"></auth-phone-email-input>
      <div v-if="!isStudentSite" class="buttons is-right is-marginless">
        <button @click.prevent="startAuth" :class="['button', 'is-large', 'is-danger', {'is-loading': authState === 'loading'}]">{{ $t('homepage.start') }}</button>
      </div>
      <div class="buttons is-right" v-if="isStudentSite">
        <button @click.prevent="anonymousStart" :class="['button', 'is-large', 'is-danger']">{{ $t('homepage.start') }}</button>
      </div>
      <div class="buttons is-right" v-if="!isStudentSite">
        <button @click.prevent="anonymousStart" class="button is-text has-text-black is-paddingless" exact ><span>{{ $t('homepage.anonymous') }}</span></button>
        <button @click.prevent="toggleInfo" class="button is-transparent is-small">
          <span>
            <b-icon
              type="is-info"
              icon="info-circle"></b-icon>
          </span>
        </button>
      </div>
      <b-message v-if="toolTipContent" type="is-info" has-icon :active.sync="toolTipOpen">
        <p v-html="toolTipContent"></p>
      </b-message>
    </div>
  </div>
</template>

<script>
import AuthPhoneEmailInput from '~/components/AuthPhoneEmailInput'
import AuthCodeInput from '~/components/AuthCodeInput'
import snarkdown from 'snarkdown'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
const touchMap = new WeakMap()

export default {
  name: 'UserLogin',
  components: {
    AuthPhoneEmailInput,
    AuthCodeInput
  },
  data () {
    return {
      phoneOrEmail: '',
      code: '',
      toolTipOpen: false,
      isInfoOpen: true,
      authenticating: false,
      didYouKnow: [
        this.$t('auth.trivia1'),
        this.$t('auth.trivia2'),
        this.$t('auth.trivia3')
      ],
      now: 0,
      date: 0,
      loginType: null
      // now: Math.trunc((new Date()).getTime() / 1000),
      // date: Math.trunc((new Date()).getTime() / 1000)
    }
  },
  computed: {
    isStudentSite () { return this.$store.state.isStudentSite },
    toolTipContent () { return this.$te(`request.phoneOrEmail.tooltip`) ? snarkdown(this.$t(`request.phoneOrEmail.tooltip`)) : null },
    isAuthenticated: function () { return this.$store.getters['userauth/isAuthenticated'] },
    user () { return this.$store.state.userauth.user },
    requests () { return this.$store.state.requests.requests },
    name () { return this.user && this.user.firstName ? this.user.firstName : this.requests && this.requests[0] && this.requests[0].firstName ? this.requests[0].firstName : this.$t('auth.voter') },
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
    retry () {
      this.updateAuthState('loggedOut')
      this.loginType = null
    },
    toggleInfo () {
      this.toolTipOpen = !this.toolTipOpen
    },
    anonymousStart: function () {
      this.$toast.open({
        message: this.$t('auth.anonymousStartMessage'),
        type: 'is-success',
        duration: 8000
      })
      this.$router.push(this.localePath({ name: 'request-stage', params: { stage: 'your-information' } }))
    },
    startAuth: function () {
      this.authenticating = true
      this.$v.phoneOrEmail.$touch()
      if (this.$v.phoneOrEmail.$error) {
        this.$refs.phoneOrEmail.$refs.phoneOrEmail.focus()
        return
      }
      if (this.isValidNumber(this.phoneOrEmail)) {
        this.loginType = 'phone'
        this.updateUser({mobileIntFormat: this.phoneOrEmail})
        this.sendSmsCode()
          .then(() => { this.authenticating = false })
      }
      if (this.isValidEmail(this.phoneOrEmail)) {
        this.loginType = 'email'
        this.updateUser({emailAddress: this.phoneOrEmail})
        this.sendEmailLink()
          .then(() => { this.authenticating = false })
      }
      // setTimeout(() => {
      //   this.authenticating = false
      // }, 5000)
    },
    confirmCode () {
      this.$v.code.$touch()
      if (this.$v.code.$error) {
        this.$refs.codeInput.$el.querySelector('input').focus()
      } else if (this.$store.state.userauth.user.emailAddress) {
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
  watch: {
    authState (val, oldVal) {
      if (val !== oldVal) {
        this.resetDate()
      }
    }
  },
  validations: {
    code: {
      required,
      minLength,
      maxLength
    },
    phoneOrEmail: {
      required,
      validPhoneOrEmail () {
        return !this.phoneOrEmail ? false : this.isValidNumber(this.phoneOrEmail) || this.isValidEmail(this.phoneOrEmail)
      }
      // validPhone () {
      //   return !this.phoneOrEmail ? false : this.isValidNumber(this.phoneOrEmail)
      // },
      // validEmail () {
      //   return !this.phoneOrEmail ? false : this.isValidEmail(this.phoneOrEmail)
      // }
    }
  }

}
</script>

<style>

</style>
