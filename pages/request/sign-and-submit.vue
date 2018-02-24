<template>
  <div class="columns is-centered is-multiline">
    <div class="column is-10-touch is-8-desktop is-7-widescreen is-6-fullhd is-paddingless">
    <!-- <no-ssr> -->
      <div class="section">
        <h1 class="has-text-centered title is-3">Step 5 of 5</h1>
        <h3 class="has-text-centered subtitle is-4">Sign and Submit</h3>
        <p class="is-size-5" v-if="stateRules">
          You must send your <strong class="has-text-danger">signed</strong> ballot request to your {{ currentRequest ? currentRequest.votAdr.leo.jurisdiction : '' }} {{ currentRequest ? currentRequest.votAdr.leo.jurisdictionType : 'local' }} election official by <span v-for="(opt, index) in stateRules.fpcaSubmitOptionsRequest" :key="index">{{ opt.toLowerCase() }}<span v-if="index < stateRules.fpcaSubmitOptionsRequest.length - 2">, </span><span v-if="index === stateRules.fpcaSubmitOptionsRequest.length - 2"> or </span></span>.
        </p>
        <br/>
        <h4 class="label">Choose how to send your Ballot request</h4>
      </div>

        <b-tabs type="is-toggle" expanded>
          <b-tab-item label="Email"
            v-if="stateRules && stateRules.fpcaSubmitOptionsRequest.indexOf('Email') > -1"
            icon="at">
            <div class="section">
              <h3 class="title is-5">Sign and send your form by Email</h3>
              <div class="buttons">
                <button class="button is-primary is-large">Add your signature</button>
                <button @click="sendEmail" class="button is-primary is-large">Email your form</button>
              </div>

              <article class="media">
                <figure class="media-left">
                  <p class="image is-64x64">
                    <b-icon icon="pencil-alt" size="is-large" type="is-primary"></b-icon>
                  </p>
                </figure>
                <div class="media-content">
                  <div class="content">
                    <p>
                      <strong>Sign Your Request. </strong> If you are on a device with a camera you can sign your name with a dark pen or
                    </p>
                  </div>
                </div>
              </article>
              <article class="media">
                <figure class="media-left">
                  <p class="image is-64x64">
                    <b-icon type="is-primary" size="is-large" icon="at"></b-icon>
                  </p>
                </figure>
                <div class="media-content">
                  <div class="content">
                    <p>
                      <strong>Email your request. </strong> Upload it here. We'll send a copy to your election official.
                    </p>
                  </div>
                </div>
              </article>

            </div>
          </b-tab-item>
          <b-tab-item label="Fax"
            v-if="stateRules && stateRules.fpcaSubmitOptionsRequest.indexOf('Fax') > -1"
            icon="fax">
            <div class="section">
              <h3 class="title is-5">Sign and send your form by Fax</h3>
              <div class="buttons">
                <button class="button is-primary is-large">Add your signature</button>
                <button class="button is-primary is-large">Fax your form</button>
              </div>
            </div>
          </b-tab-item>
          <b-tab-item label="Mail"
            v-if="stateRules && stateRules.fpcaSubmitOptionsRequest.indexOf('Mail') > -1"
            icon="envelope-open">
            <div class="section">
              <h3 class="title is-5">Download, Print, Sign and Send your form by Postal</h3>
              <ol>
                <li>Download your form</li>
                <li>Print it out</li>
                <li>Sign and Date it</li>
                <li>Mail your form to:</li>
              </ol>
              <div class="box">
                <span v-if="currentRequest.votAdr.leo.officeAddress.line1"><strong>{{ currentRequest.votAdr.leo.officeAddress.line1 }}</strong><br/></span>
                <span v-if="currentRequest.votAdr.leo.officeAddress.line2"><strong>{{ currentRequest.votAdr.leo.officeAddress.line2 }}</strong><br/></span>
                <span><strong>{{ currentRequest.votAdr.leo.officeAddress.city }}, </strong>
                <strong>{{ currentRequest.votAdr.leo.officeAddress.state }} </strong>
                <strong>{{ currentRequest.votAdr.leo.officeAddress.zip }}</strong><br/></span>
                <span class="has-text-right"><strong>USA</strong><br/></span>
              </div>
              <button class="button is-primary is-large">Download your completed form</button>
            </div>
          </b-tab-item>
        </b-tabs>

    <my-canvas v-if="signature" class="canvas" ref="fpca">
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
        :tel="tel.intNumber"
        :fax="fax.intNumber"
        :party="party"
        :addlInfo="addlInfo"
        :date="date"
        :classification="voterClass"
        :sex="sex"
        :recBallot="recBallot"
        :signature="signature"></my-box>
    </my-canvas>
    <!-- </no-ssr> -->

      <div class="control buttons is-right">
        <nuxt-link :to="localePath({ name: 'index' })" class="button is-light is-medium" exact ><b-icon pack="fas" icon="caret-left"></b-icon><span>Back</span></nuxt-link>
        <nuxt-link :to="localePath({ name: 'request-stage', params: { stage: 'voting-information'} })" class="button is-primary is-medium" exact ><span> Next </span><b-icon pack="fas" icon="caret-right"></b-icon></nuxt-link>
      </div>

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

// var mailgun = require('mailgun.js')
// var apiKey = 'key-44903961cb823b645750fe64358dfc40'
// var DOMAIN = 'mon.tg'
// var mg = mailgun.client({key: apiKey, username: 'api'})

// var data = {
//   from: 'Excited User <me@samples.mailgun.org>',
//   to: 'alexpm@gmail.com',
//   subject: 'Hello',
//   text: 'Testing some Mailgun awesomness!'
// }

export default {
  components: {
    MyCanvas,
    MyBox,
    Sign
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
      isSignatureModalActive: false,
      signature: ''
    }
  },
  methods: {
    addSig (val) {
      this.signature = val
      // console.log(val)
    },
    sendEmail () {
      let fpca = this.$refs.fpca.$refs['my-canvas'].toDataURL()
      console.log(fpca)
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
      console.log(blob)
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
    tel () { return this.currentRequest && this.currentRequest.tel ? this.currentRequest.tel : ' ' },
    fax () { return this.currentRequest && this.currentRequest.fax ? this.currentRequest.fax : ' ' },
    party () { return this.currentRequest && this.currentRequest.party ? this.currentRequest.party.toString() : ' ' },
    addlInfo () { return this.currentRequest && this.currentRequest.addlInfo ? this.currentRequest.addlInfo.toString() : ' ' },
    date () { return this.currentRequest && this.currentRequest.date ? this.currentRequest.date.toString() : ' ' },
    voterClass () { return this.currentRequest && this.currentRequest.voterClass ? this.currentRequest.voterClass.toString() : ' ' },
    sex () { return this.currentRequest && this.currentRequest.sex ? this.currentRequest.sex.toString() : ' ' },
    recBallot () { return this.currentRequest && this.currentRequest.recBallot ? this.currentRequest.recBallot.toString() : ' ' },
    isRegistered () { return this.currentRequest ? this.currentRequest.isRegistered : null },
    stateRules () {
      if (this.votState) {
        return this.allStateRules.find(x => x.iso.toLowerCase() === this.votState.toLowerCase())
      } else {
        return undefined
      }
    },
    ...mapState({
      currentRequestIndex: state => state.requests.currentRequest,
      requests: state => state.requests.requests
    })
  }
}
</script>
