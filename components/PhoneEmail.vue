<template>
  <div class="field">
    <b-field
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
            v-model="countrySearch"
            placeholder="Country"
            ref="country"
            open-on-focus
            :icon="' ' + 'flag-icon-' + countryCode.toLowerCase()"
            icon-pack="flag-icon"
            expanded
            keep-first
            :size="size"
            :data="filteredCountries"
            @blur="focusField"
            @focus="$event.target.select()"
            @select="option => {select(option); getPhonePlaceholder()}">
          <template slot-scope="props">
            <span :class="`flag-icon flag-icon-${props.option.code.toLowerCase()}`"></span>{{ props.option.name }} (+{{getPhoneCode(props.option.code)}})
          </template>
            <!-- autocomplete="country-name" -->
        </b-autocomplete>
        <b-input
          id="emailOrPhone"
          ref="emailOrPhone"
          v-model="typed"
          :size="size"
          @input="delayTouch($v.value)"
          @keyup.native.enter="$emit('pressEnter')"
          :placeholder="phonePlaceholder"
          expanded>
        </b-input>
      </b-field>
    </b-field>
    <p v-if="$v.$dirty && !$v.value.validEmailorPhone" class="help is-danger">Please enter a valid phone number or email address. <span v-if="mailCheckedEmail">Did you mean <a @click="setEmail">{{ mailCheckedEmail }}</a>?</span></p>
    <p v-else-if="mailCheckedEmail" class="help is-vfa">Did you mean <a @click="setEmail">{{ mailCheckedEmail }}</a>?</p>
  </div>
</template>

<script>
import /* webpackChunkName: "libphone" */ { getPhoneCode, parse, format, isValidNumber, asYouType as AsYouType } from 'libphonenumber-js/custom'
import { required } from 'vuelidate/lib/validators'
import Mailcheck from 'mailcheck'
const countries = require('~/assets/countries.json')
const md = async () => import(
  /* webpackChunkName: "libphone" */ 'libphonenumber-js/metadata.full.json'
)
let metadata = null
const phoneExamples = async () => import(
  /* webpackChunkName: "libphone" */ 'libphonenumber-js/examples.mobile.json'
)

const touchMap = new WeakMap()

export default {
  name: 'phone-email',
  props: {
    size: {
      type: String,
      default: ''
    },
    value: {
      type: Object,
      default: () => ({rawInput: '', country: '', isValidEmail: '', isValidPhone: '', intNumber: ''})
    }
  },
  async mounted () {
    this.phoneCountry = this.value.country || this.userCountry || 'US'
    this.typed = this.value.rawInput || ''
    this.phoneExamples = await phoneExamples()
    metadata = await md()
    this.getPhonePlaceholder()
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
      metadata: null,
      countrySearch: '',
      phonePlaceholder: `e.g. +1 201 555 0123 -or- somebody@email.com`
    }
  },
  watch: {
    typed: function (newVal, oldVal) {
      let validEmail = false
      let validPhone = false
      let intNumber = ''
      let cleanNumber = ''
      const formatter = new AsYouType(this.countryCode, metadata)
      let regex = RegExp('[^0-9 +]+')
      if (/@/.test(newVal)) {
        this.typed = newVal.replace(/[ ]/gi, '')
        if (/(^$|^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$)/.test(newVal)) {
          validEmail = true
        }
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
      this.$emit('input', {rawInput: this.typed, country: this.phoneCountry, isValidEmail: validEmail, isValidPhone: validPhone, intNumber: intNumber})
      this.$store.commit('userauth/updateUser', {emailAddress: validEmail ? this.typed : '', mobileIntFormat: intNumber})
    },
    value: function (newVal, oldVal) {
      this.typed = newVal.rawInput
      if (newVal && newVal.country && (!oldVal || oldVal.country !== newVal.country)) {
        this.getPhonePlaceholder()
      }
    },
    userCountry: function (newVal, oldVal) {
      if (!this.phoneCountry || this.phoneCountry === 'US') {
        this.phoneCountry = newVal
        this.getPhonePlaceholder()
      }
    }
  },
  computed: {
    userCountry () { return this.$store.state.userauth.user.country },
    countryList () {
      return countries.filter(({code: c}) => c !== 'AQ' && c !== 'BV' && c !== 'TF' && c !== 'HM' && c !== 'AN' && c !== 'PN' && c !== 'CS' && c !== 'UM' && c !== 'GS')
    },
    filteredCountries () {
      if (this.countrySearch && this.countrySearch.length > 0) {
        return this.countryList.filter((option) => {
          return option.name
            .toString()
            .toLowerCase()
            .indexOf(this.countrySearch.toLowerCase()) >= 0 || option.code
            .toString()
            .toLowerCase()
            .indexOf(this.countrySearch.toLowerCase()) >= 0
        })
      } else if (this.userCountry) {
        return this.countryList.filter(country => country.code === this.userCountry).concat(this.countryList)
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
    }
  },
  methods: {
    async getPhonePlaceholder () {
      let code = this.countryCode === 'un' ? 'US' : this.countryCode.toUpperCase()
      let pe = this.phoneExamples
      if (!metadata) {
        metadata = await md()
      }
      this.phonePlaceholder = `e.g. ${format(pe[code], code, 'International', metadata)} -or- somebody@email.com`
    },
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
        // console.log(error)
        return ''
      }
    },
    select (option) {
      if (option && option.code) {
        this.phoneCountry = option.code
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
      this.mailCheckedEmail = undefined
      let self = this
      Mailcheck.run({
        email: self.typed,
        suggested: function (suggestion) {
          self.mailCheckedEmail = suggestion.full
          // console.log('suggestion', suggestion, 'self.mailCheckedEmail', self)
        },
        empty: function () {
          self.mailCheckedEmail = ''
        }
      })
    },
    setEmail: function () {
      this.typed = this.mailCheckedEmail
      this.mailCheckedEmail = undefined
    },
    delayTouch ($v) {
      this.verifyEmail()
      $v.$reset()
      if (touchMap.has($v)) {
        clearTimeout(touchMap.get($v))
      }
      touchMap.set($v, setTimeout($v.$touch, 500))
    }
  },
  validations: {
    value: {
      required,
      validEmailorPhone: function (value, model) {
        return Boolean(value.isValidEmail || value.isValidPhone)
      }
    }
  }
}
</script>
