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
        :tel="tel"
        :fax="fax"
        :party="party"
        :addlInfo="addlInfo"
        :date="date"
        :classification="voterClass"
        :sex="sex"
        :recBallot="recBallot"
        @isLoading="val => isLoading = val"></my-box>
        <b-loading :is-full-page="false" :active.sync="isLoading" :can-cancel="true"></b-loading>
        <!-- :signature="signature" -->
    </my-canvas>
  </div>
  <div class="column is-10 is-8-desktop is-7-widescreen is-6-fullhd is-paddingless">

      <!-- <div class="control buttons is-right"> -->
        <nuxt-link :to="localePath({ name: 'request-stage', params: {stage: 'id-and-contact-information'} })" class="button is-light is-medium is-pulled-left" exact ><b-icon pack="fas" icon="caret-left"></b-icon><span>{{$t('request.stages.back')}}</span></nuxt-link>
         <!-- @click="$store.dispatch('requests/recordAnalytics', {event: 'found errors on review'})" -->
        <button @click="record(localePath({ name: 'request-stage', params: { stage: 'sign-and-submit'} }))" :to="localePath({ name: 'request-stage', params: { stage: 'sign-and-submit'} })" class="button is-primary is-medium is-pulled-right" exact ><span>{{$t('request.stages.submit')}}</span><b-icon pack="fas" icon="caret-right"></b-icon></button>
      <!-- </div> -->

    <!-- <b-modal :active.sync="isSignatureModalActive" has-modal-card>
      <sign @sigcap="addSig" />
    </b-modal> -->
  </div>
</div>
</template>

<script>
import MyCanvas from '~/components/MyCanvas.vue'
import MyBox from '~/components/MyBox.vue'
// import Sign from '~/components/sign.vue'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'FPCAreview',
  middleware: 'verify-request',
  components: {
    MyCanvas,
    MyBox
    // Sign
  },
  async asyncData ({app}) {
    return {
      allStateRules: await app.$content('rls')
        .query({ exclude: ['anchors', 'body', 'meta', 'path', 'permalink'] })
        .getAll()
    }
  },
  data () {
    return {
      isLoading: false
      // isSignatureModalActive: false,
      // signature: ''
    }
  },
  methods: {
    record (nextPage) {
      this.$store.dispatch('requests/updateRequest', {status: 'completed: review'})
      // this.$store.dispatch('requests/recordAnalytics', {event: 'completed: review'})
      this.$router.push(nextPage)
    },
    addSig (val) {
      this.signature = val
      // console.log(val)
    }
    // sendEmail () {
    //   let fpca = this.$refs.fpca.$refs['my-canvas'].toDataURL()
    //   // console.log(fpca)
    //   function dataURItoBlob (dataURI) {
    //     var byteString = atob(dataURI.split(',')[1])
    //     var ab = new ArrayBuffer(byteString.length)
    //     var ia = new Uint8Array(ab)
    //     for (var i = 0; i < byteString.length; i++) {
    //       ia[i] = byteString.charCodeAt(i)
    //     }
    //     return new Blob([ab], { type: 'image/png' })
    //   }
    //   var blob = dataURItoBlob(fpca)
    //   // console.log(blob)
    //   let data = new FormData()
    //   data.append('from', 'VoteFromAbroad <mailer@votefromabroad.org>')
    //   data.append('to', 'alexpm@gmail.com')
    //   data.append('subject', 'FPCA')
    //   data.append('text', 'Your FPCA application')
    //   data.append('attachment', blob, '@file/fpca.png')
    //   data.append('inline', blob, 'file/fpca.png')
    //   data.append('html', '<html>HTML version of the body<img src="cid:fpca.png" width="120" alt="FPCA"><br/></html>')
    //   let url = 'https://votefromabroad.netlify.com/api/mail'
    //   // let url = 'https://api.mailgun.net/v3/mon.tg/messages'
    //   let config = { url: url, method: 'post', headers: { 'Content-Type': 'multipart/form-data' }, auth: { username: 'api', password: 'key-44903961cb823b645750fe64358dfc40' } }
    //   this.$axios.post(url, data, config)
    //     .then(response => console.log(response))
    //     .catch(errors => console.log(errors))
    // }
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
          return this.currentRequest.identification.ssn.toString().replace(/[^0-9]/g, '') || ' '
        } else if (this.currentRequest.identification.ssn4 && typeof this.currentRequest.identification.ssn4 === 'string') {
          return this.currentRequest.identification.ssn4.toString().replace(/[^0-9]/g, '').slice(-4) || ' '
        } else return ' '
      }
    },
    stateId () { return this.currentRequest && this.currentRequest.identification && this.currentRequest.identification.stateId ? this.currentRequest.identification.stateId.toString() : ' ' },
    votStreet () { return this.getCurrent.votAdr.A },
    votApt () { return this.getCurrent.votAdr.B },
    votCity () { return this.getCurrent.votAdr.C },
    votState () { return this.getCurrent.votAdr.S },
    votCounty () { return this.getCurrent.votAdr.Y },
    votZip () { return this.getCurrent.votAdr.Z },
    abrAdr () { return this.currentRequest && this.currentRequest.abrAdr ? this.currentRequest.abrAdr : {} },
    fwdAdr () { return this.currentRequest && this.currentRequest.fwdAdr && (this.currentRequest.fwdAdr.A || this.currentRequest.fwdAdr.alt1) ? this.currentRequest.fwdAdr : {} },
    email () { return this.currentRequest && this.currentRequest.email ? this.currentRequest.email.toString() : ' ' },
    altEmail () { return this.currentRequest && this.currentRequest.altEmail ? this.currentRequest.altEmail.toString() : ' ' },
    // tel () { return this.currentRequest && this.currentRequest.tel ? this.currentRequest.tel : ' ' },
    tel () { return this.getCurrent.tel || '' },
    fax () { return this.getCurrent.fax || '' },
    party () { return this.currentRequest && this.currentRequest.party ? this.currentRequest.party.toString() : ' ' },
    stateRules () {
      if (this.votState) {
        return this.allStateRules.find(x => x.iso.toLowerCase() === this.votState.toLowerCase())
      } else {
        return undefined
      }
    },
    addlInfo () {
      let addlInfoText = ' '
      if (this.currentRequest && (this.currentRequest.stateSpecial || (this.currentRequest.identification && this.currentRequest.identification.noId && this.stateRules && this.stateRules.id && this.stateRules.id.length > 0))) {
        addlInfoText = this.currentRequest && this.currentRequest.stateSpecial ? this.currentRequest.stateSpecial.toString() : ' '
        if ((this.currentRequest.identification && this.currentRequest.identification.noId && this.stateRules && this.stateRules.id && this.stateRules.id.length > 0)) {
          addlInfoText = `I don't have the requested forms of identification. ` + addlInfoText
        }
        return addlInfoText
      } else {
        return ' '
      }
    },
    date () { return this.currentRequest && this.currentRequest.date ? this.currentRequest.date.toString() : ' ' },
    voterClass () { return this.currentRequest && this.currentRequest.voterClass ? this.currentRequest.voterClass.toString() : ' ' },
    sex () { return this.currentRequest && this.currentRequest.sex && this.currentRequest.sex !== 'decline' ? this.currentRequest.sex.toString() : ' ' },
    recBallot () { return this.currentRequest && this.currentRequest.recBallot ? this.currentRequest.recBallot.toString() : ' ' },
    ...mapState({
      currentRequestIndex: state => state.requests.currentRequest,
      requests: state => state.requests.requests
    }),
    ...mapGetters('requests', ['getCurrent'])
  }
}
</script>
