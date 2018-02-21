<template>
  <div>
    <span class="is-flex"><label class="label">{{ label }}</label><span @click="isOpen = !isOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span></span>
    <slot name="instructions"></slot>
    <br/>
    <div class="field">
      <b-checkbox v-model="checkbox">I don't have any of these forms of ID.</b-checkbox>
    </div>
    <b-field v-if="idOptions && idOptions.indexOf('SSN') > -1" label="Full Social Security Number">
      <b-input v-cleave="masks.ssn"
        @input.native="val => print(val.target._vCleave.getRawValue())">

      </b-input>
    </b-field>
    <b-field v-if="idOptions && idOptions.indexOf('SSN4') > -1" label="The last 4 digits of your Social Security Number">
      <b-input v-cleave="masks.ssn4"
        @input.native="val => print(val.target._vCleave.getRawValue())">

      </b-input>
    </b-field>
    <b-field label="Your State ID">
      <b-input>

      </b-input>
    </b-field>
    <!-- <b-field>
      <div :class="baseClass">I don't have any of these forms of ID.</div>
    </b-field> -->
    <b-message :title="toolTipTitle" type="is-info" has-icon :active.sync="isOpen">
      <slot name="tooltip"></slot>
    </b-message>
  </div>
</template>

<script>
import Cleave from 'cleave.js'

const cleave = {
  name: 'cleave',
  bind (el, binding) {
    const input = el.querySelector('input')
    input._vCleave = new Cleave(input, binding.value)
  },
  update (el, binding) {
    const input = el.querySelector('input')
    input._vCleave.destroy()
    input._vCleave = new Cleave(input, binding.value)
  },
  unbind (el) {
    const input = el.querySelector('input')
    input._vCleave.destroy()
  }
}

export default {
  directives: { cleave },
  props: [
    'label',
    'value',
    'toolTipTitle',
    'idOptions'
  ],
  data () {
    return {
      baseClass: {
        'is-medium': true,
        'is-outlined': true,
        button: true
      },
      isOpen: false,
      checkbox: false,
      masks: {
        creditCard: { creditCard: true },
        numeral: {
          numeral: true,
          numeralThousandsGroupStyle: 'thousand',
          prefix: '$ '
        },
        ssn: {
          delimiter: '-',
          blocks: [3, 2, 4],
          numericOnly: true
        },
        ssn4: {
          delimiter: '-',
          blocks: [3, 2, 4],
          numericOnly: true,
          prefix: 'XXXXX',
          rawValueTrimPrefix: true
        }
      }
    }
  },
  computed: {
    usesStateId: function () { return Boolean(this.stateIDTypes && this.stateIDTypes.length > 0) },
    stateIDTypes: function () {
      if (!this.idOptions) {
        return null
      }
      return this.idOptions.filter(opt => opt !== 'SSN4' && opt !== 'SSN')
    }
  },
  methods: {
    setVal: function (val) {
      this.$emit('input', val)
    },
    getRawValue (val, event) {
      this.rawValue = event.target._vCleave.getRawValue()
    },
    print (val) {
      console.log('val', val)
    }
  }
}
</script>
