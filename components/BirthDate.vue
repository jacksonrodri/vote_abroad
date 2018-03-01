<template>
  <div class="field">
    <b-field :label="$t('request.dob.label')" :message="message">
      <b-datepicker
        v-model="dobb"
        :readonly="false"
        :placeholder="$t('request.dob.placeholder')"
        :min-date="minDate"
        :max-date="maxDate"
        :focused-date="new Date(new Date().getFullYear() - 18, 0, 1)"
        icon="calendar"
        icon-pack="fas"></b-datepicker>
    </b-field>
  </div>
</template>

<script>
export default {
  props: [
    'message'
  ],
  data () {
    return {
      dob: null
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
        this.dob = value
        this.storeDOB = value
      }
    },
    storeDOB: {
      get () {
        let dob = this.$store.getters['requests/getCurrent'] && this.$store.getters['requests/getCurrent'].dob ? this.$store.getters['requests/getCurrent'].dob : null
        function createDateObj (d) { return new Date(d.substr(0, 4), d.substr(5, 2) - 1, d.substr(8, 2)) }
        if (!dob || dob.toString().length !== 10) {
          return null
        } else { return createDateObj(dob) }
      },
      set (value) {
        function createDateString (d) { return `${d.getFullYear()}-${d.getMonth() < 9 ? '0' : ''}${d.getMonth() + 1}-${d.getDate() < 9 ? '0' : ''}${d.getDate()}` }
        if (value) {
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
      return new Date(1870, 0, 1)
    }
  }
}
</script>
