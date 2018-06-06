<template>
<div class="field">
  <label v-if="label" :for="this.$vnode.key" class="label">{{ label }}<span v-if="toolTipTitle" @click="toolTipOpen = !toolTipOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span><transition name="fade"><span v-if="!val && !$v.$error && label" class="required"> {{required || required === '' ? 'Required' : 'Optional'}}</span></transition></label>
  <div class="field has-addons">
    <a @click.native="focusInput"
      v-if="mustBeEmail"
      :class="['button', 'is-static', 'control', {'shrink': !mustBeEmail}]">
      <b-icon
        icon="at">
      </b-icon>
    </a>
    <a :class="['button', 'control', 'is-outlined', 'is-inverted', 'is-paddingless', {'shrink': countryFocused}]"
      @click="focusCountry"
      v-if="!mustBeEmail"
      style="padding-left:0px;">
      <span class="flag-container fa-stack">
        <i :class="`fa-stack-2x flag-icon flag-icon-${userCountry ? userCountry.toLowerCase() : 'un'}`"></i>
        <i class="fas fa-sort-down fa-stack-1x has-text-grey breathe" style="transform:translateY(0.7rem)"></i>
      </span>
      <!-- <span style="transform:translateX(6px);"><i class="fas fa-angle-down"></i></span> -->
    </a>
    <b-autocomplete
      :open-on-focus=true
      keep-first
      v-if="!accepts.includes('email') || !isEmail"
      :data="filteredCountries"
      v-model="countrySearch"
      ref="country"
      :disabled="mustBeEmail"
      autocomplete="country-name"
      :icon="` flag-icon flag-icon-${userCountry ? userCountry.toLowerCase() : 'un'}`"
      @focus="countryFocused = true"
      @blur="countryFocused = false"
      @select="option => { country = option.code; focusInput() }"
      :expanded="countryFocused"
      :class="['control', {'shrink': !countryFocused}]">
      <template slot-scope="props">
        <span :class="`flag-icon flag-icon-${props.option.code.toLowerCase()}`"></span>{{ props.option.name + getPhoneCode(props.option.code) }}
      </template>
    </b-autocomplete>
    <!-- <b-input
      :value="value.rawInput || null"
      :class="['control', {'is-expanded': !countryFocused}]"
      ref="phone"
      @focus="setPlaceholder"
      type="text"
      @input="val => formatInput(val)"
      :placeholder="placeholder"></b-input> -->
      <b-field
        :type="$v.$error ? 'is-danger' : ''"
        :class="['control', {'is-expanded': !countryFocused}]">
        <b-input
          :value="val"
          :id="this.$vnode.key"
          ref="input"
          :maxlength="mustBeEmail && label && !(($v.$dirty && !$v.value.validEmailorPhone) || (mailCheckedEmail && mailCheckedEmail !== val.toLowerCase()))? 55 : ''"
          :autocomplete="autocomplete"
          @focus="setPlaceholder"
          @input.native="formatInput($event.target.value)"
          :placeholder="placeholder"></b-input>
      </b-field>
  </div>
  <p v-if="$v.$dirty && !$v.value.validEmailorPhone" class="help is-danger">Please enter a valid phone number or email address. <span v-if="mailCheckedEmail && mailCheckedEmail !== val.toLowerCase()">Did you mean <a @click="setEmail"><span class="has-text-primary">{{ mailCheckedEmail }}</span></a>?</span></p>
  <p v-else-if="mailCheckedEmail && mailCheckedEmail !== val.toLowerCase()" class="help is-vfa">Did you mean <a @click="setEmail"><span class="has-text-primary">{{ mailCheckedEmail }}</span></a>?</p>
  <b-message v-if="toolTipTitle" :title="toolTipTitle" type="is-info" has-icon :active.sync="toolTipOpen">
    <slot name="tooltip"></slot>
  </b-message>
</div>
</template>

<script>
import { format, parse, isValidNumber, getPhoneCode, asYouType as AsYouType } from 'libphonenumber-js/custom'
// getPhoneCode, parse, , isValidNumber, asYouType as AsYouType
import { requiredIf } from 'vuelidate/lib/validators'
import Mailcheck from 'mailcheck'
const countrylist = require('~/assets/countries.json')
let metadata, phoneExamples

const touchMap = new WeakMap()

export default {
  name: 'phone-input',
  props: ['value', 'accepts', 'label', 'toolTipTitle', 'required'],
  data () {
    return {
      country: '',
      countryFocused: false,
      countryCode: 'HK',
      countrySearch: '',
      exampleNumber: '',
      metadataLoaded: false,
      typed: '',
      mailCheckedEmail: undefined,
      vEmail: {},
      isEmail: false,
      maxPhoneLength: 16,
      maxEmailLength: 40,
      toolTipOpen: false
    }
  },
  computed: {
    countries () { return countrylist },
    val () {
      if (this.value && typeof this.value === 'string') {
        return this.value || ''
      } else if (this.value && typeof this.value === 'object' && this.value.rawInput) {
        return this.value.rawInput || ''
      } else {
        return ''
      }
    },
    userCountry () { return this.country.toUpperCase() || this.$store.state.userauth.user.country.toUpperCase() || null },
    filteredCountries () {
      if (this.countrySearch && this.countrySearch.length > 0) {
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
        return this.countries.filter(country => country.code === this.userCountry).concat(this.countries)
      } else {
        return this.countries
      }
    },
    mustBeEmail () { return !this.accepts.includes('phone') || (this.accepts.includes('email') && this.isEmail) },
    deviceType () { return this.$store.state.userauth.device.type },
    autocomplete () {
      return 'home email'
      // if (this.$vnode.key === 'fax') {
      //   return 'fax tel'
      // } else if (!(this.accepts.includes('phone')) || (this.deviceType === 'desktop' && this.accepts.includes('email'))) {
      //   return 'home email'
      // } else {
      //   return 'mobile tel'
      // }
    },
    type () {
      return 'email'
      // if (!this.accepts.includes('phone') || (this.deviceType === 'desktop' && this.accepts.includes('email'))) {
      //   return 'email'
      // } else {
      //   return 'tel'
      // }
    },
    placeholder () {
      if (this.accepts.includes('email') && !this.accepts.includes('phone')) { // email only placeholder
        return 'e.g. somebody@email.com'
      } else if (!this.accepts.includes('email') && this.accepts.includes('phone')) { // phone only placeholder
        return `e.g. ${this.exampleNumber || '+1 205 555 0123'}`
      } else { // phone or email default
        return `e.g. ${this.exampleNumber || '+1 205 555 0123'} or somebody@email.com`
      }
    }
  },
  methods: {
    focusCountry () {
      // if (this.metadataLoaded) {
      this.setPlaceholder()
      // }
      this.countryFocused = true
      this.$refs.country.focus()
    },
    focusInput () {
      this.countryFocused = false
      this.$refs.input.focus()
    },
    setPlaceholder () {
      if (this.metadataLoaded) {
        this.exampleNumber = format(phoneExamples[this.userCountry], this.userCountry, 'International', metadata)
      } else if (!this.mustBeEmail) {
        this.loadMetadataAndCall(this.setPlaceholder)
      } else {
        this.exampleNumber = ''
      }
    },
    getPhoneCode (iso) {
      try {
        return ` (+${getPhoneCode(iso.toUpperCase(), metadata)})`
      } catch (e) {
        // console.log(error)
        return ''
      }
    },
    async loadMetadataAndCall (passedFunction) {
      [metadata, phoneExamples] =
        await Promise.all([
          import(/* webpackChunkName: "libphone" */ 'libphonenumber-js/metadata.full.json'),
          import(/* webpackChunkName: "libphone" */ 'libphonenumber-js/examples.mobile.json')
        ])
      this.metadataLoaded = true
      passedFunction()
    },
    showChange (val) {
      console.log('showChange', val)
    },
    formatInput (val) {
      this.mailCheckedEmail = undefined
      let validEmail = false
      let validPhone = false
      this.isEmail = false
      console.log(val)
      // val = val.target.value
      if (!val || val.length === 0) {
        !this.accepts.includes('phone')
          ? this.$emit('input', null)
          : this.$emit('input', {rawInput: '', country: this.userCountry, isValidEmail: false, isValidPhone: false, intNumber: null})
      } else {
        let typed = val.data || val || this.value.rawInput || ''
        let intNumber = ''
        let cleanNumber = ''
        this.delayTouch(this.$v.value)
        let regex = RegExp('[^0-9 +]+')
        // if (!this.accepts.includes('email') && typed) {
        //   console.log('onlyPhone', 'typed', typed)
        //   // typed = typed.replace(/[^0-9 +-.]/gi, '')
        //   console.log(typed)
        // }
        console.log('regex.test', typed.replace(regex, ''))
        if (!this.accepts.includes('email') || (metadata && !regex.test(typed))) {
          const formatter = new AsYouType(this.userCountry, metadata)
          cleanNumber = typed
          if (cleanNumber.indexOf('001') === 0 || cleanNumber.indexOf('011') === 0) {
            cleanNumber = `+${cleanNumber.substr(3)}`
          } else if (cleanNumber.indexOf('00') === 0 && cleanNumber.length > 2) {
            cleanNumber = `+${cleanNumber.substr(2)}`
          } else if (cleanNumber.indexOf(formatter.country_phone_code) === 0) {
            cleanNumber = `+${cleanNumber}`
          }
          // else {
          //   cleanNumber = cleanNumber.replace(regex, '')
          // }
          console.log('cleanNumber', cleanNumber)
          typed = formatter.input(cleanNumber)
          // console.log(typed)
          if (formatter.country) { this.country = formatter.country }
          validPhone = isValidNumber(typed, this.country, metadata)
          if (validPhone) { intNumber = format(parse(typed, this.country, metadata), 'International', metadata) }
        } else if (!this.accepts.includes('phone') || /@/.test(typed) || regex.test(typed)) {
          this.isEmail = true
          typed = typed.replace(/[\s]/gi, '')
          // console.log(typed)
          if (/(^$|^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$)/.test(typed)) {
            validEmail = true
          }
        }
        if (this.accepts.includes('phone') && !metadata) {
          this.loadMetadataAndCall(this.formatInput)
        } else if (this.accepts.includes('phone')) {
          this.$emit('input', {rawInput: typed || '', country: this.userCountry, isValidEmail: validEmail, isValidPhone: validPhone, intNumber: intNumber})
        } else {
          this.$emit('validEmail', validEmail)
          this.$emit('input', typed)
        }
      }
    },
    verifyEmail: function () {
      this.mailCheckedEmail = undefined
      let em = this.value && this.value.rawInput ? this.value.rawInput : this.value
      let vm = this
      Mailcheck.run({
        email: em,
        suggested: function (suggestion) {
          console.log(suggestion)
          vm.mailCheckedEmail = suggestion.full
        },
        empty: function () {
          vm.mailCheckedEmail = ''
        }
      })
    },
    setEmail: function () {
      this.formatInput(this.mailCheckedEmail)
      this.mailCheckedEmail = undefined
    },
    delayTouch ($v) {
      $v.$reset()
      if (touchMap.has($v)) {
        clearTimeout(touchMap.get($v))
      }
      if (touchMap.has(this.vEmail)) {
        clearTimeout(touchMap.get(this.vEmail))
        this.mailCheckedEmail = undefined
      }
      touchMap.set($v, setTimeout($v.$touch, 500))
      if (this.accepts.includes('email')) {
        touchMap.set(this.vEmail, setTimeout(this.verifyEmail(), 500))
      }
    }
  },
  validations () {
    return {
      value: {
        required: requiredIf(this.required),
        validEmailorPhone: function (value, model) {
          if (!this.accepts.includes('phone')) {
            return /(^$|^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$)/.test(value)
          }
          return Boolean(value.isValidEmail || value.isValidPhone)
        }
      }
    }
  }
  // ,
  // mounted () {
  //   this.setPlaceholder()
  // }
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
