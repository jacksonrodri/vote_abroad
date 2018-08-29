<template>
<div class="modal is-active">
  <div class="modal-background"></div>
  <div class="modal-card" style="width: auto">
      <figure class="image is-64x64 is-overlay" style="left:50%; transform: translate(-50%, 80%); z-index:41">
        <img src="/icon.png" :style="'animation: spinAround 3000ms infinite linear;'">
      </figure>
    <header class="modal-card-head">
    </header>
    <section class="modal-card-body">
      <section>
        <h3 class="title has-text-vfa has-text-centered is-4">Authenticating...</h3>
        <span class="subtitle has-text-centered is-5">Did you know: {{ didYouKnow[Math.floor(Math.random() * Math.floor(didYouKnow.length))]}}</span>
      </section>

    </section>
    <footer class="modal-card-foot">
      <nuxt-link :to="localePath({ name: 'request-stage', params: {stage: 'your-information'} })">Proceed without an account.</nuxt-link>
    </footer>
  </div>
</div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  middleware: 'account',
  data () {
    return {
      didYouKnow: [
        'Did you know around 9 million Americans live abroad?',
        'Request your ballot every calendar year to get full Federal Protection for all federal elections each year.',
        'Americans have been political abroad since Thomas Jefferson.  He drafted the Bill of Rights while in Paris.'
      ]
    }
  },
  computed: {
    ...mapState('userauth', ['authState'])
  },
  watch: {
    authState (val, oldVal) {
      if (val === 'loggedIn') {
        this.$router.replace(this.localePath({ name: 'request-review' }))
      }
    }
  },
  mounted () {
    if (this.authState === 'loggedIn' || !window.location.hash.includes('access_token')) {
      this.$router.replace(this.localePath({ name: 'request-review' }))
    }
  }
}
</script>

<style>

</style>
