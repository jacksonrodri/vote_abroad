<template>
  <section>
    <span class="is-flex"><label @click="$refs.premise.focus()" class="label" style="cursor: pointer;">{{ label }} </label><span v-if="toolTipTitle" @click="isOpen = !isOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span></span>
    <slot name="instructions"></slot>
    <b-message v-if="toolTipTitle" :title="toolTipTitle" type="is-info" has-icon :active.sync="isOpen">
      <slot name="tooltip"></slot>
    </b-message>
        <div class="field">
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
                  placeholder="Street Address"
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
        <div class="field">
          <div class="field-label is-normal">
            <label class="label"></label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <input class="input" @input="updateAddress()" v-model="extendedAddress" type="text" placeholder="Apt#">
              </div>
            </div>
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-body">
            <!-- City -->
            <div class="field">
              <div class="control">
                <b-autocomplete
                  v-model="locality"
                  :data="data"
                  expanded
                  ref="city"
                  placeholder="City"
                  field="structured_formatting.main_text"
                  :loading="isFetching"
                  @change="getCityAsync"
                  @select="option => fillDataCity(option)">
                  <template slot-scope="props">{{ `${streetAddress ? props.option.structured_formatting.secondary_text : ''}` }} {{ `${streetAddress ? props.option.structured_formatting.main_text : ''}` }} {{`${!streetAddress ? props.option.description : ''}` }} </template>
                  <template slot="empty">No results found</template>
                </b-autocomplete>
              </div>
            </div>
            <b-field>
              <b-select v-model="regionCode" @input="updateAddress()" expanded placeholder="State">
                <option
                  v-for="state in states"
                  :value="state.iso"
                  :key="state.iso">
                  {{ state.name }}
                </option>
              </b-select>
            </b-field>
            <!-- Zip -->
            <div class="field">
              <p class="control is-expanded">
                <input class="input" v-model="postalCode" type="text" @input="updateAddress()" placeholder="Zip">
              </p>
            </div>
          </div>
        </div>
        <div class="field is-fullwidth">
          <!-- votAdr.county -->
          <b-field label="County">
            <b-input v-model="county"></b-input>
          </b-field>
        </div>
        <div class="field is-fullwidth">
          <!-- votAdr.county -->
          <!-- <b-field :label="`Jurisdiction (${regionCode && jurisdictionTypes[regionCode] ? jurisdictionTypes[regionCode].join(', ') : 'County, City or Town'})`"> -->
          <div class="field">
            <span class="is-flex">
              <label class="label">
                {{ `Jurisdiction (${regionCode && jurisdictionTypes[regionCode] ? jurisdictionTypes[regionCode].join(', ') : 'County, City or Town'})` }}
              </label>
            <span @click="isJurisdictionOpen = !isJurisdictionOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-search"></i></span></span>
            <b-autocomplete
                v-model="jurisdiction"
                ref="jurisdiction"
                :placeholder="`type to find your ${regionCode && jurisdictionTypes[regionCode] ? jurisdictionTypes[regionCode].join('/') : 'County/City/Town'} Local Election Official`"
                :keep-first="true"
                :data="filteredLeos"
                open-on-focus
                field="jurisdiction"
                @change="updateAddress()"
                @select="option => selected = option">
                <template slot-scope="props">{{ props.option.jurisdiction }} ({{ props.option.jurisdictionType }}) {{ props.option.state }}</template>
            </b-autocomplete>
          </div>
          <b-message title="Local Election Official Address (to be hidden/reformatted later):" type="is-info" has-icon :active.sync="isJurisdictionOpen">
            <pre><strong>Local Election Official Address (to be hidden/reformatted later):</strong><br/> {{leo}}</pre>
          </b-message>
        </div>
  </section>
</template>

<script>
import axios from 'axios'
import debounce from 'lodash/debounce'

export default {
  name: 'US-Address',
  props: [
    'value',
    'label',
    'toolTipTitle'
  ],
  async mounted () {
    await this.$store.app.$content('/leos').getAll()
      .then((data) => {
        const templeos = data[0].body
        const tempstates = Object.keys(templeos)
        let leomap = tempstates.map(state => Object.keys(templeos[state]).map(leo => Object.assign({jurisdiction: leo, state: state}, templeos[state][leo])))
        this.leos = [].concat(...leomap)
        this.jurisdictionTypes = Object.entries(templeos).map(([state, value]) => ({ state: state, jurisdictionTypes: [...new Set(Object.entries(value).map(([state, value]) => value.jurisdictionType))] })).reduce(function (acc, cur) { acc[cur.state] = cur.jurisdictionTypes; return acc }, {})
      })
    if (this.value) {
      this.postOfficeBox = this.value.poBox || ''
      this.extendedAddress = this.value.premise || ''
      this.streetAddress = this.value.thoroughfare || ''
      this.locality = this.value.locality || ''
      this.region = this.value.administrativearea || ''
      this.regionCode = this.value.regionCode || ''
      this.postalCode = this.value.postalcode || ''
      this.county = this.value.county || ''
      this.leo = this.value.leo || ''
      this.countryName = this.value.country || ''
      this.countryCode = this.value.countryiso || ''
    }
  },
  data: function () {
    return {
      data: [],
      postOfficeBox: '',
      extendedAddress: '',
      streetAddress: '',
      leo: {},
      locality: '',
      region: '',
      regionCode: '',
      postalCode: '',
      countryName: 'United States',
      countryCode: 'US',
      selected: null,
      isFetching: false,
      country: '',
      thoroughfare: '',
      premise: '',
      administrativearea: '',
      postalcode: '',
      county: '',
      jurisdictionChoices: [],
      jurisdiction: '',
      leos: [],
      jurisdictionTypes: {},
      isOpen: false,
      isJurisdictionOpen: false,
      suppressDropdown: true,
      states: [
        {'name': 'Alabama', 'iso': 'AL'},
        {'name': 'Alaska', 'iso': 'AK'},
        {'name': 'American Samoa', 'iso': 'AS'},
        {'name': 'Arizona', 'iso': 'AZ'},
        {'name': 'Arkansas', 'iso': 'AR'},
        {'name': 'California', 'iso': 'CA'},
        {'name': 'Colorado', 'iso': 'CO'},
        {'name': 'Connecticut', 'iso': 'CT'},
        {'name': 'Delaware', 'iso': 'DE'},
        {'name': 'District Of Columbia', 'iso': 'DC'},
        {'name': 'Federated States Of Micronesia', 'iso': 'FM'},
        {'name': 'Florida', 'iso': 'FL'},
        {'name': 'Georgia', 'iso': 'GA'},
        {'name': 'Guam', 'iso': 'GU'},
        {'name': 'Hawaii', 'iso': 'HI'},
        {'name': 'Idaho', 'iso': 'ID'},
        {'name': 'Illinois', 'iso': 'IL'},
        {'name': 'Indiana', 'iso': 'IN'},
        {'name': 'Iowa', 'iso': 'IA'},
        {'name': 'Kansas', 'iso': 'KS'},
        {'name': 'Kentucky', 'iso': 'KY'},
        {'name': 'Louisiana', 'iso': 'LA'},
        {'name': 'Maine', 'iso': 'ME'},
        {'name': 'Marshall Islands', 'iso': 'MH'},
        {'name': 'Maryland', 'iso': 'MD'},
        {'name': 'Massachusetts', 'iso': 'MA'},
        {'name': 'Michigan', 'iso': 'MI'},
        {'name': 'Minnesota', 'iso': 'MN'},
        {'name': 'Mississippi', 'iso': 'MS'},
        {'name': 'Missouri', 'iso': 'MO'},
        {'name': 'Montana', 'iso': 'MT'},
        {'name': 'Nebraska', 'iso': 'NE'},
        {'name': 'Nevada', 'iso': 'NV'},
        {'name': 'New Hampshire', 'iso': 'NH'},
        {'name': 'New Jersey', 'iso': 'NJ'},
        {'name': 'New Mexico', 'iso': 'NM'},
        {'name': 'New York', 'iso': 'NY'},
        {'name': 'North Carolina', 'iso': 'NC'},
        {'name': 'North Dakota', 'iso': 'ND'},
        {'name': 'Northern Mariana Islands', 'iso': 'MP'},
        {'name': 'Ohio', 'iso': 'OH'},
        {'name': 'Oklahoma', 'iso': 'OK'},
        {'name': 'Oregon', 'iso': 'OR'},
        {'name': 'Palau', 'iso': 'PW'},
        {'name': 'Pennsylvania', 'iso': 'PA'},
        {'name': 'Puerto Rico', 'iso': 'PR'},
        {'name': 'Rhode Island', 'iso': 'RI'},
        {'name': 'South Carolina', 'iso': 'SC'},
        {'name': 'South Dakota', 'iso': 'SD'},
        {'name': 'Tennessee', 'iso': 'TN'},
        {'name': 'Texas', 'iso': 'TX'},
        {'name': 'Utah', 'iso': 'UT'},
        {'name': 'Vermont', 'iso': 'VT'},
        {'name': 'Virgin Islands', 'iso': 'VI'},
        {'name': 'Virginia', 'iso': 'VA'},
        {'name': 'Washington', 'iso': 'WA'},
        {'name': 'West Virginia', 'iso': 'WV'},
        {'name': 'Wisconsin', 'iso': 'WI'},
        {'name': 'Wyoming', 'iso': 'WY'}
      ]
    }
  },
  computed: {
    filteredLeos () {
      return this.leos
        .filter(x => this.regionCode ? x.state === this.regionCode : true)
        .filter(x => {
          if (x.jurisdictionType.toLowerCase() === 'county' || x.jurisdictionType.toLowerCase() === 'island') {
            return x.jurisdiction.toString().toLowerCase().indexOf(this.county.toLowerCase()) >= 0 ||
              this.county.toString().toLowerCase().indexOf(x.jurisdiction.toLowerCase()) >= 0
          } else if (x.jurisdictionType.toLowerCase() === 'all') {
            return true
          } else {
            return this.locality.toString().toLowerCase().indexOf(x.jurisdiction.toLowerCase()) >= 0 ||
              x.jurisdiction.toString().toLowerCase().indexOf(this.locality.toLowerCase()) >= 0 ||
              (x.jurisdiction.toString().toLowerCase() === 'ny manhattan' && this.locality.toLowerCase().indexOf('new york') >= 0)
          }
        })
        .filter(x => x.jurisdiction.toString().toLowerCase().indexOf(this.jurisdiction.toLowerCase()) >= 0)
    }
  },
  watch: {
    regionCode: function (newVal, oldVal) {
      // console.log(`finding ${newVal}`)
      let statesWithoutLeos = ['AA', 'AE', 'AP', 'AS', 'FM', 'GU', 'MH', 'MP', 'PW', 'PR', 'VI', 'WI']
      if (newVal !== oldVal && statesWithoutLeos.indexOf(newVal) === -1) {
      }
    },
    filteredLeos: function (newVal, oldVal) {
      if (newVal && newVal.length === 1) {
        this.$refs.jurisdiction.setSelected(newVal[0])
        this.leo = newVal[0]
      }
    }
  },
  methods: {
    fillData (option) {
      // console.log('selected:', this.selected)
      // console.log('option', option)
      if (option && option.place_id) {
        this.suppressDropdown = true
        axios.get(`${process.env.placesUrl + process.env.detailsEndpoint}?placeid=${option.place_id}&key=${process.env.placesKey}`)
          .then(({ data }) => {
            this.county = data.result.address_components.filter(y => y.types.indexOf('administrative_area_level_2') > -1)[0].long_name
            this.regionCode = data.result.address_components.filter(n => n.types.indexOf('administrative_area_level_1') > -1)[0].short_name
            // console.log(data.result.adr_address)
            data.result.adr_address
              .split(/<span class="|">|<\/span>,?\s?/)
              .filter(e => e)
              .forEach((item, index, arr) => {
                // console.log(index, item)
                var myRe = /post-office-box|extended-address|street-address|locality|region|postal-code|country-name/g
                if (index === 0 && !myRe.test(item)) {
                  this.extendedAddress = item
                  // console.log(`extended-address = ${item}`)
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
                      // console.log(arr[index + 1])
                      // this.$refs.state.setSelected(arr[index + 1])
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
    fillDataCity (option) {
      // console.log('selected:', this.selected)
      // console.log('option', option)
      if (option && option.place_id) {
        this.suppressDropdown = true
        axios.get(`${process.env.placesUrl + process.env.detailsEndpoint}?placeid=${option.place_id}&key=${process.env.placesKey}`)
          .then(({ data }) => {
            this.county = data.result.address_components.filter(y => y.types.indexOf('administrative_area_level_2') > -1)[0].long_name
            this.regionCode = data.result.address_components.filter(n => n.types.indexOf('administrative_area_level_1') > -1)[0].short_name
            this.locality = data.result.address_components.filter(n => n.types.indexOf('locality') > -1)[0].short_name
          })
      }
    },
    getAsyncData: debounce(function () {
      if (this.suppressDropdown) {
        this.$refs.city.isActive = false
        this.$refs.premise.isActive = false
        this.suppressDropdown = false
      }
      this.data = []
      this.updateAddress()
      // console.log(this.streetAddress)
      this.isFetching = true
      axios.get(`${process.env.placesUrl + process.env.autocompleteEndpoint}?input=${this.streetAddress}&types=geocode&language=en&components=country:US&key=${process.env.placesKey}`)
        .then(({ data }) => {
          data.predictions.forEach((item) => this.data.push(item))
          this.isFetching = false
        }, response => {
          this.isFetching = false
        })
    }, 500),
    getCityAsync: debounce(function () {
      if (this.suppressDropdown) {
        this.$refs.city.isActive = false
        this.$refs.premise.isActive = false
        this.suppressDropdown = false
      }
      this.data = []
      this.updateAddress()
      // console.log(this.locality)
      this.isFetching = true
      axios.get(`${process.env.placesUrl + process.env.autocompleteEndpoint}?input=${this.streetAddress ? this.streetAddress + ' ' + this.locality : this.locality}&types=geocode&language=en&components=country:US&key=${process.env.placesKey}`)
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
        regionCode: this.regionCode,
        postalcode: this.postalCode,
        county: this.county,
        leo: this.leo,
        country: this.countryName,
        countryiso: 'US'
      })
    }
  }
}
</script>
