<template>
  <div class="column is-10 is-8-desktop is-7-widescreen is-6-fullhd is-paddingless">
    <div class="section">
      <h1 class="has-text-centered title is-3">Complete</h1>
      <h3 class="has-text-centered subtitle is-4">Next Steps</h3>
      <p class="is-size-5">Next step instructions to be included here.</p>
    </div>
  </div>
</template>


<script>
import { mapState } from 'vuex'

export default {
  name: 'FPCAComplete',
  middleware: 'verify-request',
  data () {
    return {}
  },
  methods: {
    startNewFPCA: function () {
      // TODO
    }
  },
  computed: {
    currentRequest () { return this.requests[this.currentRequestIndex] },
    ...mapState({
      currentRequestIndex: state => state.requests.currentRequest,
      requests: state => state.requests.requests
    })
  }
}
</script>
