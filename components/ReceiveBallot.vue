<template>
  <section class="section">
    <b-field grouped group-multiline position="is-centered">
      <p class="control">
        <button @click="setVal('email')" :class="[baseClass, {'is-primary': email}]">
          <span v-show="email" class="icon is-small">
            <i class="fas fa-check"></i>
          </span>
          <span>
            Email or online
          </span>
        </button>
      </p>
      <p class="control">
        <button @click="setVal('mail')" :class="[baseClass, {'is-primary': mail}]">
          <span v-show="mail" class="icon is-small">
            <i class="fas fa-check"></i>
          </span>
          <span>
            Mail
          </span>
        </button>
      </p>
      <p class="control">
        <button @click="setVal('fax')" :class="[baseClass, {'is-primary': fax}]">
          <span v-show="fax" class="icon is-small">
            <i class="fas fa-check"></i>
          </span>
          <span>
            Fax
          </span>
        </button>
      </p>
    </b-field>
  </section>
</template>

<script>
export default {
  name: 'Receive-Ballot',
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
    email: function () { return this.value === 'email' },
    mail: function () { return this.value === 'mail' },
    fax: function () { return this.value === 'fax' }
  }
}
</script>

