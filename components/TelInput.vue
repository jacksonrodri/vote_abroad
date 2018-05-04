<template>
  <b-field
    :label="label"
    :message="message"
    :type="type"
    label-for="tel">
    <b-field :type="type">
      <p v-if="showFlag" class="control">
        <b-icon
          :icon="countryCode.toLowerCase()"
          class="flag-container"
          pack="flag-icon"
          style="cursor: pointer;"
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
          @select="option => select(option.code)">
        <template slot-scope="props">
          <span :class="`flag-icon flag-icon-${props.option.code.toLowerCase()}`"></span>{{ props.option.name }} (+{{getPhoneCode(props.option.code)}})
          <!-- <span :class="`flag-icon flag-icon-${props.option.code.toLowerCase()}`"></span>{{ props.option.label }} (+{{getPhoneCode(props.option.iso)}}) -->
        </template>
      </b-autocomplete>
      <b-input
        id="tel"
        ref="tel"
        v-model="typed"
        :size="size"
        :placeholder="$t('request.tel.placeholder', { example: phonePlaceholder})"
        autocomplete="mobile tel"
        expanded>
      </b-input>
    </b-field>
  </b-field>
</template>

<script>
import { getPhoneCode, getNumberType, parse, format, isValidNumber, asYouType as AsYouType } from 'libphonenumber-js'
import * as phoneExamples from 'libphonenumber-js/examples.mobile.json'

const countries = require('~/assets/countries.json')

export default {
  name: 'tel-input',
  props: {
    size: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: 'Your Phone Number'
    },
    message: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    value: {
      type: Object,
      default: () => ({rawInput: '', country: '', isValidPhone: '', intNumber: '', type: ''})
    }
  },
  mounted () {
    // this.phoneCountry = this.value.country || this.userCountry || 'US'
    this.typed = this.value.rawInput || this.$store.state.userauth.user.mobileIntFormat || ''
  },
  data () {
    return {
      data: [],
      // phoneCountry: '',
      showFlag: true,
      selected: null,
      typed: '',
      countrySearch: ''
    }
  },
  watch: {
    typed: function (newVal, oldVal) {
      if (!newVal) {
        this.$emit('input', {rawInput: null, country: null, isValidPhone: false, intNumber: null, type: null})
        return
      }
      let validPhone = false
      let intNumber = ''
      let cleanNumber = newVal
      const formatter = new AsYouType(this.countryCode)
      if (newVal.indexOf('001') === 0 || newVal.indexOf('011') === 0) {
        cleanNumber = `+${newVal.substr(3)}`
      } else if (newVal.indexOf('00') === 0 && newVal.length > 2) {
        cleanNumber = `+${newVal.substr(2)}`
      } else if (newVal.indexOf(formatter.country_phone_code) === 0) {
        cleanNumber = `+${newVal}`
      }
      this.typed = formatter.input(cleanNumber)
      // console.log('formatter', formatter)
      // console.log('type', getNumberType(parse(this.typed, this.phoneCountry)))
      // if (formatter.country) { this.phoneCountry = formatter.country }
      validPhone = isValidNumber(this.typed, formatter.country || this.phoneCountry.toUpperCase())
      if (validPhone) { intNumber = format(parse(this.typed, this.phoneCountry), 'E.164') }
      this.$emit('input', {rawInput: this.typed || null, country: formatter.country || this.phoneCountry, isValidPhone: validPhone, intNumber: intNumber || null, type: getNumberType(parse(this.typed, this.phoneCountry)) || this.value.type || null})
    },
    value: function (newVal, oldVal) {
      this.typed = newVal.rawInput
    }
  },
  computed: {
    phoneCountry: {
      get () {
        if (this.value && this.value.country && this.value.country.length === 2) {
          return this.value.country
        } else {
          return this.userCountry || 'US'
        }
      },
      // get () { return this.value && this.value.country ? this.value.country : this.userCountry || 'US' },
      set (val) {
        this.$emit('input', Object.assign({}, this.value, {country: val}))
        // this.$emit('input', { rawInput: this.value ? this.value.rawInput || null : null, country: val || null, isValidPhone: this.value.validPhone || null, intNumber: this.value.intNumber || null, type: this.value.type || null })
      }
    },
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
    codeFilteredCountries () {
      if (this.usOnly) {
        return this.countryList.filter(country => country.code === 'US')
      }
      if (this.phoneCountry.length === 2) {
        return this.countryList.filter(country => country.code.toLowerCase() === this.phoneCountry.toLowerCase())
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
      return `${format(phoneExamples[code], code, 'International')}`
    }
  },
  methods: {
    getPhoneCode (code) {
      // if (code === 'GS') {
      //   return '500'
      // }
      try {
        return getPhoneCode(code)
      } catch (error) {
        return ''
      }
    },
    select (option) {
      // console.log(option)
      this.phoneCountry = option
      // this.selected = option
      // this.phoneCountry = this.selected.code
      // if (this.selected) {
      this.focusField()
      // }
    },
    focusCountry () {
      this.showFlag = false
      this.$refs.country.focus()
    },
    focusField () {
      this.showFlag = true
      this.$refs.tel.focus()
    }
  }
}
</script>
