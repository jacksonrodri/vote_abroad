<template>
  <section>
    <b-field
      label="Type your email address or phone number to start a secure session."
      message="hello world"
      type="is-vfalight"
      label-for="emailOrPhone">
      <b-field>
        <p v-if="showFlag" class="control">
          <b-icon
            :icon="countryCode.toLowerCase()"
            class="flag-container"
            pack="flag-icon"
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
            :icon="countryCode.toLowerCase()"
            icon-pack="flag-icon"
            expanded
            :size="size"
            :data="filteredCountries"
            field="iso"
            @blur="focusField"
            @input="updatePhoneCountry()"
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
          @blur="parseNumber"
          @input="$v.typed.$touch(); debounceParse"
          :placeholder="phonePlaceholder"
          expanded>
        </b-input>
      </b-field>
    </b-field>
  </section>
</template>

<script>
import countries from '~/assets/countryaddresses'
import { getPhoneCode, format, parse, asYouType as AsYouType } from 'libphonenumber-js'
import debounce from 'lodash/debounce'
import * as phoneExamples from 'libphonenumber-js/examples.mobile.json'
import { email } from 'vuelidate/lib/validators'

export default {
  name: 'phone-email',
  props: [
    'size',
    'userCountry',
    'value'
  ],
  mounted () {
    this.phoneCountry = this.userCountry
  },
  data () {
    return {
      data: [],
      phoneCountry: '',
      showFlag: true,
      selected: null,
      typed: '',
      email: '',
      phone: '',
      eorp: null
    }
  },
  watch: {
    typed: function (newVal, oldVal) {
      const formatter = new AsYouType(this.countryCode)
      let regex = RegExp('[^0-9 +]+')
      if (/@/.test(newVal)) {
        this.typed = newVal.replace(/[ ]/gi, '')
      } else if (!regex.test(newVal)) {
        let cleanNumber = newVal
        if (newVal.indexOf('001') === 0 || newVal.indexOf('011') === 0) {
          cleanNumber = `+${newVal.substr(3)}`
        } else if (newVal.indexOf('00') === 0 && newVal.length > 2) {
          cleanNumber = `+${newVal.substr(2)}`
        } else if (newVal.indexOf(formatter.country_phone_code) === 0) {
          cleanNumber = `+${newVal}`
        }
        this.typed = formatter.input(cleanNumber)
        this.phoneCountry = formatter.country
      }
    }
  },
  computed: {
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
        return 'un'
      }
    },
    phonePlaceholder () {
      let code = this.countryCode === 'un' ? 'US' : this.countryCode.toUpperCase()
      return `e.g. ${format(phoneExamples[code], code, 'International')} -or- somebody@email.com`
    }
  },
  methods: {
    parseNumber () {
      let parsed = this.countryCode.toLowerCase() === 'un' ? parse(this.typed) : parse(this.typed, {country: {default: this.countryCode}})
      if (this.typed.indexOf('@') === -1 && !(Object.keys(parsed).length === 0 && parsed.constructor === Object)) {
        this.phoneCountry = parsed.country
        this.phone = format(parsed, 'International_plaintext')
        this.typed = format(parsed, 'International')
        // this.email = null
      } else {
        this.email = this.typed
        // this.phone = null
      }
      this.updateInput()
    },
    debounceParse: debounce(function () {
      // if (this.typed.indexOf('@') === -1) { this.parseNumber() }
      this.parseNumber()
    }, 1500),
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
    select (option) {
      this.selected = option
      if (this.selected) {
        this.focusField()
      }
    },
    updatePhoneCountry () {
      this.$emit('input', {
        country: this.phoneCountry
      })
    },
    focusCountry () {
      this.showFlag = false
      this.$refs.country.focus()
    },
    focusField () {
      this.showFlag = true
      this.$refs.emailOrPhone.focus()
    },
    updateInput () {
      this.$emit('input', {
        phoneNumber: this.phone,
        email: this.email
      })
    }
  },
  validations: {
    typed: {
      email,
      phone (value) {
        let isEmptyObj = (Object.keys(parse(value)).length === 0 && parse(value).constructor === Object)
        return !(isEmptyObj)
      }
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
