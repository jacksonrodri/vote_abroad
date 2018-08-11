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
        <span class="is-size-4" v-html="$t('request.stages.instructions5', {leo: `${leoName ? 'the ' + leoName : 'your local election official'}`, options: ballotReceiptOptionsString})"></span>
        <!-- <i18n path="request.stages.instructions5"
          class="is-size-4"
          tag="span"
          :html="true"
          :places="{leo: `${leoName ? 'the ' + leoName : 'your local election official'}`, options: ballotReceiptOptionsString}">
        </i18n> -->
      </div>

        <b-tabs type="is-toggle" expanded>
          <b-tab-item :label="$t('request.stages.email')"
            v-if="stateRules && stateRules.fpcaSubmitOptionsRequest.indexOf('Email') > -1"
            icon="at">
            <section v-if="!signStep" class="section">
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
                        <p class="is-size-6" v-html="$options.filters.markdown($t('request.stages.emailDigiSign'))"></p>
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
                        <button :class="['button', 'is-pulled-right', 'is-primary', {'is-loading': !Boolean(pdf)}]" @click="saveFile"><b-icon icon="download"></b-icon><span>{{$t('request.stages.download')}}</span></button>
                      </div>
                    </div>
                  </article>
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
                      <button :class="['button', 'is-pulled-right', 'is-primary', {'is-loading': !Boolean(pdf)}]" @click="saveFile"><b-icon icon="download"></b-icon><span>{{$t('request.stages.download')}}</span></button>
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
                      <button :class="['button', 'is-pulled-right', 'is-primary', {'is-loading': !Boolean(pdf)}]" @click="saveFile"><b-icon icon="download"></b-icon><span>{{$t('request.stages.download')}}</span></button>
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
        <nuxt-link v-else :to="localePath({ name: 'request-stage', params: { stage: 'review'} })" class="button is-light is-medium is-pulled-left" exact ><b-icon pack="fas" icon="caret-left"></b-icon><span>{{$t('request.stages.back')}}</span></nuxt-link>
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
import { mapState, mapGetters } from 'vuex'
import axios from 'axios'
// import VueMarkdown from 'vue-markdown'
import ScrollUp from '~/components/ScrollUp'
import snarkdown from 'snarkdown'
import fileSaver from 'file-saver'

// Utility Functions for filtering rules

// Filter Function to remove elections from other states
function filterToMatchVotingState (election) {
  return election.state && election.state.toLowerCase() === this.state.toLowerCase()
}
// Filter function to remove rules that don't apply to this voterClass
function filterToMatchVoterType (rule) {
  if (!(typeof rule.voterType === 'string') || !this.voterType) {
    return true
  } else if (this.voterType === 'military' || this.voterType === 'milSpouse' || this.voterType === 'natGuard') {
    return !rule.voterType.includes('Citizen')
  } else {
    return !rule.voterType.includes('Uniformed')
  }
}

function filterRuleToMatchSubmissionMethod (rule) {
  if (!(/Mail|Email|Fax/.test(rule.rule)) || !this.submissionMethod) {
    return true
  } else if (this.submissionMethod.toLowerCase() === 'email') {
    return /Email/.test(rule.rule)
  } else if (this.submissionMethod.toLowerCase() === 'mail') {
    return /Mail/.test(rule.rule)
  } else if (this.submissionMethod.toLowerCase() === 'fax') {
    return /Fax/.test(rule.rule)
  }
}

// Compare function to sort elections chronolically
function compareElectionDateToSort (a, b) {
  return new Date(a.date).getTime() < new Date(b.date).getTime() ? -1 : 1
}

// Filter function accepting election && voterType && voterRegistrationStatus returning true if election rules match voterType and voterRegistrationStatus
function filterForVoterTypeAndRegistrationStatus (election, i, arr) {
  if (this.voterRegistrationStatus && this.voterRegistrationStatus.toLowerCase() === 'registered') {
    return [...Object.assign({}, election).rules['Ballot Request']]
      .filter(filterToMatchVoterType, {voterType: this.voterType})
      .filter(filterRuleToMatchSubmissionMethod, {submissionMethod: this.submissionMethod})
      .map(rule => new Date(typeof rule.date === 'string' ? rule.date : election.date).getTime())
      .some(epochTimeStamp => !(epochTimeStamp < new Date().getTime()))
  } else if (this.voterRegistrationStatus && this.voterRegistrationStatus.toLowerCase() === 'notregistered') {
    return [...election.rules['Registration']]
      .filter(filterToMatchVoterType, {voterType: this.voterType})
      .filter(filterRuleToMatchSubmissionMethod, {submissionMethod: this.submissionMethod})
      .map(rule => new Date(typeof rule.date === 'string' ? rule.date : election.date).getTime())
      .some(epochTimeStamp => !(epochTimeStamp < new Date().getTime()))
  } else {
    return [...Object.assign({}, election).rules['Registration'], ...Object.assign({}, election).rules['Ballot Request']]
      .filter(filterToMatchVoterType, {voterType: this.voterType})
      .filter(filterRuleToMatchSubmissionMethod, {submissionMethod: this.submissionMethod})
      .map(rule => new Date(typeof rule.date === 'string' ? rule.date : election.date).getTime())
      .some(epochTimeStamp => !(epochTimeStamp < new Date().getTime()))
  }
}
function removeRulesForOtherRegistrationStatus (election) {
  let thisElection = Object.assign({}, election)
  let rules = {}
  if (this.voterRegistrationStatus && /notregistered/.test(this.voterRegistrationStatus.toLowerCase())) {
    rules['Registration'] = thisElection.rules['Registration']
  } else if (this.voterRegistrationStatus && /registered/.test(this.voterRegistrationStatus.toLowerCase())) {
    rules['Ballot Request'] = thisElection.rules['Ballot Request']
  }
  if (!this.voterRegistrationStatus || /unsure/.test(this.voterRegistrationStatus.toLowerCase())) {
    rules['Ballot Request'] = thisElection.rules['Ballot Request']
    rules['Registration'] = thisElection.rules['Registration']
  }
  thisElection.rules = rules
  return thisElection
}

// function accepting array of elections, voterRegistrationStatus, voterType, state, submissionMethod and returning a the next election where rules apply to voter
function getNextEligibleRules (electionArr, state, voterRegistrationStatus, voterType, submissionMethod) {
  return [ ...electionArr ] // work with a copy of array so we are not mutating original array
    .filter(filterToMatchVotingState, {state}) // remove elections from other states
    .filter(filterForVoterTypeAndRegistrationStatus, {voterType, voterRegistrationStatus, submissionMethod}) // remove elections with rules that for different voter type/registration status/ or past due
    .map(removeRulesForOtherRegistrationStatus, {voterRegistrationStatus})
    .sort(compareElectionDateToSort)
}

function getRuleLanguage (eligibleRules, type, voterRegistrationStatus) {
  if (!eligibleRules || !type || !eligibleRules.rules || !eligibleRules.rules[type] || eligibleRules.rules[type].length === 0 || /(no deadline)|(not required)/gi.test(getRuleType(eligibleRules.rules[type][0].rule))) {
    return `There is no deadline for ${type.toLowerCase()}.`
  } else if (eligibleRules && type && eligibleRules.rules[type] && eligibleRules.rules[type].length === 1) {
    return `Your form must be ${getRuleType(eligibleRules.rules[type][0].rule)} ${getRuleDeadline(eligibleRules.rules[type][0].date)}.`
  } else {
    return eligibleRules.rules[type].map((rule, i) => `If you send your form by ${getRuleSubmissionOption(eligibleRules.rules[type][i].rule)}, it must be ${getRuleType(eligibleRules.rules[type][i].rule)} ${getRuleDeadline(eligibleRules.rules[type][i].date)}.`).join(voterRegistrationStatus && /registered/.test(voterRegistrationStatus.toLowerCase()) ? '\n- ' : ' - ')
  }
}

function getRuleType (rule) {
  if (rule && typeof rule === 'string') {
    let rt = ['postmarked by', 'received by', 'sent by', 'no deadline', 'not required', 'signed by', 'signed/postmarked by'].filter(x => rule.toLowerCase().includes(x))
    return rt.includes('signed/postmarked by') ? 'signed/postmarked by' : rt[0]
  } else return 'received by'
}
function getRuleDeadline (date) {
  return date && typeof date === 'string' && date.substr(0, 4) === new Date().getFullYear().toString() ? `${new Date(date).toLocaleDateString('en-US', {month: 'short', day: 'numeric'}).toUpperCase()} at ${new Date(date).toLocaleTimeString('en-US', {hour: 'numeric'}).toUpperCase()}` : null
}
function getRuleSubmissionOption (rule) {
  let st = []
  if (/Email/.test(rule) || !/Mail|Email|Fax/.test(rule)) st.push('email')
  if (/Fax/.test(rule) || !/Mail|Email|Fax/.test(rule)) st.push('fax')
  if (/Mail/.test(rule) || !/Mail|Email|Fax/.test(rule)) st.push('postal mail')
  return st.length === 3 ? `${st[0]}, ${st[1]} or ${st[2]}` : st.length === 2 ? `${st[0]} or ${st[1]}` : st[0]
}

function getDeadlineLanguage (electionArr, state, voterRegistrationStatus, voterType, submissionMethod) {
  let applicableRules = getNextEligibleRules([...electionArr], state || '', voterRegistrationStatus, voterType, submissionMethod)
  // console.log(applicableRules)
  applicableRules = applicableRules[0]
  if (!applicableRules) {
    return `IMPORTANT: Your form must be received by your state deadline to be eligible to vote in the November 6 General Election.  \nYou can find your state deadlines at www.votefromabroad.org/states `
  } else {
    switch (voterRegistrationStatus) {
      case 'notRegistered':
        return `** IMPORTANT DEADLINES for new voters to vote in the ${new Date(applicableRules.date).toLocaleDateString('en-US', {month: 'short', day: 'numeric'}).toUpperCase()} ${applicableRules.electionType} **\n- ${getRuleLanguage(applicableRules, 'Registration', voterRegistrationStatus)}\nSee all your states deadlines at www.votefromabroad.org/${applicableRules.state}`
      case 'registered':
        return `** IMPORTANT DEADLINES for registered voters to vote in the ${new Date(applicableRules.date).toLocaleDateString('en-US', {month: 'short', day: 'numeric'}).toUpperCase()} ${applicableRules.electionType} **\n- ${getRuleLanguage(applicableRules, 'Ballot Request', voterRegistrationStatus)}\nSee all your states deadlines at www.votefromabroad.org/${applicableRules.state}`
      default:
        return `** IMPORTANT DEADLINES ** for the ${new Date(applicableRules.date).toLocaleDateString('en-US', {month: 'short', day: 'numeric'}).toUpperCase()} ${applicableRules.electionType} -- NEW VOTERS - ${getRuleLanguage(applicableRules, 'Registration', voterRegistrationStatus)} REGISTERED VOTERS - ${getRuleLanguage(applicableRules, 'Ballot Request', voterRegistrationStatus)} - See all your states deadlines at www.votefromabroad.org/${applicableRules.state}`
    }
  }
}

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
    // VueMarkdown,
    ScrollUp
  },
  async asyncData ({app, store}) {
    let state = store.getters['requests/getCurrent'] && store.getters['requests/getCurrent'].leo ? store.getters['requests/getCurrent'].leo.s : ''
    // let state = store.getters['requests/getCurrent'].leo.s || ''
    let elections = (await app.$content('/elections').get('elections')).body
    let voterRegistrationStatus = store.getters['requests/getCurrent'].isRegistered || null
    let voterType = store.getters['requests/getCurrent'].voterClass || null
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
      elections: elections,
      deadlineLanguage: getDeadlineLanguage(elections, state, voterRegistrationStatus, voterType, null)
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
      axios.get(encodeURI(`/api/fpca?firstName=${this.firstName || ''}&lastName=${this.lastName || ''}&middleName=${this.middleName || ''}&suffix=${this.suffix || ''}&ssn=${this.ssn || ''}&previousName=${this.previousName.previousName || ''}&dob=${this.dob || ''}&stateId=${this.stateId || ''}&votStreet=${this.votStreet || ''}&votApt=${this.votApt || ''}&votCity=${this.votCity || ''}&votState=${this.votState || ''}&votCounty=${this.votCounty || ''}&votZip=${this.votZip || ''}&abrAdr=${this.abrAdr && this.abrAdr.alt1 ? this.abrAdr.alt1 : ''}\n${this.abrAdr && this.abrAdr.alt2 ? this.abrAdr.alt2 : ''}\n${this.abrAdr && this.abrAdr.alt3 ? this.abrAdr.alt3 : ''}\n${this.abrAdr && this.abrAdr.alt4 ? this.abrAdr.alt4 : ''}\n${this.abrAdr && this.abrAdr.alt5 ? this.abrAdr.alt5 : ''}&fwdAdr=${this.fwdAdr && this.fwdAdr.alt1 ? this.fwdAdr.alt1 : ''}\n${this.fwdAdr && this.fwdAdr.alt2 ? this.fwdAdr.alt2 : ''}\n${this.fwdAdr && this.fwdAdr.alt3 ? this.fwdAdr.alt3 : ''}\n${this.fwdAdr && this.fwdAdr.alt4 ? this.fwdAdr.alt4 : ''}\n${this.fwdAdr && this.fwdAdr.alt5 ? this.fwdAdr.alt5 : ''}&email=${encodeURIComponent(this.email) || ''}&altEmail=${encodeURIComponent(this.altEmail) || ''}&tel=${this.tel ? encodeURIComponent(this.tel.replace(/\s/g, '')) : ''}&fax=${this.fax ? encodeURIComponent(this.fax.replace(/\s/g, '')) : ''}&party=${this.party || ''}&addlInfo=${this.addlInfo || ''}&date=${this.date || ''}&class=${this.voterClass || ''}&sex=${this.sex || ''}&recBallot=${this.recBallot || ''}&leoName=${this.leoName || ''}&leoAddress=${this.leoAdr || ''}&leoFax=${this.leoFax || ''}&leoEmail=${this.leoEmail || ''}&leoPhone=${this.leoPhone || ''}&transmitOpts=${this.stateRules.ballotReceiptOptions.join(',')}&deadline=${encodeURIComponent(this.deadlineLanguage)}`), {responseType: 'arraybuffer'})
        .then((response) => {
          let blob = new Blob([response.data], {type: 'application/pdf'})
          this.msPdf = blob
          this.pdf = window.URL.createObjectURL(blob)
        })
    }
  },
  filters: {
    markdown: function (md) {
      return snarkdown(md)
    }
  },
  methods: {
    scrollUp () { window.scrollTo(0, 0) },
    saveFile: function () {
      fileSaver.saveAs(this.msPdf, `${this.firstName}-${this.lastName}-2018-fpca.pdf`)
      this.confirmPdfDownload()
    },
    md: function (md) { return snarkdown(md) },
    // signatureAgree () { // unused
    //   this.$store.dispatch('requests/recordAnalytics', {event: 'start digital signature'})
    //   this.$dialog.confirm({
    //     title: this.$t('request.sig.affirmation'),
    //     message: `<h1 class="title is-5">I swear or affirm, under penalty of perjury that:</h1>
    //     <div class="content">
    //     <ul>
    //       <li>The information on this form is true, accurate, and complete to the best of my knowledge. I understand that a material misstatement of fact in completion of this document may constitute grounds for conviction of perjury.</li>
    //       <li>I am a U.S. citizen, at least 18 years of age (or will be by the day of the election), eligible to vote in the requested jurisdiction, and</li>
    //       <li>I am not disqualified to vote due to having been convicted of a felony or other disqualifying offense, nor have I been adjudicated mentally incompetent; or if so, my voting rights have been reinstated; and</li>
    //       <li>I am not registering, requesting a ballot, or voting in any other jurisdiction in the United States, except the jurisdiction cited in this voting form. </li><ul></div>`,
    //     cancelText: this.$t('request.sig.disagree'),
    //     confirmText: this.$t('request.sig.agree'),
    //     type: 'is-success',
    //     onConfirm: () => { this.signStep = 'instructions' }
    //   })
    // },
    confirmPdfDownload () {
      this.$dialog.alert({
        title: this.$t('request.fpcaDownload.downloadedAlertTitle'),
        message: this.md(this.$t('request.fpcaDownload.downloadedAlertMessage')),
        confirmText: this.$t('request.fpcaDownload.confirmButton'),
        type: 'is-danger',
        hasIcon: true,
        icon: 'download',
        iconPack: 'fas',
        onConfirm: () => this.$router.push(this.localePath('/dashboard'))
      })
    },
    openPdf () {
      this.$dialog.alert({
        title: this.$t('request.fpcaDownload.downloadingAlertTitle'),
        message: this.md(this.$t('request.fpcaDownload.downloadingAlertMessage')),
        confirmText: this.$t('request.fpcaDownload.confirmButton'),
        type: 'is-danger',
        hasIcon: true,
        icon: 'download',
        iconPack: 'fas',
        onConfirm: () => { this.$router.push(this.localePath('/dashboard')); this.openPdfNewWindow() }
      })
    },
    openPdfNewWindow () {
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(this.msPdf)
      } else {
        window.open(this.pdf, `${this.firstName}-${this.lastName}-2018-fpca.pdf`)
      }
      // if (this.needsMsSaveOrOpenBlob) {
      //   window.navigator.msSaveOrOpenBlob(this.msPdf, `${this.firstName}-${this.lastName}-2018-fpca.pdf`)
      // } else {
      //   window.open(this.pdf, '_blank')
      // }
    },
    finish () {
      this.$router.push(this.localePath('/dashboard'))
      this.confirmPdfDownload()
    },
    getFPCA (method) {
      axios.get(encodeURI(`/api/fpca?firstName=${this.firstName || ''}&lastName=${this.lastName || ''}&middleName=${this.middleName || ''}&suffix=${this.suffix || ''}&ssn=${this.ssn || ''}&previousName=${this.previousName.previousName || ''}&dob=${this.dob || ''}&stateId=${this.stateId || ''}&votStreet=${this.votStreet || ''}&votApt=${this.votApt || ''}&votCity=${this.votCity || ''}&votState=${this.votState || ''}&votCounty=${this.votCounty || ''}&votZip=${this.votZip || ''}&abrAdr=${this.abrAdr && this.abrAdr.alt ? this.abrAdr.alt1 : ''}\n${this.abrAdr && this.abrAdr.alt ? this.abrAdr.alt2 : ''}\n${this.abrAdr && this.abrAdr.alt ? this.abrAdr.alt3 : ''}\n${this.abrAdr && this.abrAdr.alt ? this.abrAdr.alt4 : ''}\n${this.abrAdr && this.abrAdr.alt ? this.abrAdr.alt5 : ''}&fwdAdr=${this.fwdAdr ? this.fwdAdr.alt1 : ''}\n${this.fwdAdr ? this.fwdAdr.alt2 : ''}\n${this.fwdAdr ? this.fwdAdr.alt3 : ''}\n${this.fwdAdr ? this.fwdAdr.alt4 : ''}\n${this.fwdAdr ? this.fwdAdr.alt5 : ''}&email=${encodeURIComponent(this.email) || ''}&altEmail=${encodeURIComponent(this.altEmail) || ''}&tel=${this.tel ? encodeURIComponent(this.tel.replace(/\s/g, '')) : ''}&fax=${this.fax ? encodeURIComponent(this.fax.replace(/\s/g, '')) : ''}&party=${this.party || ''}&addlInfo=${this.addlInfo || ''}&date=${this.date || ''}&leoAdr=${this.leoAdr}&class=${this.voterClass || ''}&sex=${this.sex || ''}&recBallot=${this.recBallot || ''}&leoName=${this.leoName || ''}&leoAddress=${this.leoAdr || ''}&leoFax=${this.leoFax || ''}&leoEmail=${this.leoEmail || ''}&leoPhone=${this.leoPhone || ''}&transmitOpts=${this.stateRules.ballotReceiptOptions.join(',')}&deadline=${encodeURIComponent(this.deadlineLanguage)}&method=${method}`), {responseType: 'arraybuffer'})
        .then((response) => {
          // console.log(response)
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
      this.signStep = 'composeMessage'
      // console.log('addsig', this.$refs.fpca.$refs['my-canvas'])
      setTimeout(() => {
        this.fpca = this.$refs.fpca.$refs['my-canvas'].toDataURL()
      }, 800)
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
      let url = '/api/mail'
      let config = { url: url, method: 'post', headers: { 'Content-Type': 'multipart/form-data' }, auth: { username: 'api', password: 'key-44903961cb823b645750fe64358dfc40' } }
      this.$axios.post(url, data, config)
        .then(response => console.log(response))
        .catch(errors => console.log(errors))
    }
  },
  computed: {
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
    pleaseRotate () {
      // return this.signStep === 'instructions'
      return this.$store.state.userauth.device.type === 'mobile' && this.$store.state.userauth.device.orientation === 'portrait' && this.signStep === 'instructions'
    },
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
    abrAdr () { return this.currentRequest && this.currentRequest.abrAdr ? this.currentRequest.abrAdr : null },
    fwdAdr () { return this.currentRequest && this.currentRequest.fwdAdr ? this.currentRequest.fwdAdr : null },
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
    nextDeadline () {
      let electionArr = []
      this.stateElections.forEach(election => Object.entries(election.rules).forEach(([ruleKey, ruleValue]) => ruleValue.forEach(item => {
        let rt
        let st = []
        console.log(item.rule)
        if (typeof item.rule === 'string') {
          rt = ['postmarked by', 'received by', 'sent by', 'no deadline', 'not required', 'signed by', 'signed/postmarked by'].filter(x => item.rule.toLowerCase().includes(x))
          rt = rt.includes('signed/postmarked by') ? 'signed/postmarked by' : rt[0]
          if (/email/.test(item.rule.toLowerCase()) || !/mail|email|fax/.test(item.rule.toLowerCase())) st.push('email')
          if (/fax/.test(item.rule.toLowerCase()) || !/mail|email|fax/.test(item.rule.toLowerCase())) st.push('fax')
          if (/mail/.test(item.rule.toLowerCase()) || !/mail|email|fax/.test(item.rule.toLowerCase())) st.push('mail')
        } else {
          rt = 'received by'
          st = ['mail', 'email', 'fax']
        }
        electionArr.push({
          electionType: election.electionType,
          electionDate: election && election.date && election.date.substr(0, 4) === '2018' ? new Date(election.date) : null,
          requestType: ruleKey,
          ruleType: rt,
          submitType: st,
          voterType: typeof item.voterType === 'string' ? item.voterType : 'All',
          ruleDate: item && item.date && item.date.substr(0, 4) === '2018' ? new Date(item.date) : null
        })
      })))
      console.log(electionArr)
      let importantE
      if (this.voterClass && Boolean(this.voterClass === 'military' || this.voterClass === 'milSpouse' || this.voterClass === 'natGuard')) {
        importantE = electionArr.filter(x => x.voterType.indexOf('Citizen') === -1)
      } else {
        importantE = electionArr.filter(x => x.voterType.indexOf('Uniformed') === -1)
      }
      console.log(importantE.filter(({requestType}) => requestType !== 'Ballot Return').filter(x => x.ruleDate > new Date()).sort((a, b) => a.ruleDate - b.ruleDate).slice(0, 2))
      if (this.isRegistered === 'registered') {
        importantE = importantE.filter(x => x.requestType === 'Ballot Request').filter(x => x.ruleDate > new Date()).sort((a, b) => a.ruleDate - b.ruleDate)
        console.log(importantE, importantE.length)
        importantE = importantE[0]
        return `IMPORTANT: As a registered voter, your form must be ${/deadline|required/.test(importantE.ruleType) ? 'received by election day ' : importantE.ruleType + ' ' + importantE.ruleDate.toLocaleDateString('en-US', {month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'})} to be eligible to vote in the ${importantE.electionDate.toLocaleDateString('en-US', {month: 'long', day: 'numeric'})} ${importantE.electionType}. See all your state deadlines and submission options at www.votefromabroad.org/states/${this.state}`
      } else if (this.isRegistered === 'notRegistered') {
        importantE = importantE.filter(x => x.requestType === 'Registration').filter(x => x.ruleDate > new Date()).sort((a, b) => a.ruleDate - b.ruleDate)[0]
        return `IMPORTANT: As a new voter, your form must be ${/deadline|required/.test(importantE.ruleType) ? 'received by election day ' : importantE.ruleType + ' ' + importantE.ruleDate.toLocaleDateString('en-US', {month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'})} to be eligible to vote in the ${importantE.electionDate.toLocaleDateString('en-US', {month: 'long', day: 'numeric'})} ${importantE.electionType}. See all your state deadlines and submission options at www.votefromabroad.org/states/${this.state}`
      } else {
        importantE = importantE.filter(x => x.requestType !== 'Ballot Return') // .filter(x => x.ruleDate > new Date()).sort((a, b) => a.ruleDate - b.ruleDate).slice(0, 2)
        let reg = importantE.filter(x => x.requestType === 'Registration')[0]
        let req = importantE.filter(x => x.requestType === 'Ballot Request')[0]
        if (/deadline|required/.test(reg.ruleType) && /deadline|required/.test(req.ruleType)) {
          return `IMPORTANT: Your form must be received by election day ${req.electionDate.toLocaleDateString('en-US', {month: 'long', day: 'numeric'})} ${req.electionType}.`
        } else if (/deadline|required/.test(reg.ruleType)) {
          return `IMPORTANT: There is no deadline for voter registration, but your ballot request must be ${/deadline|required/.test(req.ruleType) ? 'received by election day' : req.ruleType + ' ' + req.ruleDate.toLocaleDateString('en-US', {month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'})} to receive a ballot for the ${req.electionDate.toLocaleDateString('en-US', {month: 'long', day: 'numeric'})} ${req.electionType}. See all your state deadlines and submission options at www.votefromabroad.org/states/${this.state}`
        } else if (/deadline|required/.test(req.ruleType)) {
          return `IMPORTANT: If you are not yet registered, your form must be ${reg.ruleType} ${reg.ruleDate.toLocaleDateString('en-US', {month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'})}. If you are already registered, there is no deadline for a ballot request, but we recommend sending your request early to receive a ballot for the ${req.electionDate.toLocaleDateString('en-US', {month: 'long', day: 'numeric'})} ${req.electionType}. See all your state deadlines and submission options at www.votefromabroad.org/states/${this.state}`
        } else return `IMPORTANT: If you are not yet registered, your form must be ${reg.ruleType} ${reg.ruleDate.toLocaleDateString('en-US', {month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'})}. If you are already registered, your ballot request must be ${req.ruleType} ${req.ruleDate.toLocaleDateString('en-US', {month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'})} to receive a ballot for the ${req.electionDate.toLocaleDateString('en-US', {month: 'long', day: 'numeric'})} ${req.electionType}. See all your state deadlines and submission options at www.votefromabroad.org/states/${this.state}`
      }
    },
    ...mapState({
      currentRequestIndex: state => state.requests.currentRequest,
      requests: state => state.requests.requests
    }),
    ...mapGetters('requests', ['getCurrent'])
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
