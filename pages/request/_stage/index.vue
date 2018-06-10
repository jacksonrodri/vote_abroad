<template>
<div class="column is-12 is-8-desktop is-7-widescreen is-6-fullhd">
<section class="section">
    <h1 class="has-text-centered title is-3">{{ $t('request.stages.step', {step: stage.order})}}</h1>
    <h3 class="has-text-centered subtitle is-4">{{ $t(`request.stages.stage${stage.order}`)}}</h3>
<!-- your information -->
  <section v-if="stage.slug === 'your-information'">
    <form id="your-information" key="your-information">
      <!-- firstName -->
      <div class="field">
        <label class="label" for="firstName">{{ $t('request.firstName.label') }}<transition name="fade"><span v-if="!firstName && !$v.firstName.$error" class="required"> Required</span></transition></label>
        <b-field :type="($v.firstName.$error ? 'is-danger': '')" :message="$v.firstName.$error ? Object.keys($v.firstName.$params).map(x => $t(`request.firstName.messages.${x}`)) : '' ">
          <b-input v-model="firstName"
            id="firstName"
            autocomplete="given-name"
            @input="delayTouch($v.firstName)"
            ref="firstName"></b-input>
        </b-field>
            <!-- autocomplete="given-name" -->
      </div>

      <!-- middleName -->
      <div class="field">
        <label class="label" for="middleName">{{ $t('request.middleName.label') }}<transition name="fade"><span v-if="!middleName" class="required"> Optional</span></transition></label>
        <b-field :type="($v.middleName.$error ? 'is-danger': '')" :message="$v.middleName.$error ? Object.keys($v.middleName.$params).map(x => x) : '' ">
          <b-input v-model="middleName" id="middleName" @input="$v.middleName.$touch()" autocomplete="additional-name"></b-input>
        </b-field>
      </div>

      <!-- lastName -->
      <div class="field">
        <label class="label" for="lastName">{{ $t('request.lastName.label') }}<transition name="fade"><span v-if="!lastName && !$v.lastName.$error" class="required"> Required</span></transition></label>
        <b-field :type="($v.lastName.$error ? 'is-danger': '')" :message="$v.lastName.$error ? Object.keys($v.lastName.$params).map(x => $t(`request.lastName.messages.${x}`)) : '' ">
          <b-input v-model="lastName"
            id="lastName"
            @input="delayTouch($v.lastName)"
            autocomplete="family-name"
            ref="lastName"></b-input>
        </b-field>
      </div>

      <!-- suffix -->
      <div class="field">
        <label class="label" for="suffix">{{ $t('request.suffix.label') }}<transition name="fade"><span v-if="!suffix" class="required"> Optional</span></transition></label>
        <b-field :type="($v.suffix.$error ? 'is-danger': '')" :message="$v.suffix.$error ? Object.keys($v.suffix.$params).map(x => x) : '' ">
          <b-input v-model="suffix" id="suffix" @input="$v.suffix.$touch()" autocomplete="honorific-suffix"></b-input>
        </b-field>
      </div>

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
      </previous-name>

      <!-- phone Number -->
      <!-- <tel-input
        key="tel"
        :label="$t('request.tel.label')"
        ref="tel"
        autocomplete="mobile tel"
        @input="delayTouch($v.tel)"
        :type="($v.tel.$error ? 'is-danger': '')"
        :message="$v.tel.$error ? Object.keys($v.tel.$params).map(x => x === 'validPhone' ? 'Please enter a valid phone number': x) : [] "
        v-model="tel"></tel-input> -->

      <phone-input ref="tel" key="telephone" :label="$t('request.tel.label')" :accepts="['phone']" v-model="tel"></phone-input>
      <!-- <phone-input key="phoneEmail"
        required
        :label="$t('homepage.loginInstructions')"
        :accepts="['phone', 'email']"
        toolTipTitle="What is this?"
        v-model="email">
        <div slot="tooltip">
          {{ $t('homepage.tooltip')}}
        </div>
      </phone-input> -->
      <!-- <phone-input key="phone" :label="$t('request.tel.label')" :accepts="['phone']" v-model="phoneTest"></phone-input> -->
      <phone-input key="email" ref="email" :label="$t('request.email.label')" :required="recBallot === 'email'" :accepts="['email']" v-model="email"></phone-input>

        <!-- emailAddress -->
      <!-- <b-field
      :type="($v.email.$error ? 'is-danger': '')"
      :message="$v.email.$error ? Object.keys($v.email.$params).map(x => $t(`request.email.messages.${x}`)) : '' "
      :label="$t('request.email.label')">
        <b-input v-model="email"
          @input="delayTouch($v.email)"
          autocomplete="email"
          maxlength="40"
          ref="email"></b-input>
      </b-field> -->

      <!-- countryName -->
      <!-- <address-input
        :label="$t('request.abrAdr.label')"
        key="overseas"
        ref="abrAdr"
        v-model="abrAdr"
        @input="delayTouch($v.abrAdr)"
        :validations=$v.abrAdr
        :toolTipTitle="$t('request.abrAdr.tooltipTitle')">
        <div slot="instructions">
          <p>{{$t('request.abrAdr.instructions')}}</p>
        </div>
        <div slot="tooltip">
          <vue-markdown>{{$t('request.abrAdr.tooltip')}}</vue-markdown>
        </div>
      </address-input> -->

      <adr-input v-model="abrAdr"
        :label="$t('request.abrAdr.label')"
        ref="abrAdr"
        :v="$v.abrAdr"
        @input="val => touch(val)"
        key="abrAdr"></adr-input>
      <scroll-up :key="$route.params.stage"></scroll-up>
    <section >
        <nuxt-link :to="localePath({ name: 'index' })" class="button is-light is-medium is-pulled-left" exact ><b-icon pack="fas" icon="caret-left"></b-icon><span>{{$t('request.stages.back')}}</span></nuxt-link>
        <button @click.prevent="focusFirstErrorOrAdvance(localePath({ name: 'request-stage', params: {stage: 'voting-information'} }))" class="button is-primary is-medium is-pulled-right" exact ><span> {{$t('request.stages.next')}} </span><b-icon pack="fas" icon="caret-right"></b-icon></button>
    </section>

    </form>
  </section>

<!-- voting information -->
  <section v-if="stage.slug === 'voting-information'">
    <form id="voting-information" key="voting-information">

      <voting-address
        :label="$t('request.votAdr.label')"
        :validations=$v.votAdr
        ref="votAdr"
        @input="delayTouch($v.votAdr)"

        :toolTipTitle="$t('request.votAdr.tooltipTitle')">
        <div slot="instructions">
          <p>{{ $t('request.votAdr.instructions') }}</p>
        </div>
        <div slot="tooltip">
          <p v-html="$options.filters.markdown($t('request.votAdr.tooltip'))"></p>
          <!-- <vue-markdown>{{$t('request.votAdr.tooltip')}}</vue-markdown> -->
        </div>
      </voting-address>

      <jurisdiction v-if="votAdr && votAdr.stateISO"
        :label="$t('request.jurisdiction.label')"
        :toolTipTitle="$t('request.jurisdiction.tooltipTitle')"
        :placeholder="$t('request.jurisdiction.placeholder')"
        :key="votAdr.stateISO"
        ref="jurisdiction"

        @input="delayTouch($v.jurisdiction)"
        :validations="($v.jurisdiction)"
        :state="this.votAdr.stateISO">
        <div slot="instructions">
          <p>{{$t('request.jurisdiction.instructions')}}</p>
        </div>
        <div slot="tooltip">
          <p v-html="$options.filters.markdown($t('request.jurisdiction.tooltip'))"></p>
          <!-- <vue-markdown>{{$t('request.jurisdiction.tooltip')}}</vue-markdown> -->
        </div>
      </jurisdiction>

    <voter-class v-model="voterClass"
      :allowsNeverResided="stateRules ? stateRules.allowsNeverResided : false"
      :validations="($v.voterClass)"
      @input="delayTouch($v.voterClass)"
      :toolTipTitle="$t('request.voterClass.tooltipTitle')">
      <div slot="tooltip">
        <p v-html="$options.filters.markdown($t('request.voterClass.tooltip'))"></p>
        <!-- <vue-markdown>{{$t('request.voterClass.tooltip')}}</vue-markdown> -->
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
      <div slot="tooltip">
        <p v-html="$options.filters.markdown($t('request.receiveBallot.tooltip'))"></p>
        <!-- <vue-markdown>{{$t('request.receiveBallot.tooltip')}}</vue-markdown> -->
      </div>
    </receive-ballot>

    <!-- <tel-input
      key="fax"
      :label="$t('request.fax.label')"
      :type="($v.fax.$error ? 'is-danger': '')"
      :message="$v.fax.$error ? Object.keys($v.fax.$params) : [''] "
      v-if="recBallot === 'fax'"
      @input="$v.fax.$touch()"
      v-model="fax">
    </tel-input> -->
    <phone-input key="fax"
      ref="fax"
      :label="$t('request.fax.label')"
      v-if="recBallot === 'fax'"
      @input="delayTouch($v.fax)"
      :required="recBallot === 'fax'"
      :accepts="['phone']"
      v-model="fax"></phone-input>

    <!-- altEmail -->
    <phone-input v-if="recBallot === 'email' && (email === null || skippedEmail || $v.email.$error)"
      key="email"
      ref="email"
      @input="skippedEmail = true"
      :label="$t('request.email.label')"
      :required="recBallot === 'email'"
      :accepts="['email']"
      v-model="email">
    </phone-input>

    <phone-input key="altEmail"
      v-if="recBallot === 'email'"
      ref="altEmail"
      :label="$t('request.altEmail.label')"
      :required="false"
      :accepts="['email']"
      v-model="altEmail">
    </phone-input>

    <!-- <b-field
      :type="($v.altEmail.$error ? 'is-danger': '')"
      :message="$v.altEmail.$error ? Object.keys($v.altEmail.$params).map(x => $t(`request.email.messages.${x}`)) : '' "
      v-if="recBallot === 'email'"
      :label="$t('request.altEmail.label')">
      <b-input v-model="altEmail"
        ref="altEmail"
        autocomplete="email"
        maxlength="40"
        @input="$v.altEmail.$touch()"></b-input>
    </b-field> -->

      <!-- fwdAdr -->
      <address-input
        :label="$t('request.fwdAdr.label')"
        key="forwardingAddress"
        ref="fwdAdr"
        v-if="recBallot === 'mail'"
        v-model="fwdAdr"
        @input="delayTouch($v.fwdAdr)"
        :validations=$v.fwdAdr
        :tooltipTitle="$t('request.fwdAdr.tooltipTitle')">
        <div slot="instructions">
          <p>{{$t('request.fwdAdr.instructions')}}</p>
        </div>
        <div slot="tooltip">
          <p v-html="$options.filters.markdown($t('request.fwdAdr.tooltip'))"></p>
          <!-- <vue-markdown>{{$t('request.fwdAdr.tooltip')}}</vue-markdown> -->
        </div>
      </address-input>

    <scroll-up :key="$route.params.stage"></scroll-up>

    <section >
        <nuxt-link :to="localePath({ name: 'request-stage', params: { stage: 'your-information'} })" class="button is-light is-medium is-pulled-left" exact ><b-icon pack="fas" icon="caret-left"></b-icon><span>{{$t('request.stages.back')}}</span></nuxt-link>
        <button @click.prevent="focusFirstErrorOrAdvance(localePath({ name: 'request-stage', params: { stage: 'id-and-contact-information'} }))" class="button is-primary is-medium is-pulled-right" exact ><span> {{$t('request.stages.next')}} </span><b-icon pack="fas" icon="caret-right"></b-icon></button>
    </section>

  </form>
  </section>

  <section v-if="stage.slug === 'id-and-contact-information'">
    <form id="id-and-contact-information" key="id-and-contact-information">
<!-- identity and Contact information -->
      <!-- dob -->
      <!-- <birth-date
        :validations="$v.dob"
        ref="dob"
        :tooltipTitle="$t('request.dob.tooltipTitle')"
        @input="delayTouch($v.dob)">
        <div slot="tooltip">
          <vue-markdown>{{$t('request.dob.tooltip')}}</vue-markdown>
        </div>
      </birth-date> -->

      <date-of-birth v-model="dob"
        :tooltipTitle="$t('request.dob.tooltipTitle')"
        @input="delayTouch($v.dob)"
        ref="dob"
        :validations="$v.dob">
        <div slot="tooltip">
          <p v-html="$options.filters.markdown($t('request.dob.tooltip'))"></p>
          <!-- <vue-markdown>{{$t('request.dob.tooltip')}}</vue-markdown> -->
        </div>
      </date-of-birth>
      <!-- <b-field label="Select a date">
        <b-datepicker v-model="dob"
          :date-formatter="(date) => date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })"
          placeholder="Click to select...">
        </b-datepicker>
      </b-field> -->

      <!-- gender -->
      <gender
        :label="$t('request.sex.label')"
        :tooltipTitle="$t('request.sex.tooltipTitle')"
        v-model="sex">
        <div slot="tooltip">
          <p v-html="$options.filters.markdown($t('request.sex.tooltip'))"></p>
          <!-- <vue-markdown>{{$t('request.sex.tooltip')}}</vue-markdown> -->
        </div>
      </gender>

      <!-- party -->
      <party
        :label="$t('request.party.label')"
        v-model="party"
        :join="joinDa"
        :state="votAdr.stateISO"
        @joinDA="val => joinDA = val"
        :tooltipTitle="$t('request.party.tooltipTitle')"
        :joinTooltipTitle="$t('request.joinDa.tooltipTitle')"
        :joinLabel="$t('request.joinDa.label')"
        :message="$v.party.$error ? Object.keys($v.party.$params).map(x => x) : '' "
        :type="($v.party.$error ? 'is-danger': '')">
        <div slot="tooltip">
          <p v-html="$options.filters.markdown($t('request.party.tooltip'))"></p>
          <!-- <vue-markdown>{{$t('request.party.tooltip')}}</vue-markdown> -->
        </div>
        <div slot="joinTooltip">
          <p v-html="$options.filters.markdown($t('request.joinDa.tooltip'))"></p>
          <!-- <vue-markdown>{{$t('request.joinDa.tooltip')}}</vue-markdown> -->
        </div>
      </party>

      <!-- <transition name="fade">
      <join-democratsabroad
        v-model="joinDa"
        :party="party"
        :tooltipTitle="$t('request.joinDa.tooltipTitle')"
        :label="$t('request.joinDa.label')">
        <div slot="tooltip">
          <p v-html="$options.filters.markdown($t('request.joinDa.tooltip'))"></p> -->
          <!-- <vue-markdown>{{$t('request.joinDa.tooltip')}}</vue-markdown> -->
        <!-- </div>
      </join-democratsabroad>
      </transition> -->
        <!-- v-if="party!=='Republican' && party && !$store.state.userauth.user.isDA" -->

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
        <div slot="instructions">
          <p v-if="stateRules && stateRules.id && stateRules.id.length === 0"
            v-html="$options.filters.markdown($t('request.id.instructionsOptional', { state: stateRules.state}))">
          </p>
          <p v-else-if="stateRules && stateRules.id && stateRules.id.length === 1"
            v-html="$options.filters.markdown($t('request.id.instructionsReq1', { state: stateRules.state, id: $t(`request.id.${stateRules.id[0]}`), idType: $t(`request.id.${stateRules.id[0].indexOf('SSN') > -1 ? 'SSN' : stateRules.id[0]}`)}))">
          </p>
          <p v-else v-html="$options.filters.markdown($t('request.id.instructionsReq2', { state: stateRules.state, allButLastTypes: allButLastIdType, lastType: lastIdType }))">
          </p>
          <!-- <i18n v-if="stateRules && stateRules.id && stateRules.id.length === 0"
            path=request.id.instructionsOptional tag="vue-markdown" :places="{ state: stateRules.state}">
          </i18n>
          <i18n v-else-if="stateRules && stateRules.id && stateRules.id.length === 1" path=request.id.instructionsReq1 tag="vue-markdown" :places="{ state: stateRules.state, id: $t(`request.id.${stateRules.id[0]}`), idType: $t(`request.id.${stateRules.id[0].indexOf('SSN') > -1 ? 'SSN' : stateRules.id[0]}`)}">
          </i18n> -->
          <!-- <i18n v-else path=request.id.instructionsReq2 tag="vue-markdown" :places="{ state: stateRules.state, allButLastTypes: allButLastIdType, lastType: lastIdType }">
          </i18n> -->
        </div>
        <div slot="tooltip">
          <p v-if="stateRules && stateRules.id && stateRules.id.length === 0"
            v-html="$options.filters.markdown($t('request.id.tooltipOptional', { state: stateRules.state}))">
          </p>
          <p v-else-if="stateRules && stateRules.id && stateRules.id.length === 1"
            v-html="$options.filters.markdown($t('request.id.tooltipReq1', { state: stateRules.state, id: $t(`request.id.${stateRules.id[0]}`)}))">
          </p>
          <p v-else v-html="$options.filters.markdown($t('request.id.tooltipReq2', { state: stateRules.state, allButLastTypes: allButLastIdType, lastType: lastIdType }))">
          </p>
          <!-- <i18n v-if="stateRules && stateRules.id && stateRules.id.length === 0"
            path=request.id.tooltipOptional tag="vue-markdown" :places="{ state: stateRules.state}">
          </i18n>
          <i18n v-else-if="stateRules && stateRules.id && stateRules.id.length === 1" path=request.id.tooltipReq1 tag="vue-markdown" :places="{ state: stateRules.state, id: $t(`request.id.${stateRules.id[0]}`)}">
          </i18n>
          <i18n v-else path=request.id.tooltipReq2 tag="vue-markdown" :places="{ state: stateRules.state, allButLastTypes: allButLastIdType, lastType: lastIdType }">
          </i18n> -->
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
      <button @click.prevent="focusFirstErrorOrAdvance(localePath({ name: 'request-stage', params: { stage: 'review'} }))" class="button is-primary is-medium is-pulled-right" exact ><span> {{$t('request.stages.next')}} </span><b-icon pack="fas" icon="caret-right"></b-icon></button>
    </section>
  </form>
  </section>
</section>
</div>
</template>

<script>
import { required, requiredIf, helpers, email } from 'vuelidate/lib/validators'
import AddressInput from '~/components/AddressInput'
import Jurisdiction from '~/components/Jurisdiction'
import VotingAddress from '~/components/VotingAddress'
import VoterClass from '~/components/VoterClass'
import IsRegistered from '~/components/IsRegistered'
import ReceiveBallot from '~/components/ReceiveBallot'
import TelInput from '~/components/TelInput'
import BirthDate from '~/components/BirthDate'
import DateOfBirth from '~/components/DateOfBirth'
import Party from '~/components/Party'
import JoinDemocratsabroad from '~/components/JoinDemocratsabroad'
import PreviousName from '~/components/PreviousName'
import Gender from '~/components/Gender'
import StateSpecial from '~/components/StateSpecial'
import ScrollUp from '~/components/ScrollUp'
import Identification from '~/components/Identification'
import PhoneInput from '~/components/PhoneInput'
import AdrInput from '~/components/AdrInput'
// import VueMarkdown from 'vue-markdown'
import snarkdown from 'snarkdown'

const optionalEmail = (value) => !helpers.req(value) || email(value)
const touchMap = new WeakMap()

export default {
  transition: 'test',
  scrollToTop: true,
  middleware: 'verify-request',
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
      prty: '',
      phoneEmailTest: {},
      phoneTest: {},
      skippedEmail: false
    }
  },
  components: {
    AddressInput,
    VotingAddress,
    Jurisdiction,
    VoterClass,
    IsRegistered,
    ReceiveBallot,
    TelInput,
    BirthDate,
    DateOfBirth,
    Party,
    JoinDemocratsabroad,
    PreviousName,
    Gender,
    StateSpecial,
    ScrollUp,
    Identification,
    // VueMarkdown,
    PhoneInput,
    AdrInput
  },
  computed: {
    v () {
      let r = this.$refs.abrAdr && this.$refs.abrAdr && this.$refs.abrAdr.countryFormat ? this.$refs.abrAdr.countryFormat.require.toUpperCase() : false
      let re = this.$refs.abrAdr ? this.$refs.abrAdr : false
      return {
        re: re,
        r: r,
        A: r ? r.includes('A') : false,
        D: r ? r.includes('D') : false,
        C: r ? r.includes('C') : false,
        S: r ? r.includes('S') : false,
        X: r ? r.includes('X') : false,
        Z: r ? r.includes('Z') : false
      }
    },
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
      set (value) { this.$store.commit('requests/update', { email: value || null }) }
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
      get () { return this.requests[this.currentRequest] && this.requests[this.currentRequest].abrAdr ? this.requests[this.currentRequest].abrAdr : null },
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
      get () { return this.requests[this.currentRequest] && this.requests[this.currentRequest].sex ? this.requests[this.currentRequest].sex : null },
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
  filters: {
    markdown: function (md) {
      return snarkdown(md)
    }
  },
  methods: {
    touch (val) {
      // console.log(val)
      // Object.keys(val).forEach(item => console.log(item))
      this.delayTouch(this.$v.abrAdr)
      // if (val) {
      //   Object.keys(val).forEach(item => this.delayTouch(this.$v.abrAdr[item]))
      // }
    },
    focusName () {
      this.$refs.userinput.focus()
    },
    focusFirstErrorOrAdvance (nextPage) {
      switch (this.$route.params.stage) {
        case 'your-information':
          // if (this.$refs.abrAdr) this.$refs.abrAdr.touch()
          this.$v.firstName.$touch()
          this.$v.lastName.$touch()
          this.$v.email.$touch()
          this.$v.tel.$touch()
          this.$v.abrAdr.$touch()
          this.$v.abrAdr.A.$touch()
          break
        case 'voting-information':
          this.$v.votAdr.$touch()
          this.$v.jurisdiction.$touch()
          this.$v.voterClass.$touch()
          this.$v.isRegistered.$touch()
          this.$v.recBallot.$touch()
          this.$v.email.$touch()
          this.$v.fax.$touch()
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
          this.$refs.firstName.$el.scrollIntoView()
          console.log(this.$refs.firstName)
          this.$refs.firstName.focus()
          break
        case this.stage.slug === 'your-information' && this.$v.lastName.$error:
          this.$refs.lastName.$el.scrollIntoView()
          this.$refs.lastName.focus()
          this.$store.dispatch('requests/recordAnalytics', { event: 'Form Error', attributes: { field: 'lastName' } })
          break
        case this.stage.slug === 'your-information' && this.$v.email.$error:
          this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'email'}})
          this.$refs.email.$refs.input.$el.scrollIntoView()
          this.$refs.email.$refs.input.focus()
          break
        case this.stage.slug === 'your-information' && this.$v.abrAdr.country.$error:
          this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'abrAdr.country'}})
          this.$refs.abrAdr.$refs.country.$el.scrollIntoView()
          this.$refs.abrAdr.$refs.country.focus()
          break
        case this.stage.slug === 'your-information' && this.$v.abrAdr.A.$error && !this.abrAdr.usesAlternateFormat:
          this.$refs.abrAdr.$refs.A[0].$el.scrollIntoView()
          this.$refs.abrAdr.$refs.A[0].focus()
          this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'abrAdr.A'}})
          break
        case this.stage.slug === 'your-information' && this.$v.abrAdr.D.$error && !this.abrAdr.usesAlternateFormat:
          this.$refs.abrAdr.$refs.D[0].$el.scrollIntoView()
          this.$refs.abrAdr.$refs.D[0].focus()
          this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'abrAdr.D'}})
          break
        case this.stage.slug === 'your-information' && this.$v.abrAdr.C.$error && !this.abrAdr.usesAlternateFormat:
          this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'abrAdr.C'}})
          this.$refs.abrAdr.$refs.C[0].$el.scrollIntoView()
          this.$refs.abrAdr.$refs.C[0].focus()
          break
        case this.stage.slug === 'your-information' && this.$v.abrAdr.S.$error && !this.abrAdr.usesAlternateFormat:
          this.$refs.abrAdr.$refs.S[0].$el.scrollIntoView()
          this.$refs.abrAdr.$refs.S[0].focus()
          this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'abrAdr.S'}})
          break
        case this.stage.slug === 'your-information' && this.$v.abrAdr.X.$error && !this.abrAdr.usesAlternateFormat:
          this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'abrAdr.X'}})
          this.$refs.abrAdr.$refs.X[0].$el.scrollIntoView()
          this.$refs.abrAdr.$refs.X[0].focus()
          break
        case this.stage.slug === 'your-information' && this.$v.abrAdr.Z.$error && !this.abrAdr.usesAlternateFormat:
          this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'abrAdr.Z'}})
          this.$refs.abrAdr.$refs.Z[0].$el.scrollIntoView()
          this.$refs.abrAdr.$refs.Z[0].focus()
          break
        case this.stage.slug === 'your-information' && this.$v.tel.$error:
          this.$refs.tel.$refs.input.$el.scrollIntoView()
          this.$refs.tel.$refs.input.focus()
          this.$store.dispatch('requests/recordAnalytics', { event: 'Form Error', attributes: { field: 'tel' } })
          break
        case this.stage.slug === 'voting-information' && this.$v.votAdr.thoroughfare.$error:
          this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'votAdr.thoroughfare'}})
          this.$refs.votAdr.$refs.street.$el.scrollIntoView()
          this.$refs.votAdr.$refs.street.focus()
          break
        case this.stage.slug === 'voting-information' && this.$v.votAdr.locality.$error:
          this.$refs.votAdr.$refs.city.$el.scrollIntoView()
          this.$refs.votAdr.$refs.city.focus()
          this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'votAdr.locality'}})
          break
        case this.stage.slug === 'voting-information' && this.$v.votAdr.stateISO.$error:
          this.$refs.votAdr.$refs.state.$el.scrollIntoView()
          this.$refs.votAdr.$refs.state.focus()
          this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'votAdr.stateISO'}})
          break
        case this.stage.slug === 'voting-information' && this.$v.votAdr.postalcode.$error:
          this.$refs.votAdr.$refs.zip.$el.scrollIntoView()
          this.$refs.votAdr.$refs.zip.focus()
          this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'votAdr.postalcode'}})
          break
        case this.stage.slug === 'voting-information' && this.$v.jurisdiction.$error:
          this.$refs.jurisdiction.$refs.jurisdiction.$el.scrollIntoView()
          this.$refs.jurisdiction.$refs.jurisdiction.focus()
          this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'jurisdiction'}})
          break
        case this.stage.slug === 'voting-information' && this.$v.fax.$error:
          this.$refs.fax.$refs.input.$el.scrollIntoView()
          this.$refs.fax.$refs.input.focus()
          this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'fax'}})
          break
        case this.stage.slug === 'voting-information' && this.$v.email.$error && this.$refs.email:
          this.$refs.email.$refs.input.$el.scrollIntoView()
          this.$refs.email.$refs.input.focus()
          this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'email'}})
          break
        case this.stage.slug === 'voting-information' && this.$v.altEmail.$error && this.$refs.altEmail:
          this.$refs.altEmail.$refs.input.$el.scrollIntoView()
          this.$refs.altEmail.$refs.input.focus()
          this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'altEmail'}})
          break
        case this.stage.slug === 'id-and-contact-information' && this.$v.dob.$error:
          this.$refs.dob.$refs.dob.$el.scrollIntoView()
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
          if (this.stage.slug === 'voting-information') {
            if (!this.$refs.altEmail && this.$v.altEmail.$error) this.altEmail = null
            if (!this.$refs.fax && this.$v.fax.$error) this.fax = null
          }
          this.$store.dispatch('requests/recordAnalytics', {event: 'completed: ' + this.stage.slug})
          this.$router.push(nextPage)
          this.$store.dispatch('requests/updateRequest', {status: 'completed: ' + this.stage.slug})
      }
    },
    delayTouch ($v) {
      // console.log($v, touchMap)
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
        required: requiredIf(function (model) {
          return this.recBallot === 'email'
        }),
        optionalEmail
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
        A: { required: requiredIf((model) => this.$refs.abrAdr && this.$refs.abrAdr && this.$refs.abrAdr.countryFormat ? this.$refs.abrAdr.countryFormat.require.toUpperCase().includes('A') : false) },
        D: { required: requiredIf((model) => this.$refs.abrAdr && this.$refs.abrAdr && this.$refs.abrAdr.countryFormat ? this.$refs.abrAdr.countryFormat.require.toUpperCase().includes('D') : false) },
        C: { required: requiredIf((model) => this.$refs.abrAdr && this.$refs.abrAdr && this.$refs.abrAdr.countryFormat ? this.$refs.abrAdr.countryFormat.require.toUpperCase().includes('C') : false) },
        S: { required: requiredIf((model) => this.$refs.abrAdr && this.$refs.abrAdr && this.$refs.abrAdr.countryFormat ? this.$refs.abrAdr.countryFormat.require.toUpperCase().includes('S') : false) },
        X: { required: requiredIf((model) => this.$refs.abrAdr && this.$refs.abrAdr && this.$refs.abrAdr.countryFormat ? this.$refs.abrAdr.countryFormat.require.toUpperCase().includes('X') : false) },
        Z: { required: requiredIf((model) => this.$refs.abrAdr && this.$refs.abrAdr && this.$refs.abrAdr.countryFormat ? this.$refs.abrAdr.countryFormat.require.toUpperCase().includes('Z') : false) },
        countryiso: {},
        alt1: {},
        alt2: {},
        alt3: {},
        alt4: {},
        alt5: {},
        usesAlternateFormat: {}
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
        required,
        tooOld () { return new Date(1900, 0, 1) < new Date(this.dob) },
        tooYoung () { return new Date(2000, 10, 8) > new Date(this.dob) }
      },
      fax: {
        required: () => {
          if (this.recBallot !== 'fax' || this.fax.isValidPhone) {
            return true
          } else { return false }
        }
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
          requiredIf: requiredIf((model) => {
            if (!this.stateRules || !this.stateRules.id || (Array.isArray(this.stateRules.id) && this.stateRules.id.length === 0)) {
              return false
            }
            let needsSSN = Boolean(this.stateRules.id.indexOf('SSN') > -1 || this.stateRules.id.indexOf('SSN4') > -1)
            return Boolean(needsSSN && !this.identification.stateId && !this.identification.noId)
          }),
          correctLength () {
            if (this.identification.ssn && this.stateRules && this.stateRules.id && this.stateRules.id.length > 0) {
              if (this.stateRules.id.includes('SSN4') && this.stateRules.id.includes('SSN')) {
                return this.identification.ssn.length === 4 || this.identification.ssn.length === 9
              } else if (this.stateRules.id.includes('SSN4')) {
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
<style>
label.label {
  position: relative;
  width: 100%;
}
label.label > span.required {
    position: absolute;
    right: .5rem;
    color: #9c9a9a;
    font-size: 0.75rem;
    font-weight: 300;
    top: 2.5rem;
    z-index: 4;
}
</style>
