<template>
  <b-field :label="label" :message="message">
    <b-field :type="type">
      <p class="control">
        <button @click="emitVal('Democrat')" :class="[{button: true}, {'is-primary': isDem}]">
          <b-icon v-if="isDem" icon="check"></b-icon>
          <span>Dem.</span>
        </button>
      </p>
      <p class="control">
        <button @click="emitVal('Republican')" :class="[{button: true}, {'is-primary': isRep}]">
          <b-icon v-if="isRep" icon="check"></b-icon>
          <span>Rep.</span>
        </button>
      </p>
      <p class="control">
        <button @click="emitVal('Independent')" :class="[{button: true}, {'is-primary': isInd}]">
          <b-icon v-if="isInd" icon="check"></b-icon>
          <span>Ind.</span>
        </button>
      </p>
      <b-input
        placeholder="Other"
        type="text"
        :value="value"
        expanded
        ref="party"
        @input="emitVal"></b-input>
    </b-field>
  </b-field>
</template>

<script>
export default {
  name: 'Party-Input',
  props: [
    'value',
    'type',
    'label',
    'message'
  ],
  computed: {
    isDem () {
      switch (this.value ? this.value.toLowerCase() : '') {
        case 'democrat':
        case 'dem':
        case 'democrats':
          return true
        default:
          return false
      }
    },
    isInd () {
      switch (this.value ? this.value.toLowerCase() : '') {
        case 'independent':
        case 'ind':
        case 'ind.':
          return true
        default:
          return false
      }
    },
    isRep () {
      switch (this.value ? this.value.toLowerCase() : '') {
        case 'republican':
        case 'rep':
          return true
        default:
          return false
      }
    }
  },
  methods: {
    emitVal (val) {
      console.log('val', val || '', 'input', this.$refs.party.value || '')
      this.$emit('input', val)
    }
  }
}
</script>
