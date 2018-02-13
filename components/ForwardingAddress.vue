<template>
  <div>
    <h1 class="subtitle is-4">{{ $t('request.forwardingAddressInstructions') }}</h1>
    <b-field grouped>
      <p class="control">
        <button @click="updateVal({}); usesForwardingAddress = true" :class="[baseClass, {'is-primary': hasForwardingAddress}]">
          <span v-show="hasForwardingAddress" class="icon is-small">
            <i class="fas fa-check"></i>
          </span>
          <span>
            Yes
          </span>
        </button>
      </p>
      <p class="control">
        <button @click="updateVal({}); usesForwardingAddress = false" :class="[baseClass, {'is-danger': !hasForwardingAddress}]">
          <span v-show="!hasForwardingAddress" class="icon is-small">
            <i class="fas fa-times"></i>
          </span>
          <span>
            No
          </span>
        </button>
      </p>
    </b-field>
    <address-input
      :label="$t('request.forwardingAddress')"
      key="forwardingAddress"
      :value="value"
      v-show="hasForwardingAddress"
      @input="updateVal">
      <div slot="instructions">
        <p>{{ $t('request.forwardingAddressInstructions') }}</p>
      </div>

    </address-input>
  </div>
</template>

<script>
import AddressInput from '~/components/AddressInput'

export default {
  name: 'Forwarding-Address',
  props: [
    'label',
    'value'
  ],
  data () {
    return {
      usesForwardingAddress: false,
      baseClass: {
        'is-medium': false,
        button: true
      },
      adr: {}
    }
  },
  components: {
    AddressInput
  },
  methods: {
    updateVal (val) {
      this.$emit('input', val)
    }
  },
  computed: {
    hasForwardingAddress: function () { return Boolean(this.value ? this.value.alt1 || this.value.alt2 || this.value.alt3 || this.value.alt4 || this.usesForwardingAddress : this.usesForwardingAddress) }
  }
}
</script>

