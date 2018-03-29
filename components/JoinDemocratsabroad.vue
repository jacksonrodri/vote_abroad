<template>
<div class="field">
  <span class="is-flex"><label class="label">{{ label }}</label><span @click="isOpen = !isOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span></span>
  <b-field grouped group-multiline :type="type">
    <p class="control">
      <button @click="thisValue = true; isExistingDaMember = false" :class="[baseClass, {'is-success': thisValue}]">
        <b-icon v-if="thisValue" icon="check"></b-icon>
        {{$t('request.joinDa.yes')}}
      </button>
    </p>
    <p class="control">
      <button @click="thisValue = false; isExistingDaMember = false" :class="[baseClass, {'is-success': thisValue === false}]">
        <b-icon v-if="thisValue === false" icon="check"></b-icon>
        {{$t('request.joinDa.no')}}
      </button>
    </p>
    <p class="control">
      <button @click="isExistingDaMember = !isExistingDaMember; thisValue = null" :class="[baseClass, {'is-success': isExistingDaMember}]">
        <b-icon v-if="isExistingDaMember" icon="check"></b-icon>
        {{$t('request.joinDa.alreadyMember')}}
      </button>
    </p>
  </b-field>
  <transition name="fade">
    <b-field v-if="isExistingDaMember">
      <b-input
        :placeholder="$t('request.joinDa.accountEmail')"
        type="text"
        v-model="daEmail"></b-input>
    </b-field>
    <!-- Please enter your account email address if you remember it so we can update your record -->
  </transition>
  <!-- <div class="field">
    <b-checkbox v-model="isExistingDaMember">I am already a member of Democrats Abroad.</b-checkbox>
  </div> -->
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
      isExistingDaMember: false,
      daEmail: ''
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
