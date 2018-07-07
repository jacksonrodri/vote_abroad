<template>
  <form v-on:submit.prevent>
    <div class="modal-card" style="width: auto">
        <figure class="image is-64x64 is-overlay" style="left:50%; transform: translate(-50%, 80%); z-index:41">
          <img src="/icon.png" :style="isLoading ? 'animation: spinAround 3000ms infinite linear;' : ''">
        </figure>
      <header class="modal-card-head">
        <!-- <p class="modal-card-title">Authentication</p> -->
      </header>
      <section class="modal-card-body">
        <section v-if="currently === 'enteringCode' || currently === 'retryingCode'" class="section">
          <div class="content"><span v-if="currently === 'retryingCode'">That code was incorrect. </span>{{ msg }}</div>
          <b-field>
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
                @pressEnter="confirmCode"
                required>
              </b-input>
                <!-- @pressEnter="$emit('confirmCode', code)" -->
            </b-field>
                <!-- minlength=6
                maxlength=6 -->
            <p class="control">
              <a @click="confirmCode" class="button is-primary is-medium">
                <!-- $emit('confirmCode', code) -->
                <span class="icon is-small">
                  <i class="fas fa-arrow-right"></i>
                </span>
              </a>
            </p>
          </b-field>

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
          <!-- <div class="field is-grouped is-grouped-centered">
            <p class="control">
              <a @click="currently = 'loading'" class="button is-vfa is-inverted is-small">
                Did not get the code?
              </a>
            </p>
          </div> -->
        </section>
        <section v-if="currently === 'retrying'" class="section">
          <div class="content" v-if="count < 3">{{ msg }}  -- Please enter a valid email or mobile phone (where you can receive an SMS) </div>
          <b-field>
            <phone-input ref="login"
              key="login"
              :accepts="['phone', 'email']"
              size="is-medium"

              @pressEnter="startAuth()"
              v-model="phoneOrEmail">
            </phone-input>
            <p class="control">
              <button @click="startAuth" class="button is-primary">
                <span class="icon is-small">
                  <i class="fas fa-arrow-right"></i>
                </span>
              </button>
            </p>
          </b-field>
          <div @click="currently = 'enteringCode'" class="field is-grouped is-grouped-centered">
            <p class="control">
              <a class="button is-vfa is-inverted is-small">
                Enter my code
              </a>
            </p>
          </div>
        </section>
        <section v-if="currently === 'loading'">
          <h3 class="title has-text-centered is-3">Authenticating...</h3>
          <button class="button is-loading is-white is-large is-fullwidth" >Loading...</button>
          <span class="help is-vfa"> {{ didYouKnow[Math.floor(Math.random() * Math.floor(didYouKnow.length))]}}</span>
        </section>

      </section>
      <footer class="modal-card-foot">
        <button class="button" type="button" @click.prevent="$parent.close()">Cancel</button>
        <button @click.prevent="() => {$parent.close(); $router.push('/request/your-information/')}" class="button">Proceed without an account.</button>
      </footer>
    </div>
  </form>
</template>

<script>
import PhoneInput from '~/components/PhoneInput'

export default {
  name: 'authentication-code',
  props: ['msg', 'email', 'phone'],
  components: { PhoneInput },
  watch: {
    currently (val) {
      if (/inActive|loggedIn|loggedOut/.test(val)) {
        this.$emit('close')
      }
    }
  },
  data () {
    return {
      localPhoneorEmail: null,
      code: null,
      // currently: 'enteringCode',
      count: 1,
      now: Math.trunc((new Date()).getTime() / 1000),
      date: Math.trunc((new Date()).getTime() / 1000),
      didYouKnow: [
        'Did you know around 9 million Americans live abroad?',
        'Request your ballot every calendar year to get full Federal Protection for all federal elections each year.',
        'Americans have been political abroad since Thomas Jefferson.  He wrote portions of xx while in Paris.'
      ]
    }
  },
  computed: {
    currently: {
      get () { return this.$store.state.userauth.authState },
      set (val) { this.$store.commit('userauth/updateAuthState', val) }
    },
    isLoading () { return /loading/.test(this.currently) },
    isActive: {
      get () { return /inActive|loggedIn|loggedOut/.test(this.$store.state.userauth.authState) },
      set (value) { this.$store.commit('userauth/updateAuthState', value) }
    },
    phoneOrEmail: {
      get () { return this.localPhoneorEmail || this.email || this.phone },
      set (val) {
        this.localPhoneorEmail = val
        this.$store.commit('userauth/updateUser', {emailAddress: val.isValidEmail ? val.rawInput : '', mobileIntFormat: val.intNumber})
      }
    },
    seconds () {
      return (this.now - this.date)
    }
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
    confirmCode () {
      if (this.$store.state.userauth.user.emailAddress) {
        this.$store.dispatch('userauth/loginEmailVerify', this.code)
      } else if (this.$store.state.userauth.user.mobileIntFormat) {
        this.$store.dispatch('userauth/loginSmsVerify', this.code)
      }
    },
    resetDate () {
      this.date = Math.trunc((new Date()).getTime() / 1000)
    }
  },
  mounted () {
    this.resetDate()
    if (process.browser) {
      window.setInterval(() => {
        this.now = Math.trunc((new Date()).getTime() / 1000)
      }, 1000)
    }
  }
}
</script>
