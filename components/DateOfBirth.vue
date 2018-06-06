<template>
  <div class="field">
  <span class="is-flex"><label class="label">{{ $t('request.dob.label') }}</label><span @click.prevent="toolTipOpen = !toolTipOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span></span>
  <b-field label="Select a date"
    :message="validations.$error ? Object.keys(validations.$params).map(x => $t(`request.dob.messages.${x}`)) : '' "
    :type="(validations.$error ? 'is-danger': '')">
    <b-datepicker v-model="dob"
      :date-formatter="(date) => date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })"
      :date-parser="dateParser"
      :readonly="false"
      :mobile-native="allowNative"
      :min-date="minDate"
      :max-date="maxDate"
      autocomplete="bday"
      ref="dob"
      :focused-date="dob || new Date(new Date().getFullYear() - 18, 0, 1)"
      icon="calendar"
      icon-pack="fas"
      :placeholder="$t('request.dob.placeholder')">
    </b-datepicker>
  </b-field>
  <b-message :title="tooltipTitle" type="is-info" has-icon :active.sync="toolTipOpen">
    <slot name="tooltip"></slot>
  </b-message>
</div>
</template>

<script>
import ModalDateSelector from '~/components/ModalDateSelector'

export default {
  name: 'date-of-birth',
  props: [
    'value',
    'message',
    'validations',
    'tooltipTitle'
  ],
  components: {
    ModalDateSelector
  },
  data () {
    return {
      date: undefined,
      maxDate: new Date(2000, 10, 7),
      minDate: new Date(1900, 0, 1),
      toolTipOpen: false
    }
  },
  computed: {
    dob: {
      get () {
        function createDateObj (d) { return new Date(d.substr(0, 4), d.substr(5, 2) - 1, d.substr(8, 2), 12) }
        return typeof this.value === 'string' ? createDateObj(this.value) : undefined
      },
      set (val) {
        function createDateString (d) { return `${d.getFullYear()}-${d.getMonth() < 9 ? '0' : ''}${d.getMonth() + 1}-${d.getDate() < 9 ? '0' : ''}${d.getDate()}` }
        this.date = val instanceof Date ? createDateString(val) : null
        this.$emit('input', val instanceof Date ? createDateString(val) : null)
      }
    },
    allowNative () {
      return Boolean(!(this.$store.state.userauth.device.type === 'mobile' && this.$store.state.userauth.device.os === 'android'))
    }
  },
  methods: {
    cardModal (dateChoices, input) {
      let vm = this
      this.$modal.open({
        parent: this,
        component: ModalDateSelector,
        hasModalCard: true,
        props: {
          dateChoices,
          input
        },
        events: {
          selectDate (date) { vm.dob = date }
        }
      })
      return new Date()
    },
    dateParser (input) {
      // console.log('input', input.toString())
      let currentYear = new Date().getFullYear()
      // console.log('currentYear', currentYear)
      let dateChoices = []
      let yyyymmddRegex = /^(?:(?:(?:19)?\d{2})|(?:(?:20)?[0-2]\d))(\/|-|\.)(1[1-2]|0?[1-9])\1(1[1-2]|0?[1-9])$/g
      // console.log('yyyymmddRegex', yyyymmddRegex.test(input))
      // console.log('yyyymmddRegex', yyyymmddRegex.test(input))
      let ddmmyyyyRegex = /^(?:1[1-2]|0?[1-9])(\/|-|\.)(1[1-2]|0?[1-9])\1(?:(?:(?:19)?\d{2})|(?:(?:20)?[0-2]\d))/g
      // console.log('ddmmyyyyRegex', ddmmyyyyRegex.test(input))
      // console.log('ddmmyyyyRegex', ddmmyyyyRegex.test(input))
      let looseDate = /^(?:(?:\d\d?)(\/|-|\.)(?:\d\d?)\1(?:(?:(?:19)?\d{2})|(?:(?:20)?[0-2]\d)))$|^(?:(?:(?:(?:19)?\d{2})|(?:(?:20)?[0-2]\d))(\/|-|\.)\d\d?\2\d\d?)$/g
      let baddate = /^[a-zA-Z]{1,2}(\/|-|\.)[a-zA-Z]{1,2}\1(?:(?:(?:19)?\d{2})|(?:(?:20)?[0-2]\d))/g

      if (baddate.test(input)) {
        return null
      }

      if (yyyymmddRegex.test(input)) {
        let inputArr = input.split(/(?:\/|-|\.)/)
        console.log('yyyymmdd', 'inputArr', inputArr)
        let year = inputArr[0]
        year = year.length === 4 ? year : parseInt(year) < currentYear - 2010 ? '20' + year : '19' + year
        dateChoices.push(new Date(year, parseInt(inputArr[1]) - 1, inputArr[2]))
        if (parseInt(inputArr[1]) !== parseInt(inputArr[2])) {
          dateChoices.push(new Date(year, parseInt(inputArr[2]) - 1, inputArr[1]))
        }
        console.log('yymmdddatechoices', dateChoices)
      }
      if (ddmmyyyyRegex.test(input)) {
        let inputArr = input.split(/(?:\/|-|\.)/)
        console.log('ddmmyyyy', 'inputArr', inputArr)
        let year = inputArr[2]
        year = year.length === 4 ? year : parseInt(year) < currentYear - 2010 ? '20' + year : '19' + year
        dateChoices.push(new Date(year, parseInt(inputArr[0]) - 1, inputArr[1]))
        if (parseInt(inputArr[0]) !== parseInt(inputArr[1])) {
          dateChoices.push(new Date(year, parseInt(inputArr[1]) - 1, inputArr[0]))
        }
      }
      if (looseDate.test(input)) {
        let inputArr = input.split(/(?:\/|-|\.)/)
        if (inputArr.length === 3 && parseInt(inputArr[0]) > 12 && parseInt(inputArr[1]) > 12 && parseInt(inputArr[2]) > 12) {
          return null
        }
        if (parseInt(inputArr[0]) > 12 && parseInt(inputArr[0]) < 32) {
          let year = inputArr[2]
          year = year.length === 4 ? year : parseInt(year) < currentYear - 2010 ? '20' + year : '19' + year
          dateChoices.push(new Date(year, parseInt(inputArr[1]) - 1, inputArr[0]))
        } else if (parseInt(inputArr[2]) > 12 && parseInt(inputArr[2]) < 32) {
          let year = inputArr[0]
          year = year.length === 4 ? year : parseInt(year) < currentYear - 2010 ? '20' + year : '19' + year
          dateChoices.push(new Date(year, parseInt(inputArr[1]) - 1, inputArr[2]))
        } else if (inputArr[2].length === 2 && parseInt(inputArr[2]) > currentYear - 2010 && ((parseInt(inputArr[0]) < 32 && parseInt(inputArr[1]) < 13) || (parseInt(inputArr[1]) < 32 && parseInt(inputArr[0]) < 13))) {
          let year = parseInt(inputArr[2]) < currentYear - 2010 ? '20' + inputArr[2] : '19' + inputArr[2]
          let month = parseInt(inputArr[0]) > 12 ? parseInt(inputArr[1]) - 1 : parseInt(inputArr[0] - 1)
          let day = parseInt(inputArr[0]) > 12 ? parseInt(inputArr[0]) : parseInt(inputArr[1])
          dateChoices.push(new Date(year, month, day))
        }
      }
      // console.log(dateChoices.length, 'dateChoices', dateChoices)
      // dateChoices = Array.from(new Set(dateChoices))
      dateChoices = dateChoices
        .map(function (date) { return date.getTime() })
        .filter(function (date, i, array) {
          return array.indexOf(date) === i
        })
        .map(function (time) { return new Date(time) })
      // console.log('dateChoices2', uniqueArray)

      if (dateChoices.length > 1) {
        this.cardModal(dateChoices, input)
      } else if (dateChoices.length === 1) {
        return dateChoices[0]
      } else if (/^\d\d?(?:\/|-|\.)\d\d?$/.test(input)) {
        return null
      } else {
        return new Date(Date.parse(input))
      }
    }
  }
}
</script>
