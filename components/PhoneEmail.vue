<template>
  <section>
    <b-field
      label="Type your email address or phone number to start a secure session."
      type="is-vfalight"
      label-for="emailOrPhone">
      <b-field>
        <p v-if="showFlag" class="control">
          <b-icon
            :icon="countryCode.toLowerCase()"
            class="flag-container"
            pack="flag-icon"
            :custom-class="'flag-icon-' + countryCode.toLowerCase()"
            :size="size"
            @click.native="focusCountry">
          </b-icon>
        </p>
        <b-autocomplete
            v-show="!showFlag"
            v-model="phoneCountry"
            placeholder="Country"
            ref="country"
            open-on-focus
            :icon="' ' + 'flag-icon-' + countryCode.toLowerCase()"
            icon-pack="flag-icon"
            expanded
            :size="size"
            :data="filteredCountries"
            field="code"
            @blur="focusField"
            @focus="$event.target.select()"
            @select="option => select(option)">
          <template slot-scope="props">
            <span :class="`flag-icon flag-icon-${props.option.code.toLowerCase()}`"></span>{{ props.option.name }} (+{{getPhoneCode(props.option.code)}})
          </template>
        </b-autocomplete>
        <b-input
          id="emailOrPhone"
          ref="emailOrPhone"
          v-model="typed"
          :size="size"
          @blur="verifyEmail"
          :placeholder="phonePlaceholder"
          expanded>
        </b-input>
      </b-field>
    </b-field>
    <p v-if="mailCheckedEmail" class="help is-vfa">Did you mean <a @click="setEmail">{{ mailCheckedEmail }}</a>?</p>
  </section>
</template>

<script>
import { getPhoneCode, parse, format, isValidNumber, asYouType as AsYouType } from 'libphonenumber-js/custom'
// import * as phoneExamples from 'libphonenumber-js/examples.mobile.json'
import Mailcheck from 'mailcheck'
const countries = require('~/assets/countries.json')
const md = () => import(
  /* webpackChunkName: "libphone" */ 'libphonenumber-js/metadata.min.json'
)
let metadata = null
const phoneExamples = async () => import(
  /* webpackChunkName: "libphone" */ 'libphonenumber-js/examples.mobile.json'
)

export default {
  name: 'phone-email',
  props: {
    size: {
      type: String,
      default: ''
    },
    value: {
      type: Object,
      default: () => ({typed: '', country: '', isValidEmail: '', isValidPhone: '', intNumber: ''})
    }
  },
  async mounted () {
    this.phoneCountry = this.value.country || this.userCountry || 'US'
    this.typed = this.value.typed || ''
    this.phoneExamples = await phoneExamples()
    metadata = await md()
    console.log(metadata)
  },
  data () {
    return {
      data: [],
      phoneCountry: '',
      showFlag: true,
      selected: null,
      typed: '',
      mailCheckedEmail: undefined,
      phoneExamples: {},
      metadata: null
    }
  },
  watch: {
    typed: function (newVal, oldVal) {
      this.mailCheckedEmail = undefined
      let validEmail = false
      let validPhone = false
      let intNumber = ''
      let cleanNumber = ''
      const formatter = new AsYouType(this.countryCode, metadata)
      let regex = RegExp('[^0-9 +]+')
      if (/@/.test(newVal)) {
        this.typed = newVal.replace(/[ ]/gi, '')
        validEmail = true
      } else if (!regex.test(newVal)) {
        cleanNumber = newVal
        if (newVal.indexOf('001') === 0 || newVal.indexOf('011') === 0) {
          cleanNumber = `+${newVal.substr(3)}`
        } else if (newVal.indexOf('00') === 0 && newVal.length > 2) {
          cleanNumber = `+${newVal.substr(2)}`
        } else if (newVal.indexOf(formatter.country_phone_code) === 0) {
          cleanNumber = `+${newVal}`
        }
        this.typed = formatter.input(cleanNumber)
        if (formatter.country) { this.phoneCountry = formatter.country }
        validPhone = isValidNumber(this.typed, this.phoneCountry, metadata)
        if (validPhone) { intNumber = format(parse(this.typed, this.phoneCountry, metadata), 'E.164', metadata) }
      }
      this.$emit('input', {typed: this.typed, country: this.phoneCountry, isValidEmail: validEmail, isValidPhone: validPhone, intNumber: intNumber})
      this.$store.commit('userauth/updateUser', {emailAddress: validEmail ? this.typed : '', mobileIntFormat: intNumber})
    },
    value: function (newVal, oldVal) {
      this.typed = newVal.typed
    },
    userCountry: function (newVal, oldVal) {
      if (!this.phoneCountry || this.phoneCountry === 'US') { this.phoneCountry = newVal }
    }
  },
  computed: {
    userCountry () { return this.$store.state.userauth.user.country },
    countryList () {
      return countries
    },
    filteredCountries () {
      if (this.phoneCountry && this.phoneCountry.length > 1) {
        return this.countryList.filter((option) => {
          return option.name
            .toString()
            .toLowerCase()
            .indexOf(this.phoneCountry.toLowerCase()) >= 0 || option.code
            .toString()
            .toLowerCase()
            .indexOf(this.phoneCountry.toLowerCase()) >= 0
        })
      } else {
        return this.countryList
      }
    },
    countryCode () {
      if (this.phoneCountry && this.phoneCountry.length === 2) {
        return this.phoneCountry
      } else {
        return 'US'
      }
    },
    phonePlaceholder () {
      let code = this.countryCode === 'un' ? 'US' : this.countryCode.toUpperCase()
      let pe = this.phoneExamples
      // let meta = await md()
      // console.log(metadata)
      if (!metadata) {
        return `e.g. +1 201 555 0123 -or- somebody@email.com`
      } else {
        return `e.g. ${format(pe[code], code, 'International', metadata)} -or- somebody@email.com`
      }
    }
  },
  methods: {
    getPhoneCode (code) {
      if (!metadata) {
        return ''
      }
      if (code === 'GS') {
        return '500'
      }
      try {
        return getPhoneCode(code, metadata)
      } catch (error) {
        console.log(error)
        return ''
      }
    },
    select (option) {
      this.selected = option
      if (this.selected) {
        this.focusField()
      }
    },
    focusCountry () {
      this.showFlag = false
      this.$refs.country.focus()
    },
    focusField () {
      this.showFlag = true
      this.$refs.emailOrPhone.focus()
    },
    verifyEmail: function () {
      if (this.value.isValidEmail) {
        let self = this
        Mailcheck.run({
          email: self.typed,
          suggested: function (suggestion) {
            self.mailCheckedEmail = suggestion.full
            self.value.isValidEmail = false
          },
          empty: function () {
            // nothing wrong with the email
          }
        })
      }
    },
    setEmail: function () {
      this.typed = this.mailCheckedEmail
      this.mailCheckedEmail = undefined
    }
  }
}
</script>
