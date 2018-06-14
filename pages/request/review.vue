<template>
<div class="columns is-centered is-multiline">
  <div class="column is-10 is-8-desktop is-7-widescreen is-6-fullhd is-paddingless">
      <div class="section">
        <h1 class="has-text-centered title is-3">{{ $t('request.stages.step', {step: 4})}}</h1>
        <h3 class="has-text-centered subtitle is-4">{{ $t('request.stages.stage4')}}</h3>
        <p class="is-size-5">{{ $t('request.stages.instructions4')}}</p>
      </div>
      <!-- <div class="control buttons"> -->
        <!-- <nuxt-link :to="localePath({ name: 'request-stage', params: {stage: 'id-and-contact-information'} })" class="button is-light is-medium is-pulled-left" exact ><b-icon pack="fas" icon="caret-left"></b-icon><span>{{$t('request.stages.back')}}</span></nuxt-link> -->
        <!-- <div class="button is-text is-expanded">&nbsp;</div> -->
        <!-- <nuxt-link :to="localePath({ name: 'request-stage', params: { stage: 'sign-and-submit'} })" class="button is-primary is-medium is-pulled-right" exact ><span>{{$t('request.stages.submit')}}</span><b-icon pack="fas" icon="caret-right"></b-icon></nuxt-link> -->
      <!-- </div> -->
  </div>
  <div class="column is-12 is-10-desktop is-8-widescreen is-7-fullhd is-paddingless">
    <my-canvas class="canvas" ref="fpca">
      <my-box
        :lastName="lastName"
        :firstName="firstName"
        :middleName="middleName"
        :suffix="suffix"
        :previousName="previousName.previousName"
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
        :tel="telIntNumber"
        :fax="fax"
        :party="party"
        :addlInfo="addlInfo"
        :date="date"
        :classification="voterClass"
        :sex="sex"
        :recBallot="recBallot"
        :signature="signature"></my-box>
    </my-canvas>
  </div>
  <div class="column is-10 is-8-desktop is-7-widescreen is-6-fullhd is-paddingless">

      <!-- <div class="control buttons is-right"> -->
        <nuxt-link @click="$store.dispatch('requests/recordAnalytics', {event: 'found errors on review'})" :to="localePath({ name: 'request-stage', params: {stage: 'id-and-contact-information'} })" class="button is-light is-medium is-pulled-left" exact ><b-icon pack="fas" icon="caret-left"></b-icon><span>{{$t('request.stages.back')}}</span></nuxt-link>
        <button @click="record(localePath({ name: 'request-stage', params: { stage: 'sign-and-submit'} }))" :to="localePath({ name: 'request-stage', params: { stage: 'sign-and-submit'} })" class="button is-primary is-medium is-pulled-right" exact ><span>{{$t('request.stages.submit')}}</span><b-icon pack="fas" icon="caret-right"></b-icon></button>
      <!-- </div> -->

    <b-modal :active.sync="isSignatureModalActive" has-modal-card>
      <sign @sigcap="addSig" />
    </b-modal>
  </div>
</div>
</template>

<script>
import MyCanvas from '~/components/MyCanvas.vue'
import MyBox from '~/components/MyBox.vue'
import Sign from '~/components/sign.vue'
import { mapState } from 'vuex'

export default {
  name: 'FPCAreview',
  middleware: 'verify-request',
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
    record (nextPage) {
      this.$store.dispatch('requests/updateRequest', {status: 'completed: review'})
      this.$store.dispatch('requests/recordAnalytics', {event: 'completed: review'})
      this.$router.push(nextPage)
    },
    addSig (val) {
      this.signature = val
      // console.log(val)
    },
    sendEmail () {
      let fpca = this.$refs.fpca.$refs['my-canvas'].toDataURL()
      // console.log(fpca)
      function dataURItoBlob (dataURI) {
        var byteString = atob(dataURI.split(',')[1])
        var ab = new ArrayBuffer(byteString.length)
        var ia = new Uint8Array(ab)
        for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i)
        }
        return new Blob([ab], { type: 'image/png' })
      }
      var blob = dataURItoBlob(fpca)
      // console.log(blob)
      let data = new FormData()
      data.append('from', 'VoteFromAbroad <mailer@votefromabroad.org>')
      data.append('to', 'alexpm@gmail.com')
      data.append('subject', 'FPCA')
      data.append('text', 'Your FPCA application')
      data.append('attachment', blob, '@file/fpca.png')
      data.append('inline', blob, 'file/fpca.png')
      data.append('html', '<html>HTML version of the body<img src="cid:fpca.png" width="120" alt="FPCA"><br/></html>')
      let url = 'https://votefromabroad.netlify.com/api/mail'
      // let url = 'https://api.mailgun.net/v3/mon.tg/messages'
      let config = { url: url, method: 'post', headers: { 'Content-Type': 'multipart/form-data' }, auth: { username: 'api', password: 'key-44903961cb823b645750fe64358dfc40' } }
      this.$axios.post(url, data, config)
        .then(response => console.log(response))
        .catch(errors => console.log(errors))
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
    ssn () {
      if (this.currentRequest && this.currentRequest.identification) {
        if (this.currentRequest.identification.ssn) {
          return this.currentRequest.identification.ssn.toString() || ' '
        } else if (this.currentRequest.identification.ssn4 && typeof this.currentRequest.identification.ssn4 === 'string') {
          return this.currentRequest.identification.ssn4.slice(-4) || ' '
        } else return ' '
      }
    },
    stateId () { return this.currentRequest && this.currentRequest.identification && this.currentRequest.identification.stateId ? this.currentRequest.identification.stateId.toString() : ' ' },
    votStreet () { return this.currentRequest && this.currentRequest.votAdr && this.currentRequest.votAdr.thoroughfare ? this.currentRequest.votAdr.thoroughfare.toString() : ' ' },
    votApt () { return this.currentRequest && this.currentRequest.votAdr && this.currentRequest.votAdr.premise ? this.currentRequest.votAdr.premise.toString() : ' ' },
    votCity () { return this.currentRequest && this.currentRequest.votAdr && this.currentRequest.votAdr.locality ? this.currentRequest.votAdr.locality.toString() : ' ' },
    votState () { return this.currentRequest && this.currentRequest.votAdr && this.currentRequest.votAdr.stateISO ? this.currentRequest.votAdr.stateISO.toString() : ' ' },
    votCounty () { return this.currentRequest && this.currentRequest.votAdr && this.currentRequest.votAdr.county ? this.currentRequest.votAdr.county.toString() : ' ' },
    votZip () { return this.currentRequest && this.currentRequest.votAdr && this.currentRequest.votAdr.postalcode ? this.currentRequest.votAdr.postalcode.toString() : ' ' },
    abrAdr () { return this.currentRequest && this.currentRequest.abrAdr ? this.currentRequest.abrAdr : null },
    fwdAdr () { return this.currentRequest && this.currentRequest.fwdAdr ? this.currentRequest.fwdAdr : null },
    email () { return this.currentRequest && this.currentRequest.email ? this.currentRequest.email.toString() : ' ' },
    altEmail () { return this.currentRequest && this.currentRequest.altEmail ? this.currentRequest.altEmail.toString() : ' ' },
    tel () { return this.currentRequest && this.currentRequest.tel ? this.currentRequest.tel : ' ' },
    telIntNumber () { return this.tel && this.tel.intNumber ? this.tel.intNumber : '' },
    fax () { return this.currentRequest && this.currentRequest.fax && this.currentRequest.fax.intNumber ? this.currentRequest.fax.intNumber : ' ' },
    party () { return this.currentRequest && this.currentRequest.party ? this.currentRequest.party.toString() : ' ' },
    addlInfo () { return this.currentRequest && this.currentRequest.stateSpecial ? this.currentRequest.stateSpecial.toString() : ' ' },
    date () { return this.currentRequest && this.currentRequest.date ? this.currentRequest.date.toString() : ' ' },
    voterClass () { return this.currentRequest && this.currentRequest.voterClass ? this.currentRequest.voterClass.toString() : ' ' },
    sex () { return this.currentRequest && this.currentRequest.sex && this.currentRequest.sex !== 'decline' ? this.currentRequest.sex.toString() : ' ' },
    recBallot () { return this.currentRequest && this.currentRequest.recBallot ? this.currentRequest.recBallot.toString() : ' ' },
    ...mapState({
      currentRequestIndex: state => state.requests.currentRequest,
      requests: state => state.requests.requests
    })
  }
}
</script>
