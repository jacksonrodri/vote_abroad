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
          :places="{leo: `${leoName ? 'the ' + leoName : 'your local election official'}`, options: ballotReceiptOptionsString}">
        </i18n>
      </div>

        <b-tabs type="is-toggle" expanded>
          <b-tab-item :label="$t('request.stages.email')"
            v-if="stateRules && stateRules.fpcaSubmitOptionsRequest.indexOf('Email') > -1"
            icon="at">
            <section v-if="!signStep" class="section">
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
                      <button v-if="!signStep" class="button is-pulled-right is-primary" @click="signatureAgree"><b-icon icon="camera" size="is-small"></b-icon><span>{{$t('request.stages.sign')}}</span></button>
                      <br>
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
                      <a v-if="downloadAttrSupported" :href="pdf" :download="`${firstName}-${lastName}-2018-fpca.pdf`" :class="['button', 'is-pulled-right', 'is-primary', {'is-loading': !Boolean(pdf)}]" @click="finish"><b-icon icon="download"></b-icon><span>{{$t('request.stages.download')}}</span></a>
                      <button v-else class="button is-pulled-right is-primary" @click="openPdf"><b-icon icon="download"></b-icon><span>{{$t('request.stages.download')}}</span></button>
                    </div>
                  </article>
                </div>
              </article>
            </section>
            <section v-if="signStep" class="section">
              <sign4 v-model="signStep" :fpca="fpca" @sigcap="addSig">
              </sign4>
            </section>
          </b-tab-item>
          <b-tab-item :label="$t('request.stages.fax')"
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
                      <a v-if="downloadAttrSupported" :href="pdf" :download="`${firstName}-${lastName}-2018-fpca.pdf`" :class="['button', 'is-pulled-right', 'is-primary', {'is-loading': !Boolean(pdf)}]" @click="finish"><b-icon icon="download"></b-icon><span>{{$t('request.stages.download')}}</span></a>
                      <button v-else class="button is-pulled-right is-primary" @click="openPdf"><b-icon icon="download"></b-icon><span>{{$t('request.stages.download')}}</span></button>
                    </div>
                  </article>
                </div>
              </article>
            </section>
          </b-tab-item>
          <b-tab-item :label="$t('request.stages.mail')"
            v-if="stateRules && stateRules.fpcaSubmitOptionsRequest.indexOf('Mail') > -1"
            icon="envelope-open"><section class="section">
              <h3 class="subtitle is-4">{{$t('request.stages.mailIntro')}}</h3>
              <div class="media">
                <div class="media-content">
                  <h3 class="title is-5">{{$t('request.stages.instructions')}}</h3>
                  <article class="media">
                    <figure class="media-left">
                      <b-icon icon="download" size="is-medium"></b-icon>
                    </figure>
                    <div class="media-content">
                      <p class="is-size-5">{{$t('request.stages.mailDownload')}}</p>
                    </div>
                    <div class="media-left">
                      <a v-if="downloadAttrSupported" :href="pdf" :download="`${firstName}-${lastName}-2018-fpca.pdf`" :class="['button', 'is-pulled-right', 'is-primary', {'is-loading': !Boolean(pdf)}]" @click="finish"><b-icon icon="download"></b-icon><span>{{$t('request.stages.download')}}</span></a>
                      <button v-else class="button is-pulled-right is-primary" @click="openPdf"><b-icon icon="download"></b-icon><span>{{$t('request.stages.download')}}</span></button>
                    </div>
                  </article>
                  <article class="media">
                    <figure class="media-left">
                      <b-icon icon="pencil-alt" size="is-medium"></b-icon>
                    </figure>
                    <div class="media-content">
                      <p v-html="$t('request.stages.mailSign')" class="is-size-5"></p>
                    </div>
                  </article>

                  <article class="media">
                    <figure class="media-left">
                      <b-icon icon="envelope" size="is-medium"></b-icon>
                    </figure>
                    <div class="media-content">
                      <span class="is-size-5">{{$t('request.stages.mailPost')}}</span>
                      <div class="box">
                        <span v-if="currentRequest.votAdr.leo.n"><strong>{{ currentRequest.votAdr.leo.n }}</strong><br/></span>
                        <span v-if="currentRequest.votAdr.leo.a1"><strong>{{ currentRequest.votAdr.leo.a1 }}</strong><br/></span>
                        <span v-if="currentRequest.votAdr.leo.a2"><strong>{{ currentRequest.votAdr.leo.a2 }}</strong><br/></span>
                        <span v-if="currentRequest.votAdr.leo.a3"><strong>{{ currentRequest.votAdr.leo.a3 }}</strong><br/></span>
                        <span><strong>{{ currentRequest.votAdr.leo.c }}, </strong>
                        <strong>{{ currentRequest.votAdr.leo.s }} </strong>
                        <strong>{{ currentRequest.votAdr.leo.z }}</strong><br/></span>
                        <span class="has-text-right"><strong>United States of America</strong><br/></span>
                      </div>
                    </div>
                  </article>
                  <article class="media">
                    <figure class="media-left">
                      <b-icon icon="check" size="is-medium"></b-icon>
                    </figure>
                    <div class="media-content">
                      <p v-html="$t('request.stages.mailConfirm')" class="is-size-5"></p>
                    </div>
                  </article>
                </div>
              </div>
            </section>
          </b-tab-item>
        </b-tabs>
        <my-canvas class="canvas" ref="fpca" style="position:absolute;left:-4600px;width:1px;height:1px;">
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
      <section >
        <nuxt-link :to="localePath({ name: 'request-stage', params: { stage: 'review'} })" class="button is-light is-medium is-pulled-left" exact ><b-icon pack="fas" icon="caret-left"></b-icon><span>{{$t('request.stages.back')}}</span></nuxt-link>
    </section>
    </div>
  <scroll-up></scroll-up>
  </div>
</template>

<script>
import MyCanvas from '~/components/MyCanvas.vue'
import MyBox from '~/components/MyBox.vue'
import Sign4 from '~/components/sign4.vue'
import { mapState } from 'vuex'
import axios from 'axios'
import VueMarkdown from 'vue-markdown'
import ScrollUp from '~/components/ScrollUp'

export default {
  name: 'SignAndSubmit',
  middleware: 'verify-request',
  components: {
    MyCanvas,
    MyBox,
    Sign4,
    VueMarkdown,
    ScrollUp
  },
  async asyncData ({app, store}) {
    let state = store.getters['requests/getCurrent'].votAdr.leo.s || ''
    return {
      registering: store.getters['requests/getCurrent'].isRegistered !== 'registered',
      state: store.getters['requests/getCurrent'].votAdr.leo.s,
      allStateRules: await app.$content('rls')
        .query({ exclude: ['anchors', 'body', 'meta', 'path', 'permalink'] })
        .getAll(),
      stateElections: (await app.$content('/elections').get('elections')).body
        .filter(election => election.state && state && election.state.toLowerCase() === state.toLowerCase())
    }
  },
  data () {
    return {
      isSignatureModalActive: false,
      signature: '',
      hasCamera: false,
      downloadAttrSupported: false,
      needsMsSaveOrOpenBlob: false,
      isSigning: false,
      pdf: '',
      msPdf: '',
      deadline: `IMPORTANT: If you are not yet a registered voter, your form must be received by XX to be eligible to vote in the November 6 General Election. If you already are a registered voter, your form must be received by XX to receive a ballot for the November 6 General Election.`,
      signStep: null,
      fpca: null
    }
  },
  mounted () {
    let feat = this
    if (process.browser) {
      window.onNuxtReady((app) => {
        feat.downloadAttrSupported = ('download' in document.createElement('a'))
        feat.needsMsSaveOrOpenBlob = Boolean(window.navigator.msSaveOrOpenBlob)
        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
          feat.hasCamera = false
          return
        }
        navigator.mediaDevices.enumerateDevices()
          .then(function (devices) {
            feat.hasCamera = devices.filter(x => x.kind === 'videoinput').length > 0
          })
          .catch(function (err) {
            feat.hasCamera = false
            console.log(err.name + ': ' + err.message)
          })
      })
      axios.get(encodeURI(`/api/fpca?firstName=${this.firstName || ''}&lastName=${this.lastName || ''}&middleName=${this.middleName || ''}&suffix=${this.suffix || ''}&ssn=${this.ssn || ''}&previousName=${this.previousName.previousName || ''}&dob=${this.dob || ''}&stateId=${this.stateId || ''}&votStreet=${this.votStreet || ''}&votApt=${this.votApt || ''}&votCity=${this.votCity || ''}&votState=${this.votState || ''}&votCounty=${this.votCounty || ''}&votZip=${this.votZip || ''}&abrAdr=${this.abrAdr ? this.abrAdr.alt1 : ''}\n${this.abrAdr ? this.abrAdr.alt2 : ''}\n${this.abrAdr ? this.abrAdr.alt3 : ''}\n${this.abrAdr ? this.abrAdr.alt4 : ''}\n${this.abrAdr ? this.abrAdr.alt5 : ''}&fwdAdr=${this.fwdAdr && this.fwdAdr.alt1 ? this.fwdAdr.alt1 : ''}\n${this.fwdAdr && this.fwdAdr.alt2 ? this.fwdAdr.alt2 : ''}\n${this.fwdAdr && this.fwdAdr.alt3 ? this.fwdAdr.alt3 : ''}\n${this.fwdAdr && this.fwdAdr.alt4 ? this.fwdAdr.alt4 : ''}\n${this.fwdAdr && this.fwdAdr.alt5 ? this.fwdAdr.alt5 : ''}&email=${this.email || ''}&altEmail=${this.altEmail || ''}&tel=${this.tel && this.tel.intNumber ? this.tel.intNumber : ''}&fax=${this.fax || ''}&party=${this.party || ''}&addlInfo=${this.addlInfo || ''}&date=${this.date || ''}&class=${this.voterClass || ''}&sex=${this.sex || ''}&recBallot=${this.recBallot || ''}&leoName=${this.leoName || ''}&leoAddress=${this.leoAdr || ''}&leoFax=${this.leoFax || ''}&leoEmail=${this.leoEmail || ''}&leoPhone=${this.leoPhone || ''}&transmitOpts=${this.stateRules.ballotReceiptOptions.join(',')}&deadline=${this.nextDeadline}`), {responseType: 'arraybuffer'})
        .then((response) => {
          let blob = new Blob([response.data], {type: 'application/pdf'})
          this.msPdf = blob
          this.pdf = window.URL.createObjectURL(blob)
        })
    }
  },
  methods: {
    signatureAgree () {
      this.$dialog.confirm({
        title: this.$t('request.sig.affirmation'),
        message: `<h1 class="title is-5">I swear or affirm, under penalty of purjury that:</h1>
        <div class="content">
        <ul>
          <li>The information on this form is true, accurate, and complete to the best of my knowledge. I understand that a material misstatement of fact in completion of this document may constitute grounds for conviction of perjury.</li>
          <li>I am a U.S. citizen, at least 18 years of age (or will be by the day of the election), eligible to vote in the requested jurisdiction, and</li>
          <li>I am not disqualified to vote due to having been convicted of a felony or other disqualifying offense, nor have I been adjudicated mentally incompetent; or if so, my voting rights have been reinstated; and</li>
          <li>I am not registering, requesting a ballot, or voting in any other jurisdiction in the United States, except the jurisdiction cited in this voting form. </li><ul></div>`,
        cancelText: this.$t('request.sig.disagree'),
        confirmText: this.$t('request.sig.agree'),
        type: 'is-success',
        onConfirm: () => { this.signStep = 'instructions' }
      })
    },
    confirmPdfDownload () {
      this.$dialog.alert({
        title: this.$t('request.fpcaDownload.downloadedAlertTitle'),
        message: this.$t('request.fpcaDownload.downloadedAlertMessage'),
        confirmText: this.$t('request.fpcaDownload.confirmButton'),
        type: 'is-danger',
        hasIcon: true,
        icon: 'download',
        iconPack: 'fas',
        onConfirm: () => this.$router.push('/dashboard')
      })
    },
    openPdf () {
      this.$dialog.alert({
        title: this.$t('request.fpcaDownload.downloadingAlertTitle'),
        message: this.$t('request.fpcaDownload.downloadedAlertMessage'),
        confirmText: this.$t('request.fpcaDownload.confirmButton'),
        type: 'is-danger',
        hasIcon: true,
        icon: 'download',
        iconPack: 'fas',
        onConfirm: () => { this.$router.push('/dashboard'); this.openPdfNewWindow() }
      })
    },
    openPdfNewWindow () {
      if (this.needsMsSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(this.msPdf, `${this.firstName}-${this.lastName}-2018-fpca.pdf`)
      } else {
        window.open(this.pdf, '_blank')
      }
    },
    finish () {
      this.$router.push('/dashboard')
      this.confirmPdfDownload()
    },
    getFPCA (method) {
      axios.get(encodeURI(`/api/fpca?firstName=${this.firstName || ''}&lastName=${this.lastName || ''}&middleName=${this.middleName || ''}&suffix=${this.suffix || ''}&ssn=${this.ssn || ''}&previousName=${this.previousName.previousName || ''}&dob=${this.dob || ''}&stateId=${this.stateId || ''}&votStreet=${this.votStreet || ''}&votApt=${this.votApt || ''}&votCity=${this.votCity || ''}&votState=${this.votState || ''}&votCounty=${this.votCounty || ''}&votZip=${this.votZip || ''}&abrAdr=${this.abrAdr ? this.abrAdr.alt1 : ''}\n${this.abrAdr ? this.abrAdr.alt2 : ''}\n${this.abrAdr ? this.abrAdr.alt3 : ''}\n${this.abrAdr ? this.abrAdr.alt4 : ''}\n${this.abrAdr ? this.abrAdr.alt5 : ''}&fwdAdr=${this.fwdAdr ? this.fwdAdr.alt1 : ''}\n${this.fwdAdr ? this.fwdAdr.alt2 : ''}\n${this.fwdAdr ? this.fwdAdr.alt3 : ''}\n${this.fwdAdr ? this.fwdAdr.alt4 : ''}\n${this.fwdAdr ? this.fwdAdr.alt5 : ''}&email=${this.email || ''}&altEmail=${this.altEmail || ''}&tel=${this.tel && this.tel.intNumber ? this.tel.intNumber : ''}&fax=${this.fax || ''}&party=${this.party || ''}&addlInfo=${this.addlInfo || ''}&date=${this.date || ''}&leoAdr=${this.leoAdr}&class=${this.voterClass || ''}&sex=${this.sex || ''}&recBallot=${this.recBallot || ''}&leoName=${this.leoName || ''}&leoAddress=${this.leoAdr || ''}&leoFax=${this.leoFax || ''}&leoEmail=${this.leoEmail || ''}&leoPhone=${this.leoPhone || ''}&transmitOpts=${this.stateRules.ballotReceiptOptions.join(',')}&deadline=${this.nextDeadline}&method=${method}`), {responseType: 'arraybuffer'})
        .then((response) => {
          console.log(response)
          let blob = new Blob([response.data], {type: 'application/pdf'})
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          if (method === 'download') link.download = 'FPCA.pdf'
          if (method === 'blank') link.target = '_blank'
          link.click()
        })
    },
    addSig (val) {
      this.signature = val
      var d = new Date()
      var today = `${d.getFullYear()}-${d.getMonth() < 9 ? '0' : ''}${d.getMonth() + 1}-${d.getDate() < 9 ? '0' : ''}${d.getDate()}`
      this.$store.commit('requests/update', { date: today })
      console.log('addsig', this.$refs.fpca.$refs['my-canvas'])
      setTimeout(() => {
        this.fpca = this.$refs.fpca.$refs['my-canvas'].toDataURL()
      }, 800)
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
      let url = '/api/mail'
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
    ssn () { return this.currentRequest && this.currentRequest.identification && this.currentRequest.identification.ssn ? this.currentRequest.identification.ssn.toString() : ' ' },
    stateId () { return this.currentRequest && this.currentRequest.identification && this.currentRequest.identification.stateId ? this.currentRequest.identification.stateId.toString() : ' ' },
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
    sex () { return this.currentRequest && this.currentRequest.sex && this.currentRequest.sex !== 'decline' ? this.currentRequest.sex.toString() : ' ' },
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
      return `${leo.n ? leo.n + '\n' : ''}${leo.a1 ? leo.a1 + '\n' : ''}${leo.a2 ? leo.a2 + '\n' : ''}${leo.a3 ? leo.a3 + '\n' : ''}${leo.c ? leo.c + ', ' : ''}${leo.s ? leo.s + ' ' : ''}${leo.z ? leo.z + '\n' : '\n'}United States of America`
    },
    leoEmail () {
      return this.currentRequest.votAdr.leo && this.currentRequest.votAdr.leo.e ? this.currentRequest.votAdr.leo.e : ''
    },
    leoName () {
      return this.currentRequest.votAdr.leo && this.currentRequest.votAdr.leo.n ? this.currentRequest.votAdr.leo.n : ''
    },
    leoFax () {
      return this.currentRequest.votAdr.leo && this.currentRequest.votAdr.leo.f ? '+1 ' + this.currentRequest.votAdr.leo.f : ''
    },
    leoPhone () {
      return this.currentRequest.votAdr.leo && this.currentRequest.votAdr.leo.p ? '+1 ' + this.currentRequest.votAdr.leo.p : ''
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
    nextDeadline () {
      let electionArr = []
      this.stateElections.forEach(election => Object.entries(election.rules).forEach(([ruleKey, ruleValue]) => ruleValue.forEach(item => electionArr.push({
        electionType: election.electionType,
        electionDate: election.date.substr(0, 4) === '2018' ? new Date(election.date) : null,
        requestType: ruleKey,
        ruleType: item.rule,
        voterType: typeof item.voterType === 'string' ? item.voterType : 'All',
        ruleDate: item.date.substr(0, 4) === '2018' ? new Date(item.date) : null
      }))))
      let importantE
      if (this.voterClass && Boolean(this.voterClass === 'military' || this.voterClass === 'milSpouse' || this.voterClass === 'natGuard')) {
        importantE = electionArr.filter(x => x.voterType.indexOf('Citizen') === -1)
      } else {
        importantE = electionArr.filter(x => x.voterType.indexOf('Uniformed') === -1)
      }
      if (this.isRegistered === 'registered') {
        importantE = importantE.filter(x => x.requestType === 'Ballot Request').filter(x => x.ruleDate > new Date()).sort((a, b) => a.ruleDate - b.ruleDate)[0]
        return `IMPORTANT: As a registered voter, your form must be ${importantE.ruleType.toLowerCase()} ${importantE.ruleDate.toLocaleDateString('en-US', {month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'})} to be eligible to vote in the ${importantE.electionDate.toLocaleDateString('en-US', {month: 'long', day: 'numeric'})} ${importantE.electionType}. See all your state deadlines at www.votefromabroad.org/states/${this.state}`
      } else if (this.isRegistered === 'notRegistered') {
        importantE = importantE.filter(x => x.requestType === 'Registration').filter(x => x.ruleDate > new Date()).sort((a, b) => a.ruleDate - b.ruleDate)[0]
        return `IMPORTANT: As a new voter, your form must be ${importantE.ruleType.toLowerCase()} ${importantE.ruleDate.toLocaleDateString('en-US', {month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'})} to be eligible to vote in the ${importantE.electionDate.toLocaleDateString('en-US', {month: 'long', day: 'numeric'})} ${importantE.electionType}. See all your state deadlines at www.votefromabroad.org/states/${this.state}`
      } else {
        importantE = importantE.filter(x => x.requestType !== 'Ballot Return').filter(x => x.ruleDate > new Date()).sort((a, b) => a.ruleDate - b.ruleDate).slice(0, 2)
        let reg = importantE.filter(x => x.requestType === 'Ballot Request')[0]
        let req = importantE.filter(x => x.requestType === 'Ballot Request')[0]
        return `IMPORTANT: If you are not yet a registered voter, your form must be received by ${reg.ruleDate.toLocaleDateString('en-US', {month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'})} to be eligible to vote in the ${reg.electionDate.toLocaleDateString('en-US', {month: 'long', day: 'numeric'})} General Election. If you already are a registered voter, your form must be received by ${req.ruleDate.toLocaleDateString('en-US', {month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'})} to receive a ballot for the ${req.electionDate.toLocaleDateString('en-US', {month: 'long', day: 'numeric'})} General Election. See all your state deadlines at www.votefromabroad.org/states/${this.state}`
      }
    },
    ...mapState({
      currentRequestIndex: state => state.requests.currentRequest,
      requests: state => state.requests.requests
    })
  }
}
</script>
