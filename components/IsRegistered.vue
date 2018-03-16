<template>
<b-field :label="label"
  type='is-danger'
  :message="validations.$error ? $t(`request.isRegistered.messages.required`) : ''">
  <b-field grouped
    group-multiline>
    <p class="control">
      <button @click="setVal('registered')" :class="[baseClass, {'is-success': registered}]">
        <span v-show="registered" class="icon is-small">
          <i class="fas fa-check"></i>
        </span>
        <span>
          {{$t('request.isRegistered.yes')}}
        </span>
      </button>
    </p>
    <p class="control">
      <button @click="setVal('notRegistered')" :class="[baseClass, {'is-success': notRegistered}]">
        <span v-show="notRegistered" class="icon is-small">
          <i class="fas fa-check"></i>
        </span>
        <span>
          {{$t('request.isRegistered.no')}}
        </span>
      </button>
    </p>
    <p class="control">
      <button @click="setVal('unsure')" :class="[baseClass, {'is-success': unsure}]">
        <span v-show="unsure" class="icon is-small">
          <i class="fas fa-check"></i>
        </span>
        <span>
          {{$t('request.isRegistered.unsure')}}
        </span>
      </button>
    </p>
  </b-field>
</b-field>
</template>

<script>
export default {
  name: 'Is-Registered',
  props: [
    'label',
    'value',
    'jurisdiction',
    'jurisdictionType',
    'validations'
  ],
  data () {
    return {
      baseClass: {
        'is-medium': true,
        'is-outlined': true,
        button: true
      }
    }
  },
  methods: {
    setVal: function (val) {
      this.$emit('input', val)
    }
  },
  computed: {
    registered: function () { return this.value === 'registered' },
    notRegistered: function () { return this.value === 'notRegistered' },
    unsure: function () { return this.value === 'unsure' }
  }
}
</script>

