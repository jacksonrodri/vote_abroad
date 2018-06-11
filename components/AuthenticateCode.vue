<template>
  <form action="">
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">Authentication</p>
      </header>
      <section class="modal-card-body">
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

        <b-field>
          <b-input ref="0" :value="ncode[0] || null" size="is-medium" placeholder="*" autocomplete="new-password" @focus="chooseFirst" @input="val => chooseFirst(0, val)"></b-input>
          <b-input ref="1" :value="ncode[1] || null" size="is-medium" placeholder="*" autocomplete="new-password" @focus="chooseFirst" @input="val => chooseFirst(1, val)"></b-input>
          <b-input ref="2" :value="ncode[2] || null" size="is-medium" placeholder="*" autocomplete="new-password" @focus="chooseFirst" @input="val => chooseFirst(2, val)"></b-input>
          <b-input ref="3" :value="ncode[3] || null" size="is-medium" placeholder="*" autocomplete="new-password" @focus="chooseFirst" @input="val => chooseFirst(3, val)"></b-input>
          <b-input ref="4" :value="ncode[4] || null" size="is-medium" placeholder="*" autocomplete="new-password" @focus="chooseFirst" @input="val => chooseFirst(4, val)"></b-input>
          <b-input ref="5" :value="ncode[5] || null" size="is-medium" placeholder="*" autocomplete="new-password" @focus="chooseFirst" @input="val => chooseFirst(5, val)"></b-input>
          <p class="control">
            <button class="button is-primary is-medium">
              <span class="icon is-small">
                <i class="fas fa-arrow-right"></i>
              </span>
            </button>
          </p>
        </b-field>

        <div class="field is-grouped is-grouped-centered">
          <p class="control">
            <a class="button is-vfa is-inverted is-small">
              Did not get the code?
            </a>
          </p>
        </div>
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
      ncode: []
    }
  },
  computed: {
    phoneOrEmail: {
      get () { return this.localPhoneorEmail || this.email || this.phone },
      set (val) {
        this.localPhoneorEmail = val
        this.$store.commit('userauth/updateUser', {emailAddress: val.isValidEmail ? val.rawInput : '', mobileIntFormat: val.intNumber})
      }
    }
  },
  methods: {
    chooseFirst: function (index, val) {
      if (val) {
        this.$set(this.ncode, index, val)
      }
      this.$refs[this.ncode.length].focus()
      console.log(this.ncode, this.ncode.length)
    }
  }
}
</script>
