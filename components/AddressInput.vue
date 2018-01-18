<template>
  <section>
    <!-- <h3 class="subtitle">{{ label }}</h3> -->
    <div class="field-label has-text-left">
      <label class="label">{{ label }}</label>
    </div>
    <slot name="instructions"></slot>
    <div v-if="usOnly === undefined || usOnly === false" class="field is-fullwidth">
          <div class="field-body">
            <b-field grouped>
              <b-field expanded>
                <b-field>
                  <p class="control flag-container">
                    <b-icon
                      :icon="countryCode.toLowerCase()"
                      pack="flag-icon"
                      @click.native="$refs.country.focus()">
                    </b-icon>
                  </p>
                  <b-autocomplete
                      v-model="intlAddr['country-name']"
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
                      <span :class="`flag-icon flag-icon-${props.option.iso.toLowerCase()}`"></span>{{ props.option.label }}
                    </template>
                  </b-autocomplete>
                </b-field>
              </b-field>
            </b-field>
          </div>
        </div>
        <div class="field">
          <div class="field-label is-normal">
            <label class="label"></label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <b-autocomplete
                  v-model="intlAddr['street-address']"
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
                <!-- <input class="input" v-model="intlAddr['street-address']" type="text" :placeholder="throroughfareLabel"> -->
              </div>
            </div>
          </div>
        </div>
        <div class="field">
          <div class="field-label is-normal">
            <label class="label"></label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <input class="input" @input="updateAddress()" v-model="intlAddr['extended-address']" type="text" :placeholder="premiseLabel">
              </div>
            </div>
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-body">
            <div class="field" v-for="field in localityFields" :key="Object.keys(field)[0]">
              <p v-if="Object.keys(field)[0] === 'localityname'" class="control is-expanded">
                <input class="input" type="text" @input="updateAddress()" v-model="intlAddr['locality']" :placeholder="field.localityname.label">
              </p>
              <div v-if="Object.keys(field)[0] === 'administrativearea'">
                <div v-if="field.administrativearea && field.administrativearea.options" >
                  <b-autocomplete
                    v-model="intlAddr['region']"
                    :placeholder="field.administrativearea.label"
                    :data="filteredRegions"
                    :keep-first="true"
                    field="name"
                    @input="updateAddress()"
                    @select="option => selected = option"
                    >
                  </b-autocomplete>
                  <!-- <select v-model="intlAddr['region']" name="" id="">
                    <option selected>{{field.administrativearea.label}}</option>
                    <option v-for="state in field.administrativearea.options.slice(1)" :key="Object.keys(state)[0]" >{{state[Object.keys(state)[0]]}}</option>
                  </select> -->
                </div>
                <input v-if="field.administrativearea && !field.administrativearea.options" v-model="intlAddr['region']" @input="updateAddress()" class="input" type="text" :placeholder="field.administrativearea.label">
              </div>
              <p v-if="Object.keys(field)[0] === 'postalcode'" class="control is-expanded">
                <input class="input" v-model="intlAddr['postal-code']" type="text" @input="updateAddress()" :placeholder="field.postalcode.label">
              </p>
            </div>
          </div>
        </div>
        <div v-if="(usOnly !== undefined && usOnly !== false) || usOnly === true" class="field is-fullwidth">
          county
        </div>
  </section>
</template>

<script>
import countries from '~/assets/countryaddresses'
import axios from 'axios'
import debounce from 'lodash/debounce'

export default {
  props: [
    'value',
    'usOnly',
    'label'
  ],
  mounted () {
    if (this.usOnly !== undefined) {
      this.intlAddr['country-code'] = 'US'
      this.intlAddr['country-name'] = 'United States'
      // this.$refs.country.setSelected(0)
      this.$refs.premise.focus()
    }
  },
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
      name: '',
      selected: null,
      isFetching: false,
      country: '',
      thoroughfare: '',
      premise: '',
      locality: '',
      administrativearea: '',
      postalcode: ''
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
          if (!this.intlAddr.region) {
            return x.abbr !== ''
          } else {
            return x.abbr.toString().toLowerCase().indexOf(this.intlAddr.region.toString().toLowerCase()) > -1 || x.name.toString().toLowerCase().indexOf(this.intlAddr.region.toString().toLowerCase()) > -1
          }
        })
    }
  },
  methods: {
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
                  this.intlAddr['extended-address'] = item
                  console.log(`extended-address = ${item}`)
                } else if (item === 'country-name') {
                  data.result['address_components'].forEach(x => {
                    if (x.types[0] === 'country') {
                      this.intlAddr['country-name'] = x['long_name']
                      this.intlAddr['country-code'] = x['short_name']
                    }
                  })
                } else if (myRe.test(item)) {
                  this.intlAddr[item] = arr[index + 1]
                  console.log(`${item} = ${arr[index + 1]}`)
                }
              })
          })
      }
    },
    // You have to install and import debounce to use it,
    // it's not mandatory though.
    getAsyncData: debounce(function () {
      this.data = []
      this.updateAddress()
      console.log(this.intlAddr['street-address'])
      this.isFetching = true
      // axios.get(`${process.env.autocompleteUrl}?input=${this.intlAddr['street-address']}&types=geocode&language=en${this.countryCode && this.countryCode !== 'un' ? '&components=country:' + this.countryCode : ''}&key=AIzaSyDK4AprF-iXbiX2-eU3SAQVyovB_8kIg20`)
      axios.get(`${process.env.placesUrl + process.env.autocompleteEndpoint}?input=${this.intlAddr['street-address']}&types=geocode&language=en${this.countryCode && this.countryCode !== 'un' ? '&components=country:' + this.countryCode : ''}&key=${process.env.placesKey}`)
        .then(({ data }) => {
          data.predictions.forEach((item) => this.data.push(item))
          this.isFetching = false
        }, response => {
          this.isFetching = false
        })
    }, 500),
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
  width: 3.8em;
  height: 100%;
  line-height: inherit;

.flag-container
  width: 3em;

.flag-container > span
  width: 100%;
  height: 100%;
</style>
