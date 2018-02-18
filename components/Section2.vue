<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">U.S. Voting Address</p>
    </header>
    <section class="modal-card-body">
      <us-address
        :label="$t('request.votingAddress')"
        toolTipTitle="Your last US Address"
        v-model="votAdr">
        <div slot="instructions">
          <p>{{ $t('request.votingAddressInstructions') }}</p>
        </div>
        <div slot="tooltip">
          <p>Use the residence address of the last place you lived in the US. If you have never resided in the US, use the residence address of the last place your US parent(s) lived in the US. If your US parents last lived in the US in different locations, you may choose which one to use as your voting address.</p>
        </div>

      </us-address>
    </section>
    <footer class="modal-card-foot">
      <button class="button" type="button" @click="$parent.close()">Close</button>
      <button class="button is-primary">Login</button>
    </footer>
  </div>
</template>

<script>
import UsAddress from '~/components/USAddress.vue'
export default {
  components: {
    UsAddress
  },
  data () {
    return {
      votAdr: {}
    }
  }
}
</script>
