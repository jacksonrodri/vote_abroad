<template>
<div>
  <div class="field">
  <span class="is-flex"><label class="label">{{ label }}</label><span @click="isOpen = !isOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span></span>
    <b-field grouped group-multiline :type="type">
      <p class="control">
        <button @click="emitVal('Democrat')" :class="[baseClass, {'is-success': isDem}]">
          <b-icon v-if="isDem" icon="check"></b-icon>
          <span>Democrat</span>
        </button>
      </p>
      <p class="control">
        <button @click="emitVal('Republican')" :class="[baseClass, {'is-success': isRep}]">
          <b-icon v-if="isRep" icon="check"></b-icon>
          <span>Republican</span>
        </button>
      </p>
      <p class="control">
        <button @click="emitVal('Independent')" :class="[baseClass, {'is-success': isInd}]">
          <b-icon v-if="isInd" icon="check"></b-icon>
          <span>Independent</span>
        </button>
      </p>
      <p class="control">
        <button @click="emitVal('none')" :class="[baseClass, {'is-success': isNone}]">
          <b-icon v-if="isNone" icon="check"></b-icon>
          <span>None</span>
        </button>
      </p>
      <p class="control">
        <button @click="isOther = true" :class="[baseClass, {'is-success': isOther}]">
          <b-icon v-if="isOther" icon="check"></b-icon>
          <span>Other</span>
        </button>
      </p>
    </b-field>
  </div>
  <b-field v-if="isOther">
    <b-input
      placeholder="Other"
      type="text"
      :value="other"
      ref="party"
      @input="emitVal"></b-input>
  </b-field>
  <b-message :title="toolTipTitle" type="is-info" has-icon :active.sync="isOpen">
    <slot name="tooltip"></slot>
  </b-message>
</div>
</template>

<script>
export default {
  name: 'Party-Input',
  props: [
    'value',
    'type',
    'label',
    'message',
    'toolTipTitle'
  ],
  data () {
    return {
      isOther: false,
      other: '',
      baseClass: {
        'is-medium': true,
        'is-outlined': true,
        button: true
      },
      isOpen: false
    }
  },
  computed: {
    isDem () {
      switch (this.value ? this.value.toLowerCase() : '') {
        case 'democrat':
        case 'dem':
        case 'democrats':
          if (!this.isOther) { return true }
          break
        default:
          return false
      }
    },
    isInd () {
      switch (this.value ? this.value.toLowerCase() : '') {
        case 'independent':
        case 'ind':
        case 'ind.':
          if (!this.isOther) { return true }
          break
        default:
          return false
      }
    },
    isRep () {
      switch (this.value ? this.value.toLowerCase() : '') {
        case 'republican':
        case 'rep':
          if (!this.isOther) { return true }
          break
        default:
          return false
      }
    },
    isNone () {
      switch (this.value ? this.value.toLowerCase() : '') {
        case 'none':
        case 'unaffiliated':
          if (!this.isOther) { return true }
          break
        default:
          return false
      }
    }
  },
  methods: {
    emitVal (val) {
      switch (val) {
        case 'Democrat':
        case 'Republican':
        case 'Independent':
        case 'none':
          this.other = ''
          this.isOther = false
          this.$emit('input', val)
          break
        default:
          this.$emit('input', this.other)
      }
      // console.log('val', val || '', 'input', this.$refs.party.value || '')
      // if (this.isRep || this.isDem || this.isNone || this.isInd) {
      //   this.other = ''
      // }
      // this.$emit('input', val)
    }
  }
}
</script>
