<template>
  <div class="is-fullhd">
    <!-- <h2>Bar Chart Example</h2> -->
    <!-- These are the custom components we'll create -->
    <!-- Values for `my-box` are percentages of the width of the canvas. -->
    <!-- Each bar will take up an equal space of the canvas. -->
    <button class="button is-primary" @click="isSignatureModalActive = true">Add your signature</button>
    <my-canvas class="canvas">
    <!-- <my-canvas style="width: 2550px; height: 3300px;"> -->
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
        abrAdr="Flat 7, 27/f BLock C, Greenwood Garden, Shatin, NT, HONG KONG"
        fwdAdr="Flat 9, 29/f BLock C, Greenwood Garden, Shatin, NT, HONG KONG"
        email="somebody@gmail.com"
        altEmail="nobody@gmail.com"
        tel="+852 9669 9279"
        fax="+852 1234 5678"
        party="Democrat"
        addlInfo="I like this stuff"
        :date="new Date()"
        classification="returnUncertain"
        sex="male"
        recBallot="email"></my-box>
      <!-- <my-box
        v-for="obj, index of chartValues"
        :x1="((index / chartValues.length) * 100)"
        :x2="((index / chartValues.length) * 100) + (100 / chartValues.length)"
        :y1="100"
        :y2="100 - obj.val"
        :color="obj.color"
        :value="obj.val"
        :key="index"
      >
      </my-box> -->
    </my-canvas>
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
      isSignatureModalActive: false,
      dpi: 360
    }
  }
}
</script>

<style>
.canvas {
  width: 100vw;
  min-width: 1200px;
  height: 130vw;
  min-height: 1560px;
}
</style>
