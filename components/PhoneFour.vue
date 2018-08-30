<template>
  <div>
    <label>Phone Number
      <input @input="(val) => tel = val.target.value" :value="tel" v-format.allowEmail="countryAndMeta" @checkMetaForCountries="(e) => checkMetaForCountries(e.detail)" type="text">
    </label>
    <label>Country
      <input v-model="countryIso" type="text">
    </label>
  </div>
</template>

<script>
// const InputController = require('input-format/commonjs/')
// import { AsYouType } from 'libphonenumber-js/custom'

// const templateParser = require('input-format/commonjs/template parser').default
// const templateFormatter = require('input-format/commonjs/template formatter').default
// const parseDigit = require('input-format/commonjs/parse digit').default
const onChange = require('input-format/commonjs/input control').onChange
const onCut = require('input-format/commonjs/input control').onCut
const onPaste = require('input-format/commonjs/input control').onPaste
const onKeyDown = require('input-format/commonjs/input control').onKeyDown
// import { onCut, onPaste, onKeyDown } from 'input-format/modules'
// import { onPaste, onKeyDown } from 'input-format/modules'
// import { onKeyDown } from 'input-format/modules'
// const TEMPLATE = '(xxx) xxx-xxxx'
// const parse = templateParser(TEMPLATE, parseDigit)
// const format = templateFormatter(TEMPLATE, 'x', true)

export default {
  data () {
    return {
      tel: '',
      countryIso: 'HK'
    }
  },
  computed: {
    countryAndMeta () {
      return {
        country: this.countryIso,
        meta: this.$store.state.data.phoneMetadata,
        format: (number) => {
          if (!this.$store.getters['data/phoneMetadataHasAllCountriesForPrefix'](number)) {
            this.checkMetaForCountries(number)
          }
          let {text, formatted: {country, template}} = this.$store.getters['data/formattedNumber'](number, this.countryIso)
          if (country && this.countryIso !== country) this.countryIso = country
          return {text, template}
        }
      }
    }
  },
  methods: {
    checkMetaForCountries (value) {
      // console.log('checking meta for countries', value)
      this.$store.dispatch('data/getCountryIsoFromPhonePrefix', value)
    }
  },
  watch: {
    countryIso (val, oldVal) {
      if (val !== oldVal && !this.countryAndMeta.meta.countries[val] && val.length === 2) {
        this.$store.dispatch('data/updateCountryData', val)
      }
    }
  },
  directives: {
    format: (el, binding, vnode) => {
      let format
      let parse
      if (binding.modifiers.allowEmail) {
        format = (number) => {
          if (/(A-Za-z@)+/.test(number)) return {number, template: 'x'.repeat(60)}
          else return binding.value.format(number)
        }
        parse = (character, value) => {
          return (/\+|[0-9]/.test(character) && (!value || /^(\+?[0-9]*)$/g.test(value))) ? character : undefined
        }
      } else {
        format = binding.value.format
        parse = (character, value) => {
          return (/\+|[0-9]/.test(character) && (!value || /^(\+?[0-9]*)$/g.test(value))) ? character : undefined
        }
      }
      // function format (value) {
      //   let {value: {country, meta}} = binding
      //   console.log(country)
      //   if (/^(\+?[0-9]*)$/g.test(value)) {
      //     const formatter = new AsYouType(country, meta)
      //     console.log(formatter)
      //     const text = formatter.input(value)
      //     console.log('text', text)
      //     return { text, template: formatter.template }
      //   } else {
      //     return {value, template: 'x'.repeat(60)}
      //   }
      // }
      // console.log(el, binding, vnode)
      const onChangeHandler = () => {
        vnode.elm.dispatchEvent(new CustomEvent('input'))
      }
      el.onchange = function (event) { onChange(event, el, parse, format, onChangeHandler) }
      el.oncut = function (event) { onCut(event, el, parse, format, onChangeHandler) }
      el.onpaste = function (event) { onPaste(event, el, parse, format, onChangeHandler) }
      el.onkeydown = function (event) { onKeyDown(event, el, parse, format, onChangeHandler) }
      el.onkeyup = function (event) {
        if (event.key !== 'ArrowRight' &&
        event.key !== 'ArrowLeft' &&
        event.key !== 'Meta' &&
        event.key !== 'Shift') {
          onChange(event, el, parse, format, onChangeHandler)
        }
      }
    }
  }
}
</script>

<style>

</style>
