<template>
<div class="field">
  <span class="is-flex"><label class="label">{{ label }}</label><span @click="isOpen = !isOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span></span>
  <b-field grouped group-multiline>
    <p class="control">
      <a @click="() => setVal('female')" :class="[baseClass, {'is-success': value === 'female'}]">
        <span v-show="value === 'female'" class="icon is-small">
          <i class="fas fa-check"></i>
        </span>
        <span>
          {{$t('request.sex.female')}}
        </span>
      </a>
    </p>
    <p class="control">
      <a @click="setVal('male')" :class="[baseClass, {'is-success': value === 'male'}]">
        <span v-show="value === 'male'" class="icon is-small">
          <i class="fas fa-check"></i>
        </span>
        <span>
          {{$t('request.sex.male')}}
        </span>
      </a>
    </p>
    <p class="control">
      <a @click="setVal('decline')" :class="[baseClass, {'is-success': value === 'decline'}]">
        <span v-show="value === 'decline'" class="icon is-small">
          <i class="fas fa-check"></i>
        </span>
        <span>
          {{$t('request.sex.decline')}}
        </span>
      </a>
    </p>
  </b-field>
  <b-message :title="tooltipTitle" type="is-info" has-icon :active.sync="isOpen">
    <slot name="tooltip"></slot>
  </b-message>
</div>
</template>

<script>
export default {
  name: 'Gender',
  props: [
    'label',
    'value',
    'tooltipTitle'
  ],
  data () {
    return {
      baseClass: {
        'is-medium': true,
        'is-outlined': false,
        button: true
      },
      isOpen: false
    }
  },
  methods: {
    setVal: function (val) {
      this.$emit('input', val)
    }
  }
}
</script>

