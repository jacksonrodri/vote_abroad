<template>
<div class="field">
  <span class="is-flex"><label class="label">{{ label }}</label><span @click="isOpen = !isOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span></span>
  <p v-if="validations.$error" class="help is-danger">{{ $t(`request.receiveBallot.messages.required`) }}</p>
  <b-field grouped group-multiline>
    <p class="control" v-if="ballotReceiptOptions.indexOf('Email') > -1">
      <button @click="setVal('email')" :class="[baseClass, {'is-success': email}]">
        <span v-show="email" class="icon is-small">
          <i class="fas fa-check"></i>
        </span>
        <span>
          {{$t('request.receiveBallot.email')}}
        </span>
      </button>
    </p>
    <p class="control" v-if="ballotReceiptOptions.indexOf('Mail') > -1">
      <button @click="setVal('mail')" :class="[baseClass, {'is-success': mail}]">
        <span v-show="mail" class="icon is-small">
          <i class="fas fa-check"></i>
        </span>
        <span>
          {{$t('request.receiveBallot.mail')}}
        </span>
      </button>
    </p>
    <p class="control" v-if="ballotReceiptOptions.indexOf('Fax') > -1">
      <button @click="setVal('fax')" :class="[baseClass, {'is-success': fax}]">
        <span v-show="fax" class="icon is-small">
          <i class="fas fa-check"></i>
        </span>
        <span>
          {{$t('request.receiveBallot.fax')}}
        </span>
      </button>
    </p>
  </b-field>
  <b-message :title="toolTipTitle" type="is-info" has-icon :active.sync="isOpen">
    <slot name="tooltip"></slot>
  </b-message>
</div>
</template>

<script>
export default {
  name: 'Receive-Ballot',
  props: [
    'label',
    'value',
    'toolTipTitle',
    'ballotReceiptOptions',
    'validations'
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
  methods: {
    setVal: function (val) {
      this.$emit('input', val)
    }
  },
  computed: {
    email: function () { return this.value === 'email' },
    mail: function () { return this.value === 'mail' },
    fax: function () { return this.value === 'fax' }
  }
}
</script>

