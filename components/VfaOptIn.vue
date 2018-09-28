<template>
  <div class="card">
    <div class="card-content">
      <h3 class="subtitle is-5">Vote From Abroad helps US citizens register to vote quickly and easily, but to do so we need to collect your personal information. Your data privacy is our top concern, so please read and accept our: </h3>
      <b-field
        grouped
        position="is-centered">
        <b-checkbox :class="isDirty && !tos ? 'has-text-danger  has-text-weight-semibold' : ''" v-model="tos" required type="is-vfa">Terms of Service</b-checkbox>
        <button class="button is-vfa is-inverted is-small">
          (Read)
        </button>
      </b-field>
      <b-field grouped position="is-centered">
        <b-checkbox :class="isDirty && !privacy ? 'has-text-danger  has-text-weight-semibold' : ''" v-model="privacy" required type="is-vfa">Privacy Policy</b-checkbox>
        <button class="button is-vfa is-inverted is-small">
          (Read)
        </button>
      </b-field>
      <b-field grouped position="is-centered">
        <b-checkbox :class="isDirty && !cookie ? 'has-text-danger  has-text-weight-semibold' : ''" v-model="cookie" required type="is-vfa">Cookie Policy</b-checkbox>
        <button class="button is-vfa is-inverted is-small">
          (Read)
        </button>
      </b-field>

      <p v-if="isError" class="help has-text-centered has-text-danger">You must agree to the terms to use VoteFromAbroad.</p>
      <b-field grouped position="is-right">
          <p class="control">
              <button
                @click="optIn"
                class="button is-vfa">I agree</button>
          </p>
      </b-field>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      privacy: false,
      tos: false,
      cookie: false,
      isDirty: false
    }
  },
  computed: {
    isError () { return this.isDirty && (!this.privacy || !this.tos || !this.cookie) }
  },
  methods: {
    optIn: function () {
      this.isDirty = true
      if (!this.isError) this.$emit('optIn')
    }
  }

}
</script>

<style>

</style>
