<template>
  <div class="field">
  <span class="is-flex"><label class="label">{{ $t('request.dob.label') }}</label><span @click.prevent="toolTipOpen = !toolTipOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span></span>
  <b-field
    :message="v.$error ? Object.entries(v).filter(([key, value]) => key.charAt(0) !== '$' && value === false).map(x => $t(`request.dob.messages.${x[0]}`)) : '' "
    :type="(v.$error ? 'is-danger': '')">
    <b-datepicker v-model="date"
      :date-formatter="dateFormatter"
      :date-parser="dateParser2"
      :readonly="false"
      :mobile-native="allowNative"
      :min-date="minDate"
      :max-date="maxDate"
      :inline="!allowNative"
      ref="dob"
      @input="val => showVal(val)"
      :focused-date="focusedDate"
      @changeMonth="val => changeMonth(val)"
      @changeYear="val => changeYear(val)"
      icon="calendar"
      icon-pack="fas"
      :placeholder="$t('request.dob.placeholder')">
      <div slot="header">
        <div class="field is-centered" v-if="componentLoaded">
          <span class="help is-primary is-size-6" v-html="$t('request.dob.selectDate')"></span>
          <b-input
            v-if="!allowNative"
            :value="(dob instanceof Date) ? dob.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : dob"
            @change="val => dob = val"
            @blur="dob = dateParser2(dob)"
            :placeholder="$t('request.dob.placeholder')"></b-input>
        </div>
        <div class="pagination field is-centered" v-if="componentLoaded">
          <div class="pagination-list">
            <b-field>
              <b-select
                :value="$refs.dob.focusedDateData.year"
                @input="val => focusedDate = new Date(val, $refs.dob.focusedDateData.month, $refs.dob.focusedDate.getDate())">
                <option
                  v-for="year in listOfYears"
                  :value="year"
                  :key="year">
                  {{ year }}
                </option>
              </b-select>
              <b-select
                :value="$refs.dob.focusedDateData.month"
                @input="val => focusedDate = new Date($refs.dob.focusedDateData.year, val, $refs.dob.focusedDate.getDate())">
                <option
                  v-for="(month, index) in monthNames"
                  :value="index"
                  :key="month">
                  {{ month }}
                </option>
              </b-select>
            </b-field>
          </div>
        </div>
      </div>
    </b-datepicker>
  </b-field>
  <b-message :title="tooltipTitle" type="is-info" has-icon :active.sync="toolTipOpen">
    <slot name="tooltip"></slot>
  </b-message>
  <b-modal :active.sync="isCardModalActive" :width="640" scroll="keep" has-modal-card v-if="componentLoaded">
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">{{$t('request.dob.disambiguationTitle')}}</p>
      </header>
      <section class="modal-card-body">
        <i18n tag="span" path="request.dob.disambiguationMessage">
          <span class="is-italic">"{{ inputText }}"</span>
        </i18n>
        <b-field v-for="date in dateChoices" :key="date.getTime()">
          <a @click="() => { addDate(date) }" class="button is-primary is-fullwidth">
            {{ date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric'}) }}
          </a>
        </b-field>
      </section>
      <footer class="modal-card-foot">
        <a class="button" type="button" @click="closeModal">{{$t('request.dob.cancel')}}</a>
      </footer>
    </div>
  </b-modal>
</div>
</template>

<script>
import { returnArrayOfReasonableBirthDates } from '~/utils/helpers'

export default {
  name: 'date-of-birth',
  props: [
    'value',
    'message',
    'v',
    'tooltipTitle'
  ],
  data () {
    return {
      date: undefined,
      maxDate: new Date(2000, 10, 6),
      minDate: new Date(1900, 0, 1),
      toolTipOpen: false,
      isCardModalActive: false,
      dateChoices: [],
      inputText: '',
      componentLoaded: false,
      monthNames: [
        this.$t('request.dob.months.jan'),
        this.$t('request.dob.months.feb'),
        this.$t('request.dob.months.mar'),
        this.$t('request.dob.months.apr'),
        this.$t('request.dob.months.may'),
        this.$t('request.dob.months.jun'),
        this.$t('request.dob.months.jul'),
        this.$t('request.dob.months.aug'),
        this.$t('request.dob.months.sep'),
        this.$t('request.dob.months.oct'),
        this.$t('request.dob.months.nov'),
        this.$t('request.dob.months.dec')
      ],
      focusedDate: new Date(2000, 10, 5)
    }
  },
  created () {
    if (this.dob) {
      this.focusedDate = this.dob
      this.date = this.dob
    }
  },
  mounted () {
    this.$nextTick()
      .then(() => {
        this.componentLoaded = true
      })
  },
  computed: {
    listOfYears () {
      const latestYear = this.maxDate
        ? this.maxDate.getFullYear()
        : 2000
      const earliestYear = this.minDate
        ? this.minDate.getFullYear() : 1900
      const arrayOfYears = []
      for (let i = earliestYear; i <= latestYear; i++) {
        arrayOfYears.push(i)
      }
      return arrayOfYears.reverse()
    },
    dob: {
      get () {
        console.log('get', this.value)
        function createDateObj (d) { return new Date(d.substr(0, 4), d.substr(5, 2) - 1, d.substr(8, 2)) }
        return typeof this.value === 'string' ? createDateObj(this.value) : undefined
      },
      set (val) {
        function createDateString (d) { return `${d.getFullYear()}-${d.getMonth() < 9 ? '0' : ''}${d.getMonth() + 1}-${d.getDate() < 9 ? '0' : ''}${d.getDate()}` }
        let d = val instanceof Date ? createDateString(val) : null
        this.$store.commit('requests/update', { dob: d })
        if (val instanceof Date) {
          this.focusedDate = val
          this.date = val
        }
      }
    },
    allowNative () {
      return Boolean(!(this.$store.state.userauth.device.type === 'mobile' && this.$store.state.userauth.device.os === 'android'))
    }
  },
  methods: {
    closeModal () {
      this.dob = null
      this.isCardModalActive = false
    },
    showVal (val) {
      console.log(val)
    },
    changeMonth (month) {
      this.focusedDate = this.$refs.focusedDate
    },
    changeYear (year) {
      this.focusedDate = this.$refs.focusedDate
    },
    addDate (date) {
      console.log('date', date, this)
      this.$nextTick()
        .then(() => {
          this.dob = date
          this.date = date
          this.$nextTick()
            .then(() => {
              this.isCardModalActive = false
            })
        })
    },
    dateParser2 (input) {
      let choices = returnArrayOfReasonableBirthDates(input)
      console.log('date choices', choices)
      if (choices.length > 1) {
        this.inputText = input
        this.dateChoices = choices
        this.isCardModalActive = true
      } else if (choices.length === 1) {
        return choices[0]
      } else return null
    },
    dateFormatter (d) {
      let ahead2HoursDate = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 2)
      return ahead2HoursDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    }
  },
  watch: {
    date (val) {
      if (val instanceof Date) {
        this.dob = val
      } else {
        this.dob = null
      }
    }
  }
}
</script>
