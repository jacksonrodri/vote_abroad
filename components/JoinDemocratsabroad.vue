<template>
<div class="field">
  <span class="is-flex"><label class="label">{{ label }}</label><span @click="isOpen = !isOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span></span>
  <b-field grouped group-multiline :type="type">
    <p class="control">
      <button @click="thisValue = true" :class="[baseClass, {'is-success': thisValue}]">
        <b-icon v-if="thisValue" icon="check"></b-icon>
        <span>Yes</span>
      </button>
    </p>
    <p class="control">
      <button @click="thisValue = false" :class="[baseClass, {'is-success': thisValue === false}]">
        <b-icon v-if="thisValue === false" icon="check"></b-icon>
        <span>No</span>
      </button>
    </p>
  </b-field>
  <div class="field">
    <b-checkbox v-model="isExistingDaMember">I am already a member of Democrats Abroad.</b-checkbox>
  </div>
  <b-message :title="toolTipTitle" type="is-info" has-icon :active.sync="isOpen">
    <slot name="tooltip"></slot>
  </b-message>
</div>

</template>

<script>
export default {
  props: [
    'value',
    'label',
    'type',
    'toolTipTitle'
  ],
  data () {
    return {
      baseClass: {
        'is-medium': true,
        'is-outlined': false,
        button: true
      },
      isOpen: false,
      isExistingDaMember: false
    }
  },
  computed: {
    thisValue: {
      get () { return this.value },
      set (value) { this.$emit('input', value) }
    }
  }
}
</script>
