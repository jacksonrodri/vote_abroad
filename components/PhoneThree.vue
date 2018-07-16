<template>
  <b-field>
    dirty: {{ validations.phoneThree.$dirty }}
    <b-input ref="tel" :value="tel" :class="isRequiredClass" @input.native="tel = $event"></b-input>
    <!-- v-model="tel" @input="delayTouch(validations.phoneThree)" -->
  </b-field>
</template>

<script>
export default {
  props: [ 'value', 'dTouch', 'validations' ],
  inject: ['validations', 'dTouch'],
  data () {
    return {
      phoneInput: '',
      countryISO: 'HK',
      cursorPos: 0
    }
  },
  computed: {
    phoneFormatInfo () {
      return this.$store.getters['data/getPhoneFormatInfo'](this.tel, this.countryISO)
    },
    allCountriesLoaded () {
      return this.$store.getters['data/phoneMetadataHasAllCountriesForPrefix'](this.tel)
    },
    isRequiredClass () {
      if (this.validations.phoneThree.$params.required && !this.tel) {
        return 'is-required'
      } else if (!this.validations.phoneThree.$params.required && !this.tel) {
        return 'is-optional'
      }
      return ''
    },
    tel: {
      get () {
        return this.$store.state.data.phone || ''
      },
      set (val) {
        this.cursorPos = val.target.selectionEnd
        this.$emit('input', {val: val.target.value, countryIso: this.countryISO})
      }
    }
  },
  watch: {
    tel (val, oldVal) {
      console.log(oldVal.slice(0, this.cursorPos).replace(/[^0-9|+]/g, ''))
      let arr = [...Array(val.length).keys()]
      arr.forEach(i => {
        if (val.slice(0, i + 1).replace(/[^0-9|+]/g, '') === oldVal.slice(0, this.cursorPos).replace(/[^0-9|+]/g, '')) {
          let newPos = i + 1
          this.$refs.tel.$el.firstChild.setSelectionRange(newPos, newPos)
          setTimeout(() => {
            this.$refs.tel.$el.firstChild.setSelectionRange(newPos, newPos)
          }, 5)
        }
      })
    }
  },
  methods: {
    delayTouch () { return this.dTouch }
  }
}
</script>

<style>
.is-required::before {
  content: "Required";
  position: absolute;
  right: 0;
  color: #9c9a9a;
  font-size: 0.75rem;
  font-weight: 300;
  z-index: 4;
  margin: 0.55rem;
}
.is-optional::before {
  content: "Optional";
  position: absolute;
  right: 0;
  color: #9c9a9a;
  font-size: 0.75rem;
  font-weight: 300;
  z-index: 4;
  margin: 0.55rem;
}
.field.is-required::before {
  right: 1.55rem;
}
.field.is-optional::before {
  right: 1.55rem;
}
</style>
