<template>
  <section>
    <div class="field-label has-text-left">
      <label class="label">{{ label }}</label>
    </div>
    <slot name="instructions"></slot>
    <div v-if="usOnly === undefined || usOnly === false" class="field is-fullwidth" v-show="!usesAlternateFormat">
          <div class="field-body">
            <b-field class="grouped" >
              <b-field expanded>
                <b-field>
                  <p class="control flag-container">
                    <b-icon
                      pack="flag-icon"
                      :custom-class="'flag-icon-' + cCountryCode.toLowerCase()"
                      @click.native="$refs.country.focus()">
                    </b-icon>
                  </p>
                  <b-autocomplete
                      v-model="countryName"
                      placeholder="Country"
                      ref="country"
                      :disabled="usOnly"
                      keep-first
                      open-on-focus
                      expanded
                      :data="filteredCountries"
                      field="label"
                      @input="updateAddress()"
                      @focus="$event.target.select()"
                      @select="option => {selected = option; if (selected) {countryCode = option.iso}}">
                    <template slot-scope="props">
                      <span :class="`flag-icon flag-icon-${props.option.iso.toLowerCase()}`"></span>{{ props.option.label }}
                    </template>
                  </b-autocomplete>
                </b-field>
              </b-field>
            </b-field>
          </div>
        </div>
        <div class="field" v-show="!usesAlternateFormat">
          <div class="field-label is-normal">
            <label class="label"></label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <b-autocomplete
                  v-model="streetAddress"
                  :data="data"
                  ref="premise"
                  keep-first
                  :placeholder="throroughfareLabel"
                  field="structured_formatting.main_text"
                  :loading="isFetching"
                  @input="getAsyncData"
                  @select="option => fillData(option)">
                  <template slot-scope="props">{{ props.option.description }}</template>
                  <template slot="empty">No results found</template>
                </b-autocomplete>
              </div>
            </div>
          </div>
        </div>
        <div class="field" v-show="!usesAlternateFormat">
          <div class="field-label is-normal">
            <label class="label"></label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <input class="input" @input="updateAddress()" v-model="extendedAddress" type="text" :placeholder="premiseLabel">
              </div>
            </div>
          </div>
        </div>
        <div class="field is-horizontal" v-show="!usesAlternateFormat">
          <div class="field-body">
            <div class="field" v-for="field in localityFields" :key="Object.keys(field)[0]">
              <p v-if="Object.keys(field)[0] === 'localityname'" class="control is-expanded">
                <input class="input" type="text" @input="updateAddress()" v-model="locality" :placeholder="field.localityname.label">
              </p>
              <div v-if="Object.keys(field)[0] === 'administrativearea'">
                <div v-if="field.administrativearea && field.administrativearea.options" >
                  <b-autocomplete
                    v-model="region"
                    :placeholder="field.administrativearea.label"
                    open-on-focus
                    :data="filteredRegions"
                    :keep-first="true"
                    field="name"
                    @input="updateAddress()"
                    @select="option => selected = option">
                  </b-autocomplete>
                </div>
                <input v-if="field.administrativearea && !field.administrativearea.options" v-model="region" @input="updateAddress()" class="input" type="text" :placeholder="field.administrativearea.label">
              </div>
              <p v-if="Object.keys(field)[0] === 'postalcode'" class="control is-expanded">
                <input class="input" v-model="postalCode" type="text" @input="updateAddress()" :placeholder="field.postalcode.label">
              </p>
            </div>
          </div>
        </div>
        <div v-if="(usOnly !== undefined && usOnly !== false) || usOnly === true" class="field is-fullwidth">
          county
        </div>
        <!-- alternateFormat -->
      <b-field
          v-show="usesAlternateFormat">
        <transition name="fade">
          {{ $t('request.addressAbroadInstructions')}}
          <b-input type="text" v-model="alt1" @input="updateAddress()"></b-input>
        </transition>
      </b-field>
      <b-field
          v-show="usesAlternateFormat">
        <transition name="fade">
          {{ $t('request.addressAbroadInstructions')}}
          <b-input type="text" v-model="alt2" @input="updateAddress()"></b-input>
        </transition>
      </b-field>
      <b-field
          v-show="usesAlternateFormat">
        <transition name="fade">
          {{ $t('request.addressAbroadInstructions')}}
          <b-input type="text" v-model="alt3" @input="updateAddress()"></b-input>
        </transition>
      </b-field>
      <b-field
          v-show="usesAlternateFormat">
        <transition name="fade">
          {{ $t('request.addressAbroadInstructions')}}
          <b-input type="text" v-model="alt4" @input="updateAddress()"></b-input>
        </transition>
      </b-field>
      <b-field
          v-show="usesAlternateFormat">
        <transition name="fade">
          {{ $t('request.addressAbroadInstructions')}}
          <b-input type="text" v-model="alt5" @input="updateAddress()"></b-input>
        </transition>
      </b-field>

      <b-field :label="usesAlternateFormat ? 'Use the standard international format for my address' : 'I need to use a different format for my address.'">
        <b-field>
          <b-radio-button v-model="usesAlternateFormat"
            :native-value="!usesAlternateFormat"
            :type="usesAlternateFormat ? 'is-success' : 'is-danger'">
            <b-icon :icon="!usesAlternateFormat ? 'edit' : 'align-justify'"></b-icon>
            <span>Change format</span>
          </b-radio-button>
        </b-field>
      </b-field>
  </section>
</template>

<script>
import countries from '~/assets/countryaddresses'
import axios from 'axios'
import debounce from 'lodash/debounce'

export default {
  name: 'AddressInput',
  props: [
    'value',
    'usOnly',
    'label'
  ],
  mounted () {
    if (this.usOnly !== undefined) {
      this.countryCode = 'US'
      this.countryName = 'United States'
      this.$refs.premise.focus()
    }
    if (this.value) {
      this.postOfficeBox = this.value.poBox || ''
      this.extendedAddress = this.value.premise || ''
      this.streetAddress = this.value.thoroughfare || ''
      this.locality = this.value.locality || ''
      this.region = this.value.administrativearea || ''
      this.postalCode = this.value.postalcode || ''
      this.countryName = this.value.country || ''
      this.countryCode = this.value.countryiso || ''
      this.usesAlternateFormat = this.value.usesAlternateFormat || false
      this.alt1 = this.value.alt1 || ''
      this.alt2 = this.value.alt2 || ''
      this.alt3 = this.value.alt3 || ''
      this.alt4 = this.value.alt4 || ''
      this.alt5 = this.value.alt5 || ''
    }
  },
  data: function () {
    return {
      data: [],
      postOfficeBox: '',
      extendedAddress: '',
      streetAddress: '',
      locality: '',
      region: '',
      postalCode: '',
      countryName: '',
      countryCode: '',
      name: '',
      selected: null,
      isFetching: false,
      country: '',
      thoroughfare: '',
      premise: '',
      administrativearea: '',
      postalcode: '',
      usesAlternateFormat: false,
      alt1: '',
      alt2: '',
      alt3: '',
      alt4: '',
      alt5: ''
    }
  },
  computed: {
    countryList () {
      return countries()
    },
    filteredCountries () {
      if (this.countryName && this.countryName.length > 1) {
        return this.countryList.filter((option) => {
          return option.label
            .toString()
            .toLowerCase()
            .indexOf(this.countryName.toLowerCase()) >= 0 || option.iso
            .toString()
            .toLowerCase()
            .indexOf(this.countryName.toLowerCase()) >= 0
        })
      } else {
        return this.countryList
      }
    },
    codeFilteredCountries () {
      if (this.usOnly) {
        return this.countryList.filter(country => country.iso === 'US')
      }
      if (this.countryCode.length === 2) {
        return this.countryList.filter(country => country.iso.toLowerCase() === this.countryCode.toLowerCase())
      } else {
        return this.filteredCountries
      }
    },
    cCountryCode () {
      return this.countryCode || 'un'
    },
    throroughfareLabel () {
      return this.codeFilteredCountries.length === 0 || this.codeFilteredCountries.length === this.countryList.length ? 'Address 1' : this.codeFilteredCountries[0].fields[0].thoroughfare.label
    },
    premiseLabel () {
      return this.codeFilteredCountries.length === 0 || this.codeFilteredCountries.length === this.countryList.length ? 'Address 2' : this.codeFilteredCountries[0].fields[1].premise.label
    },
    localityFields () {
      if (this.codeFilteredCountries.length === 0 || this.codeFilteredCountries.length === this.countryList.length) {
        return [{localityname: {label: 'City'}}, {administrativearea: {label: 'State', options: true}}, {postalcode: {label: 'Postal Code'}}]
      } else {
        return this.codeFilteredCountries[0].fields[2].locality
      }
    },
    filteredRegions () {
      return this.codeFilteredCountries
        .map(x => x.fields[2].locality)
        .map((x, i) => x.filter(x => x.administrativearea && x.administrativearea.options))
        .filter(x => x.length > 0)
        .map(x => x[0].administrativearea.options)
        .reduce((prev, cur) => prev.concat(cur), [])
        .map(x => ({abbr: Object.keys(x)[0], name: x[Object.keys(x)[0]]}))
        .filter(x => {
          if (!this.region) {
            return x.abbr !== ''
          } else {
            return x.abbr.toString().toLowerCase().indexOf(this.region.toString().toLowerCase()) > -1 || x.name.toString().toLowerCase().indexOf(this.region.toString().toLowerCase()) > -1
          }
        })
    },
    formattedLocality () {
      let formatted = []
      if (this.localityFields) {
        this.localityFields.forEach(x => {
          if (x.localityname && this.locality) {
            formatted.push(this.locality + ',')
          } else if (x.administrativearea && this.region) {
            formatted.push(this.region)
          } else if (x.postalcode && this.postalCode) {
            formatted.push(this.postalcode)
          }
        })
      }
      return formatted.join(' ')
    }
  },
  watch: {
    formattedLocality: function () {
      this.updateAlt()
    },
    extendedAddress: function () {
      this.updateAlt()
    },
    streetAddress: function () {
      this.updateAlt()
    },
    countryCode: function () {
      this.updateAlt()
    }
  },
  methods: {
    updateAlt () {
      this.alt1 = this.extendedAddress || this.streetAddress
      this.alt2 = this.extendedAddress ? this.streetAddress : this.formattedLocality
      this.alt3 = this.extendedAddress ? this.formattedLocality : this.countryCode
      this.alt4 = this.extendedAddress ? this.countryName || this.countryCode : ''
      this.alt5 = ''
    },
    fillData (option) {
      console.log('selected:', this.selected)
      console.log('option', option)
      if (option && option.place_id) {
        axios.get(`${process.env.placesUrl + process.env.detailsEndpoint}?placeid=${option.place_id}&key=${process.env.placesKey}`)
          .then(({ data }) => {
            data.result.adr_address
              .split(/<span class="|">|<\/span>,?\s?/)
              .filter(e => e)
              .forEach((item, index, arr) => {
                console.log(index, item)
                var myRe = /post-office-box|extended-address|street-address|locality|region|postal-code|country-name/g
                if (index === 0 && !myRe.test(item)) {
                  this.extendedAddress = item
                  console.log(`extended-address = ${item}`)
                } else if (item === 'country-name') {
                  data.result['address_components'].forEach(x => {
                    if (x.types[0] === 'country') {
                      this.countryName = x['long_name']
                      this.countryCode = x['short_name']
                    }
                  })
                } else if (myRe.test(item)) {
                  switch (item) {
                    case 'post-office-box':
                      this.postOfficeBox = arr[index + 1]
                      break
                    case 'street-address':
                      this.streetAddress = arr[index + 1]
                      break
                    case 'locality':
                      this.locality = arr[index + 1]
                      break
                    case 'region':
                      this.region = arr[index + 1]
                      break
                    case 'postal-code':
                      this.postalCode = arr[index + 1]
                      break
                  }
                  console.log(`${item} = ${arr[index + 1]}`)
                }
              })
          })
      }
    },
    getAsyncData: debounce(function () {
      this.data = []
      this.updateAddress()
      console.log(this.streetAddress)
      this.isFetching = true
      axios.get(`${process.env.placesUrl + process.env.autocompleteEndpoint}?input=${this.streetAddress}&types=geocode&language=en${this.cCountryCode && this.cCountryCode !== 'un' ? '&components=country:' + this.cCountryCode : ''}&key=${process.env.placesKey}`)
        .then(({ data }) => {
          data.predictions.forEach((item) => this.data.push(item))
          this.isFetching = false
        }, response => {
          this.isFetching = false
        })
    }, 500),
    updateAddress () {
      this.$emit('input', {
        poBox: this.postOfficeBox,
        premise: this.extendedAddress,
        thoroughfare: this.streetAddress,
        locality: this.locality,
        administrativearea: this.region,
        postalcode: this.postalCode,
        country: this.countryName,
        countryiso: this.cCountryCode !== 'un' && this.countryCode ? this.cCountryCode : '',
        usesAlternateFormat: this.usesAlternateFormat,
        alt1: this.alt1,
        alt2: this.alt2,
        alt3: this.alt3,
        alt4: this.alt4,
        alt5: this.alt5
      })
    }
  }
}
</script>
<style lang="sass">
$flag-icon-css-path: '../node_modules/flag-icon-css/flags'
@import '../node_modules/flag-icon-css/sass/flag-icon.scss'

.flag-icon
  width: 3.8em;
  height: 100%;
  line-height: inherit;

.flag-container
  width: 3em;

.flag-container > span
  width: 100%;
  height: 100%;
</style>
