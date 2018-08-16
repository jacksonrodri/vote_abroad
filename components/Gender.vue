<template>
<div class="field">
  <span class="is-flex"><label class="label">{{ label }}</label><span @click="isOpen = !isOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span></span>
  <b-field
    :message="validations.$error ? Object.keys(validations.$params).map(x => $t(`request.sex.messages.${x}`, {state: 'Idaho' })) : '' "
    :type="(validations.$error ? 'is-danger': '')">
    <b-field grouped group-multiline>
      <p class="control">
        <a @click="() => value === 'female' ? setVal(null) : setVal('female')" :class="[baseClass, {'is-success': value === 'female'}]">
          <span v-show="value === 'female'" class="icon is-small">
            <i class="fas fa-check"></i>
          </span>
          <span>
            {{$t('request.sex.female')}}
          </span>
        </a>
      </p>
      <p class="control">
        <a @click="() => value === 'male' ? setVal(null) : setVal('male')" :class="[baseClass, {'is-success': value === 'male'}]">
          <span v-show="value === 'male'" class="icon is-small">
            <i class="fas fa-check"></i>
          </span>
          <span>
            {{$t('request.sex.male')}}
          </span>
        </a>
      </p>
      <p class="control" v-if="state !== 'ID'">
        <a @click="() => value === 'decline' ? setVal(null) : setVal('decline')" :class="[baseClass, {'is-success': value === 'decline'}]">
          <span v-show="value === 'decline'" class="icon is-small">
            <i class="fas fa-check"></i>
          </span>
          <span>
            {{$t('request.sex.decline')}}
          </span>
        </a>
      </p>
    </b-field>
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
    'state',
    'tooltipTitle',
    'validations'
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

