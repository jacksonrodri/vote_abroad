<template>
  <div class="columns is-centered is-multiline">
    <div class="column is-10 is-8-desktop is-7-widescreen is-6-fullhd is-paddingless">
      <div>
        <h1 class="has-text-centered title is-3">{{ $t('request.stages.step', {step: 5})}}</h1>
        <h3 class="has-text-centered subtitle is-4">{{ $t('request.stages.stage5')}}</h3>
        <i18n path="request.stages.instructions5"
          class="is-size-4"
          tag="vue-markdown"
          :html="true"
          :places="{leo: `${currentRequest ? currentRequest.votAdr.leo.jurisdiction : ''}${currentRequest ? currentRequest.votAdr.leo.jurisdictionType : 'local'}`, options: ballotReceiptOptionsString}">
        </i18n>
      </div>

        <b-tabs type="is-toggle" expanded>
          <b-tab-item :label="$t('request.stages.email')"
            v-if="stateRules && stateRules.fpcaSubmitOptionsRequest.indexOf('Email') > -1"
            icon="at">
            <section class="section">
              <article class="media">
                <div class="media-content">
                  <i18n path="request.stages.emailIntro"
                    class="is-size-4"
                    tag="vue-markdown"
                    :html="true">
                  </i18n>
                  <i18n path="request.stages.instructions"
                    class="subtitle is-5"
                    tag="vue-markdown"
                    :html="true">
                  </i18n>
                  <article class="media">
                    <figure class="media-left">
                      <span class="icon is-large">
                        <i class="fas fa-camera fa-2x"></i>
                      </span>
                    </figure>
                    <div class="media-content">
                      <i18n tag="vue-markdown"
                        class="is-size-6"
                        path="request.stages.emailDigiSign"
                        :html="true">
                        <span place="device">Computer</span>
                      </i18n>
                      <br>
                      <button class="button is-pulled-right is-primary" @click="isSignatureModalActive = true"><b-icon icon="camera" size="is-small"></b-icon><span>{{$t('request.stages.sign')}}</span></button>
                      {{ hasCamera ? "you have a camera" : "you don't have a camera" }}
                    </div>
                  </article>
                  <article class="media">
                    <figure class="media-left">
                      <span class="icon is-large">
                        <span class="fa-stack fa-lg">
                          <i class="fas fa-camera fa-stack-1x"></i>
                          <i class="fas fa-ban fa-stack-2x"></i>
                        </span>
                      </span>
                    </figure>
                    <div class="media-content">
                      <i18n path="request.stages.emailDownload"
                        class="is-size-6"
                        tag="vue-markdown"
                        :html="true">
                      </i18n>
                      <button class="button is-pulled-right is-primary" @click="getFPCA"><b-icon icon="download"></b-icon><span>{{$t('request.stages.download')}}</span></button>
                    </div>
                  </article>
                </div>
              </article>
            </section>
          </b-tab-item>
          <b-tab-item label="Fax"
            v-if="stateRules && stateRules.fpcaSubmitOptionsRequest.indexOf('Fax') > -1"
            icon="fax">
            <section class="section">
              <article class="media">
                <div class="media-content">
                  <i18n path="request.stages.faxIntro"
                    class="is-size-4"
                    tag="vue-markdown"
                    :html="true">
                  </i18n>
                  <i18n path="request.stages.instructions"
                    class="subtitle is-5"
                    tag="vue-markdown"
                    :html="true">
                  </i18n>
                  <article class="media">
                    <figure class="media-left">
                      <span class="icon is-large">
                        <i class="fas fa-camera fa-2x"></i>
                      </span>
                    </figure>
                    <div class="media-content">
                      <i18n tag="vue-markdown"
                        class="is-size-6"
                        path="request.stages.faxDigiSign"
                        :html="true">
                        <span place="device">Computer</span>
                      </i18n>
                      <button class="button is-pulled-right is-primary" @click="isSignatureModalActive = true"><b-icon icon="camera" size="is-small"></b-icon><span>{{$t('request.stages.sign')}}</span></button>
                    </div>
                  </article>
                  <article class="media">
                    <figure class="media-left">
                      <span class="icon is-large">
                        <span class="fa-stack fa-lg">
                          <i class="fas fa-camera fa-stack-1x"></i>
                          <i class="fas fa-ban fa-stack-2x"></i>
                        </span>
                      </span>
                    </figure>
                    <div class="media-content">
                      <i18n path="request.stages.faxDownload"
                        class="is-size-6"
                        tag="vue-markdown"
                        :html="true">
                      </i18n>
                      <button class="button is-pulled-right is-primary" @click="getFPCA"><b-icon icon="download"></b-icon><span>{{$t('request.stages.download')}}</span></button>
                    </div>
                  </article>
                </div>
              </article>
            </section>
            <!-- <section class="section">
              <i18n path="request.stages.faxIntro"
                class="is-size-4"
                tag="vue-markdown"
                :html="true">
              </i18n>
              <div class="media">
                <div class="media-content">
                  <div class="content">
                    <h3 class="title is-5">{{$t('request.stages.instructions')}}</h3>
                  </div>
                  <article class="media">
                    <div class="media-content">
                      <i18n class="is-size-5" path="request.stages.faxSign"
                        tag="vue-markdown"
                        :html="true">
                      </i18n>
                          <article class="media">
                            <figure class="media-left">
                              <span class="icon is-large">
                                <i class="fas fa-camera fa-2x"></i>
                              </span>
                            </figure>
                            <div class="media-content">
                              <i18n tag="vue-markdown"
                                class="is-size-5"
                                path="request.stages.faxDigiSign"
                                :html="true">
                                <span place="device">Computer</span>
                              </i18n>
                              <button class="button is-pulled-right is-medium is-primary" @click="isSignatureModalActive = true"><b-icon icon="camera" size="is-small"></b-icon><span>{{$t('request.stages.sign')}}</span></button>
                            </div>
                          </article>
                          <article class="media">
                            <figure class="media-left">
                              <span class="icon is-large">
                                <span class="fa-stack fa-lg">
                                  <i class="fas fa-camera fa-stack-1x"></i>
                                  <i class="fas fa-ban fa-stack-2x"></i>
                                </span>
                              </span>
                            </figure>
                            <div class="media-content">
                              <i18n path="request.stages.faxDownload"
                                tag="vue-markdown"
                                :html="true">
                              </i18n>
                              <button class="button is-pulled-right is-medium is-primary" @click="getFPCA"><b-icon icon="download"></b-icon><span>{{$t('request.stages.download')}}</span></button>
                            </div>
                          </article>
                    </div>
                  </article>
                </div>
              </div>
            </section> -->
          </b-tab-item>
          <b-tab-item label="Mail"
            v-if="stateRules && stateRules.fpcaSubmitOptionsRequest.indexOf('Mail') > -1"
            icon="envelope-open"><section class="section">
              <h3 class="subtitle is-4">Sign and Send your form by Postal Mail</h3>
              <div class="media">
                <div class="media-content">
                  <h3 class="title is-5">Instructions:</h3>
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
                        <span v-if="currentRequest.votAdr.leo.n"><strong>{{ currentRequest.votAdr.leo.n }}</strong><br/></span>
                        <span v-if="currentRequest.votAdr.leo.a1"><strong>{{ currentRequest.votAdr.leo.a1 }}</strong><br/></span>
                        <span v-if="currentRequest.votAdr.leo.a2"><strong>{{ currentRequest.votAdr.leo.a2 }}</strong><br/></span>
                        <span v-if="currentRequest.votAdr.leo.a3"><strong>{{ currentRequest.votAdr.leo.a3 }}</strong><br/></span>
                        <span><strong>{{ currentRequest.votAdr.leo.c }}, </strong>
                        <strong>{{ currentRequest.votAdr.leo.s }} </strong>
                        <strong>{{ currentRequest.votAdr.leo.z }}</strong><br/></span>
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
                  </article>
                </div>
              </div>
            </section>
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

    <b-modal :active.sync="isSignatureModalActive">
      <div class="box">instructions</div>
      <sign v-show="isSigning" @sigcap="addSig" />
    </b-modal>
    </div>
  </div>
</template>

<script>
import MyCanvas from '~/components/MyCanvas.vue'
import MyBox from '~/components/MyBox.vue'
import Sign from '~/components/sign.vue'
import { mapState } from 'vuex'
import axios from 'axios'
import VueMarkdown from 'vue-markdown'

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
  name: 'SignAndSubmit',
  middleware: 'verify-request',
  components: {
    MyCanvas,
    MyBox,
    Sign,
    VueMarkdown
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
      hasCamera: false,
      isSigning: false
    }
  },
  mounted () {
    let that = this
    function updateHasCamera (res) {
      console.log(res)
      that.hasCamera = res
    }
    if (process.browser) {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        this.hasCamera = false
        return
      }
      navigator.mediaDevices.enumerateDevices()
        .then(function (devices) {
          updateHasCamera(devices.filter(x => x.kind === 'videoinput').length > 0)
        })
        .catch(function (err) {
          this.hasCamera = false
          console.log(err.name + ': ' + err.message)
        })
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
      this.$router.push('/account')
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
      let leo = this.currentRequest.votAdr.leo
      return `${leo.n ? leo.n + '\n' : ''}${leo.a1 ? leo.a1 + '\n' : ''}${leo.a2 ? leo.a2 + '\n' : ''}${leo.a3 ? leo.a3 + '\n' : ''}${leo.c ? leo.c + ', ' : ''}${leo.s ? leo.s + ' ' : ''}${leo.z ? leo.z + '\n' : '\n'}USA`
    },
    leoEmail () {
      return this.currentRequest.votAdr.leo.e || ''
    },
    leoFax () {
      return '+1 ' + this.currentRequest.votAdr.leo.f || ''
    },
    ballotReceiptOptionsString () {
      if (!this.stateRules || this.stateRules.fpcaSubmitOptionsRequest.length === 0) {
        return ''
      } else if (this.stateRules.fpcaSubmitOptionsRequest.length === 1) {
        return this.$t(`request.stages.${this.stateRules.fpcaSubmitOptionsRequest[0].toLowerCase()}`)
      } else if (this.stateRules.fpcaSubmitOptionsRequest.length === 2) {
        return this.$t(`request.stages.${this.stateRules.fpcaSubmitOptionsRequest[0].toLowerCase()}`) + ' ' + this.$t('request.id.or') + ' ' + this.$t(`request.stages.${this.stateRules.fpcaSubmitOptionsRequest[1].toLowerCase()}`)
      } else {
        return this.$t(`request.stages.${this.stateRules.fpcaSubmitOptionsRequest[0].toLowerCase()}`) + ', ' + this.$t(`request.stages.${this.stateRules.fpcaSubmitOptionsRequest[1].toLowerCase()}`) + ' ' + this.$t('request.id.or') + ' ' + this.$t(`request.stages.${this.stateRules.fpcaSubmitOptionsRequest[2].toLowerCase()}`)
      }
    },
    ...mapState({
      currentRequestIndex: state => state.requests.currentRequest,
      requests: state => state.requests.requests
    })
  }
}
</script>
