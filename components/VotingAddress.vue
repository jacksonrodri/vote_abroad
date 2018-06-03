<template>
  <div class="field">
    <span class="is-flex"><label @click.prevent="$refs.street.focus()" class="label" style="cursor: pointer;">{{ label }} </label><span v-if="toolTipTitle" @click.prevent="isOpen = !isOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span></span>
    <slot name="instructions"></slot>
    <b-message v-if="toolTipTitle" :title="toolTipTitle" type="is-info" has-icon :active.sync="isOpen">
      <slot name="tooltip"></slot>
    </b-message>
    <b-field
      :message="validations.thoroughfare.$error ? Object.keys(validations.thoroughfare.$params).map(x => $t(`request.votAdr.messages.street-${x}`)) : '' "
      :type="(validations.thoroughfare.$error ? 'is-danger': '')">
      <b-autocomplete ref="street"
        :placeholder="$t('request.votAdr.street')"
        :data="data"
        field="structured_formatting.main_text"
        v-model="street"
        :loading="isFetching"
        @keyup.native="suppressDropdown = false"
        @input="getAsyncData"
        @select="option => fillData(option)">
        <template slot-scope="props">{{ props.option.description }}</template>
        <template slot="empty">No results found</template>
      </b-autocomplete>
    </b-field>
    <b-field>
      <b-input
        :placeholder="$t('request.votAdr.apt')"
        v-model="apt"></b-input>
    </b-field>
    <div class="field is-horizontal">
      <div class="field-body">
        <b-field
          :message="validations.locality.$error ? Object.keys(validations.locality.$params).map(x => $t(`request.votAdr.messages.city-${x}`)) : '' "
          :type="(validations.locality.$error ? 'is-danger': '')">
          <b-autocomplete ref="city"
            :placeholder="$t('request.votAdr.city')"
            :data="data"
            expanded
            field="structured_formatting.main_text"
            v-model="city"
            :loading="isFetchingCity"
            @keyup.native="suppressDropdown = false"
            @input="getAsyncDataCity"
            @select="option => fillDataCity(option)">
            <template slot-scope="props">{{ props.option.description.replace(', USA', '') }} </template>
            <template slot="empty">No results found</template>
          </b-autocomplete>
        </b-field>
        <b-field
          :message="validations.stateISO.$error ? Object.keys(validations.stateISO.$params).map(x => $t(`request.votAdr.messages.state-${x}`)) : '' "
          :type="(validations.stateISO.$error ? 'is-danger': '')">
          <b-select v-model="state"
            ref="state"
            expanded
            :placeholder="$t('request.votAdr.state')">
            <option
              v-for="state in states"
              :value="state.iso"
              :key="state.iso">
              {{ state.name }}
            </option>
          </b-select>
        </b-field>
        <b-field
          :message="validations.postalcode.$error ? Object.keys(validations.postalcode.$params).map(x => $t(`request.votAdr.messages.zip-${x}`)) : '' "
          :type="(validations.postalcode.$error ? 'is-danger': '')">
          <b-input
            :placeholder="$t('request.votAdr.zip')"
            ref="zip"
            expanded
            v-model="zip"></b-input>
        </b-field>
      </div>
    </div>
    <b-field :label="$t('request.votAdr.county')">
      <b-input ref="county"
        :placeholder="$t('request.votAdr.county')"
        :disabled="state === 'DC'"
        v-model="county"></b-input>
    </b-field>
  </div>
</template>

<script>
import axios from 'axios'
import debounce from 'lodash/debounce'

export default {
  name: 'Voting-Address',
  props: [
    'value',
    'label',
    'toolTipTitle',
    'validations'
  ],
  data () {
    return {
      isOpen: false,
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
        // {'name': 'Federated States Of Micronesia', 'iso': 'FM'},
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
        // {'name': 'Marshall Islands', 'iso': 'MH'},
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
        // {'name': 'Northern Mariana Islands', 'iso': 'MP'},
        {'name': 'Ohio', 'iso': 'OH'},
        {'name': 'Oklahoma', 'iso': 'OK'},
        {'name': 'Oregon', 'iso': 'OR'},
        // {'name': 'Palau', 'iso': 'PW'},
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
      ],
      isFetching: false,
      isFetchingCity: false,
      suppressDropdown: true,
      data: []
    }
  },
  computed: {
    currentRequest () { return this.$store.getters['requests/getCurrent'] || {} },
    leoState () { return this.currentRequest.leo && this.currentRequest.leo.s ? this.currentRequest.leo.s : null },
    votAdr () { return this.currentRequest.votAdr || {} },
    street: {
      get () { return this.votAdr.thoroughfare || '' },
      set (value) { this.updateAddress('thoroughfare', value) }
    },
    apt: {
      get () { return this.votAdr.premise || '' },
      set (value) { this.updateAddress('premise', value) }
    },
    city: {
      get () { return this.votAdr.locality || '' },
      set (value) { this.updateAddress('locality', value) }
    },
    state: {
      get () { return this.votAdr.stateISO || '' },
      set (value) { this.updateAddress('stateISO', value) }
    },
    zip: {
      get () { return this.votAdr.postalcode || '' },
      set (value) { this.updateAddress('postalcode', value) }
    },
    county: {
      get () { return this.votAdr.county || '' },
      set (value) { this.updateAddress('county', value) }
    }
  },
  watch: {
    state: function (newVal) {
      if (this.leoState && this.leoState.toLowerCase() !== newVal.toLowerCase()) {
        this.$store.commit('requests/update', {leo: null})
      }
    }
  },
  async mounted () {
    if (!this.county && this.state && this.city && this.state !== 'DC') {
      let {data: { predictions }} = await axios.get(`${process.env.placesUrl + process.env.autocompleteEndpoint}?input=${this.street || ''}%20${this.city || ''}%20${this.state || ''}%20${this.zip || ''}&types=geocode&language=en&components=country:US&key=${process.env.placesKey}`)
      if (predictions.length > 0) {
        let {data: {result}} = await axios.get(`${process.env.placesUrl + process.env.detailsEndpoint}?placeid=${predictions[0].place_id}&key=${process.env.placesKey}`)
        this.county = result.address_components.filter(y => y.types.indexOf('administrative_area_level_2') > -1)[0].long_name
      }
    }
  },
  methods: {
    updateAddress: function (field, value) {
      this.$store.commit('requests/update', {votAdr: Object.assign({}, this.votAdr, {[field]: value || null})})
      this.$emit('input')
    },
    getAsyncData: debounce(function () {
      this.isFetching = true
      if (this.suppressDropdown) {
        this.$refs.street.isActive = false
        this.$refs.city.isActive = false
        this.suppressDropdown = false
        this.isFetching = false
      }
      this.data = []
      axios.get(`${process.env.placesUrl + process.env.autocompleteEndpoint}?input=${this.street}&types=geocode&language=en&components=country:US&key=${process.env.placesKey}`)
        .then(({ data }) => {
          data.predictions.forEach((item) => this.data.push(item))
          this.isFetching = false
        }, response => {
          this.isFetching = false
        })
    }, 500),
    fillData (option) {
      if (option && option.place_id) {
        axios.get(`${process.env.placesUrl + process.env.detailsEndpoint}?placeid=${option.place_id}&key=${process.env.placesKey}`)
          .then(({ data }) => {
            this.state = data.result.address_components.filter(n => n.types.indexOf('administrative_area_level_1') > -1)[0].short_name
            if (this.state !== 'DC') {
              this.county = data.result.address_components.filter(y => y.types.indexOf('administrative_area_level_2') > -1)[0].long_name
            }
            // console.log('adr_address', data.result.adr_address.split(/<span class="|">|<\/span>,?\s?/))
            data.result.adr_address
              .split(/<span class="|">|<\/span>,?\s?/)
              .filter(e => e)
              .forEach((item, index, arr) => {
                var myRe = /post-office-box|extended-address|street-address|locality|region|postal-code|country-name/g
                if (index === 0 && !myRe.test(item)) {
                  this.extendedAddress = item
                } else if (myRe.test(item)) {
                  switch (item) {
                    case 'post-office-box':
                      // this.postOfficeBox = arr[index + 1]
                      break
                    case 'street-address':
                      this.street = arr[index + 1]
                      break
                    case 'locality':
                      this.city = arr[index + 1]
                      break
                    case 'region':
                      this.state = arr[index + 1]
                      break
                    case 'postal-code':
                      this.zip = arr[index + 1]
                      break
                  }
                }
              })
          })
      }
    },
    getAsyncDataCity: debounce(function () {
      this.isFetchingCity = true
      if (this.suppressDropdown) {
        this.$refs.street.isActive = false
        this.$refs.city.isActive = false
        this.suppressDropdown = false
        this.isFetchingCity = false
      }
      this.data = []
      axios.get(`${process.env.placesUrl + process.env.autocompleteEndpoint}?input=${this.city}&types=(cities)&language=en&components=country:US&key=${process.env.placesKey}`)
        .then(({ data }) => {
          data.predictions.forEach((item) => this.data.push(item))
          this.isFetchingCity = false
        }, response => {
          this.isFetchingCity = false
        })
    }, 500),
    fillDataCity (option) {
      if (option && option.place_id) {
        axios.get(`${process.env.placesUrl + process.env.detailsEndpoint}?placeid=${option.place_id}&key=${process.env.placesKey}`)
          .then(({ data }) => {
            this.county = data.result.address_components.filter(y => y.types.indexOf('administrative_area_level_2') > -1)[0].long_name
            this.state = data.result.address_components.filter(n => n.types.indexOf('administrative_area_level_1') > -1)[0].short_name
            data.result.adr_address
              .split(/<span class="|">|<\/span>,?\s?/)
              .filter(e => e)
              .forEach((item, index, arr) => {
                var myRe = /post-office-box|extended-address|street-address|locality|region|postal-code|country-name/g
                if (index === 0 && !myRe.test(item)) {
                  this.extendedAddress = item
                } else if (myRe.test(item)) {
                  switch (item) {
                    case 'post-office-box':
                      // this.postOfficeBox = arr[index + 1]
                      break
                    case 'street-address':
                      this.street = arr[index + 1]
                      break
                    case 'locality':
                      this.city = arr[index + 1]
                      break
                    case 'region':
                      this.state = arr[index + 1]
                      break
                    case 'postal-code':
                      this.zip = arr[index + 1]
                      break
                  }
                }
              })
          })
      }
    }
  }
}
</script>
