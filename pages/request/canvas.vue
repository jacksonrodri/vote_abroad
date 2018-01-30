<template>
  <div class="is-fullhd">
    <!-- <no-ssr> -->
    <button class="button is-primary" @click="isSignatureModalActive = true">Add your signature</button>
    <my-canvas class="canvas">
      <my-box
        lastName="Montgomery"
        firstName="Alexander"
        middleName="Parry"
        suffix="Jr."
        previousName="Nobody"
        :dob="new Date('06/26/1982')"
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
        recBallot="email"></my-box>
    </my-canvas>
    <!-- </no-ssr> -->
    <b-modal :active.sync="isSignatureModalActive" has-modal-card>
      <signature/>
    </b-modal>
  </div>
</template>

<script>
import MyCanvas from '~/components/MyCanvas.vue'
import MyBox from '~/components/MyBox.vue'
import Signature from '~/components/signature.vue'

export default {
  components: {
    MyCanvas,
    MyBox,
    Signature
  },
  data () {
    return {
      isSignatureModalActive: false
    }
  }
}
</script>
