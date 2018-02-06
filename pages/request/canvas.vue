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
        :ssn="ssn"
        :stateId="stateId"
        :votStreet="votStreet"
        :votApt="votApt"
        :votCity="votCity"
        :votState="votState"
        :votCounty="votCounty"
        :votZip="votZip"
        :abrAdr="abrAdr"
        :fwdAdr="fwdAdr"
        :email="email"
        :altEmail="altEmail"
        :tel="tel"
        :fax="fax"
        :party="party"
        :addlInfo="addlInfo"
        :date="date"
        :classification="voterClass"
        :sex="sex"
        :recBallot="recBallot"
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
    dob () { return this.currentRequest && this.currentRequest.dob ? this.currentRequest.dob.toString() : ' ' },
    ssn () { return this.currentRequest && this.currentRequest.ssn ? this.currentRequest.ssn.toString() : ' ' },
    stateId () { return this.currentRequest && this.currentRequest.stateId ? this.currentRequest.stateId.toString() : ' ' },
    votStreet () { return this.currentRequest && this.currentRequest.votAdr && this.currentRequest.votAdr.thoroughfare ? this.currentRequest.votAdr.thoroughfare.toString() : ' ' },
    votApt () { return this.currentRequest && this.currentRequest.votAdr && this.currentRequest.votAdr.premise ? this.currentRequest.votAdr.premise.toString() : ' ' },
    votCity () { return this.currentRequest && this.currentRequest.votAdr && this.currentRequest.votAdr.locality ? this.currentRequest.votAdr.locality.toString() : ' ' },
    votState () { return this.currentRequest && this.currentRequest.votAdr && this.currentRequest.votAdr.regionCode ? this.currentRequest.votAdr.regionCode.toString() : ' ' },
    votCounty () { return this.currentRequest && this.currentRequest.votAdr && this.currentRequest.votAdr.county ? this.currentRequest.votAdr.county.toString() : ' ' },
    votZip () { return this.currentRequest && this.currentRequest.votAdr && this.currentRequest.votAdr.postalcode ? this.currentRequest.votAdr.postalcode.toString() : ' ' },
    abrAdr () { return this.currentRequest && this.currentRequest.abrAdr ? this.currentRequest.abrAdr : null },
    fwdAdr () { return this.currentRequest && this.currentRequest.fwdAdr ? this.currentRequest.fwdAdr : null },
    email () { return this.currentRequest && this.currentRequest.email ? this.currentRequest.email.toString() : ' ' },
    altEmail () { return this.currentRequest && this.currentRequest.altEmail ? this.currentRequest.altEmail.toString() : ' ' },
    tel () { return this.currentRequest && this.currentRequest.tel ? this.currentRequest.tel.toString() : ' ' },
    fax () { return this.currentRequest && this.currentRequest.fax ? this.currentRequest.fax.toString() : ' ' },
    party () { return this.currentRequest && this.currentRequest.party ? this.currentRequest.party.toString() : ' ' },
    addlInfo () { return this.currentRequest && this.currentRequest.addlInfo ? this.currentRequest.addlInfo.toString() : ' ' },
    date () { return this.currentRequest && this.currentRequest.date ? this.currentRequest.date.toString() : ' ' },
    voterClass () { return this.currentRequest && this.currentRequest.voterClass ? this.currentRequest.voterClass.toString() : ' ' },
    sex () { return this.currentRequest && this.currentRequest.sex ? this.currentRequest.sex.toString() : ' ' },
    recBallot () { return this.currentRequest && this.currentRequest.recBallot ? this.currentRequest.recBallot.toString() : ' ' },
    ...mapState({
      currentRequestIndex: state => state.requests.currentRequest,
      requests: state => state.requests.requests
    })
  }
}
</script>
