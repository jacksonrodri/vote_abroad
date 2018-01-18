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
            @click.native="$refs.country.focus()">
          </b-icon>
        </p>
        <b-autocomplete
            v-if="!showFlag"
            v-model="phoneCountry"
            placeholder="Country"
            ref="country"
            :disabled="usOnly"
            keep-first
            expanded
            :data="filteredCountries"
            field="label"
            @input="updateAddress()"
            @focus="$event.target.select()"
            @select="option => {selected = option; if (selected) {intlAddr['country-code'] = option.iso}}">
          <template slot-scope="props">
            <span :class="`flag-icon flag-icon-${props.option.iso.toLowerCase()}`"></span>{{ props.option.label }} (+{{getPhoneCode(props.option.iso)}})
          </template>
        </b-autocomplete>
        <b-input
          id="emailOrPhone"
          placeholder="e.g. somebody@gmail.com -- or -- +852 9669 9279"
          expanded>
        </b-input>
      </b-field>
    </b-field>
  </section>
</template>

<script>
import countries from '~/assets/countryaddresses'
import { getPhoneCode } from 'libphonenumber-js'
// format, parse, , asYouType as AsYouType

export default {
  name: 'phone-email',
  data () {
    return {
      data: [],
      intlAddr: {
        'post-office-box': '',
        'extended-address': '',
        'street-address': '',
        'locality': '',
        'region': '',
        'postal-code': '',
        'country-name': '',
        'country-code': ''
      },
      phoneCountry: '',
      showFlag: true
    }
  },
  computed: {
    countryList () {
      return countries()
    },
    filteredCountries () {
      if (this.intlAddr['country-name'] && this.intlAddr['country-name'].length > 1) {
        return this.countryList.filter((option) => {
          return option.label
            .toString()
            .toLowerCase()
            .indexOf(this.intlAddr['country-name'].toLowerCase()) >= 0 || option.iso
            .toString()
            .toLowerCase()
            .indexOf(this.intlAddr['country-name'].toLowerCase()) >= 0
        })
      } else {
        return this.countryList
      }
    },
    codeFilteredCountries () {
      if (this.usOnly) {
        return this.countryList.filter(country => country.iso === 'US')
      }
      if (this.intlAddr['country-code'].length === 2) {
        return this.countryList.filter(country => country.iso.toLowerCase() === this.intlAddr['country-code'].toLowerCase())
      } else {
        return this.filteredCountries
      }
    },
    countryCode () {
      // let country = this.countryList.filter(x => x.label === this.intlAddr['country-name'])[0] || {iso: 'un'}
      // return country.iso
      return this.intlAddr['country-code'] || 'un'
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
    updateAddress () {
      this.$emit('input', {
        poBox: this.intlAddr['post-office-box'],
        premise: this.intlAddr['extended-address'],
        thoroughfare: this.intlAddr['street-address'],
        locality: this.intlAddr['locality'],
        administrativearea: this.intlAddr['region'],
        postalcode: this.intlAddr['postal-code'],
        country: this.intlAddr['country-name'],
        countryiso: this.countryCode !== 'un' && this.countryCode ? this.countryCode : ''
      })
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

// .icon
//   height: 2.2rem
//   width: 3rem

.flag-container
  height: 2.2rem
  width: 3rem
// .flag-container
//   width: 3em;

// .flag-container > span
//   width: 100%;
//   height: 100%;
</style>
