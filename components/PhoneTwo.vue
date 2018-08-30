<template>
  <div class="field">
    <b-field>
      <b-input v-model="storeTel"></b-input>
    </b-field>
    <!-- <label v-if="label" :for="this.$vnode.key" class="label">{{ label }}<span v-if="toolTipTitle" @click="toolTipOpen = !toolTipOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span><transition name="fade"><span v-if="!val && !$v.$error && label" class="required"> {{required || required === '' ? 'Required' : 'Optional'}}</span></transition></label> -->
    <div class="field has-addons">
      <a @click.native="focusInput"
        v-if="mustBeEmail"
        :class="['button', 'is-static', 'control', {'shrink': !mustBeEmail}]">
        <b-icon
          pack="fas"
          icon="at">
        </b-icon>
      </a>
      <a :class="['button', 'control', 'is-outlined', 'is-inverted', 'is-paddingless', {'shrink': countryFocused}]"
        @click="focusCountry"
        v-else
        style="padding-left:0px;">
        <span class="flag-container fa-stack">
          <i :class="`fa-stack-2x flag-icon flag-icon-${country.toLowerCase()}`"></i>
          <i class="fas fa-sort-down fa-stack-1x has-text-grey breathe" style="transform:translateY(0.7rem)"></i>
        </span>
        <!-- <span style="transform:translateX(6px);"><i class="fas fa-angle-down"></i></span> -->
      </a>
      <b-autocomplete
        :open-on-focus=true
        keep-first
        id="country"
        title="... type to find your country."
        aria-label="type to find your country"
        placeholder="Country"
        v-if="!mustBeEmail"
        :data="filteredCountries"
        :field="'name' || null"
        v-model="countrySearch"
        ref="country"
        :disabled="mustBeEmail"
        :icon="` flag-icon flag-icon-${country.toLowerCase()}`"
        @focus="$event.target.setSelectionRange(0,99999); countryFocused = true"
        @select="option => selectCountry(option)"
        :expanded="countryFocused"
        autocomplete="country-name"
        :class="['control', {'shrink': !countryFocused}]">
        <template slot="header">
          <label for="country" class="is-size-6 has-text-grey"> ... type to find your country.</label>
        </template>
        <template slot="empty">No results for {{countrySearch}}</template>
        <template slot-scope="props">
          <span :class="`flag-icon flag-icon-${props.option.code.toLowerCase()}`"></span>{{ props.option.name + getPhoneCode(props.option.code) }}
        </template>
      </b-autocomplete>
      <b-field :class="['control', {'is-expanded': !countryFocused}]">
        <b-input
          ref="input"
          :value="tel"
          @input.native="val => format(val)"
          type="text"
          @focus="countryFocused = false"></b-input>
      </b-field>
    </div>
  </div>
</template>

<script>
import { AsYouType, getPhoneCode } from 'libphonenumber-js'
const countrylist = require('~/assets/countries.json')

export default {
  props: ['value', 'accepts', 'label', 'toolTipTitle', 'required'],
  data () {
    return {
      selectedCountry: '',
      countrySearch: '',
      formatter: null,
      mustBeEmail: false,
      countryFocused: false,
      toolTipOpen: false
    }
  },
  computed: {
    storeTel: {
      get () { return this.$store.state.data.phone ? this.$store.getters['data/formattedNumber'](this.$store.state.data.phone, undefined) : '' },
      set (val) {
        this.$store.commit('data/updatePhone', val)
        this.$store.dispatch('data/getCountryIsoFromPhonePrefix', val)
      }
    },
    hasCountry () { return this.$store.getters['data/hasCountry']('HK') },
    tel: {
      get () { return this.value || '' },
      set (val) { this.$emit('input', val) }
    },
    country () {
      if (this.selectedCountry) return this.selectedCountry
      else if (this.formatter && this.formatter.country) return this.formatter.country
      else return 'UN'
      // return this.selectedCountry || this.formatter ? this.formatter.country : 'UN'
    },
    countries () { return countrylist },
    filteredCountries () {
      if (this.countries.filter((option) => this.countrySearch.toLowerCase() === option.name.toLowerCase()).length === 1) {
        return this.countries.filter((option) => this.countrySearch.toLowerCase() === option.name.toLowerCase()).concat(this.countries.filter((option) => this.countrySearch.toLowerCase() !== option.name.toLowerCase()))
      } else if (this.countrySearch && this.countrySearch.length > 0) {
        return this.countries.filter((option) => {
          return option.name
            .toString()
            .toLowerCase()
            .indexOf(this.countrySearch.toLowerCase()) >= 0 || option.code
            .toString()
            .toLowerCase()
            .indexOf(this.countrySearch.toLowerCase()) >= 0 || this.getPhoneCode(option.code).indexOf(this.countrySearch) > -1
        })
      } else if (this.userCountry) {
        return this.countries.filter(country => country.code === this.userCountry).concat(this.countries.filter(country => country.code !== this.userCountry))
      } else {
        return this.countries
      }
    }
  },
  methods: {
    format (e) {
      // console.log(e)
      if (!e.target || !e.target.value) {
        this.tel = null
        return
      }
      this.formatter.reset()
      this.formatter.input(e.target.value)
      let cursorPos = e.target.selectionEnd
      let inputVal = e.target.value
      let formattedVal = new AsYouType(this.country).input(inputVal)
      let built = ''
      for (let [i, ch] of formattedVal.split('').entries()) {
        if (/[0-9]/.test(ch)) {
          built = built + ch
        }
        if (built === inputVal.slice(0, cursorPos).replace(/[^0-9]/g, '')) {
          this.tel = formattedVal
          let newPos = i + 1
          e.target.setSelectionRange(newPos, newPos)
          setTimeout(() => {
            e.target.setSelectionRange(newPos, newPos)
          }, 5)
          if (this.formatter.country && this.formatter.country !== this.country) {
            this.selectedCountry = this.formatter.country
          }
          break
        }
      }
    },
    focusCountry () {
      this.countryFocused = true
      this.$refs.country.focus()
    },
    focusInput () {
      this.countryFocused = false
      this.$refs.input.focus()
    },
    getPhoneCode (iso) {
      try {
        return ` (+${getPhoneCode(iso.toUpperCase())})`
      } catch (e) {
        return ''
      }
    },
    selectCountry (option) {
      // console.log(option)
      // this.countrySearch = option.name
      if (option && option.code) {
        this.selectedCountry = option.code
        this.focusInput()
      }
    }
  },
  mounted () {
    this.formatter = new AsYouType(this.country)
    this.formatter.input(this.value)
  },
  watch: {
    value (val, oldVal) {
      if (val !== oldVal) {
        this.formatter.reset()
        this.tel = this.formatter.input(val)
      }
    },
    country (val, oldVal) {
      if ((!oldVal || val !== oldVal) && val !== 'UN') {
        this.formatter = new AsYouType(val)
        // console.log(val, `+${this.formatter.country_phone_code}`, this.value.charAt(0))
        if (this.value.includes(`+${this.formatter.country_phone_code}`) || this.value.charAt(0) !== '+') {
          this.tel = this.formatter.input(this.value)
        } else {
          this.tel = ''
        }
      }
    },
    formatter (val) {
      // console.log(val.country)
      if (val.country && val.country !== this.country) {
        this.selectedCountry = val.country
      }
    }
  }

}
</script>

<style>
.shrink {
  flex-grow: 0.001;
  width: 0px;
  opacity: 0;
}

.control {
  transition: all 0.4s;
}

.breathe {
  animation: breathe 1.4s ease-in-out alternate infinite;
}

@keyframes breathe {
  0% {
    transform: scale(.8) translateY(1.1rem);
  }
  100% {
    transform: scale(.8) translateY(0.8rem);
  }
}
</style>
