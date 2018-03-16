<template>
<div class="field">
  <span class="is-flex"><label class="label">{{ label }}</label><span @click="isOpen = !isOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span></span>
  <b-field grouped group-multiline :type="type">
    <p class="control" v-for="(party, index) in Object.keys(partyChoices)" :key="index">
      <button @click="thisValue = party" :class="[baseClass, {'is-success': partyChoices[party].aliases.indexOf(thisValue ? thisValue.toString().toLowerCase() : '') > -1}]">
        <b-icon v-if="partyChoices[party].aliases.indexOf(thisValue? thisValue.toString().toLowerCase() : '') > -1" icon="check"></b-icon>
        <span>{{$t(`request.party.${party.toLowerCase()}`)}}</span>
      </button>
    </p>
    <p class="control">
      <button @click="selectOther(!isOther)" :class="[baseClass, {'is-success': isOther}]">
        <b-icon v-if="isOther" icon="check"></b-icon>
        <span>{{$t('request.party.other')}}</span>
      </button>
    </p>
  </b-field>
  <transition name="fade">
    <b-field v-if="isOther">
      <b-input
        :placeholder="$t('request.party.placeholder')"
        type="text"
        :value="thisValue"
        ref="party"
        @input="val => thisValue = val"></b-input>
    </b-field>
  </transition>
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
      partyChoices: {
        Democratic: {aliases: ['democratic', 'democrat', 'dfl', 'd']},
        Republican: {aliases: ['republican', 'rep', 'r', 'gop']},
        // Independent: {aliases: ['independent', 'ind', 'i']},
        none: {aliases: ['none', 'no party']}
      },
      isOtherButNoValue: false
    }
  },
  computed: {
    thisValue: {
      get () { return this.value },
      set (value) { this.$emit('input', value || '') }
    },
    isOther: {
      get () { return Boolean((Object.keys(this.partyChoices).map(x => this.partyChoices[x].aliases).reduce((a, b) => a.concat(b), [])).indexOf(this.thisValue ? this.thisValue.toString().toLowerCase() : '') === -1 && (this.thisValue || this.isOtherButNoValue)) }
    },
    fromStore () { return this.$store.getters['requests/getCurrent'].party }
  },
  methods: {
    selectOther (value) {
      this.thisValue = ''
      this.isOtherButNoValue = value
    }
  }
}
</script>
