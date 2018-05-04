<template>
  <div class="field">
  <span class="is-flex"><label class="label">{{ $t('request.dob.label') }}</label><span @click="isOpen = !isOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span></span>
    <b-field :message="validations.$error ? Object.keys(validations.$params).map(x => $t(`request.dob.messages.${x}`)) : '' "
      :type="(validations.$error ? 'is-danger': '')">
        <!-- :date-formatter="(date) => {date.setHours(date.getHours() + 4); return date.toLocaleDateString()}" -->
      <b-datepicker
        v-model="dobb"
        :readonly="false"
        :placeholder="$t('request.dob.placeholder')"
        :date-formatter="(date) => date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })"
        :min-date="minDate"
        :max-date="maxDate"
        autocomplete="bday"
        ref="dob"
        @input="update"
        :focused-date="new Date(new Date().getFullYear() - 18, 0, 1)"
        icon="calendar"
        icon-pack="fas"></b-datepicker>
    </b-field>
    <b-message :title="tooltipTitle" type="is-info" has-icon :active.sync="isOpen">
      <slot name="tooltip"></slot>
    </b-message>
  </div>
</template>

<script>
export default {
  props: [
    'message',
    'validations',
    'tooltipTitle'
  ],
  data () {
    return {
      dob: null,
      isOpen: false
    }
  },
  computed: {
    dobb: {
      get () {
        if (this.dob !== null) {
          return this.dob
        } else if (!this.dob && this.storeDOB) {
          return this.storeDOB
        } else {
          return null
        }
      },
      set (value) {
        // console.log('value', value)
        this.dob = value
        this.storeDOB = value
      }
    },
    storeDOB: {
      get () {
        let dob = this.$store.getters['requests/getCurrent'] && this.$store.getters['requests/getCurrent'].dob ? this.$store.getters['requests/getCurrent'].dob : null
        function createDateObj (d) { return new Date(d.substr(0, 4), d.substr(5, 2) - 1, d.substr(8, 2), 12) }
        console.log('getdob', dob)
        // console.log('getDobObj', createDateObj(dob || new Date)
        if (!dob || dob.toString().length !== 10) {
          return null
        } else {
          // console.log('dateobj', createDateObj(dob))
          return createDateObj(dob)
        }
      },
      set (value) {
        function createDateString (d) { return `${d.getFullYear()}-${d.getMonth() < 9 ? '0' : ''}${d.getMonth() + 1}-${d.getDate() < 9 ? '0' : ''}${d.getDate()}` }
        if (value) {
          console.log('value', value)
          console.log('datestring', createDateString(value))
          this.$store.commit('requests/update', {dob: createDateString(value)})
        } else {
          this.$store.commit('requests/update', {dob: null})
        }
      }
    },
    maxDate () {
      return new Date(2000, 10, 6)
    },
    minDate () {
      return new Date(1900, 0, 1)
    }
  },
  methods: {
    update: function () {
      this.$emit('input')
    }
  }
}
</script>
