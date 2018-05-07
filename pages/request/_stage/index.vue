<template>
<div class="column is-12 is-8-desktop is-7-widescreen is-6-fullhd">
<section class="section">
    <h1 class="has-text-centered title is-3">{{ $t('request.stages.step', {step: stage.order})}}</h1>
    <h3 class="has-text-centered subtitle is-4">{{ $t(`request.stages.stage${stage.order}`)}}</h3>
<!-- your information -->
  <section v-if="stage.slug === 'your-information'">

      <!-- firstName -->
      <b-field :type="($v.firstName.$error ? 'is-danger': '')" :message="$v.firstName.$error ? Object.keys($v.firstName.$params).map(x => $t(`request.firstName.messages.${x}`)) : '' " :label="$t('request.firstName.label')">
        <b-input v-model="firstName"
          @input="delayTouch($v.firstName)"
          autocomplete="given-name"
          ref="firstName"></b-input>
      </b-field>

      <!-- middleName -->
      <b-field :type="($v.middleName.$error ? 'is-danger': '')" :message="$v.middleName.$error ? Object.keys($v.middleName.$params).map(x => x) : '' " :label="$t('request.middleName.label')">
        <b-input v-model="middleName" @input="$v.middleName.$touch()" autocomplete="additional-name"></b-input>
      </b-field>

      <!-- lastName -->
      <b-field :type="($v.lastName.$error ? 'is-danger': '')" :message="$v.lastName.$error ? Object.keys($v.lastName.$params).map(x => $t(`request.lastName.messages.${x}`)) : '' " :label="$t('request.lastName.label')">
        <b-input v-model="lastName"
          @input="delayTouch($v.lastName)"
          autocomplete="family-name"
          ref="lastName"></b-input>
      </b-field>

      <!-- suffix -->
      <b-field :type="($v.suffix.$error ? 'is-danger': '')" :message="$v.suffix.$error ? Object.keys($v.suffix.$params).map(x => x) : '' " :label="$t('request.suffix.label')">
        <b-input v-model="suffix" @input="$v.suffix.$touch()" autocomplete="honorific-suffix"></b-input>
      </b-field>

      <previous-name v-model="previousName"
        :type="($v.previousName.$error ? 'is-danger': '')"
        :message="$v.previousName.$error ? Object.keys($v.previousName.$params).map(x => x) : '' "
        :label="$t('request.previousName.label')"
        :instructions="$t('request.previousName.instructions')"
        :tooltipTitle="$t('request.previousName.tooltipTitle')"
        @input="$v.previousName.$touch()">
        <div slot="tooltip">
          {{$t('request.previousName.tooltip')}}
        </div>
        <!-- tooltipTitle="Why do you need my previous name?"         -->
      </previous-name>

      <!-- phone Number -->
      <tel-input
        key="tel"
        :label="$t('request.tel.label')"
        ref="tel"
        @input="delayTouch($v.tel)"
        :type="($v.tel.$error ? 'is-danger': '')"
        :message="$v.tel.$error ? Object.keys($v.tel.$params).map(x => x === 'validPhone' ? 'Please enter a valid phone number': x) : [] "
        v-model="tel"></tel-input>

        <!-- emailAddress -->
      <b-field
      :type="($v.email.$error ? 'is-danger': '')"
      :message="$v.email.$error ? Object.keys($v.email.$params).map(x => $t(`request.email.messages.${x}`)) : '' "
      :label="$t('request.email.label')">
        <b-input v-model="email"
          @input="delayTouch($v.email)"
          autocomplete="email"
          ref="email"></b-input>
      </b-field>

      <!-- countryName -->
      <address-input
        :label="$t('request.abrAdr.label')"
        key="overseas"
        ref="abrAdr"
        v-model="abrAdr"
        @input="delayTouch($v.abrAdr)"
        :validations=$v.abrAdr
        :toolTipTitle="$t('request.abrAdr.tooltipTitle')">
        <!-- toolTipTitle="Where are you now?" -->
        <div slot="instructions">
          <p>{{$t('request.abrAdr.instructions')}}</p>
        </div>
        <div slot="tooltip">
          <vue-markdown>{{$t('request.abrAdr.tooltip')}}</vue-markdown>
        </div>
      </address-input>
      <scroll-up :key="$route.params.stage"></scroll-up>
    <section >
        <nuxt-link :to="localePath({ name: 'index' })" class="button is-light is-medium is-pulled-left" exact ><b-icon pack="fas" icon="caret-left"></b-icon><span>{{$t('request.stages.back')}}</span></nuxt-link>
        <!-- <nuxt-link :to="localePath({ name: 'request-stage', params: { stage: 'voting-information'} })" class="button is-primary is-medium is-pulled-right" exact ><span> Next </span><b-icon pack="fas" icon="caret-right"></b-icon></nuxt-link> -->
        <button @click="focusFirstErrorOrAdvance(localePath({ name: 'request-stage', params: {stage: 'voting-information'} }))" class="button is-primary is-medium is-pulled-right" exact ><span> {{$t('request.stages.next')}} </span><b-icon pack="fas" icon="caret-right"></b-icon></button>
    </section>
  </section>

<!-- voting information -->
  <section v-if="stage.slug === 'voting-information'">

      <voting-address
        :label="$t('request.votAdr.label')"
        :validations=$v.votAdr
        ref="votAdr"
        @input="delayTouch($v.votAdr)"
        autocomplete="off"
        :toolTipTitle="$t('request.votAdr.tooltipTitle')">
        <!-- toolTipTitle="Your last US Address" -->
        <div slot="instructions">
          <p>{{ $t('request.votAdr.instructions') }}</p>
        </div>
        <div slot="tooltip">
          <vue-markdown>{{$t('request.votAdr.tooltip')}}</vue-markdown>
        </div>
      </voting-address>

      <jurisdiction v-if="votAdr && votAdr.stateISO"
        :label="$t('request.jurisdiction.label')"
        :toolTipTitle="$t('request.jurisdiction.tooltipTitle')"
        :placeholder="$t('request.jurisdiction.placeholder')"
        :key="votAdr.stateISO"
        ref="jurisdiction"
        autocomplete="off"
        @input="delayTouch($v.jurisdiction)"
        :validations="($v.jurisdiction)"
        :state="this.votAdr.stateISO">
                <!-- toolTipTitle="Jurisdiction help" -->
        <div slot="instructions">
          <p>{{$t('request.jurisdiction.instructions')}}</p>
        </div>
        <div slot="tooltip">
          <vue-markdown>{{$t('request.jurisdiction.tooltip')}}</vue-markdown>
        </div>
      </jurisdiction>

    <voter-class v-model="voterClass"
      :allowsNeverResided="stateRules ? stateRules.allowsNeverResided : false"
      :validations="($v.voterClass)"
      @input="delayTouch($v.voterClass)"
      :toolTipTitle="$t('request.voterClass.tooltipTitle')">
      <!-- toolTipTitle="Intend to return vs. Return is uncertain" -->
      <div slot="tooltip">
        <vue-markdown>{{$t('request.voterClass.tooltip')}}</vue-markdown>
      </div>
    </voter-class>

      <!-- isRegistered -->
    <is-registered
      v-if="votAdr && jurisdiction && jurisdiction.j && jurisdiction.t"
      :label="$t('request.isRegistered.label', {jurisdiction: jurisdiction.t === 'All' ? jurisdiction.s : jurisdiction.j + ' ' + jurisdiction.t})"
      :validations="($v.isRegistered)"
      @input="delayTouch($v.isRegistered)"
      v-model="isRegistered">
    </is-registered>

    <!-- recBallot -->
    <receive-ballot v-model="recBallot"
      v-if="votAdr && votAdr.stateISO"
      :label="$t('request.receiveBallot.label')"
      :validations="$v.recBallot"
      @input="delayTouch($v.recBallot)"
      :ballotReceiptOptions="stateRules ? stateRules.ballotReceiptOptions : ['Mail']"
      :toolTipTitle="$t('request.receiveBallot.tooltipTitle')">
      <!-- toolTipTitle="What is the best choice?"> -->
      <div slot="tooltip">
        <vue-markdown>{{$t('request.receiveBallot.tooltip')}}</vue-markdown>
      </div>
    </receive-ballot>

    <tel-input
      key="fax"
      :label="$t('request.fax.label')"
      :type="($v.fax.$error ? 'is-danger': '')"
      :message="$v.fax.$error ? Object.keys($v.fax.$params).map(x => x) : '' "
      v-if="recBallot === 'fax'"
      @input="$v.fax.$touch()"
      v-model="fax">
    </tel-input>

    <!-- altEmail -->
    <b-field
      :type="($v.altEmail.$error ? 'is-danger': '')"
      :message="$v.altEmail.$error ? Object.keys($v.altEmail.$params).map(x => $t(`request.email.messages.${x}`)) : '' "
      v-if="recBallot === 'email'"
      :label="$t('request.altEmail.label')">
      <b-input v-model="altEmail"
        ref="altEmail"
        autocomplete="email"
        @input="$v.altEmail.$touch()"></b-input>
    </b-field>

      <!-- fwdAdr -->
      <!-- <forwarding-address v-model="fwdAdr"
        :label="$t('request.fwdAdr.label')"
        toolTipTitle="Optional"
        v-if="recBallot === 'mail'">
        <div slot="tooltip">
          <vue-markdown>{{$t('request.fwdAdr.tooltip')}}</vue-markdown>
        </div>
      </forwarding-address> -->
      <address-input
        :label="$t('request.fwdAdr.label')"
        key="forwardingAddress"
        ref="fwdAdr"
        v-if="recBallot === 'mail'"
        v-model="fwdAdr"
        @input="delayTouch($v.fwdAdr)"
        :validations=$v.fwdAdr
        :tooltipTitle="$t('request.fwdAdr.tooltipTitle')">
        <!-- toolTipTitle="Optional"> -->
        <div slot="instructions">
          <p>{{$t('request.fwdAdr.instructions')}}</p>
        </div>
        <div slot="tooltip">
          <vue-markdown>{{$t('request.fwdAdr.tooltip')}}</vue-markdown>
        </div>
      </address-input>

    <scroll-up :key="$route.params.stage"></scroll-up>

    <section >
        <nuxt-link :to="localePath({ name: 'request-stage', params: { stage: 'your-information'} })" class="button is-light is-medium is-pulled-left" exact ><b-icon pack="fas" icon="caret-left"></b-icon><span>{{$t('request.stages.back')}}</span></nuxt-link>
        <button @click="focusFirstErrorOrAdvance(localePath({ name: 'request-stage', params: { stage: 'id-and-contact-information'} }))" class="button is-primary is-medium is-pulled-right" exact ><span> {{$t('request.stages.next')}} </span><b-icon pack="fas" icon="caret-right"></b-icon></button>
    </section>
  </section>

  <section v-if="stage.slug === 'id-and-contact-information'">
<!-- identity and Contact information -->
      <!-- dob -->
      <birth-date
        :validations="$v.dob"
        ref="dob"
        :tooltipTitle="$t('request.dob.tooltipTitle')"
        @input="delayTouch($v.dob)">
        <div slot="tooltip">
          <vue-markdown>{{$t('request.dob.tooltip')}}</vue-markdown>
        </div>
      </birth-date>

      <!-- gender -->
      <gender
        :label="$t('request.sex.label')"
        :tooltipTitle="$t('request.sex.tooltipTitle')"
        v-model="sex">
        <!-- toolTipTitle="Why is this required?"         -->
        <div slot="tooltip">
          <vue-markdown>{{$t('request.sex.tooltip')}}</vue-markdown>
        </div>
      </gender>

      <!-- party -->
      <party
        :label="$t('request.party.label')"
        v-model="party"
        :tooltipTitle="$t('request.party.tooltipTitle')"
        :message="$v.party.$error ? Object.keys($v.party.$params).map(x => x) : '' "
        :type="($v.party.$error ? 'is-danger': '')">
        <!-- toolTipTitle="What is this?" -->
        <div slot="tooltip">
          <vue-markdown>{{$t('request.party.tooltip')}}</vue-markdown>
        </div>
      </party>

      <transition name="fade">
      <join-democratsabroad
        v-model="joinDa"
        v-if="party!=='Republican' && party && !$store.state.userauth.user.isDA"
        :tooltipTitle="$t('request.joinDa.tooltipTitle')"
        :label="$t('request.joinDa.label')">
        <div slot="tooltip">
          <vue-markdown>{{$t('request.joinDa.tooltip')}}</vue-markdown>
        </div>
      </join-democratsabroad>
      </transition>

      <state-special
        :label="$t('request.stateSpecial.label', {state: stateRules && stateRules.state ? stateRules.state: 'State'})"
        v-model="stateSpecial"
        :state="votAdr && votAdr.stateISO ? votAdr.stateISO : ''"
        :isFWAB="isFWAB"
        :isIndNoParty="party && (party.toLowerCase() === 'republican' || party.toLowerCase() === 'rep' || party.toLowerCase() === 'democrat' || party.toLowerCase() === 'dem') ? false : true"
        :isReturnUncertain="Boolean(voterClass === 'uncertainReturn')"
        :isRegistering="Boolean(isRegistered === 'notRegistered' || isRegistered === 'unsure')">
      </state-special>

      <!-- identification -->
      <identification
        v-if="stateRules"
        :label="$t('request.id.label')"
        :idOptions="stateRules && stateRules.id && stateRules.id.length > 0 ? stateRules.id : null"
        :validations="($v.identification)"
        ref="id"
        @input="delayTouch($v.identification)"
        :tooltipTitle="$t('request.id.tooltipTitle')"
        v-model="identification">
        <!-- :tooltipTitle="`Why am I being asked this?`" -->
        <div slot="instructions">
          <i18n v-if="stateRules && stateRules.id && stateRules.id.length === 0"
            path=request.id.instructionsOptional tag="vue-markdown" :places="{ state: stateRules.state}">
          </i18n>
          <i18n v-else-if="stateRules && stateRules.id && stateRules.id.length === 1" path=request.id.instructionsReq1 tag="vue-markdown" :places="{ state: stateRules.state, id: $t(`request.id.${stateRules.id[0]}`), idType: $t(`request.id.${stateRules.id[0].indexOf('SSN') > -1 ? 'SSN' : stateRules.id[0]}`)}">
          </i18n>
          <i18n v-else path=request.id.instructionsReq2 tag="vue-markdown" :places="{ state: stateRules.state, allButLastTypes: allButLastIdType, lastType: lastIdType }">
          </i18n>
        </div>
        <div slot="tooltip">
          <i18n v-if="stateRules && stateRules.id && stateRules.id.length === 0"
            path=request.id.tooltipOptional tag="vue-markdown" :places="{ state: stateRules.state}">
          </i18n>
          <i18n v-else-if="stateRules && stateRules.id && stateRules.id.length === 1" path=request.id.tooltipReq1 tag="vue-markdown" :places="{ state: stateRules.state, id: $t(`request.id.${stateRules.id[0]}`)}">
          </i18n>
          <i18n v-else path=request.id.tooltipReq2 tag="vue-markdown" :places="{ state: stateRules.state, allButLastTypes: allButLastIdType, lastType: lastIdType }">
          </i18n>
        </div>
      </identification>

      <!-- fwabRequest -->
      <b-field :type="($v.fwabRequest.$error ? 'is-danger': '')"
        :message="$v.fwabRequest.$error ? Object.keys($v.fwabRequest.$params).map(x => x) : '' "
        label="Do you want to register and request a ballot for all elections you are eligile to vote in?"
        v-if="isFwab">
        <b-input v-model="fwabRequest" @input="$v.fwabRequest.$touch()"></b-input>
      </b-field>

      <scroll-up :key="$route.params.stage"></scroll-up>
    <section >
      <nuxt-link :to="localePath({ name: 'request-stage', params: { stage: 'voting-information'} })" class="button is-light is-medium is-pulled-left" exact ><b-icon pack="fas" icon="caret-left"></b-icon><span>{{$t('request.stages.back')}}</span></nuxt-link>
      <button @click="focusFirstErrorOrAdvance(localePath({ name: 'request-stage', params: { stage: 'review'} }))" class="button is-primary is-medium is-pulled-right" exact ><span> {{$t('request.stages.next')}} </span><b-icon pack="fas" icon="caret-right"></b-icon></button>
      <!-- <nuxt-link :to="localePath({ name: 'request-stage', params: { stage: 'review'} })" class="button is-primary is-medium is-pulled-right" exact ><span> Generate &amp; review your form </span><b-icon pack="fas" icon="caret-right"></b-icon></nuxt-link> -->
    </section>
  </section>
</section>
</div>
</template>

<script>
import { required, requiredIf, email } from 'vuelidate/lib/validators'
import AddressInput from '~/components/AddressInput'
import UsAddress from '~/components/USAddress'
import Jurisdiction from '~/components/Jurisdiction'
import VotingAddress from '~/components/VotingAddress'
import VoterClass from '~/components/VoterClass'
import IsRegistered from '~/components/IsRegistered'
import ReceiveBallot from '~/components/ReceiveBallot'
import TelInput from '~/components/TelInput'
import ForwardingAddress from '~/components/ForwardingAddress'
import BirthDate from '~/components/BirthDate'
import Party from '~/components/Party'
import JoinDemocratsabroad from '~/components/JoinDemocratsabroad'
import PreviousName from '~/components/PreviousName'
import Gender from '~/components/Gender'
import StateSpecial from '~/components/StateSpecial'
import ScrollUp from '~/components/ScrollUp'
import Identification from '~/components/Identification'
import AdditionalInfo from '~/components/AdditionalInfo'
import VueMarkdown from 'vue-markdown'

const touchMap = new WeakMap()

export default {
  transition: 'test',
  scrollToTop: true,
  middleware: 'verify-request',
  mounted () {
    // console.log(this.$v)
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
      code: null,
      pendingVerification: null,
      type: 'email',
      emailOrPhoneLink: null,
      createdAt: '',
      updatedAt: '',
      createdBy: '',
      emailOrPhone: '',
      localDob: null,
      localDate: null,
      fwabRequest: '',
      isFwab: false,
      isOpen: false,
      // joinDa: null,
      prty: ''
    }
  },
  components: {
    AddressInput,
    UsAddress,
    VotingAddress,
    Jurisdiction,
    VoterClass,
    IsRegistered,
    ReceiveBallot,
    TelInput,
    ForwardingAddress,
    BirthDate,
    Party,
    JoinDemocratsabroad,
    PreviousName,
    Gender,
    StateSpecial,
    ScrollUp,
    Identification,
    AdditionalInfo,
    VueMarkdown
  },
  computed: {
    stateRules () {
      if (this.votAdr && this.votAdr.stateISO) {
        return this.allStateRules.find(x => x.iso.toLowerCase() === this.votAdr.stateISO.toLowerCase())
      } else {
        return undefined
      }
    },
    allButLastIdType () {
      return this.stateRules.id.length > 2
        ? this.stateRules.id.slice(0, this.stateRules.id.length - 1).map(x => this.$t(`request.id.${x}`)).join(', ')
        : this.$t(`request.id.${this.stateRules.id[0]}`)
    },
    lastIdType () {
      return this.$t(`request.id.${this.stateRules.id.slice(-1)[0]}`)
    },
    idTypesString () {
      let arr = this.stateRules & this.stateRules.id.length > 0 ? this.stateRules.id : ['SSN4', 'StateID']
      return arr.map(x => this.$t(`request.id['${x}']`))
        .map((x, i, a) => {
          switch (a.length - i) {
            case 1:
              return x
            case 2:
              return `${x} or `
            default:
              return `${x}, `
          }
        })
    },
    stage () {
      switch (this.$route.params.stage) {
        case 'your-information':
          return {order: 1, name: 'Your Information', slug: this.$route.params.stage}
        case 'voting-information':
          return {order: 2, name: 'Voting Information', slug: this.$route.params.stage}
        case 'id-and-contact-information':
          return {order: 3, name: 'ID & Contact Information', slug: this.$route.params.stage}
        default:
          return {order: 4, name: 'unknown stage', slug: this.$route.params.stage}
      }
    },
    currentRequest () {
      return this.$store.state.requests.currentRequest
    },
    currentRequestObject () {
      return this.$store.getters['requests/getCurrent']
    },
    requests: function () {
      return this.$store.state.requests.requests
    },
    isAuthenticated: function () {
      return this.$store.getters['userauth/isAuthenticated']
    },
    user: function () {
      return this.$store.state.userauth.user
    },
    email: {
      // get () { return this.requests[this.currentRequest] ? this.requests[this.currentRequest].email : null },
      get () { return this.currentRequestObject.email || null },
      set (value) { this.$store.commit('requests/update', { email: value }) }
    },
    firstName: {
      // get () { return this.requests[this.currentRequest] ? this.requests[this.currentRequest].firstName : null },
      get () { return this.currentRequestObject.firstName || null },
      set (value) { this.$store.commit('requests/update', { firstName: value }) }
    },
    middleName: {
      // get () { return this.requests[this.currentRequest] && this.requests[this.currentRequest].middleName ? this.requests[this.currentRequest].middleName : null },
      get () { return this.currentRequestObject.middleName || null },
      set (value) { this.$store.commit('requests/update', { middleName: value }) }
    },
    lastName: {
      // get () { return this.requests[this.currentRequest] && this.requests[this.currentRequest].lastName ? this.requests[this.currentRequest].lastName : null },
      get () { return this.currentRequestObject.lastName || null },
      set (value) { this.$store.commit('requests/update', { lastName: value }) }
    },
    previousName: {
      // get () { return this.requests[this.currentRequest] ? this.requests[this.currentRequest].previousName : {usesPreviousName: false, previousName: null} },
      get () { return this.currentRequestObject.previousName || null },
      set (value) { this.$store.commit('requests/update', { previousName: value }) }
    },
    suffix: {
      // get () { return this.requests[this.currentRequest] && this.requests[this.currentRequest].suffix ? this.requests[this.currentRequest].suffix : null },
      get () { return this.currentRequestObject.suffix || null },
      set (value) { this.$store.commit('requests/update', { suffix: value }) }
    },
    dob: {
      get () { return this.requests[this.currentRequest] && this.requests[this.currentRequest].dob ? this.requests[this.currentRequest].dob : null },
      set (value) { this.$store.commit('requests/update', { dob: value }) }
    },
    date: {
      get () { return this.requests[this.currentRequest] ? this.requests[this.currentRequest].date : null },
      set (value) { this.$store.commit('requests/update', { date: value }) }
    },
    tel: {
      get () { return this.requests[this.currentRequest] ? this.requests[this.currentRequest].tel : {} },
      set (value) { this.$store.commit('requests/update', { tel: value }) }
    },
    votAdr: {
      get () { return this.requests[this.currentRequest] ? this.requests[this.currentRequest].votAdr : null },
      set (value) { this.$store.commit('requests/update', {votAdr: value}) }
    },
    // jurisdiction () { return this.leo && this.leo.n ? this.leo.n : '' },
    jurisdiction () { return this.requests[this.currentRequest] ? this.requests[this.currentRequest].leo : null },
    abrAdr: {
      get () { return this.requests[this.currentRequest] ? this.requests[this.currentRequest].abrAdr : null },
      set (value) { this.$store.commit('requests/update', {abrAdr: value}) }
    },
    voterClass: {
      get () { return this.requests[this.currentRequest] ? this.requests[this.currentRequest].voterClass : null },
      set (value) { this.$store.commit('requests/update', {voterClass: value}) }
    },
    identification: {
      get () { return this.requests[this.currentRequest] && this.requests[this.currentRequest].identification ? this.requests[this.currentRequest].identification : {noId: false, ssn: null, ssnTyped: null, stateId: null} },
      set (value) { this.$store.commit('requests/update', {identification: value}) }
    },
    ssn: {
      get () { return this.requests[this.currentRequest] ? this.requests[this.currentRequest].ssn : null },
      set (value) { this.$store.commit('requests/update', {ssn: value}) }
    },
    sex: {
      get () { return this.requests[this.currentRequest] ? this.requests[this.currentRequest].sex : null },
      set (value) { this.$store.commit('requests/update', {sex: value}) }
    },
    party: {
      get () { return this.currentRequestObject ? this.currentRequestObject.party || '' : '' },
      set (value) { this.$store.commit('requests/update', {party: value}) }
    },
    fax: {
      get () { return this.requests[this.currentRequest] ? this.requests[this.currentRequest].fax : null },
      set (value) { this.$store.commit('requests/update', {fax: value}) }
    },
    altEmail: {
      get () { return this.requests[this.currentRequest] && this.requests[this.currentRequest].altEmail ? this.requests[this.currentRequest].altEmail : null },
      set (value) { this.$store.commit('requests/update', {altEmail: value}) }
    },
    isRegistered: {
      get () { return this.requests[this.currentRequest] ? this.requests[this.currentRequest].isRegistered : null },
      set (value) { this.$store.commit('requests/update', {isRegistered: value}) }
    },
    recBallot: {
      get () { return this.requests[this.currentRequest] ? this.requests[this.currentRequest].recBallot : null },
      set (value) { this.$store.commit('requests/update', {recBallot: value}) }
    },
    stateId: {
      get () { return this.requests[this.currentRequest] ? this.requests[this.currentRequest].stateId : null },
      set (value) { this.$store.commit('requests/update', {stateId: value}) }
    },
    fwdAdr: {
      get () { return this.requests[this.currentRequest] ? this.requests[this.currentRequest].fwdAdr : null },
      set (value) { this.$store.commit('requests/update', {fwdAdr: value}) }
    },
    addlInfo: {
      get () { return this.requests[this.currentRequest] ? this.requests[this.currentRequest].addlInfo : null },
      set (value) { this.$store.commit('requests/update', {addlInfo: value}) }
    },
    stateSpecial: {
      get () { return this.requests[this.currentRequest] ? this.requests[this.currentRequest].stateSpecial : null },
      set (value) { this.$store.commit('requests/update', {stateSpecial: value}) }
    },
    joinDa: {
      get () { return this.requests[this.currentRequest] ? this.requests[this.currentRequest].joinDa : null },
      set (value) { this.$store.commit('requests/update', {joinDa: value}) }
    },
    isFWAB: {
      get () { return this.requests[this.currentRequest] ? this.requests[this.currentRequest].isFWAB : false },
      set (value) { this.$store.commit('requests/update', {isFWAB: value}) }
    },
    countryValidations: function () {
      return [
        {
          field: 'country',
          type: 'is-danger',
          message: 'you must add a country'
        }
      ]
    }
  },
  methods: {
    focusName () {
      this.$refs.userinput.focus()
    },
    focusFirstErrorOrAdvance (nextPage) {
      switch (this.$route.params.stage) {
        case 'your-information':
          this.$v.firstName.$touch()
          this.$v.lastName.$touch()
          this.$v.email.$touch()
          this.$v.tel.$touch()
          this.$v.abrAdr.$touch()
          break
        case 'voting-information':
          this.$v.votAdr.$touch()
          this.$v.jurisdiction.$touch()
          this.$v.voterClass.$touch()
          this.$v.isRegistered.$touch()
          this.$v.recBallot.$touch()
          this.$v.altEmail.$touch()
          break
        case 'id-and-contact-information':
          this.$v.dob.$touch()
          this.$v.identification.$touch()
          break
      }

      switch (true) {
        case this.stage.slug === 'your-information' && this.$v.firstName.$error:
          this.$store.dispatch('requests/recordAnalytics', { event: 'Form Error', attributes: { field: 'firstName' } })
          console.log('Form Error', {field: 'firstName'})
          this.$refs.firstName.focus()
          break
        case this.stage.slug === 'your-information' && this.$v.lastName.$error:
          this.$refs.lastName.focus()
          this.$store.dispatch('requests/recordAnalytics', { event: 'Form Error', attributes: { field: 'lastName' } })
          break
        case this.stage.slug === 'your-information' && this.$v.email.$error:
          this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'email'}})
          this.$refs.email.focus()
          break
        case this.stage.slug === 'your-information' && this.$v.abrAdr.country.$error:
          this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'abrAdr.country'}})
          this.$refs.abrAdr.$refs.country.focus()
          break
        case this.stage.slug === 'your-information' && this.$v.abrAdr.thoroughfare.$error:
          this.$refs.abrAdr.$refs.thoroughfare.focus()
          this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'abrAdr.thoroughfare'}})
          break
        case this.stage.slug === 'your-information' && this.$v.abrAdr.locality.$error:
          this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'abrAdr.locality'}})
          this.$refs.abrAdr.$refs.locality[0].focus()
          break
        case this.stage.slug === 'your-information' && this.$v.tel.$error:
          this.$refs.tel.$refs.tel.focus()
          this.$store.dispatch('requests/recordAnalytics', { event: 'Form Error', attributes: { field: 'tel' } })
          break
        case this.stage.slug === 'voting-information' && this.$v.votAdr.thoroughfare.$error:
          this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'votAdr.thoroughfare'}})
          this.$refs.votAdr.$refs.street.focus()
          break
        case this.stage.slug === 'voting-information' && this.$v.votAdr.locality.$error:
          this.$refs.votAdr.$refs.city.focus()
          this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'votAdr.locality'}})
          break
        case this.stage.slug === 'voting-information' && this.$v.votAdr.stateISO.$error:
          this.$refs.votAdr.$refs.state.focus()
          this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'votAdr.stateISO'}})
          break
        case this.stage.slug === 'voting-information' && this.$v.votAdr.postalcode.$error:
          this.$refs.votAdr.$refs.zip.focus()
          this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'votAdr.postalcode'}})
          break
        case this.stage.slug === 'voting-information' && this.$v.jurisdiction.$error:
          this.$refs.jurisdiction.$refs.jurisdiction.focus()
          this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'jurisdiction'}})
          break
        case this.stage.slug === 'voting-information' && this.$v.altEmail.$error:
          this.$refs.altEmail.focus()
          this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'altEmail'}})
          break
        case this.stage.slug === 'id-and-contact-information' && this.$v.dob.$error:
          this.$refs.dob.$refs.dob.focus()
          this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'dob'}})
          break
        case this.stage.slug === 'id-and-contact-information' && this.$v.identification.ssn.$error:
          if (this.$refs.id) this.$refs.id.$refs.ssn ? this.$refs.id.$refs.ssn.focus() : this.$refs.id.$refs.ssn4.focus()
          this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'identification.ssn'}})
          break
        case this.stage.slug === 'id-and-contact-information' && this.$v.identification.stateId.$error:
          this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'identification.stateId'}})
          this.$refs.id.$refs.StateId.focus()
          break
        default:
          this.$store.dispatch('requests/recordAnalytics', {event: 'completed: ' + this.stage.slug})
          this.$router.push(nextPage)
          this.$store.dispatch('requests/updateRequest', {status: 'completed: ' + this.stage.slug})
      }
    },
    delayTouch ($v) {
      $v.$reset()
      if (touchMap.has($v)) {
        clearTimeout(touchMap.get($v))
      }
      touchMap.set($v, setTimeout($v.$touch, 1000))
    }
  },
  validations () {
    return {
      email: {
        // required: requiredIf(function () {
        //   return this.recBallot === 'email'
        // }),
        required,
        email
      },
      firstName: {
        required
      },
      middleName: {
      },
      lastName: {
        required
      },
      previousName: {
      },
      suffix: {
      },
      abrAdr: {
        country: { required },
        thoroughfare: { required },
        locality: { required }
      },
      voterClass: {
        required
      },
      votAdr: {
        thoroughfare: { required },
        locality: { required },
        stateISO: { required },
        postalcode: { required }
      },
      jurisdiction: { required },
      recBallot: {
        required
      },
      dob: {
        required
        // minValue: new Date(1880, 0, 1),
        // maxValue: new Date(2000, 10, 6)
      },
      fax: {
      },
      tel: {
        async validPhone () { return this.tel && this.tel.rawInput ? this.tel.isValidPhone : true }
      },
      altEmail: {
        email
      },
      fwabRequest: {
      },
      party: {
      },
      sex: {
      },
      isRegistered: {
        required
      },
      identification: {
        ssn: {
          requiredIf: requiredIf(() => {
            if (!this.stateRules || !this.stateRules.id) {
              return false
            }
            let needsSSN = Boolean(this.stateRules.id.indexOf('SSN') > -1 || this.stateRules.id.indexOf('SSN4') > -1)
            return Boolean(needsSSN && !this.identification.stateId && !this.identification.noId)
          }),
          correctLength () {
            if (this.identification.ssn && this.stateRules && this.stateRules.id) {
              if (this.stateRules.id.indexOf('SSN4') > -1) {
                return this.identification.ssn.length === 4
              } else if (this.stateRules.id.indexOf('SSN') > -1) {
                return this.identification.ssn.length === 9
              }
            } else {
              return true
            }
          }
        },
        stateId: {
          requiredIf: requiredIf((model) => {
            if (!this.stateRules || !this.stateRules.id) {
              return false
            }
            let needsStateId = Boolean(this.stateRules.id.filter(x => x !== 'SSN' || x !== 'SSN4').length > 0)
            return Boolean(needsStateId && !this.identification.ssn && !this.identification.noId)
          })
        }
      },
      // ssn: {
      //   required
      // },
      // stateId: {
      //   required
      // },
      fwdAdr: {
        country: { },
        thoroughfare: { },
        locality: { }
      },
      addlInfo: {
      },
      date: ''
    }
  }
}
</script>
