<template>
  <div>
    <span class="is-flex"><label class="label">{{ label }}</label><span @click="isOpen = !isOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span></span>
    <b-field v-if="idOptions && idOptions.indexOf('SSN') > -1" label="Full Social Security Number">
      <b-input>

      </b-input>
    </b-field>
    <b-field v-if="idOptions && idOptions.indexOf('SSN4') > -1" label="The last 4 digits of your Social Security Number">
      <b-input>

      </b-input>
    </b-field>
    <b-field label="Your State ID">
      <b-input>

      </b-input>
    </b-field>
    <b-field>
      <div :class="baseClass">I don't have any of these forms of ID.</div>
    </b-field>
    <b-message :title="toolTipTitle" type="is-info" has-icon :active.sync="isOpen">
      <slot name="tooltip"></slot>
    </b-message>
  </div>
</template>

<script>
export default {
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
      isOpen: false
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
    }
  }
}
</script>
