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
            keep-first
            open-on-focus
            :icon="' ' + 'flag-icon-' + countryCode.toLowerCase()"
            icon-pack="flag-icon"
            expanded
            :size="size"
            :data="filteredCountries"
            field="iso"
            @blur="focusField"
            @focus="$event.target.select()"
            @select="option => select(option)">
          <template slot-scope="props">
            <span :class="`flag-icon flag-icon-${props.option.iso.toLowerCase()}`"></span>{{ props.option.label }} (+{{getPhoneCode(props.option.iso)}})
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
    <p v-if="mailCheckedEmail" class="help is-danger">Did you mean <a @click="setEmail">{{ mailCheckedEmail }}</a>?</p>
  </section>
</template>

<script>
import countries from '~/assets/countryaddresses'
import { getPhoneCode, parse, format, isValidNumber, asYouType as AsYouType } from 'libphonenumber-js'
import * as phoneExamples from 'libphonenumber-js/examples.mobile.json'
import Mailcheck from 'mailcheck'

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
  mounted () {
    this.phoneCountry = this.value.country || this.userCountry || 'US'
    this.typed = this.value.typed || ''
  },
  data () {
    return {
      data: [],
      phoneCountry: '',
      showFlag: true,
      selected: null,
      typed: '',
      mailCheckedEmail: undefined
    }
  },
  watch: {
    typed: function (newVal, oldVal) {
      this.mailCheckedEmail = undefined
      let validEmail = false
      let validPhone = false
      let intNumber = ''
      let cleanNumber = ''
      const formatter = new AsYouType(this.countryCode)
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
        validPhone = isValidNumber(this.typed, this.phoneCountry)
        if (validPhone) { intNumber = format(parse(this.typed, this.phoneCountry), 'E.164') }
      }
      this.$emit('input', {typed: this.typed, country: this.phoneCountry, isValidEmail: validEmail, isValidPhone: validPhone, intNumber: intNumber})
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
      return countries()
    },
    filteredCountries () {
      if (this.phoneCountry && this.phoneCountry.length > 1) {
        return this.countryList.filter((option) => {
          return option.label
            .toString()
            .toLowerCase()
            .indexOf(this.phoneCountry.toLowerCase()) >= 0 || option.iso
            .toString()
            .toLowerCase()
            .indexOf(this.phoneCountry.toLowerCase()) >= 0
        })
      } else {
        return this.countryList
      }
    },
    codeFilteredCountries () {
      if (this.usOnly) {
        return this.countryList.filter(country => country.iso === 'US')
      }
      if (this.phoneCountry.length === 2) {
        return this.countryList.filter(country => country.iso.toLowerCase() === this.phoneCountry.toLowerCase())
      } else {
        return this.filteredCountries
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
      return `e.g. ${format(phoneExamples[code], code, 'International')} -or- somebody@email.com`
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

<style lang="sass">
$flag-icon-css-path: '../node_modules/flag-icon-css/flags'
@import '../node_modules/flag-icon-css/sass/flag-icon.scss'

.flag-icon
  width: 3rem;
  height: 100%;
  line-height: inherit;

.flag-icon.fa-3x
  width: 4.3rem;

.flag-container
  height: 2.2rem
  width: 3rem

.flag-container.is-large
  height: 3.4rem;
  width: 4.3rem;
</style>
