<template>
  <form action="">
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">Authentication</p>
      </header>
      <section class="modal-card-body">
        <section v-if="currently === 'enteringCode'" class="section">
          <div class="content">{{ msg }}</div>
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
                :value="code"
                required>
              </b-input>
            </b-field>
                <!-- minlength=6
                maxlength=6 -->
            <p class="control">
              <button class="button is-primary is-medium">
                <span class="icon is-small">
                  <i class="fas fa-arrow-right"></i>
                </span>
              </button>
            </p>
          </b-field>
          <div class="block">
              <p class="digit">{{ seconds }}</p>
              <p class="text">Seconds</p>
          </div>

          <div class="field is-grouped is-grouped-centered">
            <p class="control">
              <a @click="currently = 'retrying'" class="button is-vfa is-inverted is-small">
                Did not get the code?
              </a>
            </p>
          </div>
        </section>
        <section v-if="currently === 'retrying'" class="section">
          <div class="content" v-if="count < 3">{{ msg }}</div>
          <b-field>
            <phone-input ref="login"
              key="login"
              :accepts="['phone', 'email']"
              size="is-medium"

              @pressEnter="startAuth()"
              v-model="phoneOrEmail">
            </phone-input>
            <p class="control">
              <button class="button is-primary">
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

      </section>
      <footer class="modal-card-foot">
        <button class="button" type="button" @click="$parent.close()">Cancel</button>
        <button class="button">Proceed without an account.</button>
      </footer>
    </div>
  </form>
</template>

<script>
import PhoneInput from '~/components/PhoneInput'

export default {
  name: 'authentication-code',
  props: ['code', 'msg', 'email', 'phone', 'startAuth'],
  components: { PhoneInput },
  data () {
    return {
      localPhoneorEmail: null,
      ncode: [],
      currently: 'enteringCode',
      count: 1,
      now: Math.trunc((new Date()).getTime() / 1000),
      date: Math.trunc((new Date()).getTime() / 1000)
    }
  },
  computed: {
    phoneOrEmail: {
      get () { return this.localPhoneorEmail || this.email || this.phone },
      set (val) {
        this.localPhoneorEmail = val
        this.$store.commit('userauth/updateUser', {emailAddress: val.isValidEmail ? val.rawInput : '', mobileIntFormat: val.intNumber})
      }
    },
    seconds () {
      return (this.date - this.now) % 60
    }
  },
  mounted () {
    this.date = Math.trunc((new Date()).getTime() / 1000)
    if (process.browser) {
      window.setInterval(() => {
        this.now = Math.trunc((new Date()).getTime() / 1000)
      }, 1000)
    }
  }
}
</script>
