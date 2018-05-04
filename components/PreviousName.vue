<template>
<div>
  <div class="field">
    <span class="is-flex"><label class="label">{{ instructions }}</label><span @click="isOpen = !isOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span></span>
      <b-field grouped>
        <p class="control">
          <button @click="setUsesPreviousName(true)" :class="[baseClass, {'is-success': usesPreviousName}]">
            <span v-show="usesPreviousName" class="icon is-small">
              <i class="fas fa-check"></i>
            </span>
            <span>
              {{ $t('request.previousName.yes')}}
            </span>
          </button>
        </p>
        <p class="control">
          <button @click="setUsesPreviousName(false)" :class="[baseClass, {'is-success': !usesPreviousName}]">
            <span v-show="!usesPreviousName" class="icon is-small">
              <i class="fas fa-check"></i>
            </span>
            <span>
              {{ $t('request.previousName.no')}}
            </span>
          </button>
        </p>
      </b-field>
  </div>
  <b-field v-show="usesPreviousName" :type="type" :message="message" :label="label">
    <!-- <b-input :value="value && value.previousName ? value.previousName : ''" @input="val => setName(val)"></b-input> -->
    <b-input v-model="pName"></b-input>
  </b-field>
  <b-message :title="tooltipTitle" type="is-info" has-icon :active.sync="isOpen">
    <slot name="tooltip"></slot>
    <!-- {{ $t('request.previousName.tooltip')}} -->
  </b-message>
</div>
</template>

<script>
export default {
  name: 'PreviousName',
  props: [
    'label',
    'instructions',
    'value',
    'type',
    'message',
    'tooltipTitle'
  ],
  computed: {
    name () {
      return this.value && this.value.previousName ? this.value.previousName : ''
    },
    pName: {
      get () {
        if (typeof this.value === 'string' && this.value.length > 0) {
          return this.value
        } else if (this.value && typeof this.value.previousName === 'string' && this.value.previousName.length > 0) {
          return this.value.previousName
        } else {
          return null
        }
      },
      set (value) {
        this.$emit('input', {
          previousName: value || null,
          usesPreviousName: this.value.usesPreviousName || false
        })
      }
    },
    usesPreviousName () {
      return this.value && this.value.usesPreviousName ? this.value.usesPreviousName : false
    }
  },
  data () {
    return {
      isOpen: false,
      baseClass: {
        'is-medium': true,
        'is-outlined': false,
        button: true
      }
    }
  },
  methods: {
    setName: function (val) {
      // console.log(val, this.value)
      this.$emit('input', {
        previousName: val,
        usesPreviousName: true
      })
    },
    setUsesPreviousName: function (val) {
      this.$emit('input', {
        // previousName: val ? this.name || null : null,
        previousName: this.pName,
        usesPreviousName: val
      })
    }
  }
}
</script>
