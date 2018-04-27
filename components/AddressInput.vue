<template>
  <section>
    <span class="is-flex"><label @click="$refs.country.focus()" class="label" style="cursor: pointer;">{{ label }} </label><span v-if="toolTipTitle" @click="isOpen = !isOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span></span>
    <slot name="instructions"></slot>
    <b-message v-if="toolTipTitle" title="Where are you now?" type="is-info" has-icon :active.sync="isOpen">
      <slot name="tooltip"></slot>
    </b-message>
    <div v-if="usOnly === undefined || usOnly === false" class="field is-fullwidth" v-show="!usesAlternateFormat">
          <div class="field-body">
            <b-field
              :message="validations.country.$error ? Object.keys(validations.country.$params).map(x => $t(`request.abrAdr.messages.country-${x}`)) : '' "
              :type="(validations.country.$error ? 'is-danger': '')"
              class="grouped" >
              <b-field expanded>
                <b-field
                  :type="(validations.country.$error ? 'is-danger': '')">
                  <p class="control flag-container">
                    <b-icon
                      pack="flag-icon"
                      class="flag-container"
                      :custom-class="'flag-icon-' + cCountryCode.toLowerCase()"
                      @click.native="$refs.country.focus()"
                      style="cursor: pointer;">
                    </b-icon>
                  </p>
                  <b-autocomplete
                      v-model="countryName"
                      :placeholder="$t('request.abrAdr.placeholder')"
                      ref="country"
                      :disabled="usOnly"
                      keep-first
                      open-on-focus
                      expanded
                      :data="filteredCountries"
                      autocomplete="country"
                      field="label"
                      @input="updateAddress()"
                      @focus="$event.target.select()"
                      @select="option => {if (!option) {return}; selected = option; if (selected) {countryCode = option.iso}}">
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
            <b-field
              :type="validations.thoroughfare.$error ? 'is-danger' : ''"
              :message="validations.thoroughfare.$error ? Object.keys(validations.thoroughfare.$params).map(x => $t(`request.abrAdr.messages.thoroughfare-${x}`)) : '' ">
              <!-- <div class="control"> -->
                <b-autocomplete
                  v-model="streetAddress"
                  :data="data"
                  ref="thoroughfare"
                  keep-first
                  :placeholder="throroughfareLabel"
                  field="structured_formatting.main_text"
                  :loading="isFetching"
                  autocomplete="address-line1"
                  @input="getAsyncData"
                  @select="option => fillData(option)">
                  <template slot-scope="props">{{ props.option.description }}</template>
                  <template slot="empty">No results found</template>
                </b-autocomplete>
              <!-- </div> -->
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
                <input class="input"
                  @input="updateAddress()"
                  v-model="extendedAddress"
                  type="text"
                  autocomplete="address-line2"
                  :placeholder="premiseLabel">
              </div>
            </div>
          </div>
        </div>
        <div class="field is-horizontal" v-show="!usesAlternateFormat">
          <div class="field-body">
            <template v-for="field in localityFields">
              <!-- <p v-if="Object.keys(field)[0] === 'localityname'" class="control is-expanded">
                <input class="input" type="text" @input="updateAddress()" v-model="locality" :placeholder="field.localityname.label">
              </p> -->
              <b-field :key="Object.keys(field)[0]" :type="validations.locality.$error ? 'is-danger' : ''"
                v-if="Object.keys(field)[0] === 'localityname'"
                :message="validations.locality.$error ? Object.keys(validations.locality.$params).map(x => $t(`request.abrAdr.messages.locality-${x}`)) : '' ">
                <b-input v-model="locality"
                  :placeholder="field.localityname.label"
                  ref="locality"
                  autocomplete="address-level2"
                  @input="updateAddress()">
                </b-input>
              </b-field>
              <div :key="Object.keys(field)[0]" v-if="Object.keys(field)[0] === 'administrativearea'" class="field">
                <div v-if="field.administrativearea && field.administrativearea.options" >
                  <b-autocomplete
                    v-model="region"
                    :placeholder="field.administrativearea.label"
                    open-on-focus
                    :data="filteredRegions"
                    ref="region"
                    :keep-first="true"
                    field="name"
                    autocomplete="address-level1"
                    @input="updateAddress()"
                    @select="option => {if (!option) {return}; selected = option}">
                  </b-autocomplete>
                </div>
                <input v-if="field.administrativearea && !field.administrativearea.options" v-model="region" @input="updateAddress()" class="input" type="text" :placeholder="field.administrativearea.label">
              </div>
              <div :key="Object.keys(field)[0]" v-if="Object.keys(field)[0] === 'postalcode'" class="field">
                <input class="input"
                  v-model="postalCode"
                  type="text"
                  @input="updateAddress()"
                  autocomplete="postal-code"
                  :placeholder="field.postalcode.label">
              </div>
            </template>
          </div>
        </div>
        <div v-if="(usOnly !== undefined && usOnly !== false) || usOnly === true" class="field is-fullwidth">
          county
        </div>
        <!-- alternateFormat -->
      <b-field
          v-show="usesAlternateFormat">
        <transition name="fade">
          <b-input type="text" v-model="alt1" @input="updateAddress()"></b-input>
        </transition>
      </b-field>
      <b-field
          v-show="usesAlternateFormat">
        <transition name="fade">
          <b-input type="text" v-model="alt2" @input="updateAddress()"></b-input>
        </transition>
      </b-field>
      <b-field
          v-show="usesAlternateFormat">
        <transition name="fade">
          <b-input type="text" v-model="alt3" @input="updateAddress()"></b-input>
        </transition>
      </b-field>
      <b-field
          v-show="usesAlternateFormat">
        <transition name="fade">
          <b-input type="text" v-model="alt4" @input="updateAddress()"></b-input>
        </transition>
      </b-field>
      <b-field
          v-show="usesAlternateFormat">
        <transition name="fade">
          <b-input type="text" v-model="alt5" @input="updateAddress()"></b-input>
        </transition>
      </b-field>

      <b-field :label="usesAlternateFormat ? $t('request.abrAdr.structured-label') : $t('request.abrAdr.unstructured-label')">
        <b-field>
          <b-radio-button v-model="usesAlternateFormat"
            :native-value="!usesAlternateFormat"
            :type="usesAlternateFormat ? 'is-success' : 'is-danger'">
            <b-icon :icon="!usesAlternateFormat ? 'edit' : 'align-justify'"></b-icon>
            <span>{{$t('request.abrAdr.changeFormat')}}</span>
            <!-- <span>Change format</span> -->
          </b-radio-button>
        </b-field>
      </b-field>
  </section>
</template>

<script>
// import countries from '~/assets/countryaddresses'
import axios from 'axios'
import debounce from 'lodash/debounce'
// let countries = async function () {
//   let data = await
//   this. = await (
//       await import(
//         /* webpackChunkName: "countrydata" */ `@/data/countries.json`
//       )
//     )
// }

export default {
  name: 'AddressInput',
  props: [
    'value',
    'usOnly',
    'label',
    'validations',
    'toolTipTitle'
  ],
  async created () {
    this.countryList = await (
      await import(
        /* webpackChunkName: "countrydata" */ `@/data/countries.json`
      )
    )
  },
  mounted () {
    // console.log(this.$refs)
    if (this.value) {
      this.postOfficeBox = this.value.poBox || ''
      this.extendedAddress = this.value.premise || ''
      this.streetAddress = this.value.thoroughfare || ''
      this.locality = this.value.locality || ''
      this.region = this.value.administrativearea || ''
      this.postalCode = this.value.postalcode || ''
      this.countryName = this.value.country || ''
      this.countryCode = this.value.countryiso || this.userCountry || ''
      this.usesAlternateFormat = this.value.usesAlternateFormat || false
      this.alt1 = this.value.alt1 || ''
      this.alt2 = this.value.alt2 || ''
      this.alt3 = this.value.alt3 || ''
      this.alt4 = this.value.alt4 || ''
      this.alt5 = this.value.alt5 || ''
      // if (this.countryCode && !this.countryName) {
      //   this.countryName = this.codeFilteredCountries[0].label
      // }
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
      alt5: '',
      isOpen: false,
      // suppressDropdown: true,
      countryList: []
    }
  },
  computed: {
    userCountry () { return this.$store.state.userauth.user.country },
    // countryList () {
    //   return countries()
    // },
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
        this.localityFields.forEach((x, index, arr) => {
          if (x.localityname && this.locality) {
            formatted.push(this.locality + (index < arr.length - 1 ? ',' : ''))
          } else if (x.administrativearea && this.region) {
            formatted.push(this.region + (index < arr.length - 1 ? ',' : ''))
          } else if (x.postalcode && this.postalCode) {
            formatted.push(this.postalCode + (index < arr.length - 1 ? ',' : ''))
          }
        })
      }
      return formatted.join(' ')
    },
    countryMessage: function () {
      return this.findMessage('country')
    },
    countryType: function () {
      return this.findType('country')
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
    countryCode: function (val) {
      // if (val && !this.countryName && this.codeFilteredCountries) {
      //   console.log('cfc', this.codeFilteredCountries)
      //   // this.countryName = this.codeFilteredCountries[0].label
      // }
      this.updateAlt()
    },
    codeFilteredCountries: function (val) {
      if (!this.countryName && val.length === 1) {
        this.countryName = val[0].label
      }
    }
  },
  methods: {
    setFocus () {
      this.$refs.thoroughfare.focus()
    },
    updateAlt () {
      this.alt1 = this.streetAddress
      this.alt2 = this.extendedAddress ? this.extendedAddress : this.formattedLocality
      this.alt3 = this.extendedAddress ? this.formattedLocality : this.countryName || this.countryCode
      this.alt4 = this.extendedAddress ? this.countryName || this.countryCode : ''
      this.alt5 = ''
    },
    fillData (option) {
      // console.log('selected:', this.selected)
      // console.log('option', option)
      if (option && option.place_id) {
        // this.suppressDropdown = true
        axios.get(`${process.env.placesUrl + process.env.detailsEndpoint}?placeid=${option.place_id}&language=en&key=${process.env.placesKey}`)
          .then(({ data }) => {
            // console.log(data.result)
            data.result.adr_address
              .split(/<span class="|">|<\/span>,?\s?/)
              .filter(e => e)
              .forEach((item, index, arr) => {
                // console.log(index, item)
                var myRe = /post-office-box|extended-address|street-address|locality|region|postal-code|country-name/g
                if (index === 0 && !myRe.test(item)) {
                  this.extendedAddress = item
                  // console.log(`extended-address = ${item}`)
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
                  // console.log(`${item} = ${arr[index + 1]}`)
                }
              })
          })
      }
    },
    getAsyncData: debounce(function () {
      // if (this.suppressDropdown) {
      //   this.$refs.region.isActive = false
      //   this.$refs.thoroughfare.isActive = false
      //   this.$refs.country.isActive = false
      //   this.suppressDropdown = false
      // }
      this.data = []
      this.updateAddress()
      // console.log(this.streetAddress)
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
      let input = {}
      if (this.postOfficeBox) input.poBox = this.postOfficeBox
      if (this.extendedAddress) input.premise = this.extendedAddress
      if (this.streetAddress) input.thoroughfare = this.streetAddress
      if (this.locality) input.locality = this.locality
      if (this.regions) input.administrativearea = this.region
      if (this.postalCode) input.postalcode = this.postalCode
      if (this.countryName) input.country = this.countryName
      if (this.cCountryCode !== 'un' && this.countryCode) input.countryiso = this.cCountryCode
      if (this.usesAlternateFormat) input.usesAlternateFormat = this.usesAlternateFormat
      if (this.alt1) input.alt1 = this.alt1
      if (this.alt2) input.alt2 = this.alt2
      if (this.alt3) input.alt3 = this.alt3
      if (this.alt4) input.alt4 = this.alt4
      if (this.alt5) input.alt5 = this.alt5
      this.$emit('input', input)
    },
    findMessage (field) {
      return this.validations
    },
    findType (field) {
      return this.validations
    }
  }
}
</script>
