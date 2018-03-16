<template>
  <div>
    <!-- <h1 class="subtitle is-4">{{ $t('request.forwardingAddressInstructions') }}</h1> -->
    <span class="is-flex"><label class="label" style="cursor: pointer;">{{ label }} </label><span v-if="toolTipTitle" @click="isOpen = !isOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span></span>
    <b-message v-if="toolTipTitle" :title="toolTipTitle" type="is-info" has-icon :active.sync="isOpen">
      <slot name="tooltip"></slot>
    </b-message>
    <b-field grouped>
      <p class="control">
        <button @click="updateVal({}); usesForwardingAddress = true" :class="[baseClass, {'is-success': hasForwardingAddress}]">
          <span v-show="hasForwardingAddress" class="icon is-small">
            <i class="fas fa-check"></i>
          </span>
          <span>
            {{$t('request.fwdAdr.yes')}}
          </span>
        </button>
      </p>
      <p class="control">
        <button @click="updateVal({}); usesForwardingAddress = false" :class="[baseClass, {'is-success': !hasForwardingAddress}]">
          <span v-show="!hasForwardingAddress" class="icon is-small">
            <i class="fas fa-check"></i>
          </span>
          <span>
            {{$t('request.fwdAdr.no')}}
          </span>
        </button>
      </p>
    </b-field>
    <address-input
      :label="$t('request.fwdAdr.label')"
      key="forwardingAddress"
      :value="value"
      v-if="hasForwardingAddress"
      @input="updateVal">
      <div slot="instructions">
        <p>{{ $t('request.fwdAdr.instructions') }}</p>
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
    'value',
    'toolTipTitle'
  ],
  data () {
    return {
      usesForwardingAddress: false,
      baseClass: {
        'is-medium': true,
        'is-outlined': true,
        button: true
      },
      adr: {},
      isOpen: false
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

