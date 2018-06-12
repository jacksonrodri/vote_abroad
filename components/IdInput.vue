<template>
  <div class="field">
    <span class="is-flex"><label class="label">{{ label }}</label><span v-if="idOptions" class="has-text-weight-light">&nbsp;(required)</span><span v-else>&nbsp;(Optional)</span><span @click.prevent="toolTipOpen = !toolTipOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span></span>
    <slot name="instructions"></slot>
    <br/>

    <b-field v-if="idOptions && idOptions.indexOf('SSN') > -1"
        :label="$t('request.id.SSN')"
        label-for="ssn"
        :message="validations.ssn.$error ? $t(`request.id.messages.fullSSNRequired`) : '' "
        :type="(validations.ssn.$error ? 'is-danger': '')">
      <b-input
        id="ssn"
        v-model="ssn"
        type="tel"
        v-mask="'###-##-####'"
        placeholder="e.g. 123-45-6789">
      </b-input>
    </b-field>

    <div v-if="idOptions && idOptions.includes('SSN') && idOptions.includes('SSN4')" class="has-text-centered"><strong>{{ $t('request.id.or')}}</strong></div>

    <b-field v-if="!idOptions || (idOptions && idOptions.indexOf('SSN4') > -1)"
      :message="validations.ssn4.$error ? $t(`request.id.messages.SSN4Required`) : '' "
      :type="(validations.ssn4.$error ? 'is-danger': '')"
      :label="$t('request.id.SSN4')"
      label-for="ssn4">
      <b-input
        v-mask="'✱✱✱-✱✱-####'"
        id="ssn4"
        type="tel"
        ref="ssn4"
        v-model="ssn4"
        placeholder="e.g. ✱✱✱-✱✱-6789" expanded></b-input>
    </b-field>

    <div class="has-text-centered"><strong>{{ $t('request.id.or')}}</strong></div>

    <b-field  v-if="!idOptions || (idOptions && idOptions.filter(x => x!== 'SSN' && x !== 'SSN4').length > 0)"
      :message="validations.stateId.$error ? $t(`request.id.messages.stateIdRequired`) : '' "
      :type="(validations.stateId.$error ? 'is-danger': '')"
      :label="stateIdLabel"
      label-for="stateId">
      <b-input id="stateId"
        v-model="stateId"
        ref="stateId">
      </b-input>
    </b-field>

    <div class="field">
      <b-checkbox v-model="noId" ref="noId">
        <span v-if="idOptions && idOptions.length === 1">{{$t('request.id.noid1', {id: $t(`request.id.${idOptions[0]}`)})}}</span>
        <span v-else>{{$t('request.id.noid2')}}</span>
      </b-checkbox>
    </div>

    <b-message :title="tooltipTitle" type="is-info" has-icon :active.sync="toolTipOpen">
      <slot name="tooltip"></slot>
    </b-message>

  </div>
</template>

<script>
import {mask, TheMask} from 'vue-the-mask'
export default {
  name: 'id-input',
  directives: {mask},
  components: {TheMask},
  props: [
    'label',
    'value',
    'tooltipTitle',
    'idOptions',
    'validations'
  ],
  data () {
    return {
      toolTipOpen: false
    }
  },
  computed: {
    ssn: {
      get () { return this.value && this.value.ssn ? this.value.ssn : null },
      set (val) { this.update({ssn: val}) }
    },
    ssn4: {
      get () { return this.value && this.value.ssn4 ? this.value.ssn4 : null },
      set (val) { this.update({ssn4: val}) }
    },
    stateId: {
      get () { return this.value && this.value.stateId ? this.value.stateId : null },
      set (val) { this.update({stateId: val}) }
    },
    noId: {
      get () { return this.value && this.value.noId ? this.value.noId : false },
      set (val) { this.update({noId: val}) }
    },
    usesStateId: function () { return Boolean(this.stateIDTypes && this.stateIDTypes.length > 0) },
    stateIDTypes: function () {
      if (!this.idOptions) {
        return null
      }
      return this.idOptions.filter(opt => opt !== 'SSN4' && opt !== 'SSN')
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
    update (val) {
      console.log(val)
      let newVal = Object.assign({}, this.value, val)
      if (Object.keys(val).includes('ssn')) { newVal.ssn4 = null; newVal.noId = false }
      if (Object.keys(val).includes('ssn4')) { newVal.ssn = null; newVal.noId = false }
      if (Object.keys(val).includes('stateId')) { newVal.ssn = null; newVal.noId = false }
      this.$emit('input', newVal)
    }
  }
}
</script>
