<template>
  <div class="columns is-centered is-multiline">
    <div class="column is-10 is-8-desktop is-7-widescreen is-6-fullhd is-paddingless">
      <!-- <div :class="['modal', {'is-active': pleaseRotate}]">
        <div class="modal-background"></div>
        <div class="modal-content">
          <div class="has-text-centered">
            <h1 class="title has-text-primary">Rotate your device</h1>
            <transition name="rotate">
              <span v-if="pleaseRotate"
                class="icon is-large rotated">
                <span class="fa-stack fa-5x has-text-primary">
                  <i class="fas fa-mobile-alt fa-stack-2x"></i>
                  <i class="fas fa-redo fa-stack-1x shrink"></i>
                </span>
              </span>
              </transition>
          </div>
        </div>
      </div> -->
      <div>
        <h1 class="has-text-centered title is-3">{{ $t('request.stages.step', {step: 5})}}</h1>
        <h3 class="has-text-centered subtitle is-4">{{ $t('request.stages.stage5')}}</h3>
        <p class="is-size-5" v-html="md(transmitInstructions)"></p>
        <b-message v-if="transmitRules" type="is-info" has-icon>
          <span v-html="md(transmitRules)"></span>
        </b-message>
        <p class="is-size-5" v-if="stateRules && stateRules.fpcaSubmitOptionsRequest.length > 1" v-html="md($t('request.stages.instructions5sub'))"></p>
        <!-- <span
          class="is-size-4"
          v-html="$t('request.stages.instructions5', {leo: `${leoName ? 'the ' + leoName : 'your local election official'}`, options: ballotReceiptOptionsString})"></span> -->
        <!-- <span class="is-size-4"> {{/AR|CT|NJ|NY|TX|VT|WY/.test(this.state) ? specialSubmissionRules : '' }}</span> -->
        <!-- <i18n path="request.stages.instructions5"
          class="is-size-4"
          tag="span"
          :html="true"
          :places="{leo: `${leoName ? 'the ' + leoName : 'your local election official'}`, options: ballotReceiptOptionsString}">
        </i18n> -->
      </div>

        <b-tabs type="is-toggle" expanded>
          <b-tab-item :label="$t('request.stages.email')"
            v-if="stateRules && stateRules.fpcaSubmitOptionsRequest.includes('Email')"
            icon="at">
            <section v-if="isIE" class="section">
              <h3 class="subtitle is-4">{{$t('request.stages.emailIntro')}}</h3>
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
                      <button :class="['button', 'is-pulled-right', 'is-primary', {'is-loading': !Boolean(msPdf)}]" @click="saveFile"><b-icon icon="download"></b-icon><span>{{$t('request.stages.download')}}</span></button>
                      <!-- <a v-if="downloadAttrSupported" :href="pdf" :download="`${firstName}-${lastName}-2018-fpca.pdf`" :class="['button', 'is-pulled-right', 'is-primary', {'is-loading': !Boolean(pdf)}]" @click="finish"><b-icon icon="download"></b-icon><span>{{$t('request.stages.download')}}</span></a>
                      <a v-else class="button is-pulled-right is-primary" @click="openPdf"><b-icon icon="download"></b-icon><span>{{$t('request.stages.download')}}</span></a> -->
                    </div>
                  </article>
                  <article class="media">
                    <figure class="media-left">
                      <b-icon icon="pencil-alt" size="is-medium"></b-icon>
                    </figure>
                    <div class="media-content">
                      <p v-html="$t('request.stages.emailSign')" class="is-size-5"></p>
                    </div>
                  </article>

                  <article class="media">
                    <figure class="media-left">
                      <b-icon icon="fax" size="is-medium"></b-icon>
                    </figure>
                    <div class="media-content">
                      <span class="is-size-5">
                        Email your form to:
                        <!-- {{$t('request.stages.mailPost')}} -->
                      </span>
                      <div class="box">
                        <span v-if="currentRequest.leo.n"><strong>{{ currentRequest.leo.n }}</strong><br/></span>
                        <span v-if="currentRequest.leo.e"><strong><a :href="`mailto:${currentRequest.leo.e}`">{{ currentRequest.leo.e }}</a></strong><br/></span>
                      </div>
                    </div>
                  </article>
                  <article class="media">
                    <figure class="media-left">
                      <b-icon icon="check" size="is-medium"></b-icon>
                    </figure>
                    <div class="media-content">
                      <p v-html="$t('request.stages.emailConfirm')" class="is-size-5"></p>
                    </div>
                  </article>
                </div>
              </div>
            </section>
            <section v-else-if="!signStep" class="section">
              <h3 class="subtitle is-4">{{$t('request.stages.emailIntro')}}</h3>
              <div class="media">
                <div class="media-content" style="width:100%;">
                  <p class="title is-5">{{$t('request.stages.instructions')}}</p>
                  <article class="media">
                    <figure class="media-left">
                      <span class="icon is-large">
                        <i class="fas fa-camera fa-2x"></i>
                      </span>
                    </figure>
                    <div class="media-content">
                      <div class="content">
                        <p v-if="canCaptureImage" class="is-size-6" v-html="$options.filters.markdown($t('request.stages.emailDigiSign'))"></p>
                        <p v-else class="is-size-6" v-html="$options.filters.markdown($t('request.stages.emailUploadSignature'))"></p>
                        <a v-if="!signStep" class="button is-pulled-right is-primary" @click="signStep = 'signatureAffirmation'"><b-icon icon="camera" size="is-small"></b-icon><span>{{$t('request.stages.sign')}}</span></a>
                      </div>
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
                      <div class="content">
                        <p class="is-size-6" v-html="$options.filters.markdown($t('request.stages.emailDownload'))"></p>
                        <button :class="['button', 'is-pulled-right', 'is-primary', {'is-loading': !Boolean(msPdf)}]" @click="saveFile"><b-icon icon="download"></b-icon><span>{{$t('request.stages.download')}}</span></button>
                      </div>
                    </div>
                  </article>
                  <b-message v-if="electronicTransmissionNote" type="is-warning" has-icon>
                      {{electronicTransmissionNote.replace(/\*/g, '') | capitalizeFirstLetter}}
                  </b-message>
                  <!-- <article class="media" v-if="/AR|CT|NJ|NY|WY/.test(votState)">
                    <figure class="media-left">
                      <b-icon icon="envelope" size="is-medium"></b-icon>
                    </figure>
                    <div class="media-content">
                      <span class="is-size-5">{{$t(`request.deadlineLanguage.${this.state}Special`)}}</span>
                      <div class="box">
                        <span v-if="currentRequest.leo.n"><strong>{{ currentRequest.leo.n }}</strong><br/></span>
                        <span v-if="currentRequest.leo.a1"><strong>{{ currentRequest.leo.a1 }}</strong><br/></span>
                        <span v-if="currentRequest.leo.a2"><strong>{{ currentRequest.leo.a2 }}</strong><br/></span>
                        <span v-if="currentRequest.leo.a3"><strong>{{ currentRequest.leo.a3 }}</strong><br/></span>
                        <span><strong>{{ currentRequest.leo.c }}, </strong>
                        <strong>{{ currentRequest.leo.s }} </strong>
                        <strong>{{ currentRequest.leo.z }}</strong><br/></span>
                        <span class="has-text-right"><strong>United States of America</strong><br/></span>
                      </div>
                    </div>
                  </article> -->
                </div>
              </div>
            </section>
            <section v-if="signStep" class="section">
              <!-- <sign4 v-model="signStep" :fpca="fpca" @sigcap="addSig">
              </sign4> -->
              <transition name="fade">
                <signature-affirmation v-model="signStep" v-if="signStep === 'signatureAffirmation'"></signature-affirmation>
              </transition>
              <transition name="fade">
                <add-signature v-model="signStep" @sigcap="addSig" v-if="signStep === 'addSignature'"></add-signature>
              </transition>
              <transition name="fade">
                <compose-message v-model="signStep" :fpca="fpca" :documentRequired="documentRequired" v-if="signStep === 'composeMessage'"></compose-message>
              </transition>
              <transition name="fade">
                <special-instructions v-model="signStep" :msPdf="msPdf" :state="votState" :firstName="firstName" :lastName="lastName" v-if="signStep === 'specialInstructions'"></special-instructions>
              </transition>
            </section>
          </b-tab-item>
          <b-tab-item :label="$t('request.stages.fax')"
            v-if="stateRules && stateRules.fpcaSubmitOptionsRequest.indexOf('Fax') > -1"
            icon="fax">
            <section class="section">
              <h3 class="subtitle is-4">{{$t('request.stages.faxIntro')}}</h3>
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
                      <button :class="['button', 'is-pulled-right', 'is-primary', {'is-loading': !Boolean(msPdf)}]" @click="saveFile"><b-icon icon="download"></b-icon><span>{{$t('request.stages.download')}}</span></button>
                      <!-- <a v-if="downloadAttrSupported" :href="pdf" :download="`${firstName}-${lastName}-2018-fpca.pdf`" :class="['button', 'is-pulled-right', 'is-primary', {'is-loading': !Boolean(pdf)}]" @click="finish"><b-icon icon="download"></b-icon><span>{{$t('request.stages.download')}}</span></a>
                      <a v-else class="button is-pulled-right is-primary" @click="openPdf"><b-icon icon="download"></b-icon><span>{{$t('request.stages.download')}}</span></a> -->
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
                      <b-icon icon="fax" size="is-medium"></b-icon>
                    </figure>
                    <div class="media-content">
                      <span class="is-size-5">
                        Fax your form to:
                        <!-- {{$t('request.stages.mailPost')}} -->
                      </span>
                      <div class="box">
                        <span v-if="currentRequest.leo.n"><strong>{{ currentRequest.leo.n }}</strong><br/></span>
                        <span v-if="currentRequest.leo.f"><strong>+1 {{ currentRequest.leo.f }}</strong><br/></span>
                      </div>
                    </div>
                  </article>
                  <!-- <article class="media" v-if="/AR|CT|NJ|NY|TX|VT|WY/.test(votState)">
                    <figure class="media-left">
                      <b-icon icon="envelope" size="is-medium"></b-icon>
                    </figure>
                    <div class="media-content">
                      <span class="is-size-5">{{$t(`request.deadlineLanguage.${this.state.toLowerCase()}Special`)}}</span>
                      <div class="box">
                        <span v-if="currentRequest.leo.n"><strong>{{ currentRequest.leo.n }}</strong><br/></span>
                        <span v-if="currentRequest.leo.a1"><strong>{{ currentRequest.leo.a1 }}</strong><br/></span>
                        <span v-if="currentRequest.leo.a2"><strong>{{ currentRequest.leo.a2 }}</strong><br/></span>
                        <span v-if="currentRequest.leo.a3"><strong>{{ currentRequest.leo.a3 }}</strong><br/></span>
                        <span><strong>{{ currentRequest.leo.c }}, </strong>
                        <strong>{{ currentRequest.leo.s }} </strong>
                        <strong>{{ currentRequest.leo.z }}</strong><br/></span>
                        <span class="has-text-right"><strong>United States of America</strong><br/></span>
                      </div>
                    </div>
                  </article> -->
                  <article class="media">
                    <figure class="media-left">
                      <b-icon icon="check" size="is-medium"></b-icon>
                    </figure>
                    <div class="media-content">
                      <p v-html="$t('request.stages.mailConfirm')" class="is-size-5"></p>
                    </div>
                  </article>
                  <b-message v-if="electronicTransmissionNote" type="is-warning" has-icon>
                      {{electronicTransmissionNote.replace(/\*/g, '') | capitalizeFirstLetter}}
                  </b-message>
                </div>
              </div>
            </section>
            <!-- <section class="section">
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
            </section> -->
          </b-tab-item>
          <b-tab-item :label="$t('request.stages.mail')"
            v-if="stateRules && stateRules.fpcaSubmitOptionsRequest.indexOf('Mail') > -1"
            icon="envelope-open">
            <section class="section">
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
                      <button :class="['button', 'is-pulled-right', 'is-primary', {'is-loading': !Boolean(msPdf)}]" @click="saveFile"><b-icon icon="download"></b-icon><span>{{$t('request.stages.download')}}</span></button>
                      <!-- <a v-if="downloadAttrSupported" :href="pdf" :download="`${firstName}-${lastName}-2018-fpca.pdf`" :class="['button', 'is-pulled-right', 'is-primary', {'is-loading': !Boolean(pdf)}]" @click="finish"><b-icon icon="download"></b-icon><span>{{$t('request.stages.download')}}</span></a>
                      <a v-else class="button is-pulled-right is-primary" @click="openPdf"><b-icon icon="download"></b-icon><span>{{$t('request.stages.download')}}</span></a> -->
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
                        <span v-if="currentRequest.leo.n"><strong>{{ currentRequest.leo.n }}</strong><br/></span>
                        <span v-if="currentRequest.leo.a1"><strong>{{ currentRequest.leo.a1 }}</strong><br/></span>
                        <span v-if="currentRequest.leo.a2"><strong>{{ currentRequest.leo.a2 }}</strong><br/></span>
                        <span v-if="currentRequest.leo.a3"><strong>{{ currentRequest.leo.a3 }}</strong><br/></span>
                        <span><strong>{{ currentRequest.leo.c }}, </strong>
                        <strong>{{ currentRequest.leo.s }} </strong>
                        <strong>{{ currentRequest.leo.z }}</strong><br/></span>
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
      <section >
        <button v-if="signStep" @click.prevent="() => { signStep = null; scrollUp() }" class="button is-light is-medium is-pulled-left" exact ><b-icon pack="fas" icon="caret-left"></b-icon><span>{{$t('request.stages.back')}}</span></button>
        <nuxt-link v-else :to="localePath({ name: 'request-review' })" class="button is-light is-medium is-pulled-left" exact ><b-icon pack="fas" icon="caret-left"></b-icon><span>{{$t('request.stages.back')}}</span></nuxt-link>
    </section>
    </div>
  <scroll-up></scroll-up>
  </div>
</template>

<script>
import MyCanvas from '~/components/MyCanvas.vue'
import MyBox from '~/components/MyBox.vue'
import Sign4 from '~/components/sign4.vue'
import SignatureAffirmation from '~/components/SignatureAffirmation.vue'
import AddSignature from '~/components/AddSignature.vue'
import ComposeMessage from '~/components/ComposeMessage.vue'
import SpecialInstructions from '~/components/SpecialInstructions'
import { mapState, mapGetters } from 'vuex'
import axios from 'axios'
// import VueMarkdown from 'vue-markdown'
import ScrollUp from '~/components/ScrollUp'
import snarkdown from 'snarkdown'
import fileSaver from 'file-saver'
// import { getDeadlineLanguage, flattenRules } from '~/utils/helpers'

export default {
  name: 'SignAndSubmit',
  middleware: 'verify-request',
  components: {
    MyCanvas,
    MyBox,
    Sign4,
    AddSignature,
    ComposeMessage,
    SignatureAffirmation,
    SpecialInstructions,
    // VueMarkdown,
    ScrollUp
  },
  async asyncData ({app, store}) {
    let state = store.getters['requests/getCurrent'] && store.getters['requests/getCurrent'].leo ? store.getters['requests/getCurrent'].leo.s : ''
    // let state = store.getters['requests/getCurrent'].leo.s || ''
    let elections = (await app.$content('/elections').get('elections')).body
    // let voterRegistrationStatus = store.getters['requests/getCurrent'].isRegistered || null
    // let voterType = store.getters['requests/getCurrent'].voterClass || null
    return {
      registering: store.getters['requests/getCurrent'].isRegistered !== 'registered',
      state: store.getters['requests/getCurrent'].leo.s,
      submissionMethod: store.getters['requests/getCurrent'].recBallot,
      allStateRules: await app.$content('rls')
        .query({ exclude: ['anchors', 'body', 'meta', 'path', 'permalink'] })
        .getAll(),
      stateElections: (await app.$content('/elections').get('elections')).body
        .filter(election => election.state && state && election.state.toLowerCase() === state.toLowerCase())
        .filter(x => new Date(x.date).getTime() > Date.now())
        .sort(function (a, b) {
          var dateA = new Date(a.date).getTime()
          var dateB = new Date(b.date).getTime()
          return dateA - dateB
        }),
      elections: elections
      // deadlineLanguage: getDeadlineLanguage(elections, state, voterRegistrationStatus, voterType, null),
      // rules: flattenRules(elections)
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
      signStep: null,
      fpca: null
    }
  },
  mounted () {
    let feat = this
    if (process.browser) {
      // console.log('starting to retrieve file')
      axios.get(encodeURI(`/api/fpca?firstName=${this.firstName || ''}&lastName=${this.lastName || ''}&middleName=${this.middleName || ''}&suffix=${this.suffix || ''}&ssn=${this.ssn || ''}&previousName=${this.previousName.previousName || ''}&dob=${this.dob || ''}&stateId=${this.stateId || ''}&votStreet=${this.votStreet || ''}&votApt=${this.votApt || ''}&votCity=${this.votCity || ''}&votState=${this.votState || ''}&votCounty=${this.votCounty || ''}&votZip=${this.votZip || ''}&abrAdr=${this.abrAdr.formatted && this.abrAdr.formatted[0] ? this.abrAdr.formatted[0] : ''}\n${this.abrAdr.formatted && this.abrAdr.formatted[1] ? this.abrAdr.formatted[1] : ''}\n${this.abrAdr.formatted && this.abrAdr.formatted[2] ? this.abrAdr.formatted[2] : ''}\n${this.abrAdr.formatted && this.abrAdr.formatted[3] ? this.abrAdr.formatted[3] : ''}\n${this.abrAdr.formatted && this.abrAdr.formatted[4] ? this.abrAdr.formatted[4] : ''}&fwdAdr=${this.fwdAdr.formatted && this.fwdAdr.formatted[0] ? this.fwdAdr.formatted[0] : ''}\n${this.fwdAdr.formatted && this.fwdAdr.formatted[1] ? this.fwdAdr.formatted[1] : ''}\n${this.fwdAdr.formatted && this.fwdAdr.formatted[2] ? this.fwdAdr.formatted[2] : ''}\n${this.fwdAdr.formatted && this.fwdAdr.formatted[3] ? this.fwdAdr.formatted[3] : ''}\n${this.fwdAdr.formatted && this.fwdAdr.formatted[4] ? this.fwdAdr.formatted[4] : ''}&email=${encodeURIComponent(this.email) || ''}&altEmail=${encodeURIComponent(this.altEmail) || ''}&tel=${this.tel ? encodeURIComponent(this.tel.replace(/\s/g, '')) : ''}&fax=${this.fax ? encodeURIComponent(this.fax.replace(/\s/g, '')) : ''}&party=${this.party || ''}&addlInfo=${this.addlInfo || ''}&date=${this.date || ''}&class=${this.voterClass || ''}&sex=${this.sex || ''}&recBallot=${this.recBallot || ''}&leoName=${this.leoName || ''}&leoAddress=${this.leoAdr ? encodeURIComponent(this.leoAdr) : ''}&leoFax=${this.leoFax || ''}&leoEmail=${this.leoEmail || ''}&leoPhone=${this.leoPhone || ''}&transmitOpts=${this.transmitOpts}&transmitInstructions=${this.pdfInstructions ? encodeURIComponent(this.pdfInstructions) : ''}&deadline=${encodeURIComponent(this.deadlineLanguage)}`), {responseType: 'arraybuffer'})
        .then((response) => {
          // console.log('response', response)
          let blob = new Blob([response.data], {type: 'application/pdf'})
          // console.log('blob', blob)
          this.msPdf = blob
          // this.pdf = window.URL.createObjectURL(blob)
        })
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
          console.error(err.name + ': ' + err.message)
        })
    }
  },
  filters: {
    markdown: function (md) {
      return snarkdown(md)
    },
    capitalizeFirstLetter: function (string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    }
  },
  methods: {
    scrollUp () { window.scrollTo(0, 0) },
    saveFile: function () {
      fileSaver.saveAs(this.msPdf, `${this.firstName}-${this.lastName}-2018-fpca.pdf`)
      this.confirmPdfDownload()
    },
    md: function (md) { return snarkdown(md) },
    confirmPdfDownload () {
      this.$store.dispatch('requests/updateRequest', {status: 'formDownloaded'})
      this.$store.commit('requests/update', {status: 'formDownloaded'})
      this.$toast.open({
        message: this.md(this.$t('request.fpcaDownload.downloadedAlertMessage')),
        type: 'is-success',
        duration: 7000
      })
      this.$router.push(this.localePath('dashboard'))
      // this.$dialog.alert({
      //   title: this.$t('request.fpcaDownload.downloadedAlertTitle'),
      //   message: this.md(this.$t('request.fpcaDownload.downloadedAlertMessage')),
      //   confirmText: this.$t('request.fpcaDownload.confirmButton'),
      //   type: 'is-danger',
      //   hasIcon: true,
      //   icon: 'download',
      //   iconPack: 'fas',
      //   onConfirm: () => this.$router.push(this.localePath('dashboard'))
      // })
    },
    // openPdf () {
    //   this.$dialog.alert({
    //     title: this.$t('request.fpcaDownload.downloadingAlertTitle'),
    //     message: this.md(this.$t('request.fpcaDownload.downloadingAlertMessage')),
    //     confirmText: this.$t('request.fpcaDownload.confirmButton'),
    //     type: 'is-danger',
    //     hasIcon: true,
    //     icon: 'download',
    //     iconPack: 'fas',
    //     onConfirm: () => { this.$router.push(this.localePath('dashboard')); this.openPdfNewWindow() }
    //   })
    // },
    // openPdfNewWindow () {
    //   if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    //     window.navigator.msSaveOrOpenBlob(this.msPdf)
    //   } else {
    //     window.open(this.pdf, `${this.firstName}-${this.lastName}-2018-fpca.pdf`)
    //   }
    //   // if (this.needsMsSaveOrOpenBlob) {
    //   //   window.navigator.msSaveOrOpenBlob(this.msPdf, `${this.firstName}-${this.lastName}-2018-fpca.pdf`)
    //   // } else {
    //   //   window.open(this.pdf, '_blank')
    //   // }
    // },
    // finish () {
    //   this.$router.push(this.localePath('dashboard'))
    //   this.confirmPdfDownload()
    // },
    // getFPCA (method) {
    //   axios.get(encodeURI(`/api/fpca?firstName=${this.firstName || ''}&lastName=${this.lastName || ''}&middleName=${this.middleName || ''}&suffix=${this.suffix || ''}&ssn=${this.ssn || ''}&previousName=${this.previousName.previousName || ''}&dob=${this.dob || ''}&stateId=${this.stateId || ''}&votStreet=${this.votStreet || ''}&votApt=${this.votApt || ''}&votCity=${this.votCity || ''}&votState=${this.votState || ''}&votCounty=${this.votCounty || ''}&votZip=${this.votZip || ''}&abrAdr=${this.abrAdr.formatted && this.abrAdr.formatted[0] ? this.abrAdr.formatted[0] : ''}\n${this.abrAdr.formatted && this.abrAdr.formatted[1] ? this.abrAdr.formatted[1] : ''}\n${this.abrAdr.formatted && this.abrAdr.formatted[2] ? this.abrAdr.formatted[2] : ''}\n${this.abrAdr.formatted && this.abrAdr.formatted[3] ? this.abrAdr.formatted[3] : ''}\n${this.abrAdr.formatted && this.abrAdr.formatted[4] ? this.abrAdr.formatted[4] : ''}&fwdAdr=${this.fwdAdr.formatted && this.fwdAdr.formatted[0] ? this.fwdAdr.formatted[0] : ''}\n${this.fwdAdr.formatted && this.fwdAdr.formatted[1] ? this.fwdAdr.formatted[1] : ''}\n${this.fwdAdr.formatted && this.fwdAdr.formatted[2] ? this.fwdAdr.formatted[2] : ''}\n${this.fwdAdr.formatted && this.fwdAdr.formatted[3] ? this.fwdAdr.formatted[3] : ''}\n${this.fwdAdr.formatted && this.fwdAdr.formatted[4] ? this.fwdAdr.formatted[4] : ''}&email=${encodeURIComponent(this.email) || ''}&altEmail=${encodeURIComponent(this.altEmail) || ''}&tel=${this.tel ? encodeURIComponent(this.tel.replace(/\s/g, '')) : ''}&fax=${this.fax ? encodeURIComponent(this.fax.replace(/\s/g, '')) : ''}&party=${this.party || ''}&addlInfo=${this.addlInfo || ''}&date=${this.date || ''}&leoAdr=${this.leoAdr}&class=${this.voterClass || ''}&sex=${this.sex || ''}&recBallot=${this.recBallot || ''}&leoName=${this.leoName || ''}&leoAddress=${this.leoAdr || ''}&leoFax=${this.leoFax || ''}&leoEmail=${this.leoEmail || ''}&leoPhone=${this.leoPhone || ''}&transmitOpts=${this.isRegistered === 'registered' ? this.stateRules.fpcaSubmitOptionsRegister.join('--') : this.stateRules.fpcaSubmitOptionsRequest.join('--')}&deadline=${encodeURIComponent(this.deadlineLanguage)}&method=${method}`), {responseType: 'arraybuffer'})
    //     .then((response) => {
    //       // console.log(response)
    //       let blob = new Blob([response.data], {type: 'application/pdf'})
    //       let link = document.createElement('a')
    //       link.href = window.URL.createObjectURL(blob)
    //       if (method === 'download') link.download = 'FPCA.pdf'
    //       if (method === 'blank') link.target = '_blank'
    //       link.click()
    //     })
    // },
    addSig (val) {
      this.signature = val
      var d = new Date()
      var today = `${d.getFullYear()}-${d.getMonth() < 9 ? '0' : ''}${d.getMonth() + 1}-${d.getDate() < 9 ? '0' : ''}${d.getDate()}`
      this.$store.commit('requests/update', { date: today })
      this.signStep = 'composeMessage'
      // console.log('addsig', this.$refs.fpca.$refs['my-canvas'])
      setTimeout(() => {
        this.fpca = this.$refs.fpca.$refs['my-canvas'].toDataURL()
      }, 800)
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
    //   let url = '/api/mail'
    //   let config = { url: url, method: 'post', headers: { 'Content-Type': 'multipart/form-data' }, auth: { username: 'api', password: 'key-44903961cb823b645750fe64358dfc40' } }
    //   this.$axios.post(url, data, config)
    //     .then(response => console.log(response))
    //     .catch(errors => console.log(errors))
    // }
  },
  computed: {
    instructionsObject () {
      let votState = this.votState
      return {
        leoName: this.leoName || '',
        transmitOpts: this.transmitOpts,
        default: this.$t(`request.deadlineLanguage.transmitInstructions`, {
          leoName: this.leoName,
          transmitOpts: this.transmitOpts
        }),
        specialDeadline: this.$te(`request.deadlineLanguage.${votState}SpecialDeadline`) ? this.$t(`request.deadlineLanguage.${votState}SpecialDeadline`, {leoName: this.leoName}) : this.$t('request.deadlineLanguage.emailSuggested')
      }
    },
    pdfInstructions () {
      if (this.$te(`request.deadlineLanguage.${this.votState}Special`)) {
        return this.$t(`request.deadlineLanguage.${this.votState}Special`, this.instructionsObject).replace(/\*{2}/gi, '*')
      } else {
        return this.$t(`request.deadlineLanguage.transmitInstructions`, {leoName: this.leoName, transmitOpts: this.transmitOpts}) + this.stateRules.fpcaSubmitOptionsRegister.includes('Email')
          ? this.$t('request.deadlineLanguage.emailSuggested')
          : ''
      }
    },
    transmitInstructions () {
      if (this.$te(`request.deadlineLanguage.${this.votState}SpecialDeadline`)) {
        // return this.$t(`request.deadlineLanguage.${this.votState}Special`, this.instructionsObject)
        return this.$t(`request.deadlineLanguage.transmitInstructions`, {leoName: this.leoName, transmitOpts: this.transmitOpts})
      } else if (this.$te(`request.deadlineLanguage.${this.votState}Special`)) {
        return this.$t(`request.deadlineLanguage.${this.votState}Special`, Object.assign({}, this.instructionsObject, {specialDeadline: ''}))
      } else {
        return this.$t(`request.deadlineLanguage.transmitInstructions`, {leoName: this.leoName, transmitOpts: this.transmitOpts})
      }
    },
    transmitRules () {
      if (this.$te(`request.deadlineLanguage.${this.votState}SpecialDeadline`)) {
        return this.$t(`request.deadlineLanguage.${this.votState}Special`, Object.assign({}, this.instructionsObject, {default: ''}))
      } else return this.stateRules && this.stateRules.fpcaSubmitOptionsRequest.includes('Email') ? this.$t('request.deadlineLanguage.emailSuggested') : ''
    },
    electronicTransmissionNote () {
      if (this.$te(`request.deadlineLanguage.${this.votState}SpecialDeadline`)) {
        return this.$t(`request.deadlineLanguage.${this.votState}SpecialDeadline`, {leoName: this.leoName})
      } else if (this.$te(`request.deadlineLanguage.${this.votState}Special`)) {
        return this.$t(`request.deadlineLanguage.${this.votState}Special`, {leoName: this.leoName})
      } else return null
    },
    transmitOpts () {
      switch (this.stateRules.fpcaSubmitOptionsRegister.length) {
        case 1:
          return this.$t(`request.deadlineLanguage.${this.stateRules.fpcaSubmitOptionsRegister[0].toLowerCase()}`)
        case 2:
          return this.$t(`request.deadlineLanguage.opt2`, {item1: this.$t(`request.deadlineLanguage.${this.stateRules.fpcaSubmitOptionsRegister[0].toLowerCase()}`).toLowerCase(), item2: this.$t(`request.deadlineLanguage.${this.stateRules.fpcaSubmitOptionsRegister[1].toLowerCase()}`).toLowerCase()})
        case 3:
          return this.$t(`request.deadlineLanguage.opt3`, {item1: this.$t(`request.deadlineLanguage.${this.stateRules.fpcaSubmitOptionsRegister[0].toLowerCase()}`).toLowerCase(), item2: this.$t(`request.deadlineLanguage.${this.stateRules.fpcaSubmitOptionsRegister[1].toLowerCase()}`).toLowerCase(), item3: this.$t(`request.deadlineLanguage.${this.stateRules.fpcaSubmitOptionsRegister[2].toLowerCase()}`).toLowerCase()})
        case 4:
          return this.$t(`request.deadlineLanguage.opt4`, {item1: this.$t(`request.deadlineLanguage.${this.stateRules.fpcaSubmitOptionsRegister[0].toLowerCase()}`).toLowerCase(), item2: this.$t(`request.deadlineLanguage.${this.stateRules.fpcaSubmitOptionsRegister[1].toLowerCase()}`).toLowerCase(), item3: this.$t(`request.deadlineLanguage.${this.stateRules.fpcaSubmitOptionsRegister[2].toLowerCase()}`).toLowerCase(), item4: this.$t(`request.deadlineLanguage.${this.stateRules.fpcaSubmitOptionsRegister[3].toLowerCase()}`).toLowerCase()})
        default:
          return `mail, email or fax`
      }
    },
    newVoterDeadlineLanguageObject () {
      let elections = this.getCurrentDeadlines.filter(x => x.ruleType === 'Registration')
      let rule = elections[0].rule
      let deadline = new Date(elections[0].ruleDate)
      let methods = elections.length < 2 || elections[0].submissionOptions.length > 2 ? '' : this.$t(`request.deadlineLanguage.submissionMethod`, {method: elections[0].submissionOptions.join('/')})
      let altMethods = elections.length < 2 || elections[1].submissionOptions.length > 2 ? '' : this.$t(`request.deadlineLanguage.alternateSubmissionMethod`, {rule: this.$t(`request.deadlineLanguage.${elections[1].rule}`), deadline: new Date(elections[1].ruleDate).toLocaleDateString('en-US', {month: 'short', day: 'numeric'}), method: elections[1].submissionOptions.join('/')})
      return {
        rule: this.$t(`request.deadlineLanguage.${rule}`),
        deadline: deadline.toLocaleDateString('en-US', {month: 'short', day: 'numeric'}),
        submissionMethod: methods,
        alternateSubmissionMethod: altMethods,
        electionDay: new Date(elections[0].electionDate).toLocaleDateString('en-US', {month: 'short', day: 'numeric'}),
        electionType: elections[0].electionType,
        note: elections[0].note || '',
        url: process.env.url,
        state: elections[0].state,
        documentRequired: this.documentRequired && (this.state === 'AK' || this.state === 'AZ') ? this.$t(`request.deadlineLanguage.documentRequired`, {document: this.$t(`request.deadlineLanguage.${this.state.toLowerCase()}Document`)}) : ''
      }
    },
    registeredVoterDeadlineObject () {
      let elections = this.getCurrentDeadlines.filter(x => x.ruleType === 'Ballot Request')
      let rule = elections[0].rule
      let deadline = new Date(elections[0].ruleDate)
      let methods = elections.length < 2 || elections[0].submissionOptions.length > 2 ? '' : this.$t(`request.deadlineLanguage.submissionMethod`, {method: elections[0].submissionOptions.join('/')})
      let altMethods = elections.length < 2 || elections[1].submissionOptions.length > 2 ? '' : this.$t(`request.deadlineLanguage.alternateSubmissionMethod`, {rule: this.$t(`request.deadlineLanguage.${elections[1].rule}`), deadline: new Date(elections[1].ruleDate).toLocaleDateString('en-US', {month: 'short', day: 'numeric'}), method: elections[1].submissionOptions.join('/')})
      return {
        rule: this.$t(`request.deadlineLanguage.${rule}`),
        deadline: deadline.toLocaleDateString('en-US', {month: 'short', day: 'numeric'}),
        submissionMethod: methods,
        alternateSubmissionMethod: altMethods,
        electionDay: new Date(elections[0].electionDate).toLocaleDateString('en-US', {month: 'short', day: 'numeric'}),
        electionType: elections[0].electionType,
        note: elections[0].note || '',
        url: process.env.url,
        state: elections[0].state
      }
    },
    unsureVoterDeadlineObject () {
      let electionsNew = this.getCurrentDeadlines.filter(x => x.ruleType === 'Ballot Request')
      let newVoterRule = electionsNew[0].rule
      let newVoterDeadline = new Date(electionsNew[0].ruleDate)
      let newVoterMethods = electionsNew.length < 2 || electionsNew[0].submissionOptions.length > 2 ? '' : this.$t(`request.deadlineLanguage.submissionMethod`, {method: electionsNew[0].submissionOptions.join('/')})
      let newVoterAltMethods = electionsNew.length < 2 || electionsNew[1].submissionOptions.length > 2 ? '' : this.$t(`request.deadlineLanguage.alternateSubmissionMethod`, {rule: this.$t(`request.deadlineLanguage.${electionsNew[1].rule}`), deadline: new Date(electionsNew[1].ruleDate).toLocaleDateString('en-US', {month: 'short', day: 'numeric'}), method: electionsNew[1].submissionOptions.join('/')})
      let electionsRegistered = this.getCurrentDeadlines.filter(x => x.ruleType === 'Ballot Request')
      let registeredVoterRule = electionsRegistered[0].rule
      let registeredVoterDeadline = new Date(electionsRegistered[0].ruleDate)
      let registeredVoterMethods = electionsRegistered.length < 2 || electionsRegistered[0].submissionOptions.length > 2 ? '' : this.$t(`request.deadlineLanguage.submissionMethod`, {method: electionsRegistered[0].submissionOptions.join('/')})
      let registeredVoterAltMethods = electionsRegistered.length < 2 || electionsRegistered[1].submissionOptions.length > 2 ? '' : this.$t(`request.deadlineLanguage.alternateSubmissionMethod`, {rule: this.$t(`request.deadlineLanguage.${electionsRegistered[1].rule}`), deadline: new Date(electionsRegistered[1].ruleDate).toLocaleDateString('en-US', {month: 'short', day: 'numeric'}), method: electionsRegistered[1].submissionOptions.join('/')})
      return {
        newVoterRule: this.$t(`request.deadlineLanguage.${newVoterRule}`),
        newVoterDeadline: newVoterDeadline.toLocaleDateString('en-US', {month: 'short', day: 'numeric'}),
        newVoterSubmissionMethod: newVoterMethods,
        newVoterAlternateSubmissionMethod: newVoterAltMethods,
        newVoterElectionDay: new Date(electionsNew[0].electionDate).toLocaleDateString('en-US', {month: 'short', day: 'numeric'}),
        newVoterElectionType: electionsNew[0].electionType,
        newVoterNote: electionsNew[0].note || '',
        registeredVoterRule: this.$t(`request.deadlineLanguage.${registeredVoterRule}`),
        registeredVoterDeadline: registeredVoterDeadline.toLocaleDateString('en-US', {month: 'short', day: 'numeric'}),
        registeredVoterSubmissionMethod: registeredVoterMethods,
        registeredVoterAlternateSubmissionMethod: registeredVoterAltMethods,
        registeredVoterElectionDay: new Date(electionsRegistered[0].electionDate).toLocaleDateString('en-US', {month: 'short', day: 'numeric'}),
        registeredVoterElectionType: electionsRegistered[0].electionType,
        registeredVoterNote: electionsRegistered[0].note || '',
        url: process.env.url,
        state: electionsNew[0].state,
        documentRequired: this.documentRequired && (this.state === 'AK' || this.state === 'AZ') ? this.$t(`request.deadlineLanguage.documentRequired`, {document: this.$t(`request.deadlineLanguage.${this.state.toLowerCase()}Document`)}) : ''
      }
    },
    ballotReturnDeadlineObject () {
      let elections = this.getCurrentDeadlines.filter(x => x.ruleType === 'Ballot Return')
      let rule = elections[0].rule
      let deadline = new Date(elections[0].ruleDate)
      let methods = elections.length < 2 || elections[0].submissionOptions.length > 2 ? '' : this.$t(`request.deadlineLanguage.submissionMethod`, {method: elections[0].submissionOptions.join('/')})
      let altMethods = elections.length < 2 || elections[1].submissionOptions.length > 2 ? '' : this.$t(`request.deadlineLanguage.alternateSubmissionMethod`, {rule: this.$t(`request.deadlineLanguage.${elections[1].rule}`), deadline: new Date(elections[1].ruleDate).toLocaleDateString('en-US', {month: 'short', day: 'numeric'}), method: elections[1].submissionOptions.join('/')})
      return {
        rule: this.$t(`request.deadlineLanguage.${rule}`),
        deadline: deadline.toLocaleDateString('en-US', {month: 'short', day: 'numeric'}),
        submissionMethod: methods,
        alternateSubmissionMethod: altMethods,
        electionDay: new Date(elections[0].electionDate).toLocaleDateString('en-US', {month: 'short', day: 'numeric'}),
        electionType: elections[0].electionType,
        note: elections[0].note || '',
        url: process.env.url,
        state: elections[0].state
      }
    },
    specialSubmissionRules () {
      return this.$te(`request.deadlineLanguage.${this.votState.toLowerCase()}Special`)
        ? this.$t(`request.deadlineLanguage.${this.votState.toLowerCase()}Special`)
        : ''
    },
    deadlineLanguage () {
      switch (this.isRegistered) {
        case 'notRegistered':
          return this.$t('request.deadlineLanguage.newVoters', this.newVoterDeadlineLanguageObject)
        case 'registered':
          return this.$t('request.deadlineLanguage.registeredVoters', this.registeredVoterDeadlineObject)
        default:
          return this.$t('request.deadlineLanguage.unsureRegistrationVoters', this.unsureVoterDeadlineObject)
      }
    },
    deadlineFormSubmitted () {
      return this.$t('request.deadlineLanguage.formSubmitted', {
        alsoVoterRegistration: this.isRegistered === 'registered' ? '' : this.$t('request.deadlineLanguage.alsoVoterRegistration')
      })
    },
    deadlineFormConfirmation () {
      return this.$t('request.deadlineLanguage.formConfirmation')
    },
    deadlineReceiveBallot () {
      let daysToNextElection = Math.ceil((new Date(this.getCurrentDeadlines[0].electionDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24))
      return this.$t(`request.deadlineLanguage.${daysToNextElection > 44 ? 'sendBallot45days' : 'sendBallotLessThan45days'}`)
    },
    deadlineBallotReturn () {
      return this.$t('request.deadlineLanguage.ballotReturn', this.ballotReturnDeadlineObject)
    },
    documentRequired () {
      switch (this.state.toLowerCase()) {
        case 'ak':
          return 'proof of Alaska Residency'
        case 'az':
          return this.isRegistered === 'unsure' || this.isRegistered === 'notRegistered' ? 'proof of citizenship (for newly registered voters)' : null
        default:
          return null
      }
    },
    // pleaseRotate () {
    //   // return this.signStep === 'instructions'
    //   return this.$store.state.userauth.device.type === 'mobile' && this.$store.state.userauth.device.orientation === 'portrait' && this.signStep === 'instructions'
    // },
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
    // ssn () { return this.currentRequest && this.currentRequest.identification && this.currentRequest.identification.ssn ? this.currentRequest.identification.ssn.toString() : ' ' },
    stateId () { return this.currentRequest && this.currentRequest.identification && this.currentRequest.identification.stateId ? this.currentRequest.identification.stateId.toString() : ' ' },
    votStreet () { return this.getCurrent.votAdr.A || '' },
    votApt () { return this.getCurrent.votAdr.B || '' },
    votCity () { return this.getCurrent.votAdr.C || '' },
    votState () { return this.getCurrent.votAdr.S || '' },
    votCounty () { return this.getCurrent.votAdr.Y || '' },
    votZip () { return this.getCurrent.votAdr.Z || '' },
    abrAdr () { return this.currentRequest && this.currentRequest.abrAdr ? this.currentRequest.abrAdr : {} },
    fwdAdr () { return this.currentRequest && this.currentRequest.fwdAdr && (this.currentRequest.fwdAdr.A || this.currentRequest.fwdAdr.alt1) ? this.currentRequest.fwdAdr : {} },
    email () { return this.currentRequest && this.currentRequest.email ? this.currentRequest.email.toString() : ' ' },
    altEmail () { return this.currentRequest && this.currentRequest.altEmail ? this.currentRequest.altEmail.toString() : ' ' },
    tel () { return this.getCurrent.tel || '' },
    fax () { return this.getCurrent.fax || '' },
    party () { return this.currentRequest && this.currentRequest.party ? this.currentRequest.party.toString() : ' ' },
    // addlInfo () { return this.currentRequest && this.currentRequest.stateSpecial ? this.currentRequest.stateSpecial.toString() : ' ' },
    addlInfo () {
      let addlInfoText = ' '
      if (this.currentRequest && (this.currentRequest.stateSpecial || (this.currentRequest.identification && this.currentRequest.identification.noId && this.stateRules && this.stateRules.id && this.stateRules.id.length > 0))) {
        addlInfoText = this.currentRequest && this.currentRequest.stateSpecial ? this.currentRequest.stateSpecial.toString() : ' '
        if ((this.currentRequest.identification && this.currentRequest.identification.noId && this.stateRules && this.stateRules.id && this.stateRules.id.length > 0)) {
          addlInfoText = `I don't have the requested forms of identification. ` + addlInfoText
        }
        return addlInfoText
      } else {
        return ''
      }
    },
    date () {
      let d = new Date()
      return this.getCurrent.date || `${d.getFullYear()}-${d.getMonth() < 9 ? '0' : ''}${d.getMonth() + 1}-${d.getDate() < 9 ? '0' : ''}${d.getDate()}`
    },
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
      let leo = this.currentRequest.leo
      return `${leo.n ? leo.n + '\n' : ''}${leo.a1 ? leo.a1 + '\n' : ''}${leo.a2 ? leo.a2 + '\n' : ''}${leo.a3 ? leo.a3 + '\n' : ''}${leo.c ? leo.c + ', ' : ''}${leo.s ? leo.s + ' ' : ''}${leo.z ? leo.z + '\n' : '\n'}United States of America`
    },
    leoEmail () {
      return this.currentRequest.leo && this.currentRequest.leo.e ? this.currentRequest.leo.e : ''
    },
    leoName () {
      return this.currentRequest.leo && this.currentRequest.leo.n ? this.currentRequest.leo.n : ''
    },
    leoFax () {
      return this.currentRequest.leo && this.currentRequest.leo.f ? '+1 ' + this.currentRequest.leo.f : ''
    },
    leoPhone () {
      return this.currentRequest.leo && this.currentRequest.leo.p ? '+1 ' + this.currentRequest.leo.p : ''
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
      requests: state => state.requests.requests,
      canCaptureImage: state => state.userauth.device.hasWebCam,
      isIE: state => state.userauth.device.isIE
    }),
    ...mapGetters('requests', ['getCurrent', 'getCurrentDeadlines'])
  }
}
</script>

<style>
.rotated {
  transform: rotate(90deg);
}
.shrink {
  transform: scale(0.8) translate(0.2em, -0.15em);
}

.rotate-enter-active {
  transition: all 3s ease;
}
.rotate-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.rotate-enter, .rotate-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: rotate(0deg);
}
</style>
