<template>
  <section class="section">
    <b-field grouped group-multiline position="is-centered">
      <p class="control">
        <button @click="setVal('registered')" :class="[baseClass, {'is-primary': registered}]">
          <span v-show="registered" class="icon is-small">
            <i class="fas fa-check"></i>
          </span>
          <span>
            Yes
          </span>
        </button>
      </p>
      <p class="control">
        <button @click="setVal('notRegistered')" :class="[baseClass, {'is-primary': notRegistered}]">
          <span v-show="notRegistered" class="icon is-small">
            <i class="fas fa-check"></i>
          </span>
          <span>
            No
          </span>
        </button>
      </p>
      <p class="control">
        <button @click="setVal('unsure')" :class="[baseClass, {'is-primary': unsure}]">
          <span v-show="unsure" class="icon is-small">
            <i class="fas fa-check"></i>
          </span>
          <span>
            Not Sure
          </span>
        </button>
      </p>
    </b-field>
  </section>
</template>

<script>
export default {
  name: 'Is-Registered',
  props: [
    'label',
    'value'
  ],
  data () {
    return {
      baseClass: {
        'is-medium': true,
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

