const schema = require('schm')
// const ac = require('../../static/postal/ac.json')
const ca = require('../../static/postal/ca.json')

const countryPostalAddressSchema = schema({
  fmt: {
    type: String,
    default: '%N%n%O%n%A%n%C'
  },
  id: String,
  key: String,
  lang: String,
  languages: {
    type: String,
    get: (value) => value ? value.split('~') : undefined
  },
  name: {
    type: String
  },
  posturl: {
    type: String
  },
  locality_name_type: {
    type: String,
    default: 'city'
  },
  state_name_type: {
    type: String,
    default: 'province'
  },
  sublocality_name_type: {
    type: String,
    default: 'suburb'
  },
  zip_name_type: {
    type: String,
    default: 'postal'
  },
  require: {
    type: String,
    default: 'AC'
  },
  sub_isoids: {
    type: String,
    get: (value) => value ? value.split('~') : undefined
  },
  sub_keys: {
    type: String,
    get: (value) => value ? value.split('~') : undefined
  },
  sub_names: {
    type: String,
    get: (value) => value ? value.split('~') : undefined
  },
  sub_zips: {
    type: String,
    get: (value) => value ? value.split('~').map(v => new RegExp(v)) : undefined
  },
  upper: {
    type: String,
    default: 'C'
  },
  zip: {
    type: String
  },
  zipex: {
    type: String,
    get:  (value) => value ? value.split(',') : undefined
  }
})

// console.log(countryPostalAddressSchema.parse(ca.CA))
// console.log(countryPostalAddressSchema.parse(ac.AC))
// console.log(ac)
