<template>
  <section class="container">
    <div>
      <h1 class="title">
        Vote from Abroad
      </h1>
      <h2 class="subtitle">
        Enter your email address or phone number to get a code start a secure session.
      </h2>
      <b-field class="is-grouped  is-grouped-multiline">
        <b-field class="control is-expanded" label="Email">
          <b-field class="is-expanded">
            <b-field class="is-expanded">
              <b-input
              expanded
              placeholder="e.g. somebody@gmail.com"
              v-model="email">
              </b-input>
            </b-field>
            <b-field class="control">
              <p>
                <span class="subtitle"> Or </span>
              </p>
            </b-field>
          </b-field>
        </b-field>
        <b-field class="is-expanded" label="Phone number">
          <b-field class="is-expanded">
            <b-field class="is-expanded">
              <p class="control" v-show="!showCountryAutocomplete">
                <span :class="`flag-icon flag-icon-${this.userCountry.toLowerCase()}`" @click="selectCountryAutocomplete()"></span>
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
                :icon="`icon flag-icon-${userCountry.toLowerCase()}`"
                icon-pack="flag"
                @blur="()=> showCountryAutocomplete = false"
                @keyup.enter.native="setPhoneFocus()"
                @select="option => select(option)">
                <template slot-scope="props">
                  <span :class="`flag-icon flag-icon-${props.option.code.toLowerCase()}`"></span>{{ props.option.name }} (+{{getPhoneCode(props.option.code)}})
                </template>
              </b-autocomplete>
              <b-input
                ref="phone"
                expanded
                placeholder="+852 9669 9279"
                v-model="phone"
                @input="formatPhone()">
              </b-input>
            </b-field>
            <b-field>
              <p class="control">
                <button class="button is-primary">Start</button>
              </p>
            </b-field>
          </b-field>
        </b-field>
      </b-field>
      <p>You have entered: {{validPhone}}</p>
    </div>
    <nuxt-link
      to="/hello">Hello
    </nuxt-link>
    {{ $t('home') }}
    <nuxt-link
      v-for="(locale, index) in $i18n.locales"
      v-if="locale.code !== $i18n.locale"
      :key="index"
      :exact="true"
      :to="switchLocalePath(locale.code)">{{ locale.name }}</nuxt-link>
  </section>
</template>

<script>
import Logo from '~/components/Logo.vue'
import ValidationCheck from '~/components/ValidationCheck.vue'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import axios from 'axios'
import debounce from 'lodash/debounce'
import { getPhoneCode, asYouType as AsYouType } from 'libphonenumber-js'
import { mapState } from 'vuex'

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
  async asyncData () {
    let { data } = await axios.get('//votefromabroad.netlify.com/api/countries/', {headers: {'Access-Control-Allow-Origin': '*'}})
    let countries = {countries: Object.keys(data).sort().map(x => ({name: data[x], code: x}))}
    return countries
  },
  data () {
    return {
      telOrEmail: null,
      tel: {
        phoneNumber: null,
        countryCode: null,
        nationalFormat: null
      },
      email: null,
      phone: null,
      phoneFormatted: null,
      ip: null,
      showCountryAutocomplete: false,
      location: '',
      selected: null,
      countries: []
    }
  },
  computed: {
    filteredDataObj () {
      if (this.userCountry) {
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
    ...mapState('userauth', [
      'session',
      'user'
    ]),
    ...mapState('requests', [
      'requests'
    ])
    // session () {
    //   if (this.$store.state.userauth.session.country) {
    //     return this.$store.state.userauth.session
    //   }
    //   return {city: null, country: 'US', ip: null, loc: null, region: null}
    // }
  },
  validations: {
    telOrEmail: {
      required,
      minLength: minLength(4),
      maxLength: maxLength(15)
      // async isPhoneNumber (value) {
      //   if (value === '') return true
      //   // const response = await fetch(`/api/unique/${value}`)
      //   const response = await twilio.get(value)
      //   console.log('tel', response.data.phone_number)
      //   // let internationalNumber = await response.data.phone_number
      //   return Boolean(response.data.phone_number)
      // }
      // async isValidEmail (value) {
      //   if (value === '') return true
      //   const response = await fetch(`/api/unique/${value}`)
      //   return Boolean(await response.json())
      // }
    }
  },
  methods: {
    getPhoneCode (code) {
      if (code === 'GS') {
        return '500'
      }
      return getPhoneCode(code)
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
    formatPhone () {
      const formatter = new AsYouType((this.userCountry) ? this.userCountry : this.session.country)
      let temp = formatter.input(this.phone)
      // const formatter = new AsYouType((this.location && this.location.country) ? this.location.country : '')
      this.phoneFormatted = temp
      this.phone = temp
      let tempCountry = formatter.country
      if (tempCountry) {
        this.userCountry = tempCountry
      }
      console.log(tempCountry)
      // return `${formatter.input(this.phone)} - country: ${formatter.country} - code: ${formatter.country_phone_code} - template: ${formatter.template}`
    }
  }
}
</script>

<style lang="sass">
$flag-icon-css-path: '../node_modules/flag-icon-css/flags'
@import '../node_modules/flag-icon-css/sass/flag-icon.scss'

.flag-icon
  width: 3em;
  height: 100%;
  line-height: inherit;
</style>
