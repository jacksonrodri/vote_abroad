<template>
  <div class="field">
    <div class="field">
      <label for="country" class="label">{{ label }}<span v-if="toolTipTitle" @click="toolTipOpen = !toolTipOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span></label>
      <!-- <transition name="fade"><span v-if="!value && !$v.$error" class="required"> {{required || required === '' ? 'Required' : 'Optional'}}</span></transition> -->
      <!-- <b-field expanded label="country">
        :for="this.$vnode.key"
        <b-input placeholder="Country"></b-input>
      </b-field> -->
      <b-field expanded placeholder="Country" :type="v && v.country && v.country.$error ? 'is-danger' : ''" >
        <a :class="['button', 'control', 'is-outlined', 'is-inverted', 'is-paddingless']"
          @click="$refs.country.focus()"
          style="padding-left:0px;">
          <span class="flag-container fa-stack">
            <i :class="`fa-stack-2x flag-icon flag-icon-${value && value.countryiso ? value.countryiso.toLowerCase() : userCountry || 'un'}`"></i>
            <i class="fas fa-sort-down fa-stack-1x has-text-grey breathe" style="transform:translateY(0.7rem)"></i>
          </span>
        </a>
        <b-autocomplete
          :open-on-focus=true
          keep-first
          name="country"
          autocomplete="section-abroad shipping country"
          :placeholder="$t('request.abrAdr.placeholder')"
          v-model="countrySearch"
          :field="'name' || null"
          :data="filteredCountries"
          type="search"
          @focus="$event.target.setSelectionRange(0,99999)"
          ref="country"
          :id="country"
          @select="option => selectCountry(option)"
          expanded>
          <template slot="header">
            <span class="is-size-6 has-text-grey"> ... type to find your country.</span>
          </template>
          <template slot="empty">No results for {{countrySearch}}</template>
          <template slot-scope="props">
            <span :class="`flag-icon flag-icon-${props.option.code.toLowerCase()}`"></span>{{ props.option.name }}
          </template>
        </b-autocomplete>
          <!-- autocomplete="off" -->
        <p class="control">
          <a class="button is-outlined is-borderless" @click="$refs.country.focus()">
            <span class="icon is-small">
              <i class="fas fa-angle-down"></i>
            </span>
          </a>
        </p>
          <!-- @input="val => countrySearch = val" -->
          <!-- :value="countrySearch || getCountryName(userCountry) || ''" -->

      </b-field>
      <p v-if="v && v.country && v.country.$error" class="help is-danger">Please select a country.</p>
    </div>
    <transition name="fade" mode="out-in">
      <div v-if="!usesAlternateFormat" key="formatted">
        <template v-for="item in fmt">
          <b-field v-if="typeof item === 'string'" expanded :key="item"
            :type="v && v[item] && v[item]['$error'] ? 'is-danger' : ''"
            :message="v && v[item] && v[item].$error ? `Please enter your ${getPlaceholder(item)}.` : ''">
            <b-autocomplete v-if="item === 'A'"
                :value="A"
                :data="data"
                ref="A"
                keep-first
                autocomplete="section-abroad shipping street-address"
                :placeholder="getPlaceholder(item)"
                field="structured_formatting.main_text"
                @focus="getFormatAndCall(null, countryiso || userCountry)"
                :loading="isFetching"
                @input="val => getFormatAndCall(() => { update({A: val}); getAsyncData(val) }, countryiso || userCountry)"
                @select="option => fillData(option)">
                <template slot-scope="props">{{ props.option.description }}</template>
                <template slot="empty">No results found</template>
              </b-autocomplete>
                <!-- autocomplete="address-line1" -->
              <b-autocomplete v-else-if="item === 'S' && sOptions.length > 0"
                :key="item"
                :value="S"
                ref="S"
                :autocomplete="getAutocomplete(item)"
                @input="val => update({S: val})"
                @select="opt => {if (opt) { update({S: opt.key}) }}"
                :data="!S ? sOptions : sOptions.filter((opt) => opt.name.toLowerCase().includes(S.toLowerCase()) || opt.key.toLowerCase().includes(S.toLowerCase()))"
                field="name"
                keep-first
                :placeholder="getPlaceholder(item)"
                :open-on-focus=true></b-autocomplete>
            <b-input :placeholder="getPlaceholder(item)"
              v-else
              :value="getValue(item)"
              :ref="item"
              :autocomplete="getAutocomplete(item)"
              @input="val => update({[item]: val})">
            </b-input>
          </b-field>
          <b-field v-else :key="item.join('-')"
            :type="item.filter(x => v && v[x] && v[x].$error).length > 0 ? 'is-danger' : ''"
            :message="item.filter(x => v && v[x] && v[x].$error).length === 0 ? '' : item.filter(x => v && v[x] && v[x].$error).length === 1 ? `Please enter your ${getPlaceholder(item.filter(x => v && v[x] && v[x].$error)[0])}.` : `These fields are required: ${item.filter(x => v && v[x] && v[x].$error).map(x => getPlaceholder(x)).join(', ')}.`">
            <b-field grouped>
              <b-field v-for="subItem in item" :expanded="subItem !== 'X' || subItem !== 'Z'" :key="subItem"
                :type="v && v[subItem] && v[subItem]['$error'] ? 'is-danger' : ''">
                <b-autocomplete v-if="subItem === 'S' && sOptions.length > 0"
                  :value="S"
                  :ref="S"
                  @input="val => update({S: val})"
                  @select="opt => {if (opt) { update({S: opt.key}) }}"
                  :data="!S ? sOptions : sOptions.filter((opt) => opt.name.toLowerCase().includes(S.toLowerCase()) || opt.key.toLowerCase().includes(S.toLowerCase()))"
                  field="name"
                  keep-first
                  :autocomplete="getAutocomplete(subItem)"
                  :placeholder="getPlaceholder(subItem)"
                  :open-on-focus=true></b-autocomplete>
                <b-input v-else :value="getValue(subItem)"
                  @input="val => update({[subItem]: val})"
                  :ref="subItem"
                  :autocomplete="getAutocomplete(subItem)"
                  :placeholder="getPlaceholder(subItem)">
                </b-input>
              </b-field>
            </b-field>
          </b-field>
        </template>
      </div>
      <div v-else key="altFormat">
        <b-field>
          <b-input type="text" :value="alt1" @input="val => update({alt1: val})"></b-input>
        </b-field>
        <b-field >
          <b-input type="text" :value="alt2" @input="val => update({alt2: val})"></b-input>
        </b-field>
        <b-field>
          <b-input type="text" :value="alt3" @input="val => update({alt3: val})"></b-input>
        </b-field>
        <b-field>
          <b-input type="text" :value="alt4" @input="val => update({alt4: val})"></b-input>
        </b-field>
        <b-field>
          <b-input type="text" :value="alt5" @input="val => update({alt5: val})"></b-input>
        </b-field>
      </div>
    </transition>

      <b-field :label="usesAlternateFormat ? $t('request.abrAdr.structured-label') : $t('request.abrAdr.unstructured-label')">
        <b-field>
          <b-radio-button v-model="usesAlternateFormat"
            :native-value="!usesAlternateFormat"
            :type="usesAlternateFormat ? 'is-success' : 'is-danger'">
            <b-icon :icon="!usesAlternateFormat ? 'edit' : 'align-justify'"></b-icon>
            <span>{{$t('request.abrAdr.changeFormat')}}</span>
          </b-radio-button>
        </b-field>
      </b-field>
  </div>
</template>

<script>
import { requiredIf } from 'vuelidate/lib/validators'
import axios from 'axios'
import debounce from 'lodash/debounce'
const countrylist = require('~/assets/countries.json')
const ZZ = require('~/data/postal/zz.json')
const latinizeCharacters = require('~/assets/latinize.characters.json')

const touchMap = new WeakMap()

export default {
  name: 'AdrInput',
  props: [
    'value',
    'label',
    'toolTipTitle',
    'required',
    'v'
  ],
  data () {
    return {
      toolTipOpen: false,
      isFetching: false,
      data: [],
      formats: {},
      countrySearch: '',
      country: '',
      model: [
        'postOfficeBox',
        'extendedAddress',
        'streetAddress',
        'locality',
        'region',
        'postalCode',
        'countryName',
        'countryiso',
        'usesAlternateFormat',
        'alt1',
        'alt2',
        'alt3',
        'alt4',
        'alt5'
      ],
      format: [
        'streetAddress',
        'extendedAddress',
        [
          'locality',
          'region',
          'postalCode'
        ]
      ]
    }
  },
  computed: {
    countries () { return countrylist },
    N () { return this.value && this.value.N ? this.value.N : null },
    O () { return this.value && this.value.O ? this.value.O : null },
    A () { return this.value && this.value.A ? this.value.A : null },
    B () { return this.value && this.value.B ? this.value.B : null },
    D () { return this.value && this.value.D ? this.value.D : null },
    C () { return this.value && this.value.C ? this.value.C : null },
    S () { return this.value && this.value.S ? this.value.S : null },
    Z () { return this.value && this.value.Z ? this.value.Z : null },
    X () { return this.value && this.value.X ? this.value.X : null },
    countryiso () { return this.value && this.value.countryiso ? this.value.countryiso : this.userCountry || null },
    alt1 () { return this.value && this.value.alt1 ? this.value.alt1 : null },
    alt2 () { return this.value && this.value.alt2 ? this.value.alt2 : null },
    alt3 () { return this.value && this.value.alt3 ? this.value.alt3 : null },
    alt4 () { return this.value && this.value.alt4 ? this.value.alt4 : null },
    alt5 () { return this.value && this.value.alt5 ? this.value.alt5 : null },
    usesAlternateFormat: {
      get () { return this.value && this.value.usesAlternateFormat ? this.value.usesAlternateFormat : false },
      set (val) { this.update(Object.assign({}, this.value, {usesAlternateFormat: val})) }
    },
    defaultFormat () { return ZZ.ZZ },
    countryFormat () { return Object.assign({}, this.defaultFormat, this.formats[this.userCountry.toUpperCase() + '--en'] || this.formats[this.userCountry.toUpperCase()] || {}) },
    sOptions () {
      if (((this.countryFormat.lfmt && this.countryFormat.lfmt.includes('%S')) || (this.countryFormat.fmt && this.countryFormat.fmt.includes('%S'))) && this.countryFormat['sub_keys']) {
        let subKeys = this.countryFormat['sub_keys'].split(/~+/g)
        let subNames = this.countryFormat && this.countryFormat['sub_lnames'] ? this.countryFormat['sub_lnames'].split(/~+/g) : this.countryFormat['sub_names'] ? this.countryFormat['sub_names'].split(/~+/g) : this.countryFormat['sub_keys'].split(/~+/g)
        return subKeys.reduce((arr, k, i) => arr.concat({ key: k, name: subNames[i] }), [])
      } else {
        return []
      }
    },
    formatted () {
      return this.countryFormat.fmt.replace(/(%[N|O|A|B|D|C|S|Z|X])/g, (match, p1, offset, string) => this[p1] || '')
    },
    fmt () {
      let ft = this.countryFormat.lfmt || this.countryFormat.fmt
      return ft.replace('%A', '%A%n%B').replace(/%[N|O]%n/g, '').split('%n').map(x => x.length === 2 ? x : x.split(/(%[A-Z])/).filter(x => /%[A-Z]/.test(x)).map(x => typeof x === 'string' ? x.substr(-1) : x)).map(x => typeof x === 'string' ? x.substr(-1) : x)
    },
    subkeys () {
      if (this.countryFormat['sub_keys']) {
        return this.latinize(this.countryFormat['sub_keys'])
      } else {
        return null
      }
    },
    userCountry () { return this.value && this.value.countryiso ? this.value.countryiso.toLowerCase() : this.$store.state.userauth.user.country.toLowerCase() || null },
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
            .indexOf(this.countrySearch.toLowerCase()) >= 0
        })
      } else if (this.userCountry) {
        return this.countries.filter(country => country.code === this.userCountry).concat(this.countries)
      } else {
        return this.countries
      }
    }
  },
  watch: {
    value (val) {
      if (val && val.countryiso && !val.country) {
        this.update(Object.assign({}, this.val, {country: this.getCountryName(val.countryiso)}))
        console.log('needs country name')
      }
    },
    userCountry (val, oldVal) {
      if (this.countrySearch !== this.getCountryName(val)) {
        this.countrySearch = this.getCountryName(val)
        this.update({country: this.countrySearch, countryiso: val})
      }
      if (val && (!oldVal || val !== oldVal)) {
        this.getFormatAndCall(null, val)
      }
      // if (!this.countrySearch) {
      //   this.countrySearch = this.getCountryName(val)
      //   this.update({country: this.countrySearch, countryiso: val})
      // }
    }
  },
  methods: {
    decodeHtmlEntity (str) {
      return str.replace(/&#(\d+);/g, function (match, dec) {
        return String.fromCharCode(dec)
      })
    },
    getValue: function (item) { return this && this[item] ? this[item] : null },
    getCountryName: function (option) {
      // console.log('getCountryName', option)
      let ctry = this.countries.find((country) => country.code.toLowerCase() === option.toLowerCase())
      return ctry ? ctry.name : option
    },
    selectCountry (option) {
      // this.countrySearch = option.name
      console.log('option', option)
      if (option) {
        this.update({country: option.name, countryiso: option.code})
        this.getFormatAndCall(null, option.code || null)
      }
      // this.update({country: option.name, countryiso: option.code})
      // this.countrySearch = option.name
    },
    update: async function (inputObj) {
      // console.log(inputObj, this.value)
      // Object.keys(inputObj).forEach(item => this.delayTouch(this.$v[item]))
      if (Object.keys.length === 1 && (Object.keys(inputObj).includes('alt1') || Object.keys(inputObj).includes('alt2') || Object.keys(inputObj).includes('alt3') || Object.keys(inputObj).includes('alt4') || Object.keys(inputObj).includes('alt5'))) {
        this.$emit('input', Object.assign({}, {alt1: this.value.alt1, alt2: this.value.alt2, alt3: this.value.alt3, alt4: this.value.alt4, alt5: this.value.alt5, usesAlternateFormat: true, country: this.value.country, countryiso: this.value.countryiso}, inputObj))
      } else if (inputObj.countryiso && this.value && this.value.countryiso && inputObj.countryiso.toLowerCase() !== this.value.countryiso.toLowerCase()) {
        this.countrySearch = this.getCountryName(inputObj.countryiso)
        this.$emit('input', Object.assign({}, this.value, {countryiso: inputObj.countryiso, country: this.getCountryName(inputObj.countryiso)}))
        let countryiso = inputObj.countryiso
        // delete inputObj.countryiso
        this.getFormatAndCall(() => this.update(inputObj), countryiso)
      } else {
        let ft = this.countryFormat.lfmt || this.countryFormat.fmt || '%A%n%B%n%C%n%S'
        // let fullFt = ft + '%country%countryiso%B'
        let newVal = Object.assign({}, this.value, inputObj)
        // console.log('newVal1', newVal)
        Object.keys(newVal)
          .forEach(x => {
            newVal[x] = typeof newVal[x] === 'string' ? this.decodeHtmlEntity(this.latinize(newVal[x])) : newVal[x]
          })
        // Object.keys(newVal)
        //   .forEach(x => {
        //     if (newVal[x] && fullFt.includes(`%${x}`)) {
        //       newVal[x] = this.removeDiacritics(newVal[x])
        //     } else {
        //       newVal[x] = null
        //     }
        //   })
        // let formatted = ft.replace('%A%n', '%A%n%B%n').replace(/%[N|O]%n/g, '').replace(/%([A|B|D|C|S|Z|X])([%n]?)/g, (match, p1, p2, offset, string) => p1 && newVal[p1] ? this.countryFormat.upper.includes([p1]) ? newVal[p1].toUpperCase() + p2 || '' : newVal[p1] + p2 || '' : '').concat(`%n${newVal.country.toUpperCase()}`).split('%n')
        let formatted = ft.replace('%A%n', '%A%n%B%n').replace(/%[N|O]%n/g, '').split('%n').map(x => x.replace(/%([A|B|D|C|S|Z|X])/g, (match, p1) => p1 && newVal[p1] ? this.countryFormat.upper.includes(p1) ? newVal[p1].toUpperCase() : newVal[p1] : '')).concat(newVal.country ? newVal.country.toUpperCase() === 'SINGAPORE' ? 'REPUBLIC OF SINGAPORE' : newVal.country.toUpperCase() : null).filter(x => x)
        // console.log('formatted', formatted)
        newVal.alt1 = inputObj.alt1 || formatted.length > 0 ? formatted[0] : null
        newVal.alt2 = inputObj.alt2 || formatted.length > 1 ? formatted[1] : null
        newVal.alt3 = inputObj.alt3 || formatted.length > 2 ? formatted[2] : null
        newVal.alt4 = inputObj.alt4 || formatted.length > 3 ? formatted[3] : null
        newVal.alt5 = inputObj.alt5 || formatted.length > 4 ? formatted.slice(4 - formatted.length).join(' ') : null
        newVal.usesAlternateFormat = inputObj.usesAlternateFormat || this.value ? this.value.usesAlternateFormat : false
        if (newVal.D && newVal.B && newVal.D.toLowerCase() === newVal.B.toLowerCase()) {
          newVal.B = null
        }
        // console.log('newVal', newVal)
        await this.$emit('input', newVal)
      }
    },
    async getFormatAndCall (passedFunction, countryiso) {
      // if (countryiso) console.log(`has country format countryiso: ${countryiso}, userCountry: ${this.userCountry}`, !this.formats[countryiso.toUpperCase()])
      if ((countryiso && !this.formats[countryiso.toUpperCase()]) || (this.value && this.value.countryiso && !this.formats[this.value.countryiso.toUpperCase()]) || (this.userCountry && !this.formats[this.userCountry.toUpperCase()])) {
        // console.log('requesting country format: ', countryiso || this.value ? this.value.countryiso : this.userCountry)
        // || (!countryiso && this.userCountry && !this.formats[this.userCountry.toUpperCase()]))
        let requestedFormat = await import(`~/data/postal/${countryiso ? countryiso.toLowerCase() : this.userCountry.toLowerCase()}.json`)
        this.formats = Object.assign({}, this.formats, await requestedFormat)
        if (passedFunction) { passedFunction() }
      } else {
        if (passedFunction) { passedFunction() }
      }
    },
    getPlaceholder (item) {
      switch (item) {
        case 'N':
          return 'Name'
        case 'O':
          return 'Organization'
        case 'A':
          return 'Address line 1'
        case 'B':
          return 'Address line 2'
        case 'D':
          return this.countryFormat['sublocality_name_type'].replace(/^\w/, c => c.toUpperCase()) || 'City'
        case 'C':
          return this.countryFormat['locality_name_type'].replace(/^\w/, c => c.toUpperCase()) || 'City'
        case 'S':
          return this.countryFormat['state_name_type'].replace(/^\w/, c => c.toUpperCase()) || 'State'
        case 'Z':
          return this.countryFormat['zip_name_type'].replace(/^\w/, c => c.toUpperCase()) || 'Postal Code'
        case 'X':
          return this.countryFormat.key === 'FR' ? 'CEDEX' : 'Sorting Code'
          // return 'Zip'
        default:
          return item
      }
    },
    getAutocomplete (item) {
      let base = 'section-abroad shipping'
      switch (item) {
        case 'N':
          return `${base} name`
        case 'O':
          return `${base} organization`
        case 'A':
          return `${base} address-line1`
        case 'B':
          return `${base} address-line2`
        case 'D':
          return `${base} address-level3`
        case 'C':
          return `${base} address-level2`
        case 'S':
          return `${base} address-level1`
        case 'Z':
          return `${base} postal-code`
      }
    },
    latinize (str) {
      if (typeof str === 'string') {
        return str.replace(/[^A-Za-z0-9]/g, function (x) {
          return latinizeCharacters[x] || x
        })
      } else {
        return str
      }
    },
    removeDiacritics (str) {
      const baseChars = [
        '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '_', ' ', '\'', ',', '/',
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
        'AA', 'AE', 'AO', 'AU', 'AV', 'AY', 'DZ', 'Dz', 'LJ', 'Lj', 'NJ', 'Nj', 'OI', 'OO', 'OU', 'TZ', 'VY',
        'aa', 'ae', 'ao', 'au', 'av', 'ay', 'dz', 'hv', 'lj', 'nj', 'oi', 'ou', 'oo', 'tz', 'vy'
      ]
      return str.normalize('NFKD').split('')
        .map(c => baseChars.find(bc => bc.localeCompare(c, 'en', { sensitivity: 'case' }) === 0))
        .join('')
    },
    fillData (option) {
      let input = {}
      // console.log('option', option)
      if (option && option.place_id) {
        axios.get(`${process.env.placesUrl + process.env.detailsEndpoint}?placeid=${option.place_id}&language=en&key=${process.env.placesKey}`)
          .then(({ data: {result} }) => {
            let ctry = result.address_components && result.address_components.filter(({types}) => types.includes('country')).length > 0 ? result.address_components.filter(({types}) => types.includes('country'))[0].short_name : null
            let region = result.address_components && result.address_components.filter(({types}) => types.includes('administrative_area_level_1')).length > 0 ? result.address_components.filter(({types}) => types.includes('administrative_area_level_1'))[0].short_name : null
            // console.log('placeid data', result.address_components.filter(({types}) => types.includes('country')))
            // input.A = result.adr_address && result.adr_address.includes('street-address') ? this.latinize(result.adr_address.match('<span class="street-address">(.*?)</span>')[1]) : null
            input.B = result.adr_address && result.adr_address.includes('extended-address') ? result.adr_address.match('<span class="extended-address">(.*?)</span>')[1] : null
            input.D = result.address_components && result.address_components.filter(({types}) => types.includes('sublocality')).length > 0 ? result.address_components.filter(({types}) => types.includes('sublocality'))[0].long_name : null
            input.C = result.adr_address && result.adr_address.includes('locality') ? result.adr_address.match('<span class="locality">(.*?)</span>')[1] : null
            input.S = result.adr_address && result.adr_address.includes('region') ? result.adr_address.match('<span class="region">(.*?)</span>')[1] : region
            input.Z = result.adr_address && result.adr_address.includes('postal-code') ? result.adr_address.match('<span class="postal-code">(.*?)</span>')[1] : null
            input.country = this.getCountryName(ctry)
            input.countryiso = ctry
            this.update(input)
          })
      }
    },
    getAsyncData: debounce(function (val) {
      this.data = []
      this.isFetching = true
      axios.get(`${process.env.placesUrl + process.env.autocompleteEndpoint}?input=${val}&types=geocode&language=en${this.userCountry || this.countryiso ? '&components=country:' + this.countryiso || this.userCountry : ''}&key=${process.env.placesKey}`)
        .then(({ data }) => {
          data.predictions.forEach((item) => this.data.push(item))
          this.isFetching = false
        }, response => {
          this.isFetching = false
        })
    }, 500),
    delayTouch ($v) {
      $v.$reset()
      if (touchMap.has($v)) {
        clearTimeout(touchMap.get($v))
      }
      touchMap.set($v, setTimeout($v.$touch, 1000))
    }
  },
  validations () {
    return {
      A: {required: requiredIf((model) => this.countryFormat.require.toUpperCase().includes('A'))},
      D: {required: requiredIf((model) => this.countryFormat.require.toUpperCase().includes('D'))},
      C: {required: requiredIf((model) => this.countryFormat.require.toUpperCase().includes('C'))},
      S: {required: requiredIf((model) => this.countryFormat.require.toUpperCase().includes('S'))},
      X: {required: requiredIf((model) => this.countryFormat.require.toUpperCase().includes('X'))},
      Z: {required: requiredIf((model) => this.countryFormat.require.toUpperCase().includes('Z'))},
      alt1: {required: requiredIf((model) => this.usesAlternateFormat)},
      alt2: {required: requiredIf((model) => this.usesAlternateFormat)},
      alt3: {},
      alt4: {},
      alt5: {}
    }
  },
  mounted () {
    this.formats = Object.assign({}, ZZ)
    // this.getFormatAndCall()ted
    this.getFormatAndCall(null, this.countryiso || this.userCountry)
    this.countrySearch = this.value && this.value.country ? this.value.country : this.getCountryName(this.userCountry)
    this.country = this.getCountryName(this.countryiso || this.userCountry)
    // this.update({country: this.countrySearch, countryiso: this.userCountry})
  }
}
</script>

<style>

</style>
