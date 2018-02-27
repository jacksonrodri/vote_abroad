<template>
  <!-- <div class="columns is-centered is-multiline"> -->
    <div class="column is-10 is-8-desktop is-7-widescreen is-6-fullhd is-paddingless">
    <!-- <no-ssr> -->
      <div class="section">
        <h1 class="has-text-centered title is-3">{{ $t('request.stages.step', {step: 5})}}</h1>
        <h3 class="has-text-centered subtitle is-4">{{ $t('request.stages.stage5')}}</h3>
        <p class="is-size-5" v-if="stateRules">
          {{$t('request.stages.instructions5', {leo: `${currentRequest ? currentRequest.votAdr.leo.jurisdiction : ''}${currentRequest ? currentRequest.votAdr.leo.jurisdictionType : 'local'}`, options: ballotReceiptOptionsString })}}
        </p>
        <!-- You must send your <strong class="has-text-danger">signed</strong> ballot request to your {{ currentRequest ? currentRequest.votAdr.leo.jurisdiction : '' }} {{ currentRequest ? currentRequest.votAdr.leo.jurisdictionType : 'local' }} election official by <span v-for="(opt, index) in stateRules.fpcaSubmitOptionsRequest" :key="index">{{ opt.toLowerCase() }}<span v-if="index < stateRules.fpcaSubmitOptionsRequest.length - 2">, </span><span v-if="index === stateRules.fpcaSubmitOptionsRequest.length - 2"> or </span></span>. -->
        <br/>
        <!-- <h4 class="label">Choose how to send your Ballot request</h4> -->
      </div>

        <b-tabs type="is-toggle" expanded>
          <b-tab-item :label="$t('request.stagges.email')"
            v-if="stateRules && stateRules.fpcaSubmitOptionsRequest.indexOf('Email') > -1"
            icon="at">
            <section class="section">
              <h3 class="subtitle is-4">{{$t('request.stages.emailInstructions')}}</h3>
              <!-- Sign and send your form by Email -->
              <div class="media">
                <div class="media-content">
                  <h3 class="title is-5">{{t$('request.stages.instructions')}}</h3>
                  <!-- <p>You must <strong class="has-text-danger">sign, date and email</strong> your completed form to your {{ currentRequest ? currentRequest.votAdr.leo.jurisdiction : 'local' }} election official at <a :href="`mailto:${leoEmail}`">{{ leoEmail }}.</a> </p> -->
                  <article class="media">
                    <figure class="media-left">
                      <b-icon icon="pencil-alt" size="is-medium"></b-icon>
                    </figure>
                    <div class="media-content">
                      {{$t('request.stages.emailSign')}}
                      <!-- <p class="is-size-5"><strong class="has-text-danger">Sign and Date</strong> your form</p> -->
                      <article class="media">
                        <div class="media-content">
                          <article class="media">
                            <div class="media-content">
                              {{$t('request.stages.emailDigiSign')}}
                              <!-- <p><strong>If you have a camera</strong> on this <span class="is-hidden-touch">computer</span><span class="is-hidden-desktop is-hidden-mobile">tablet</span><span class="is-hidden-tablet">phone</span>, you can capture your signature and email your form straight from this website.</p> -->
                              <!-- <p class="has-text-centered"><button class="button is-primary" @click="isSignatureModalActive = true"><b-icon icon="camera"></b-icon><span> Capture my signature</span></button></p> -->
                            </div>
                            <div class="media-right">
                              <button class="button is-primary" @click="isSignatureModalActive = true"><b-icon icon="camera" size="is-small"></b-icon><span>{{$t('request.stages.sign')}}</span></button>
                            </div>
                          </article>
                          <article class="media">
                            <div class="media-content">
                              {{$t('request.stages.emailDownload')}}
                              <!-- <p><strong>Otherwise,</strong> you will need to download your form, print, sign, date and scan it.</p> -->
                              <!-- <p class="has-text-centered"><button class="button is-primary" @click="getFPCA"><b-icon icon="download"></b-icon><span>Download my form</span></button></p> -->
                            </div>
                            <div class="media-right">
                              <button class="button is-primary" @click="getFPCA"><b-icon icon="download"></b-icon><span>{{$t('request.stages.download')}}</span></button>
                            </div>
                          </article>
                        </div>
                      </article>
                    </div>
                  </article>
                  <article class="media">
                    <figure class="media-left">
                      <b-icon icon="at" size="is-medium"></b-icon>
                    </figure>
                    <div class="media-content">
                      {{$t('request.stages.emailSend', {leo: leoEmail})}}
                      <!-- <p class="is-size-5"><strong class="has-text-danger">Email</strong> your form to <a :href="`mailto:${leoEmail}`">{{leoEmail}}</a></p> -->
                    </div>
                  </article>
                  <article class="media">
                    <figure class="media-left">
                      <b-icon icon="check" size="is-medium"></b-icon>
                    </figure>
                    <div class="media-content">
                      {{$t('request.stages.emailConfirm')}}
                      <!-- <p class="is-size-5"><strong class="has-text-danger">Confirm</strong> with your your local election official that they received it. </p> -->
                    </div>
                    <!-- <div class="media-right">
                      <button class="button is-primary"><b-icon icon="calendar"></b-icon><span>Remind Me</span></button>
                    </div> -->
                  </article>
                </div>
              </div>
            </section>
          </b-tab-item>
          <b-tab-item label="Fax"
            v-if="stateRules && stateRules.fpcaSubmitOptionsRequest.indexOf('Fax') > -1"
            icon="fax">
            <section class="section">
              <h3 class="subtitle is-4">Sign and send your form by Fax</h3>
              <div class="media">
                <div class="media-content">
                  <h3 class="title is-5">Instructions:</h3>
                  <!-- <p>You must <strong class="has-text-danger">sign, date and email</strong> your completed form to your {{ currentRequest ? currentRequest.votAdr.leo.jurisdiction : 'local' }} election official at <a :href="`mailto:${leoEmail}`">{{ leoEmail }}.</a> </p> -->
                  <article class="media">
                    <figure class="media-left">
                      <b-icon icon="pencil-alt" size="is-medium"></b-icon>
                    </figure>
                    <div class="media-content">
                      <p class="is-size-5"><strong class="has-text-danger">Sign and Date</strong> your form</p>
                      <article class="media">
                        <div class="media-content">
                          <article class="media">
                            <div class="media-content">
                              <p><strong>If you have a camera</strong> on this <span class="is-hidden-touch">computer</span><span class="is-hidden-desktop is-hidden-mobile">tablet</span><span class="is-hidden-tablet">phone</span>, you can capture your signature and fax your form straight from this website.</p>
                              <!-- <p class="has-text-centered"><button class="button is-primary" @click="isSignatureModalActive = true"><b-icon icon="camera"></b-icon><span> Capture my signature</span></button></p> -->
                            </div>
                            <div class="media-right">
                              <button class="button is-primary" @click="isSignatureModalActive = true"><b-icon icon="camera" size="is-small"></b-icon><span>Capture signature</span></button>
                            </div>
                          </article>
                          <article class="media">
                            <div class="media-content">
                              <p><strong>Otherwise,</strong> you will need to download your form, print, sign and date it before faxing.</p>
                              <!-- <p class="has-text-centered"><button class="button is-primary" @click="getFPCA"><b-icon icon="download"></b-icon><span>Download my form</span></button></p> -->
                            </div>
                            <div class="media-right">
                              <button class="button is-primary" @click="getFPCA"><b-icon icon="download"></b-icon><span>Download</span></button>
                            </div>
                          </article>
                        </div>
                      </article>
                    </div>
                  </article>
                  <article class="media">
                    <figure class="media-left">
                      <b-icon icon="fax" size="is-medium"></b-icon>
                    </figure>
                    <div class="media-content">
                      <p class="is-size-5"><strong class="has-text-danger">Fax</strong> your form to {{leoFax}}</p>
                    </div>
                  </article>
                  <article class="media">
                    <figure class="media-left">
                      <b-icon icon="check" size="is-medium"></b-icon>
                    </figure>
                    <div class="media-content">
                      <p class="is-size-5"><strong class="has-text-danger">Confirm</strong> with your your local election official that they received it. </p>
                    </div>
                    <div class="media-right">
                      <button class="button is-primary"><b-icon icon="calendar"></b-icon><span>Remind Me</span></button>
                    </div>
                  </article>
                </div>
              </div>
            </section>
          </b-tab-item>
          <b-tab-item label="Mail"
            v-if="stateRules && stateRules.fpcaSubmitOptionsRequest.indexOf('Mail') > -1"
            icon="envelope-open"><section class="section">
              <h3 class="subtitle is-4">Sign and Send your form by Postal Mail</h3>
              <div class="media">
                <div class="media-content">
                  <h3 class="title is-5">Instructions:</h3>
                  <!-- <p>You must <strong class="has-text-danger">sign, date and email</strong> your completed form to your {{ currentRequest ? currentRequest.votAdr.leo.jurisdiction : 'local' }} election official at <a :href="`mailto:${leoEmail}`">{{ leoEmail }}.</a> </p> -->
                  <article class="media">
                    <figure class="media-left">
                      <b-icon icon="download" size="is-medium"></b-icon>
                    </figure>
                    <div class="media-content">
                      <p class="is-size-5">Download your completed form.</p>
                    </div>
                    <div class="media-lef">
                      <button @click="getFPCA" class="button is-primary"><span>Download now</span></button>
                    </div>
                  </article>
                  <article class="media">
                    <figure class="media-left">
                      <b-icon icon="pencil-alt" size="is-medium"></b-icon>
                    </figure>
                    <div class="media-content">
                      <p class="is-size-5">Print, <strong class="has-text-danger">sign and date</strong> your form.</p>
                    </div>
                  </article>

                  <article class="media">
                    <figure class="media-left">
                      <b-icon icon="envelope" size="is-medium"></b-icon>
                    </figure>
                    <div class="media-content">
                      <span class="is-size-5">Mail your form to: </span>
                      <div class="box">
                        <span v-if="currentRequest.votAdr.leo.officeAddress.line1"><strong>{{ currentRequest.votAdr.leo.officeAddress.line1 }}</strong><br/></span>
                        <span v-if="currentRequest.votAdr.leo.officeAddress.line2"><strong>{{ currentRequest.votAdr.leo.officeAddress.line2 }}</strong><br/></span>
                        <span><strong>{{ currentRequest.votAdr.leo.officeAddress.city }}, </strong>
                        <strong>{{ currentRequest.votAdr.leo.officeAddress.state }} </strong>
                        <strong>{{ currentRequest.votAdr.leo.officeAddress.zip }}</strong><br/></span>
                        <span class="has-text-right"><strong>USA</strong><br/></span>
                      </div>
                    </div>
                  </article>
                  <article class="media">
                    <figure class="media-left">
                      <b-icon icon="check" size="is-medium"></b-icon>
                    </figure>
                    <div class="media-content">
                      <p class="is-size-5"><strong class="has-text-danger">Confirm</strong> with your your local election official that they received it. </p>
                    </div>
                    <div class="media-right">
                      <button class="button is-primary"><b-icon icon="calendar"></b-icon><span>Remind Me</span></button>
                    </div>
                  </article>
                </div>
              </div>
            </section>
            <!-- <div class="section">
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
              <button @click="getFPCA" class="button is-primary is-large"><b-icon icon="download"></b-icon><span>Download your completed form</span></button>
            </div> -->
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

      <!-- <div class="control buttons is-right">
        <nuxt-link :to="localePath({ name: 'index' })" class="button is-light is-medium" exact ><b-icon pack="fas" icon="caret-left"></b-icon><span>Back</span></nuxt-link>
        <nuxt-link :to="localePath({ name: 'request-stage', params: { stage: 'voting-information'} })" class="button is-primary is-medium" exact ><span> Next </span><b-icon pack="fas" icon="caret-right"></b-icon></nuxt-link>
      </div> -->
      <section >
      <!-- <div class="control buttons is-right"> -->
        <nuxt-link :to="localePath({ name: 'request-stage', params: { stage: 'review'} })" class="button is-light is-medium is-pulled-left" exact ><b-icon pack="fas" icon="caret-left"></b-icon><span>Back</span></nuxt-link>
        <!-- <nuxt-link :to="localePath({ name: 'request-stage', params: { stage: 'your-information'} })" class="button is-primary is-medium is-pulled-right" exact ><span> Start a New Request </span><b-icon pack="fas" icon="caret-right"></b-icon></nuxt-link> -->
      <!-- </div> -->
    </section>

    <b-modal :active.sync="isSignatureModalActive" has-modal-card>
      <sign @sigcap="addSig" />
    </b-modal>
    <!-- </div> -->
  </div>
</template>

<script>
import MyCanvas from '~/components/MyCanvas.vue'
import MyBox from '~/components/MyBox.vue'
import Sign from '~/components/sign.vue'
import { mapState } from 'vuex'
import axios from 'axios'

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
      signature: '',
      hasCamera: true
    }
  },
  methods: {
    getFPCA () {
      // axios.get('/api/fpca?firstName=Alex&lastName=Montgomery&middleName=Parry&suffix=&ssn=0116')
      axios({
        url: encodeURI(`/api/fpca?firstName=${this.firstName || ''}&lastName=${this.lastName || ''}&middleName=${this.middleName || ''}&suffix=${this.suffix || ''}&ssn=${this.ssn || ''}&previousName=${this.previousName.previousName || ''}&dob=${this.dob || ''}&stateId=${this.stateId || ''}&votStreet=${this.votStreet || ''}&votApt=${this.votApt || ''}&votCity=${this.votCity || ''}&votState=${this.votState || ''}&votCounty=${this.votCounty || ''}&votZip=${this.votZip || ''}&abrAdr=${this.abrAdr ? this.abrAdr.alt1 : ''}\n${this.abrAdr ? this.abrAdr.alt2 : ''}\n${this.abrAdr ? this.abrAdr.alt3 : ''}\n${this.abrAdr ? this.abrAdr.alt4 : ''}\n${this.abrAdr ? this.abrAdr.alt5 : ''}&fwdAdr=${this.fwdAdr ? this.fwdAdr.alt1 : ''}\n${this.fwdAdr ? this.fwdAdr.alt2 : ''}\n${this.fwdAdr ? this.fwdAdr.alt3 : ''}\n${this.fwdAdr ? this.fwdAdr.alt4 : ''}\n${this.fwdAdr ? this.fwdAdr.alt5 : ''}&email=${this.email || ''}&altEmail=${this.altEmail || ''}&tel=${this.tel && this.tel.intNumber ? this.tel.intNumber : ''}&fax=${this.fax || ''}&party=${this.party || ''}&addlInfo=${this.addlInfo || ''}&date=${this.date || ''}&leoAdr=${this.leoAdr}&class=${this.voterClass || ''}&sex=${this.sex || ''}&recBallot=${this.recBallot || ''}`),
        method: 'GET',
        responseType: 'blob' // important
      }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `${this.firstName}-${this.lastName}-fpca.pdf`)
        document.body.appendChild(link)
        link.click()
      })
    },
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
    leoAdr () {
      let leo = this.currentRequest.votAdr.leo.officeAddress
      return `${leo.line1 ? leo.line1 + '\n' : ''}${leo.line2 ? leo.line2 + '\n' : ''}${leo.line3 ? leo.line3 + '\n' : ''}${leo.city ? leo.city + ', ' : ''}${leo.state ? leo.state + ' ' : ''}${leo.zip ? leo.zip + '\n' : '\n'}USA`
    },
    leoEmail () {
      return this.currentRequest.votAdr.leo.emailAddress || ''
    },
    leoFax () {
      return '+1 ' + this.currentRequest.votAdr.leo.faxNumber || ''
    },
    ballotReceiptOptionsString () {
      if (this.stateRules.fpcaSubmitOptionsRequest.length === 1) {
        return this.$t(`this.request.stages.${this.fpcaSubmitOptionsRequest[0]}`)
      } else if (this.stateRules.fpcaSubmitOptionsRequest.length === 2) {
        return this.$t(`this.request.stages.${this.fpcaSubmitOptionsRequest[0]}`) + ' ' + this.$t('this.request.stages.or') + ' ' + this.$t(`this.request.stages.${this.fpcaSubmitOptionsRequest[1]}`)
      } else {
        return this.$t(`this.request.stages.${this.fpcaSubmitOptionsRequest[0]}`) + ', ' + this.$t(`this.request.stages.${this.fpcaSubmitOptionsRequest[1]}`) + ' ' + this.$t('this.request.stages.or') + ' ' + this.$t(`this.request.stages.${this.fpcaSubmitOptionsRequest[2]}`)
      }
    },
    ...mapState({
      currentRequestIndex: state => state.requests.currentRequest,
      requests: state => state.requests.requests
    })
  }
}
</script>
