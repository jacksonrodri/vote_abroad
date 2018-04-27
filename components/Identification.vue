<template>
  <div class="field">
    <span class="is-flex"><label class="label">{{ label }}</label><span v-if="idOptions" class="has-text-weight-light">&nbsp;(required)</span><span v-else>&nbsp;(Optional)</span><span @click="isOpen = !isOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span></span>
    <slot name="instructions"></slot>
    <br/>

    <b-field v-if="idOptions && idOptions.indexOf('SSN') > -1"
      :label="$t('request.id.SSN')"
      :message="validations.ssn.$error ? $t(`request.id.messages.fullSSNRequired`) : '' "
      :type="(validations.ssn.$error ? 'is-danger': '')">
      <b-input v-cleave="masks.ssn"
        :value="value ? value.ssnTyped : ''"
        ref="ssn"
        @input="setVal"
        @input.native="val => setSSN(val.target._vCleave.getRawValue())">
      </b-input>
    </b-field>

    <b-field v-if="!idOptions || (idOptions && idOptions.indexOf('SSN4') > -1)"
      :message="validations.ssn.$error ? $t(`request.id.messages.SSN4Required`) : '' "
      :type="(validations.ssn.$error ? 'is-danger': '')"
      :label="$t('request.id.SSN4')">
      <b-input v-cleave="masks.ssn4"
        :value="value ? value.ssnTyped : ''"
        ref="ssn4"
        @input="setVal"
        @input.native="val => setSSN(val.target._vCleave.getRawValue())">
      </b-input>
    </b-field>

    <div class="has-text-centered"><strong>{{ $t('request.id.or')}}</strong></div>

    <b-field v-if="!idOptions || (idOptions && idOptions.filter(x => x!== 'SSN' && x !== 'SSN4').length > 0)"
      :message="validations.stateId.$error ? $t(`request.id.messages.stateIdRequired`) : '' "
      :type="(validations.stateId.$error ? 'is-danger': '')"
      :label="stateIdLabel">
      <b-input :value="value ? value.stateId : ''"
        ref="stateId"
        @input="setVal">
      </b-input>
    </b-field>

    <div class="field">
      <b-checkbox :value="value ? value.noId : false" @input="setVal" ref="noId">
        <span v-if="idOptions && idOptions.length === 1">{{$t('request.id.noid1', {id: $t(`request.id.${idOptions[0]}`)})}}</span>
        <span v-else>{{$t('request.id.noid2')}}</span>
      </b-checkbox>
    </div>

    <b-message :title="tooltipTitle" type="is-info" has-icon :active.sync="isOpen">
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
    'tooltipTitle',
    'idOptions',
    'validations'
  ],
  data () {
    return {
      baseClass: {
        'is-medium': true,
        'is-outlined': true,
        button: true
      },
      isOpen: false,
      ssnclean: '',
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
    },
    ssn: function () {
      if (this.$refs.ssn) {
        return this.$refs.ssn.newValue
      } else if (this.$refs.ssn4) {
        return this.$refs.ssn4.newValue
      } else {
        return ''
      }
    },
    stateIdLabel: function () {
      return !this.usesStateId
        ? this.$t('request.id.StateID')
        : this.stateIDTypes.reduce((label, cur, i, arr) => {
          if (i === 0) {
            return label + this.$t(`request.id.${cur}`)
          } else if (i === arr.length - 1) {
            return `${label} or ${this.$t(`request.id.${cur}`)}`
          } else {
            return `${label}, ${this.$t(`request.id.${cur}`)}`
          }
        }, '')
    }
  },
  methods: {
    setVal: function () {
      let val = this.$refs.noId.newValue ? {noId: true, ssn: '', ssnTyped: '', stateId: ''} : {noId: false, ssn: this.ssnclean, ssnTyped: this.ssn, stateId: this.$refs.stateId ? this.$refs.stateId.newValue || '' : ''}
      if (this.$refs.noId.newValue) {
        this.$refs.ssn4.value = ''
      }
      this.$emit('input', val)
    },
    setSSN: function (val) {
      this.ssnclean = val
    },
    getRawValue (val, event) {
      this.rawValue = event.target._vCleave.getRawValue()
    }
  }
}
</script>
