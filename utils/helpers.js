import axios from 'axios'
import debounce from 'lodash/debounce'

const placesAutocomplete = debounce(function (val, country, addressType, searchType) {
  this.data = []
  this.isFetching = true
  let options = `&types=${searchType === 'city' ? '(cities)' : 'geocode'}&language=en${addressType === 'votAdr' ? '&components=country:us|country:pr|country:vi|country:gu|country:mp' : country ? '&components=country:' + country : ''}`
  try {
    axios.get(`${process.env.placesUrl + process.env.autocompleteEndpoint}?input=${val}${options}&key=${process.env.placesKey}&session_token=${this.sessionToken}`)
      .then(({ data }) => {
        data.predictions.forEach((item) => this.data.push(item))
        this.isFetching = false
        return data.predictions
      }, response => {
        this.isFetching = false
      })
  } catch (e) {
    this.isFetching = false
    console.log('placesAutocompleteError', e)
    return []
  }
}, 500)

const placeDetails = function fillData (option) {
  let input = {}
  // console.log('option', option)
  if (option && option.place_id) {
    axios.get(`${process.env.placesUrl + process.env.detailsEndpoint}?placeid=${option.place_id}&language=en&key=${process.env.placesKey}&session_token=${this.sessionToken}`)
      .then(({ data }) => {
        if (data.status && data.status === 'NOT_FOUND') {
          this.$toast.open({
            message: 'Unable to retrieve address. Please enter manually.',
            duration: 3500,
            type: 'is-warning'
          })
        } else {
          let result = data.result
          let ctry = result.address_components && result.address_components.filter(({types}) => types.includes('country')).length > 0 ? result.address_components.filter(({types}) => types.includes('country'))[0].short_name : null
          let region = result.address_components && result.address_components.filter(({types}) => types.includes('administrative_area_level_1')).length > 0 ? result.address_components.filter(({types}) => types.includes('administrative_area_level_1'))[0].short_name : null
          // console.log('placeid data', result.address_components.filter(({types}) => types.includes('country')))
          // input.A = result.adr_address && result.adr_address.includes('street-address') ? this.latinize(result.adr_address.match('<span class="street-address">(.*?)</span>')[1]) : null
          if (ctry.toLowerCase() === 'jp') {
            input.A = result.formatted_address.split(', ')[0]
            input.B = this.adr.B || result.formatted_address.split(', ')[1]
          } else if (this.fieldName === 'votAdr') {
            input.A = result.adr_address && result.adr_address.includes('street-address') ? result.adr_address.match('<span class="street-address">(.*?)</span>')[1] : this.adr.A || null
            input.B = this.adr.B || (result.adr_address && result.adr_address.includes('extended-address') ? result.adr_address.match('<span class="extended-address">(.*?)</span>')[1] : null)
          } else {
            input.B = this.adr.B || (result.adr_address && result.adr_address.includes('extended-address') ? result.adr_address.match('<span class="extended-address">(.*?)</span>')[1] : null)
            input.D = result.address_components && result.address_components.filter(({types}) => types.includes('sublocality')).length > 0 ? result.address_components.filter(({types}) => types.includes('sublocality'))[0].long_name : null
          }
          input.C = result.adr_address && result.adr_address.includes('locality') ? result.adr_address.match('<span class="locality">(.*?)</span>')[1] : null
          input.S = result.adr_address && result.adr_address.includes('region') ? result.adr_address.match('<span class="region">(.*?)</span>')[1] : region
          input.Z = result.adr_address && result.adr_address.includes('postal-code') ? result.adr_address.match('<span class="postal-code">(.*?)</span>')[1] : null
          if (this.fieldName === 'votAdr') input.Y = data.result.address_components.filter(y => y.types.indexOf('administrative_area_level_2') > -1)[0].long_name
          // input.country = this.getCountryName(ctry)
          input.countryiso = this.fieldName === 'votAdr' ? 'US' : ctry
          Object.keys(input)
            .forEach(x => {
              input[x] = typeof input[x] === 'string' ? decodeHtmlEntity(latinize(input[x])) : input[x]
            })
          console.log('input', input)
          this.update({[this.fieldName]: Object.assign({}, this.adr, input)})
        }
      })
    this.sessionToken = uuidv4()
  }
}

const cleanString = function (str) {
  return typeof str === 'string' ? decodeHtmlEntity(latinize(str)) : str
}

const returnArrayOfReasonableBirthDates = function (dateString) {
  let currentYear = new Date().getFullYear()
  let dateArr = []
  let dateRegexPatterns = {
    YMD: /^(\d?\d?\d\d)(?:\/|-|\.)(\d?\d)(?:\/|-|\.)(\d?\d)$/g,
    MDY: /^(\d?\d)(?:\/|-|\.)(\d?\d)(?:\/|-|\.)(\d?\d?\d\d)$/g,
    DMY: /^(\d?\d)(?:\/|-|\.)(\d?\d)(?:\/|-|\.)(\d?\d?\d\d)$/g
  }

  if (/^\d+(?:\/|-|\.)\d+(?:\/|-|\.)\d+$/.test(dateString)) {
    Object.entries(dateRegexPatterns).forEach(([regexName, dateRegex]) => {
      let matchArr
      let yPos = regexName.indexOf('Y') + 1
      let mPos = regexName.indexOf('M') + 1
      let dPos = regexName.indexOf('D') + 1
      while ((matchArr = dateRegex.exec(dateString)) !== null) {
        let validDate = formatDate(matchArr[yPos], matchArr[mPos], matchArr[dPos])
        if (validDate) dateArr.push(validDate)
      }
    })
  } else {
    // dateArr.push(new Date(Date.parse(dateString)))
    dateArr.push(new Date(Date.parse(dateString) - (new Date().getTimezoneOffset() * 60000)))
  }
  // console.log(new Date(Date.parse('june 1 82') + new Date().getTimezoneOffset() * 60000))
  // console.log(new Date(Date.parse('june 1 82') - (new Date().getTimezoneOffset() * 60000)))
  return dateArr
    .map(function (date) { return date.getTime() })
    .filter(function (date, i, array) {
      // remove entries that are duplicates or before today
      return array.indexOf(date) === i && date < new Date()
    })
    .map(function (time) { return new Date(time) })

  function formatDate (y, m, d) {
    let year = y.length === 4 ? y : parseInt(y) < currentYear - 2010 ? '20' + y : '19' + y
    year = year < 1890 || year > currentYear ? null : year
    let month = parseInt(m) - 1
    let day = parseInt(d)
    let parsedDate = new Date(Date.UTC(year, month, day))
    if (!year || parsedDate.getUTCMonth() !== month) {
    } else return parsedDate
  }
}

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
//             input.A = formatted.split(', ')[0]
//             input.B = formatted.split(', ')[1]
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

const placesDetails = async function (option) {
  if (!option || !option.place_id) {
    return
  }
  try {
    let {data} = await axios.get(`${process.env.placesUrl + process.env.detailsEndpoint}?placeid=${option.place_id}&language=en&key=${process.env.placesKey}&session_token=${this.sessionToken}`)
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
      A = formatted.split(', ')[0]
      B = formatted.split(', ')[1]
    }
    this.update(input)
    console.log(A, B, C, D, S, Z, Y)
  } catch (error) {
    console.log(error)
  }
}

function decodeHtmlEntity (str) {
  return typeof str === 'string'
    ? str.replace(/&#(\d+);/g, function (match, dec) {
      return String.fromCharCode(dec)
    })
    : str
}

function latinize (str) {
  if (typeof str === 'string') {
    return str.replace(/[^A-Za-z0-9]/g, function (x) {
      return latinizeCharacters[x] || x
    })
  } else {
    return str
  }
}

function uuidv4 () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0
    var v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

const latinizeCharacters = { 'Á': 'A', 'Ă': 'A', 'Ắ': 'A', 'Ặ': 'A', 'Ằ': 'A', 'Ẳ': 'A', 'Ẵ': 'A', 'Ǎ': 'A', 'Â': 'A', 'Ấ': 'A', 'Ậ': 'A', 'Ầ': 'A', 'Ẩ': 'A', 'Ẫ': 'A', 'Ä': 'A', 'Ǟ': 'A', 'Ȧ': 'A', 'Ǡ': 'A', 'Ạ': 'A', 'Ȁ': 'A', 'À': 'A', 'Ả': 'A', 'Ȃ': 'A', 'Ā': 'A', 'Ą': 'A', 'Å': 'A', 'Ǻ': 'A', 'Ḁ': 'A', 'Ⱥ': 'A', 'Ã': 'A', 'Ꜳ': 'AA', 'Æ': 'AE', 'Ǽ': 'AE', 'Ǣ': 'AE', 'Ꜵ': 'AO', 'Ꜷ': 'AU', 'Ꜹ': 'AV', 'Ꜻ': 'AV', 'Ꜽ': 'AY', 'Ḃ': 'B', 'Ḅ': 'B', 'Ɓ': 'B', 'Ḇ': 'B', 'Ƀ': 'B', 'Ƃ': 'B', 'Ć': 'C', 'Č': 'C', 'Ç': 'C', 'Ḉ': 'C', 'Ĉ': 'C', 'Ċ': 'C', 'Ƈ': 'C', 'Ȼ': 'C', 'Ď': 'D', 'Ḑ': 'D', 'Ḓ': 'D', 'Ḋ': 'D', 'Ḍ': 'D', 'Ɗ': 'D', 'Ḏ': 'D', 'ǲ': 'D', 'ǅ': 'D', 'Đ': 'D', 'Ƌ': 'D', 'Ǳ': 'DZ', 'Ǆ': 'DZ', 'É': 'E', 'Ĕ': 'E', 'Ě': 'E', 'Ȩ': 'E', 'Ḝ': 'E', 'Ê': 'E', 'Ế': 'E', 'Ệ': 'E', 'Ề': 'E', 'Ể': 'E', 'Ễ': 'E', 'Ḙ': 'E', 'Ë': 'E', 'Ė': 'E', 'Ẹ': 'E', 'Ȅ': 'E', 'È': 'E', 'Ẻ': 'E', 'Ȇ': 'E', 'Ē': 'E', 'Ḗ': 'E', 'Ḕ': 'E', 'Ę': 'E', 'Ɇ': 'E', 'Ẽ': 'E', 'Ḛ': 'E', 'Ꝫ': 'ET', 'Ḟ': 'F', 'Ƒ': 'F', 'Ǵ': 'G', 'Ğ': 'G', 'Ǧ': 'G', 'Ģ': 'G', 'Ĝ': 'G', 'Ġ': 'G', 'Ɠ': 'G', 'Ḡ': 'G', 'Ǥ': 'G', 'Ḫ': 'H', 'Ȟ': 'H', 'Ḩ': 'H', 'Ĥ': 'H', 'Ⱨ': 'H', 'Ḧ': 'H', 'Ḣ': 'H', 'Ḥ': 'H', 'Ħ': 'H', 'Í': 'I', 'Ĭ': 'I', 'Ǐ': 'I', 'Î': 'I', 'Ï': 'I', 'Ḯ': 'I', 'İ': 'I', 'Ị': 'I', 'Ȉ': 'I', 'Ì': 'I', 'Ỉ': 'I', 'Ȋ': 'I', 'Ī': 'I', 'Į': 'I', 'Ɨ': 'I', 'Ĩ': 'I', 'Ḭ': 'I', 'Ꝺ': 'D', 'Ꝼ': 'F', 'Ᵹ': 'G', 'Ꞃ': 'R', 'Ꞅ': 'S', 'Ꞇ': 'T', 'Ꝭ': 'IS', 'Ĵ': 'J', 'Ɉ': 'J', 'Ḱ': 'K', 'Ǩ': 'K', 'Ķ': 'K', 'Ⱪ': 'K', 'Ꝃ': 'K', 'Ḳ': 'K', 'Ƙ': 'K', 'Ḵ': 'K', 'Ꝁ': 'K', 'Ꝅ': 'K', 'Ĺ': 'L', 'Ƚ': 'L', 'Ľ': 'L', 'Ļ': 'L', 'Ḽ': 'L', 'Ḷ': 'L', 'Ḹ': 'L', 'Ⱡ': 'L', 'Ꝉ': 'L', 'Ḻ': 'L', 'Ŀ': 'L', 'Ɫ': 'L', 'ǈ': 'L', 'Ł': 'L', 'Ǉ': 'LJ', 'Ḿ': 'M', 'Ṁ': 'M', 'Ṃ': 'M', 'Ɱ': 'M', 'Ń': 'N', 'Ň': 'N', 'Ņ': 'N', 'Ṋ': 'N', 'Ṅ': 'N', 'Ṇ': 'N', 'Ǹ': 'N', 'Ɲ': 'N', 'Ṉ': 'N', 'Ƞ': 'N', 'ǋ': 'N', 'Ñ': 'N', 'Ǌ': 'NJ', 'Ó': 'O', 'Ŏ': 'O', 'Ǒ': 'O', 'Ô': 'O', 'Ố': 'O', 'Ộ': 'O', 'Ồ': 'O', 'Ổ': 'O', 'Ỗ': 'O', 'Ö': 'O', 'Ȫ': 'O', 'Ȯ': 'O', 'Ȱ': 'O', 'Ọ': 'O', 'Ő': 'O', 'Ȍ': 'O', 'Ò': 'O', 'Ỏ': 'O', 'Ơ': 'O', 'Ớ': 'O', 'Ợ': 'O', 'Ờ': 'O', 'Ở': 'O', 'Ỡ': 'O', 'Ȏ': 'O', 'Ꝋ': 'O', 'Ꝍ': 'O', 'Ō': 'O', 'Ṓ': 'O', 'Ṑ': 'O', 'Ɵ': 'O', 'Ǫ': 'O', 'Ǭ': 'O', 'Ø': 'O', 'Ǿ': 'O', 'Õ': 'O', 'Ṍ': 'O', 'Ṏ': 'O', 'Ȭ': 'O', 'Ƣ': 'OI', 'Ꝏ': 'OO', 'Ɛ': 'E', 'Ɔ': 'O', 'Ȣ': 'OU', 'Ṕ': 'P', 'Ṗ': 'P', 'Ꝓ': 'P', 'Ƥ': 'P', 'Ꝕ': 'P', 'Ᵽ': 'P', 'Ꝑ': 'P', 'Ꝙ': 'Q', 'Ꝗ': 'Q', 'Ŕ': 'R', 'Ř': 'R', 'Ŗ': 'R', 'Ṙ': 'R', 'Ṛ': 'R', 'Ṝ': 'R', 'Ȑ': 'R', 'Ȓ': 'R', 'Ṟ': 'R', 'Ɍ': 'R', 'Ɽ': 'R', 'Ꜿ': 'C', 'Ǝ': 'E', 'Ś': 'S', 'Ṥ': 'S', 'Š': 'S', 'Ṧ': 'S', 'Ş': 'S', 'Ŝ': 'S', 'Ș': 'S', 'Ṡ': 'S', 'Ṣ': 'S', 'Ṩ': 'S', 'ß': 'ss', 'Ť': 'T', 'Ţ': 'T', 'Ṱ': 'T', 'Ț': 'T', 'Ⱦ': 'T', 'Ṫ': 'T', 'Ṭ': 'T', 'Ƭ': 'T', 'Ṯ': 'T', 'Ʈ': 'T', 'Ŧ': 'T', 'Ɐ': 'A', 'Ꞁ': 'L', 'Ɯ': 'M', 'Ʌ': 'V', 'Ꜩ': 'TZ', 'Ú': 'U', 'Ŭ': 'U', 'Ǔ': 'U', 'Û': 'U', 'Ṷ': 'U', 'Ü': 'U', 'Ǘ': 'U', 'Ǚ': 'U', 'Ǜ': 'U', 'Ǖ': 'U', 'Ṳ': 'U', 'Ụ': 'U', 'Ű': 'U', 'Ȕ': 'U', 'Ù': 'U', 'Ủ': 'U', 'Ư': 'U', 'Ứ': 'U', 'Ự': 'U', 'Ừ': 'U', 'Ử': 'U', 'Ữ': 'U', 'Ȗ': 'U', 'Ū': 'U', 'Ṻ': 'U', 'Ų': 'U', 'Ů': 'U', 'Ũ': 'U', 'Ṹ': 'U', 'Ṵ': 'U', 'Ꝟ': 'V', 'Ṿ': 'V', 'Ʋ': 'V', 'Ṽ': 'V', 'Ꝡ': 'VY', 'Ẃ': 'W', 'Ŵ': 'W', 'Ẅ': 'W', 'Ẇ': 'W', 'Ẉ': 'W', 'Ẁ': 'W', 'Ⱳ': 'W', 'Ẍ': 'X', 'Ẋ': 'X', 'Ý': 'Y', 'Ŷ': 'Y', 'Ÿ': 'Y', 'Ẏ': 'Y', 'Ỵ': 'Y', 'Ỳ': 'Y', 'Ƴ': 'Y', 'Ỷ': 'Y', 'Ỿ': 'Y', 'Ȳ': 'Y', 'Ɏ': 'Y', 'Ỹ': 'Y', 'Ź': 'Z', 'Ž': 'Z', 'Ẑ': 'Z', 'Ⱬ': 'Z', 'Ż': 'Z', 'Ẓ': 'Z', 'Ȥ': 'Z', 'Ẕ': 'Z', 'Ƶ': 'Z', 'Ĳ': 'IJ', 'Œ': 'OE', 'ᴀ': 'A', 'ᴁ': 'AE', 'ʙ': 'B', 'ᴃ': 'B', 'ᴄ': 'C', 'ᴅ': 'D', 'ᴇ': 'E', 'ꜰ': 'F', 'ɢ': 'G', 'ʛ': 'G', 'ʜ': 'H', 'ɪ': 'I', 'ʁ': 'R', 'ᴊ': 'J', 'ᴋ': 'K', 'ʟ': 'L', 'ᴌ': 'L', 'ᴍ': 'M', 'ɴ': 'N', 'ᴏ': 'O', 'ɶ': 'OE', 'ᴐ': 'O', 'ᴕ': 'OU', 'ᴘ': 'P', 'ʀ': 'R', 'ᴎ': 'N', 'ᴙ': 'R', 'ꜱ': 'S', 'ᴛ': 'T', 'ⱻ': 'E', 'ᴚ': 'R', 'ᴜ': 'U', 'ᴠ': 'V', 'ᴡ': 'W', 'ʏ': 'Y', 'ᴢ': 'Z', 'á': 'a', 'ă': 'a', 'ắ': 'a', 'ặ': 'a', 'ằ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ǎ': 'a', 'â': 'a', 'ấ': 'a', 'ậ': 'a', 'ầ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ä': 'a', 'ǟ': 'a', 'ȧ': 'a', 'ǡ': 'a', 'ạ': 'a', 'ȁ': 'a', 'à': 'a', 'ả': 'a', 'ȃ': 'a', 'ā': 'a', 'ą': 'a', 'ᶏ': 'a', 'ẚ': 'a', 'å': 'a', 'ǻ': 'a', 'ḁ': 'a', 'ⱥ': 'a', 'ã': 'a', 'ꜳ': 'aa', 'æ': 'ae', 'ǽ': 'ae', 'ǣ': 'ae', 'ꜵ': 'ao', 'ꜷ': 'au', 'ꜹ': 'av', 'ꜻ': 'av', 'ꜽ': 'ay', 'ḃ': 'b', 'ḅ': 'b', 'ɓ': 'b', 'ḇ': 'b', 'ᵬ': 'b', 'ᶀ': 'b', 'ƀ': 'b', 'ƃ': 'b', 'ɵ': 'o', 'ć': 'c', 'č': 'c', 'ç': 'c', 'ḉ': 'c', 'ĉ': 'c', 'ɕ': 'c', 'ċ': 'c', 'ƈ': 'c', 'ȼ': 'c', 'ď': 'd', 'ḑ': 'd', 'ḓ': 'd', 'ȡ': 'd', 'ḋ': 'd', 'ḍ': 'd', 'ɗ': 'd', 'ᶑ': 'd', 'ḏ': 'd', 'ᵭ': 'd', 'ᶁ': 'd', 'đ': 'd', 'ɖ': 'd', 'ƌ': 'd', 'ı': 'i', 'ȷ': 'j', 'ɟ': 'j', 'ʄ': 'j', 'ǳ': 'dz', 'ǆ': 'dz', 'é': 'e', 'ĕ': 'e', 'ě': 'e', 'ȩ': 'e', 'ḝ': 'e', 'ê': 'e', 'ế': 'e', 'ệ': 'e', 'ề': 'e', 'ể': 'e', 'ễ': 'e', 'ḙ': 'e', 'ë': 'e', 'ė': 'e', 'ẹ': 'e', 'ȅ': 'e', 'è': 'e', 'ẻ': 'e', 'ȇ': 'e', 'ē': 'e', 'ḗ': 'e', 'ḕ': 'e', 'ⱸ': 'e', 'ę': 'e', 'ᶒ': 'e', 'ɇ': 'e', 'ẽ': 'e', 'ḛ': 'e', 'ꝫ': 'et', 'ḟ': 'f', 'ƒ': 'f', 'ᵮ': 'f', 'ᶂ': 'f', 'ǵ': 'g', 'ğ': 'g', 'ǧ': 'g', 'ģ': 'g', 'ĝ': 'g', 'ġ': 'g', 'ɠ': 'g', 'ḡ': 'g', 'ᶃ': 'g', 'ǥ': 'g', 'ḫ': 'h', 'ȟ': 'h', 'ḩ': 'h', 'ĥ': 'h', 'ⱨ': 'h', 'ḧ': 'h', 'ḣ': 'h', 'ḥ': 'h', 'ɦ': 'h', 'ẖ': 'h', 'ħ': 'h', 'ƕ': 'hv', 'í': 'i', 'ĭ': 'i', 'ǐ': 'i', 'î': 'i', 'ï': 'i', 'ḯ': 'i', 'ị': 'i', 'ȉ': 'i', 'ì': 'i', 'ỉ': 'i', 'ȋ': 'i', 'ī': 'i', 'į': 'i', 'ᶖ': 'i', 'ɨ': 'i', 'ĩ': 'i', 'ḭ': 'i', 'ꝺ': 'd', 'ꝼ': 'f', 'ᵹ': 'g', 'ꞃ': 'r', 'ꞅ': 's', 'ꞇ': 't', 'ꝭ': 'is', 'ǰ': 'j', 'ĵ': 'j', 'ʝ': 'j', 'ɉ': 'j', 'ḱ': 'k', 'ǩ': 'k', 'ķ': 'k', 'ⱪ': 'k', 'ꝃ': 'k', 'ḳ': 'k', 'ƙ': 'k', 'ḵ': 'k', 'ᶄ': 'k', 'ꝁ': 'k', 'ꝅ': 'k', 'ĺ': 'l', 'ƚ': 'l', 'ɬ': 'l', 'ľ': 'l', 'ļ': 'l', 'ḽ': 'l', 'ȴ': 'l', 'ḷ': 'l', 'ḹ': 'l', 'ⱡ': 'l', 'ꝉ': 'l', 'ḻ': 'l', 'ŀ': 'l', 'ɫ': 'l', 'ᶅ': 'l', 'ɭ': 'l', 'ł': 'l', 'ǉ': 'lj', 'ſ': 's', 'ẜ': 's', 'ẛ': 's', 'ẝ': 's', 'ḿ': 'm', 'ṁ': 'm', 'ṃ': 'm', 'ɱ': 'm', 'ᵯ': 'm', 'ᶆ': 'm', 'ń': 'n', 'ň': 'n', 'ņ': 'n', 'ṋ': 'n', 'ȵ': 'n', 'ṅ': 'n', 'ṇ': 'n', 'ǹ': 'n', 'ɲ': 'n', 'ṉ': 'n', 'ƞ': 'n', 'ᵰ': 'n', 'ᶇ': 'n', 'ɳ': 'n', 'ñ': 'n', 'ǌ': 'nj', 'ó': 'o', 'ŏ': 'o', 'ǒ': 'o', 'ô': 'o', 'ố': 'o', 'ộ': 'o', 'ồ': 'o', 'ổ': 'o', 'ỗ': 'o', 'ö': 'o', 'ȫ': 'o', 'ȯ': 'o', 'ȱ': 'o', 'ọ': 'o', 'ő': 'o', 'ȍ': 'o', 'ò': 'o', 'ỏ': 'o', 'ơ': 'o', 'ớ': 'o', 'ợ': 'o', 'ờ': 'o', 'ở': 'o', 'ỡ': 'o', 'ȏ': 'o', 'ꝋ': 'o', 'ꝍ': 'o', 'ⱺ': 'o', 'ō': 'o', 'ṓ': 'o', 'ṑ': 'o', 'ǫ': 'o', 'ǭ': 'o', 'ø': 'o', 'ǿ': 'o', 'õ': 'o', 'ṍ': 'o', 'ṏ': 'o', 'ȭ': 'o', 'ƣ': 'oi', 'ꝏ': 'oo', 'ɛ': 'e', 'ᶓ': 'e', 'ɔ': 'o', 'ᶗ': 'o', 'ȣ': 'ou', 'ṕ': 'p', 'ṗ': 'p', 'ꝓ': 'p', 'ƥ': 'p', 'ᵱ': 'p', 'ᶈ': 'p', 'ꝕ': 'p', 'ᵽ': 'p', 'ꝑ': 'p', 'ꝙ': 'q', 'ʠ': 'q', 'ɋ': 'q', 'ꝗ': 'q', 'ŕ': 'r', 'ř': 'r', 'ŗ': 'r', 'ṙ': 'r', 'ṛ': 'r', 'ṝ': 'r', 'ȑ': 'r', 'ɾ': 'r', 'ᵳ': 'r', 'ȓ': 'r', 'ṟ': 'r', 'ɼ': 'r', 'ᵲ': 'r', 'ᶉ': 'r', 'ɍ': 'r', 'ɽ': 'r', 'ↄ': 'c', 'ꜿ': 'c', 'ɘ': 'e', 'ɿ': 'r', 'ś': 's', 'ṥ': 's', 'š': 's', 'ṧ': 's', 'ş': 's', 'ŝ': 's', 'ș': 's', 'ṡ': 's', 'ṣ': 's', 'ṩ': 's', 'ʂ': 's', 'ᵴ': 's', 'ᶊ': 's', 'ȿ': 's', 'ɡ': 'g', 'ᴑ': 'o', 'ᴓ': 'o', 'ᴝ': 'u', 'ť': 't', 'ţ': 't', 'ṱ': 't', 'ț': 't', 'ȶ': 't', 'ẗ': 't', 'ⱦ': 't', 'ṫ': 't', 'ṭ': 't', 'ƭ': 't', 'ṯ': 't', 'ᵵ': 't', 'ƫ': 't', 'ʈ': 't', 'ŧ': 't', 'ᵺ': 'th', 'ɐ': 'a', 'ᴂ': 'ae', 'ǝ': 'e', 'ᵷ': 'g', 'ɥ': 'h', 'ʮ': 'h', 'ʯ': 'h', 'ᴉ': 'i', 'ʞ': 'k', 'ꞁ': 'l', 'ɯ': 'm', 'ɰ': 'm', 'ᴔ': 'oe', 'ɹ': 'r', 'ɻ': 'r', 'ɺ': 'r', 'ⱹ': 'r', 'ʇ': 't', 'ʌ': 'v', 'ʍ': 'w', 'ʎ': 'y', 'ꜩ': 'tz', 'ú': 'u', 'ŭ': 'u', 'ǔ': 'u', 'û': 'u', 'ṷ': 'u', 'ü': 'u', 'ǘ': 'u', 'ǚ': 'u', 'ǜ': 'u', 'ǖ': 'u', 'ṳ': 'u', 'ụ': 'u', 'ű': 'u', 'ȕ': 'u', 'ù': 'u', 'ủ': 'u', 'ư': 'u', 'ứ': 'u', 'ự': 'u', 'ừ': 'u', 'ử': 'u', 'ữ': 'u', 'ȗ': 'u', 'ū': 'u', 'ṻ': 'u', 'ų': 'u', 'ᶙ': 'u', 'ů': 'u', 'ũ': 'u', 'ṹ': 'u', 'ṵ': 'u', 'ᵫ': 'ue', 'ꝸ': 'um', 'ⱴ': 'v', 'ꝟ': 'v', 'ṿ': 'v', 'ʋ': 'v', 'ᶌ': 'v', 'ⱱ': 'v', 'ṽ': 'v', 'ꝡ': 'vy', 'ẃ': 'w', 'ŵ': 'w', 'ẅ': 'w', 'ẇ': 'w', 'ẉ': 'w', 'ẁ': 'w', 'ⱳ': 'w', 'ẘ': 'w', 'ẍ': 'x', 'ẋ': 'x', 'ᶍ': 'x', 'ý': 'y', 'ŷ': 'y', 'ÿ': 'y', 'ẏ': 'y', 'ỵ': 'y', 'ỳ': 'y', 'ƴ': 'y', 'ỷ': 'y', 'ỿ': 'y', 'ȳ': 'y', 'ẙ': 'y', 'ɏ': 'y', 'ỹ': 'y', 'ź': 'z', 'ž': 'z', 'ẑ': 'z', 'ʑ': 'z', 'ⱬ': 'z', 'ż': 'z', 'ẓ': 'z', 'ȥ': 'z', 'ẕ': 'z', 'ᵶ': 'z', 'ᶎ': 'z', 'ʐ': 'z', 'ƶ': 'z', 'ɀ': 'z', 'ﬀ': 'ff', 'ﬃ': 'ffi', 'ﬄ': 'ffl', 'ﬁ': 'fi', 'ﬂ': 'fl', 'ĳ': 'ij', 'œ': 'oe', 'ﬆ': 'st', 'ₐ': 'a', 'ₑ': 'e', 'ᵢ': 'i', 'ⱼ': 'j', 'ₒ': 'o', 'ᵣ': 'r', 'ᵤ': 'u', 'ᵥ': 'v', 'ₓ': 'x', 'Ё': 'YO', 'Й': 'I', 'Ц': 'TS', 'У': 'U', 'К': 'K', 'Е': 'E', 'Н': 'N', 'Г': 'G', 'Ш': 'SH', 'Щ': 'SCH', 'З': 'Z', 'Х': 'H', 'Ъ': '\'', 'ё': 'yo', 'й': 'i', 'ц': 'ts', 'у': 'u', 'к': 'k', 'е': 'e', 'н': 'n', 'г': 'g', 'ш': 'sh', 'щ': 'sch', 'з': 'z', 'х': 'h', 'ъ': '\'', 'Ф': 'F', 'Ы': 'I', 'В': 'V', 'А': 'a', 'П': 'P', 'Р': 'R', 'О': 'O', 'Л': 'L', 'Д': 'D', 'Ж': 'ZH', 'Э': 'E', 'ф': 'f', 'ы': 'i', 'в': 'v', 'а': 'a', 'п': 'p', 'р': 'r', 'о': 'o', 'л': 'l', 'д': 'd', 'ж': 'zh', 'э': 'e', 'Я': 'Ya', 'Ч': 'CH', 'С': 'S', 'М': 'M', 'И': 'I', 'Т': 'T', 'Ь': '\'', 'Б': 'B', 'Ю': 'YU', 'я': 'ya', 'ч': 'ch', 'с': 's', 'м': 'm', 'и': 'i', 'т': 't', 'ь': '\'', 'б': 'b', 'ю': 'yu' }

const presidentaddresses = ['George.W_32', 'John.A_35', 'Thomas.J_43', 'James.M_51', 'James.M_58', 'John.Q.A_67', 'Andrew.J_67', 'Martin.V.B_82', 'William.H.H_73', 'John.T_90', 'James.K.P_95', 'Zachary.T_84', 'Millard.F_00', 'Franklin.P_04', 'James.B_91', 'Abraham.L_09', 'Andrew.J_08', 'Ulysses.S.G_22', 'Rutherford.B.H_22', 'James.A.G_31', 'Chester.A.A_29', 'Grover.C_37', 'Benjamin.H_33', 'Grover.C_37', 'William.M_43', 'Theodore.R_58', 'William.H.T_57', 'Woodrow.W_56', 'Warren.G.H_65', 'Calvin.C_72', 'Herbert.H_74', 'Franklin.D.R_82', 'Harry.S.T_84', 'Dwight.D.E_90', 'John.F.K_17', 'Lyndon.B.J_08', 'Richard.N_13', 'Gerald.F_13', 'Jimmy.C_24', 'Ronald.R_11', 'George.H.W.B_24', 'Bill.C_46', 'George.W.B_46', 'Barack.O_61']
const commonEmailDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'aol.com', 'mac.com', 'me.com', 'shaw.ca', 'msn.com', 'rogers.com', 'sympatico.ca', 'yahoo.co.uk', 'icloud.com', 'live.com', 'outlook.com', 'btinternet.com', 'yahoo.ca', 'gmx.de', 'democratsabroad.org', 'googlemail.com', 'telus.net', 't-online.de', 'wanadoo.fr', 'web.de', 'hotmail.co.uk', 'dems-dr.org', 'bluewin.ch', 'comcast.net', 'orange.fr', 'earthlink.net', 'yahoo.fr', 'cogeco.ca', 'sbcglobal.net', 'ymail.com', 'utoronto.ca', 'gmx.net', 'yahoo.de', 'free.fr', 'mail.mcgill.ca', 'nyu.edu', 'hotmail.fr', 'eircom.net', 'rocketmail.com', 'libero.it', 'online.no', 'bigpond.com', 'netvision.net.il', 'ntlworld.com', 'prodigy.net.mx', 'att.net', 'xs4all.nl', 'yahoo.com.au', 'blueyonder.co.uk', 'yahoo.es', 'bell.net', 'st-andrews.ac.uk', 'videotron.ca', 'eastlink.ca', 'yahoo.it', 'cam.ac.uk', 'yorku.ca', 'hotmail.de', 'alice.it', 'juno.com', 'mail.com', 'ualberta.ca', 'btopenworld.com', 'cornell.edu', 'post.harvard.edu', 'telia.com', 'umich.edu', 'aim.com', 'gol.com', 'otenet.gr', 'noos.fr', 'optusnet.com.au', 'skynet.be', 'umn.edu', 'lse.ac.uk', 'us.army.mil', 'mindspring.com', 'netscape.net', 'usa.net', 'bezeqint.net', 'columbia.edu', 'hotmail.it', 'bellsouth.net', 'tcd.ie', 'tiscali.it', 'uvic.ca', 'arcor.de', 'planet.nl', 'tin.it', 'fastmail.fm', 'sfu.ca', 'verizon.net', 'ns.sympatico.ca', 'bigpond.net.au', 'mcmaster.ca', 'live.co.uk', 'yahoo.com.mx']
function randomPresAddress () { return `${presidentaddresses[Math.floor(Math.random() * presidentaddresses.length)]}@${commonEmailDomains[Math.floor(Math.random() * commonEmailDomains.length)]}` }

export { placesAutocomplete, placeDetails, cleanString, returnArrayOfReasonableBirthDates, placesDetails, uuidv4, commonEmailDomains, randomPresAddress }

// Old helpers.js
// import axios from 'axios'
// import debounce from 'lodash/debounce'

// export const placesAutocomplete = debounce(function (val) {
//   this.data = []
//   this.isFetching = true
//   axios.get(`${process.env.placesUrl + process.env.autocompleteEndpoint}?input=${val}&types=geocode&language=en${this.userCountry || this.countryiso ? '&components=country:' + this.countryiso || this.userCountry : ''}&key=${process.env.placesKey}`)
//     .then(({ data }) => {
//       data.predictions.forEach((item) => this.data.push(item))
//       this.isFetching = false
//     }, response => {
//       this.isFetching = false
//     })
// }, 500)

// export const returnArrayOfReasonableBirthDates = function (dateString) {
//   let currentYear = new Date().getFullYear()
//   let dateArr = []
//   let dateRegexPatterns = {
//     YMD: /^(\d?\d?\d\d)(?:\/|-|\.)(\d?\d)(?:\/|-|\.)(\d?\d)$/g,
//     MDY: /^(\d?\d)(?:\/|-|\.)(\d?\d)(?:\/|-|\.)(\d?\d?\d\d)$/g,
//     DMY: /^(\d?\d)(?:\/|-|\.)(\d?\d)(?:\/|-|\.)(\d?\d?\d\d)$/g
//   }

//   if (/^\d+(?:\/|-|\.)\d+(?:\/|-|\.)\d+$/.test(dateString)) {
//     Object.entries(dateRegexPatterns).forEach(([regexName, dateRegex]) => {
//       let matchArr
//       let yPos = regexName.indexOf('Y') + 1
//       let mPos = regexName.indexOf('M') + 1
//       let dPos = regexName.indexOf('D') + 1
//       while ((matchArr = dateRegex.exec(dateString)) !== null) {
//         let validDate = formatDate(matchArr[yPos], matchArr[mPos], matchArr[dPos])
//         if (validDate) dateArr.push(validDate)
//       }
//     })
//   } else {
//     // dateArr.push(new Date(Date.parse(dateString)))
//     dateArr.push(new Date(Date.parse(dateString) - (new Date().getTimezoneOffset() * 60000)))
//   }
//   // console.log(new Date(Date.parse('june 1 82') + new Date().getTimezoneOffset() * 60000))
//   // console.log(new Date(Date.parse('june 1 82') - (new Date().getTimezoneOffset() * 60000)))
//   return dateArr
//     .map(function (date) { return date.getTime() })
//     .filter(function (date, i, array) {
//       // remove entries that are duplicates or before today
//       return array.indexOf(date) === i && date < new Date()
//     })
//     .map(function (time) { return new Date(time) })

//   function formatDate (y, m, d) {
//     let year = y.length === 4 ? y : parseInt(y) < currentYear - 2010 ? '20' + y : '19' + y
//     year = year < 1890 || year > currentYear ? null : year
//     let month = parseInt(m) - 1
//     let day = parseInt(d)
//     let parsedDate = new Date(Date.UTC(year, month, day))
//     if (!year || parsedDate.getUTCMonth() !== month) {
//     } else return parsedDate
//   }
// }

// // export const placesFillData = function (option) {
// //   let input = {}
// //   let currentCountry = this.countryiso !== undefined ? this.countryiso : 'US'
// //   if (option && option.place_id) {
// //     axios.get(`${process.env.placesUrl + process.env.detailsEndpoint}?placeid=${option.place_id}&language=en&key=${process.env.placesKey}`)
// //       .then(({ data }) => {
// //         if (data.status && data.status === 'NOT_FOUND') {
// //           this.$toast.open({
// //             message: 'Unable to retrieve address. Please enter manually.',
// //             duration: 3500,
// //             type: 'is-warning'
// //           })
// //         } else {
// //           let result = data.result
// //           let ctry = components.filter(({types}) => types.includes('country')).length > 0 ? components.filter(({types}) => types.includes('country'))[0].short_name : null
// //           let region = components.filter(({types}) => types.includes('administrative_area_level_1')).length > 0 ? components.filter(({types}) => types.includes('administrative_area_level_1'))[0].short_name : null
// //           // console.log('placeid data', components.filter(({types}) => types.includes('country')))
// //           // input.A = adrFormat.includes('street-address') ? this.latinize(adrFormat.match('<span class="street-address">(.*?)</span>')[1]) : null
// //           if (ctry.toLowerCase() === 'jp') {
// //             input.A = formatted.split(',')[0]
// //             input.B = formatted.split(',')[1]
// //           } else {
// //             input.B = adrFormat.includes('extended-address') ? adrFormat.match('<span class="extended-address">(.*?)</span>')[1] : null
// //             input.D = components.filter(({types}) => types.includes('sublocality')).length > 0 ? components.filter(({types}) => types.includes('sublocality'))[0].long_name : null
// //           }
// //           input.C = adrFormat.includes('locality') ? adrFormat.match('<span class="locality">(.*?)</span>')[1] : null
// //           input.S = adrFormat.includes('region') ? adrFormat.match('<span class="region">(.*?)</span>')[1] : region
// //           input.Z = adrFormat.includes('postal-code') ? adrFormat.match('<span class="postal-code">(.*?)</span>')[1] : null
// //           if (this.Y !== undefined) input.Y = components.filter(y => y.types.indexOf('administrative_area_level_2') > -1)[0].long_name
// //           if (this.countryiso !== undefined) input.country = this.getCountryName(ctry)
// //           if (this.countryiso !== undefined) input.countryiso = ctry
// //           this.update(input)
// //           console.log(currentCountry, res)
// //         }
// //       })
// //   }
// // }

// export const placesDetails = async function (option) {
//   if (!option || !option.place_id) {
//     return
//   }
//   try {
//     let {data} = await axios.get(`${process.env.placesUrl + process.env.detailsEndpoint}?placeid=${option.place_id}&language=en&key=${process.env.placesKey}`)
//     if (data.status && data.status === 'NOT_FOUND') {
//       this.$toast.open({
//         message: 'Unable to retrieve address. Please enter manually.',
//         duration: 3500,
//         type: 'is-warning'
//       })
//       throw new Error(`no place details found for: ${JSON.stringify(option, null, 2)}`)
//     }
//     let input = {}
//     let {result: {address_components: components = [], formatted_address: formatted = '', adr_address: adrFormat = ''}} = data
//     let {short_name: ctry = null} = (components.find(({types}) => types.includes('country')))
//     let {short_name: region = null} = (components.find(({types}) => types.includes('administrative_area_level_1')))
//     let B = adrFormat.includes('extended-address') ? adrFormat.match('<span class="extended-address">(.*?)</span>')[1] : null
//     let {long_name: D = null} = (components.find(({types}) => types.includes('country')))
//     let C = adrFormat.includes('locality') ? adrFormat.match('<span class="locality">(.*?)</span>')[1] : null
//     let S = adrFormat.includes('region') ? adrFormat.match('<span class="region">(.*?)</span>')[1] : region
//     let Z = adrFormat.includes('postal-code') ? adrFormat.match('<span class="postal-code">(.*?)</span>')[1] : null
//     let {long_name: Y = null} = (components.find(({types}) => types.includes('administrative_area_level_2')))
//     if (this.countryiso !== undefined) input.country = this.getCountryName(ctry)
//     if (this.countryiso !== undefined) input.countryiso = ctry
//     let A
//     if (ctry.toLowerCase() === 'jp') {
//       A = formatted.split(',')[0]
//       B = formatted.split(',')[1]
//     }
//     this.update(input)
//     console.log(A, B, C, D, S, Z, Y)
//   } catch (error) {
//     console.log(error)
//   }
// }
