import axios from 'axios'
import debounce from 'lodash/debounce'

export const placesAutocomplete = debounce(function (val) {
  this.data = []
  this.isFetching = true
  axios.get(`${process.env.placesUrl + process.env.autocompleteEndpoint}?input=${val}&types=geocode&language=en${this.userCountry || this.countryiso ? '&components=country:' + this.countryiso || this.userCountry : ''}&key=${process.env.placesKey}`)
    .then(({ data }) => {
      data.predictions.forEach((item) => this.data.push(item))
      this.isFetching = false
    }, response => {
      this.isFetching = false
    })
}, 500)

// export const placesFillData = function (option) {
//   let input = {}
//   let currentCountry = this.countryiso !== undefined ? this.countryiso : 'US'
//   if (option && option.place_id) {
//     axios.get(`${process.env.placesUrl + process.env.detailsEndpoint}?placeid=${option.place_id}&language=en&key=${process.env.placesKey}`)
//       .then(({ data }) => {
//         if (data.status && data.status === 'NOT_FOUND') {
//           this.$toast.open({
//             message: 'Unable to retrieve address. Please enter manually.',
//             duration: 3500,
//             type: 'is-warning'
//           })
//         } else {
//           let result = data.result
//           let ctry = components.filter(({types}) => types.includes('country')).length > 0 ? components.filter(({types}) => types.includes('country'))[0].short_name : null
//           let region = components.filter(({types}) => types.includes('administrative_area_level_1')).length > 0 ? components.filter(({types}) => types.includes('administrative_area_level_1'))[0].short_name : null
//           // console.log('placeid data', components.filter(({types}) => types.includes('country')))
//           // input.A = adrFormat.includes('street-address') ? this.latinize(adrFormat.match('<span class="street-address">(.*?)</span>')[1]) : null
//           if (ctry.toLowerCase() === 'jp') {
//             input.A = formatted.split(',')[0]
//             input.B = formatted.split(',')[1]
//           } else {
//             input.B = adrFormat.includes('extended-address') ? adrFormat.match('<span class="extended-address">(.*?)</span>')[1] : null
//             input.D = components.filter(({types}) => types.includes('sublocality')).length > 0 ? components.filter(({types}) => types.includes('sublocality'))[0].long_name : null
//           }
//           input.C = adrFormat.includes('locality') ? adrFormat.match('<span class="locality">(.*?)</span>')[1] : null
//           input.S = adrFormat.includes('region') ? adrFormat.match('<span class="region">(.*?)</span>')[1] : region
//           input.Z = adrFormat.includes('postal-code') ? adrFormat.match('<span class="postal-code">(.*?)</span>')[1] : null
//           if (this.Y !== undefined) input.Y = components.filter(y => y.types.indexOf('administrative_area_level_2') > -1)[0].long_name
//           if (this.countryiso !== undefined) input.country = this.getCountryName(ctry)
//           if (this.countryiso !== undefined) input.countryiso = ctry
//           this.update(input)
//           console.log(currentCountry, res)
//         }
//       })
//   }
// }

export const placesDetails = async function (option) {
  if (!option || !option.place_id) {
    return
  }
  try {
    let {data} = await axios.get(`${process.env.placesUrl + process.env.detailsEndpoint}?placeid=${option.place_id}&language=en&key=${process.env.placesKey}`)
    if (data.status && data.status === 'NOT_FOUND') {
      this.$toast.open({
        message: 'Unable to retrieve address. Please enter manually.',
        duration: 3500,
        type: 'is-warning'
      })
      throw new Error(`no place details found for: ${JSON.stringify(option, null, 2)}`)
    }
    let input = {}
    let {result: {address_components: components = [], formatted_address: formatted = '', adr_address: adrFormat = ''}} = data
    let {short_name: ctry = null} = (components.find(({types}) => types.includes('country')))
    let {short_name: region = null} = (components.find(({types}) => types.includes('administrative_area_level_1')))
    let B = adrFormat.includes('extended-address') ? adrFormat.match('<span class="extended-address">(.*?)</span>')[1] : null
    let {long_name: D = null} = (components.find(({types}) => types.includes('country')))
    let C = adrFormat.includes('locality') ? adrFormat.match('<span class="locality">(.*?)</span>')[1] : null
    let S = adrFormat.includes('region') ? adrFormat.match('<span class="region">(.*?)</span>')[1] : region
    let Z = adrFormat.includes('postal-code') ? adrFormat.match('<span class="postal-code">(.*?)</span>')[1] : null
    let {long_name: Y = null} = (components.find(({types}) => types.includes('administrative_area_level_2')))
    if (this.countryiso !== undefined) input.country = this.getCountryName(ctry)
    if (this.countryiso !== undefined) input.countryiso = ctry
    let A
    if (ctry.toLowerCase() === 'jp') {
      A = formatted.split(',')[0]
      B = formatted.split(',')[1]
    }
    this.update(input)
    console.log(A, B, C, D, S, Z, Y)
  } catch (error) {
    console.log(error)
  }
}
