<template>
<div class="field">
  <div class="field">
    <span class="is-flex"><label class="label">{{ label }}</label><span @click="isOpen = !isOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span></span>
    <b-field grouped group-multiline :type="type">
      <p class="control" v-for="(party, index) in Object.keys(partyChoices)" :key="index">
        <a @click="thisValue = thisValue === party ? null : party; isOtherButNoValue = false" :class="[baseClass, {'is-success': partyChoices[party].aliases.indexOf(thisValue ? thisValue.toString().toLowerCase() : '') > -1}]">
          <b-icon v-if="partyChoices[party].aliases.indexOf(thisValue ? thisValue.toString().toLowerCase() : '') > -1" icon="check"></b-icon>
          <span>{{$t(`request.party.${party.toLowerCase()}`)}}</span><span v-if="state === 'MN' && party.toLowerCase() === 'democratic'">&nbsp;(DFL)</span><span v-if="state === 'ND' && party.toLowerCase() === 'democratic'">&nbsp;(D-NPL)</span>
        </a>
      </p>
      <p class="control">
        <a @click="selectOther(!isOther)" :class="[baseClass, {'is-success': isOther}]">
          <b-icon v-if="isOther" icon="check"></b-icon>
          <span>{{$t('request.party.other')}}</span>
        </a>
      </p>
    </b-field>
    <transition name="fade">
      <b-field v-if="isOther || elapsedTime < 5">
        <b-input
          :placeholder="$t('request.party.placeholder')"
          type="text"
          :value="thisValue"
          ref="party"
          @input="val => {if (val) {isOtherButNoValue = false}; thisValue = val; resetTimer()}"></b-input>
      </b-field>
    </transition>
    <b-message :title="tooltipTitle" type="is-info" has-icon :active.sync="isOpen">
      <slot name="tooltip"></slot>
    </b-message>
  </div>
  <transition name="fade">
  <div v-if="!$store.state.userauth.user.isDA && ((thisValue && !partyChoices.Republican.aliases.includes(thisValue.toLowerCase())) || isOtherButNoValue || (isOtherButNoValue && thisValue && !partyChoices.Republican.aliases.includes(thisValue.toLowerCase())) || joinValue)" class="field">
    <span class="is-flex"><label class="label">{{ joinLabel }}</label><span @click="joinToolTipIsOpen = !joinToolTipIsOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span></span>
    <b-field grouped group-multiline :type="type">
      <p class="control">
        <a @click="joinValue = joinValue === true ? null : true; isExistingDaMember = false" :class="[baseClass, {'is-success': joinValue === true}]">
          <b-icon v-if="joinValue === true" icon="check"></b-icon>
          <span>{{$t('request.joinDa.yes')}}</span>
        </a>
      </p>
      <p class="control">
        <a @click="joinValue = joinValue === false? null : false; isExistingDaMember = false" :class="[baseClass, {'is-success': joinValue === false}]">
          <b-icon v-if="joinValue === false" icon="check"></b-icon>
          <span>{{$t('request.joinDa.no')}}</span>
        </a>
      </p>
      <p class="control">
        <a @click="isExistingDaMember = !isExistingDaMember; joinValue = !isExistingDaMember ? null : daEmail || 'already a member'" :class="[baseClass, {'is-success': isExistingDaMember || (joinValue !== true && joinValue !== false && joinValue)}]">
          <b-icon v-if="isExistingDaMember || (joinValue !== true && joinValue !== false && joinValue)" icon="check"></b-icon>
          <span>{{$t('request.joinDa.alreadyMember')}}</span>
        </a>
      </p>
    </b-field>
    <transition name="fade">
      <b-field
        v-if="isExistingDaMember || (joinValue !== true && joinValue !== false && joinValue)"
        key="daEmail"
        ref="daEmail"
        :label="$t('request.joinDa.accountEmail', {email: email || $t('request.joinDa.currentEmail')})"
        :type="$v.$error ? 'is-danger' : ''"
        :message="$v.$error ? $t('request.joinDa.messages.email') : ''">
        <a @click.prevent="$el.querySelector('input').focus()"
          :class="['button', 'is-static', 'control']">
          <b-icon
            pack="fas"
            icon="at">
          </b-icon>
        </a>
        <b-input type="email"
          v-model="daEmailGetter"
          @input="(val) => joinValue = val"
          maxlength="30">
        </b-input>
      </b-field>
    </transition>
    <b-message :title="joinTooltipTitle" type="is-info" has-icon :active.sync="joinToolTipIsOpen">
      <slot name="joinTooltip"></slot>
    </b-message>
  </div>
  </transition>
</div>

</template>

<script>
import { email } from 'vuelidate/lib/validators'

export default {
  props: [
    'value',
    'join',
    'label',
    'joinLabel',
    'type',
    'tooltipTitle',
    'joinTooltipTitle',
    'state'
  ],
  data () {
    return {
      baseClass: {
        'is-medium': true,
        'is-outlined': false,
        button: true
      },
      isOpen: false,
      joinToolTipIsOpen: false,
      partyChoices: {
        Democratic: {aliases: ['democratic', 'democrat']},
        Republican: {aliases: ['republican', 'gop']},
        // Independent: {aliases: ['independent', 'ind', 'i']},
        none: {aliases: ['none', 'no party']}
      },
      isOtherButNoValue: false,
      isExistingDaMember: false,
      daEmail: '',
      currentTime: Math.trunc((new Date()).getTime() / 1000),
      setTime: Math.trunc((new Date()).getTime() / 1000) - 10
    }
  },
  computed: {
    thisValue: {
      get () { return this.value },
      set (value) {
        if (value === 'Republican') this.$store.commit('requests/update', {joinDa: null})
        this.$emit('input', value)
      }
    },
    email () { return this.$store.getters['requests/getCurrent'].email },
    daEmailGetter: {
      get () { return this.daEmail || (this.joinValue && this.joinValue !== true && this.joinValue !== false && this.joinValue !== 'already a member' && this.joinValue !== 'true' && this.joinValue !== 'false') ? this.joinValue : '' },
      set (value) { this.daEmail = value }
    },
    joinValue: {
      get () { return this.join },
      set (value) { this.$emit('joinDA', value) }
    },
    isOther: {
      get () { return Boolean((Object.keys(this.partyChoices).map(x => this.partyChoices[x].aliases).reduce((a, b) => a.concat(b), [])).indexOf(this.thisValue ? this.thisValue.toString().toLowerCase() : '') === -1 && (this.thisValue || this.isOtherButNoValue)) }
    },
    fromStore () { return this.$store.getters['requests/getCurrent'].party },
    elapsedTime () { return this.currentTime - this.setTime }
  },
  methods: {
    resetTimer () {
      this.setTime = Math.trunc((new Date()).getTime() / 1000)
    },
    selectOther (value) {
      this.thisValue = ''
      this.isOtherButNoValue = value
    }
  },
  mounted () {
    this.setTime = Math.trunc((new Date()).getTime() / 1000) - 10
    if (process.browser) {
      window.setInterval(() => {
        this.currentTime = Math.trunc((new Date()).getTime() / 1000)
      }, 1000)
    }
  },
  validations () {
    return {
      daEmailGetter: { email }
    }
  }
}
</script>
