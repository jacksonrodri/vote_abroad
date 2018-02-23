<template>
<div>
  <div class="field">
    <span class="is-flex"><label class="label">{{ instructions }}</label><span @click="isOpen = !isOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span></span>
      <b-field grouped>
        <p class="control">
          <button @click="setUsesPreviousName(true)" :class="['button', {'is-success': usesPreviousName}]">
            <span v-show="usesPreviousName" class="icon is-small">
              <i class="fas fa-check"></i>
            </span>
            <span>
              Yes
            </span>
          </button>
        </p>
        <p class="control">
          <button @click="setUsesPreviousName(false)" :class="['button', 'is-outlined', {'is-success': !usesPreviousName}]">
            <span v-show="!usesPreviousName" class="icon is-small">
              <i class="fas fa-check"></i>
            </span>
            <span>
              No
            </span>
          </button>
        </p>
      </b-field>
  </div>
  <b-field v-show="usesPreviousName" :type="type" :message="message" :label="label">
    <b-input :value="value && value.previousName ? value.previousName : ''" @input="val => setName(val)"></b-input>
  </b-field>
  <b-message title="Why do you need my previous name?" type="is-info" has-icon :active.sync="isOpen">
    If you have previously voted with a different name, you election official may need to look you up using your previous name.
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
    'message'
  ],
  computed: {
    name () {
      return this.value && this.value.previousName ? this.value.previousName : ''
    },
    usesPreviousName () {
      return this.value && this.value.usesPreviousName ? this.value.usesPreviousName : false
    }
  },
  data () {
    return {
      isOpen: false
    }
  },
  methods: {
    setName: function (val) {
      console.log(val, this.value)
      this.$emit('input', {
        previousName: val,
        usesPreviousName: true
      })
    },
    setUsesPreviousName: function (val) {
      this.$emit('input', {
        previousName: val ? this.name : '',
        usesPreviousName: val
      })
    }
  }
}
</script>
