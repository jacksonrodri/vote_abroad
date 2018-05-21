<template>
  <!-- Hero content: will be in the middle -->
  <div class="hero-body">
    <div class="container is-light has-text-left">
      <div class="columns is-centered is-light">
        <div class="column is-three-quarters">
          <section class="section">
            <h1 class="title">
              Vote from Abroad
            </h1>
            <h1 class="title">
              Register to vote now!
            </h1>
          </section>
          <section class="section">
            <h2 class="subtitle">
              Enter your email address or mobile phone number to start.
            </h2>
            <h2 class="subtitle is-6">We'll send you a code to start a secure session</h2>
            <b-field class="is-grouped is-grouped-multiline">
              <b-field class="control is-expanded" label="Email" label-for="email">
                <b-field class="is-expanded">
                  <b-field class="is-expanded">
                    <b-input
                    id="email"
                    expanded
                    size="is-medium"
                    placeholder="e.g. somebody@gmail.com"
                    v-model="email">
                    </b-input>
                  </b-field>
                </b-field>
              </b-field>
              <b-field class="is-expanded" label="Phone number" label-for="phone">
                <b-field class="is-expanded">
                  <b-field class="is-expanded">
                    <p class="control" v-show="!showCountryAutocomplete">
                      <span :class="`flag-icon flag-icon-${this.userCountry ? this.userCountry.toLowerCase() : 'un'}`" @click="selectCountryAutocomplete()"></span>
                    </p>
                    <b-autocomplete
                      v-show="showCountryAutocomplete"
                      ref="countryAutocomplete"
                      class="autocountry"
                      v-model="userCountry"
                      placeholder="Country"
                      :keep-first="true"
                      :data="filteredDataObj"
                      field="code"
                      max-results=10
                      size="is-medium"
                      :icon="`icon flag-icon-${userCountry ? userCountry.toLowerCase() : 'un'}`"
                      icon-pack="flag"
                      @blur="()=> showCountryAutocomplete = false"
                      @keyup.enter.native="setPhoneFocus()"
                      @select="option => select(option)">
                      <template slot-scope="props">
                        <span :class="`flag-icon flag-icon-${props.option.code.toLowerCase()}`"></span>{{ props.option.name }} (+{{getPhoneCode(props.option.code)}})
                      </template>
                    </b-autocomplete>
                    <b-input
                      id="phone"
                      ref="phone"
                      expanded
                      size="is-medium"
                      :placeholder="phonePlaceholder"
                      v-model="userPhone"
                      @input="updatePhoneCountry()">
                    </b-input>
                  </b-field>
                </b-field>
              </b-field>
            </b-field>
            <div class="level is-mobile">
              <div class="level-left">
                <div class="level-item has-text-left-touch is-hidden-desktop">
                  <div>
                    <p><button class="button is-large is-info" @click="authStart">Start</button></p>
                    <p>
                      <nuxt-link :to="localePath({ name: 'request-stage', params: {stage: 'your-information'} })" class="button is-text is-paddingless has-text-grey" exact >or start an anonymous session</nuxt-link>
                      <!-- <button class="button is-text is-paddingless has-text-grey">or start an anonymous session</button> -->
                    </p>
                  </div>
                </div>
              </div>
              <div class="level-right">
                <div class="level-item has-text-right is-hidden-touch">
                  <div>
                    <p><button class="button is-large is-info" @click="authStart">Start</button></p>
                    <p>
                      <nuxt-link :to="localePath({ name: 'request-stage', params: {stage: 'your-information'} })" class="button is-text is-paddingless has-text-grey" exact >or start an anonymous session</nuxt-link>
                      <!-- <button class="button is-text is-paddingless has-text-grey" @click="toasty">or start an anonymous session</button> -->
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue'
import ValidationCheck from '~/components/ValidationCheck.vue'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import axios from 'axios'
import debounce from 'lodash/debounce'
import /* webpackChunkName: "libphone" */ { format, parse, getPhoneCode, asYouType as AsYouType } from 'libphonenumber-js/custom'
import /* webpackChunkName: "libphone" */ * as phoneExamples from 'libphonenumber-js/examples.mobile.json'
import { mapState } from 'vuex'
import countryNames from '~/assets/countries.json'

let twilio = axios.create({
  baseURL: 'https://lookups.twilio.com/v1/PhoneNumbers/',
  auth: {
    username: 'AC042bca3094a405612de651f0ca005b30',
    password: '655958deb05d1db2f29554933ebef6b9'
  },
  validateStatus: function (status) {
    return status < 500 // Reject only if the status code is greater than or equal to 500
  }
})

const touchMap = new WeakMap()

export default {
  components: {
    Logo,
    ValidationCheck
  },
  data () {
    return {
      telOrEmail: null,
      tel: {
        phoneNumber: null,
        countryCode: null,
        nationalFormat: null
      },
      phone: null,
      phoneFormatted: null,
      ip: null,
      showCountryAutocomplete: false,
      location: '',
      selected: null
    }
  },
  computed: {
    countries () {
      return Object.keys(countryNames).sort().map(x => ({name: countryNames[x], code: x}))
    },
    filteredDataObj () {
      if (this.userCountry && this.userCountry.length > 1) {
        return this.countries.filter((option) => {
          return option.name
            .toString()
            .toLowerCase()
            .indexOf(this.userCountry.toLowerCase()) >= 0 || option.code
            .toString()
            .toLowerCase()
            .indexOf(this.userCountry.toLowerCase()) >= 0
        })
      } else {
        return this.countries
      }
    },
    validPhone () {
      const formatter = new AsYouType(this.userCountry || '')
      return `${formatter.input(this.phone)} - country: ${formatter.country} - code: ${formatter.country_phone_code} - template: ${formatter.template}`
    },
    userCountry: {
      get () {
        return this.$store.state.userauth.user.country
      },
      set (value) {
        this.$store.commit('userauth/updateUser', {country: value})
      }
    },
    email: {
      get () {
        return this.$store.state.userauth.user.emailAddress
      },
      set (value) {
        this.$store.commit('userauth/updateUser', {emailAddress: value})
      }
    },
    userPhone: {
      get () {
        const formatter = new AsYouType((this.userCountry) ? this.userCountry : this.session.country)
        return formatter.input(this.$store.state.userauth.user.mobilePhone)
      },
      set (value) {
        this.$store.commit('userauth/updateUser', {mobilePhone: value})
      }
    },
    phonePlaceholder () {
      return `e.g. ${format(phoneExamples[this.userCountry], this.userCountry, 'International')}`
    },
    ...mapState('userauth', [
      'session',
      'user'
    ]),
    ...mapState('requests', [
      'requests'
    ])
  },
  validations: {
    telOrEmail: {
      required,
      minLength: minLength(4),
      maxLength: maxLength(15)
    }
  },
  methods: {
    getPhoneCode (code) {
      if (code === 'GS') {
        return '500'
      }
      try {
        return getPhoneCode(code)
      } catch (error) {
        // console.error(error)
        return ''
      }
    },
    selectCountryAutocomplete () {
      this.showCountryAutocomplete = true
      this.$refs.countryAutocomplete.focus()
    },
    setPhoneFocus () {
      this.$refs.phone.focus()
    },
    select (option) {
      this.selected = option
    },
    delayTouch ($v) {
      $v.$reset()
      if (touchMap.has($v)) {
        clearTimeout(touchMap.get($v))
      }
      touchMap.set($v, setTimeout($v.$touch, 1000))
    },
    checkPhone: debounce(function () {
      twilio.get(`${this.telOrEmail}?CountryCode=HK`).then(res => console.log('received', res.status))
    }, 1000),
    updatePhoneCountry () {
      const formatter = new AsYouType((this.userCountry) ? this.userCountry : this.session.country)
      formatter.input(this.userPhone)
      if (formatter.country) {
        this.userCountry = formatter.country
      }
      let num = formatter.country ? parse(this.userPhone, formatter.country) : parse(this.userPhone)
      let intFormat = format(num, 'International_plaintext')
      // let domesticFormat = format(num, 'National')
      this.$store.commit('userauth/updateUser', {mobileIntFormat: intFormat})
      // console.log('int', intFormat, 'domestic', domesticFormat)
    },
    promptCode () {
      this.$store.dispatch('promptCode')
    },
    toasty () {
      this.$store.dispatch('toasty')
    },
    authStart () {
      this.$store.dispatch('userauth/authStart', '/request/your-information')
    }
  }
}
</script>
