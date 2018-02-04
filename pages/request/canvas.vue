<template>
  <div class="is-fullhd">
    <!-- <no-ssr> -->
    <button class="button is-primary" @click="isSignatureModalActive = true">Add your signature</button>
    <my-canvas class="canvas">
      <my-box
        :lastName="lastName"
        :firstName="firstName"
        :middleName="middleName"
        :suffix="suffix"
        :previousName="previousName"
        :dob="dob"
        ssn="123456789"
        stateId="NC123"
        votStreet="711 McCulloch St"
        votApt="apartment block"
        votCity="Raleigh"
        votState="NC"
        votCounty="Wake"
        votZip="27603-1939"
        :abr="['Flat 7, 27/f BLock C,','Greenwood Garden,','Shatin, NT,','HONG KONG']"
        :fwd="['Flat 9, 29/f BLock C,','Greenwood Garden,','Shatin, NT,','HONG KONG']"
        email="somebody@gmail.com"
        altEmail="nobody@gmail.com"
        tel="+852 9669 9279 123"
        fax="+852 1234 5678"
        party="Democrat"
        :addlInfo="['I like this stuff','line 2','line 3']"
        :date="new Date()"
        classification="uncertainReturn"
        sex="male"
        recBallot="email"
        :signature="signature"></my-box>
    </my-canvas>
    <!-- </no-ssr> -->
    <b-modal :active.sync="isSignatureModalActive" has-modal-card>
      <sign @sigcap="addSig" />
    </b-modal>
  </div>
</template>

<script>
import MyCanvas from '~/components/MyCanvas.vue'
import MyBox from '~/components/MyBox.vue'
import Sign from '~/components/sign.vue'
import { mapState } from 'vuex'

export default {
  components: {
    MyCanvas,
    MyBox,
    Sign
  },
  data () {
    return {
      isSignatureModalActive: false,
      signature: ''
    }
  },
  methods: {
    addSig (val) {
      this.signature = val
      // console.log(val)
    }
  },
  computed: {
    currentRequest () { return this.requests[this.currentRequestIndex] },
    firstName () { return this.currentRequest && this.currentRequest.firstName ? this.currentRequest.firstName : ' ' },
    lastName () { return this.currentRequest && this.currentRequest.lastName ? this.currentRequest.lastName : ' ' },
    middleName () { return this.currentRequest && this.currentRequest.middleName ? this.currentRequest.middleName : ' ' },
    suffix () { return this.currentRequest && this.currentRequest.suffix ? this.currentRequest.suffix : ' ' },
    previousName () { return this.currentRequest && this.currentRequest.previousName ? this.currentRequest.previousName : ' ' },
    dob () { return this.currentRequest && this.currentRequest.dob ? this.currentRequest.dob : ' ' },
    ...mapState({
      currentRequestIndex: state => state.requests.currentRequest,
      requests: state => state.requests.requests
    })
  }
}
</script>
