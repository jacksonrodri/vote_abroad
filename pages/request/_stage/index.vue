<template>
<div class="column is-12 is-8-desktop is-7-widescreen is-6-fullhd">
<section class="section">
    <h1 class="has-text-centered title is-3">{{ $t('request.stages.step', {step: stage.order})}}</h1>
    <h3 class="has-text-centered subtitle is-4">{{ $t(`request.stages.stage${stage.order}`)}}</h3>
<!-- your information -->
  <section v-if="stage.slug === 'your-information'">
    <form @submit.prevent id="your-information" key="your-information">
      <!-- firstName -->
      <div class="field">
        <label class="label" for="firstName">{{ $t('request.firstName.label') }}<transition name="fade"><span v-if="!firstName && !$v.firstName.$error" class="required"> Required</span></transition></label>
        <b-field :type="($v.firstName.$error ? 'is-danger': '')" :message="$v.firstName.$error ? Object.entries($v.firstName).filter(([key, value]) => key.charAt(0) !== '$' && value === false).map(x => $t(`request.firstName.messages.${x[0]}`)) : '' ">
          <b-input v-model="firstName"
            id="firstName"
            autocomplete="given-name"
            :maxlength="(firstName && !$v.firstName.$dirty) || $v.firstName.$error || (firstName && firstName.length > 44) ? 50 : ''"
            @input="delayTouch($v.firstName)"
            ref="firstName"></b-input>
        </b-field>
      </div>

      <!-- middleName -->
      <div class="field">
        <label class="label" for="middleName">{{ $t('request.middleName.label') }}<transition name="fade"><span v-if="!middleName" class="required"> Optional</span></transition></label>
        <b-field :type="($v.middleName.$error ? 'is-danger': '')" :message="$v.middleName.$error ? Object.keys($v.middleName.$params).map(x => $t(`request.middleName.messages.${x}`)) : '' ">
          <b-input
            v-model="middleName"
            id="middleName"
            @input="$v.middleName.$touch()"
            autocomplete="additional-name"
            :maxlength="(middleName && !$v.middleName.$dirty) || $v.middleName.$error || (middleName && middleName.length > 44) ? 50 : ''"></b-input>
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
            :maxlength="(lastName && !$v.lastName.$dirty) || $v.lastName.$error || (lastName && lastName.length > 44) ? 50 : ''"
            ref="lastName"></b-input>
        </b-field>
      </div>

      <!-- suffix -->
      <div class="field">
        <label class="label" for="suffix">{{ $t('request.suffix.label') }}<transition name="fade"><span v-if="!suffix" class="required"> Optional</span></transition></label>
        <b-field :type="($v.suffix.$error ? 'is-danger': '')" :message="$v.suffix.$error ? Object.keys($v.suffix.$params).map(x => $t(`request.suffix.messages.${x}`)) : '' ">
          <b-input
            v-model="suffix"
            id="suffix"
            @input="delayTouch($v.suffix)"
            :maxlength="(suffix && !$v.suffix.$dirty) || $v.suffix.$error || (suffix && suffix.length > 8) ? 16 : ''"
            autocomplete="honorific-suffix"></b-input>
        </b-field>
      </div>

      <previous-name v-model="previousName"
        :type="($v.previousName.$error ? 'is-danger': '')"
        :message="$v.previousName.$error ? Object.keys($v.previousName.previousName.$params).map(x => x) : '' "
        :label="$t('request.previousName.label')"
        :instructions="$t('request.previousName.instructions')"
        :tooltipTitle="$t('request.previousName.tooltipTitle')"
        @input="delayTouch($v.previousName)">
        <div slot="tooltip">
          {{$t('request.previousName.tooltip')}}
        </div>
      </previous-name>

      <!-- phone Number -->
      <!-- <phone-two ref="pe"
        key="pe"
        :accepts="['phone', 'email']"
        v-model="phoneTwo"
        :label="$t('request.tel.label')"></phone-two> -->
      <!-- <phone-four></phone-four>
      <phone-three v-model="phoneThree" @input="delayTouch($v.phoneThree)"></phone-three>

      <phone-input ref="tel" key="telephone" :label="$t('request.tel.label')" :accepts="['phone']" v-model="tel"></phone-input>

      <phone-input key="email" ref="email" :label="$t('request.email.label')" :required="recBallot === 'email'" :accepts="['email']" v-model="email"></phone-input>

      <adr-input v-model="abrAdr"
        :label="$t('request.abrAdr.label')"
        ref="abrAdr"
        :v="$v.abrAdr"
        @input="val => touch(val)"
        key="abrAdr"></adr-input>
      <scroll-up :key="$route.params.stage"></scroll-up> -->
      <tel-two
        ref="tel"
        key="tel"
        fieldName="tel"
        :v="$v.tel"
        @delayTouch="delayTouch($v.tel)"></tel-two>

      <email-input
        ref="email"
        key="email"
        fieldName="email"
        :v="$v.email"
        @delayTouch="delayTouch($v.email)"></email-input>

      <address-five
        ref="abrAdr"
        key="abrAdr"
        fieldName="abrAdr"
        :v="$v.abrAdr"
        @delayTouch="(val) => delayTouch($v.abrAdr[val])"></address-five>
    <section >
        <nuxt-link :to="localePath({ name: 'index' })" class="button is-light is-medium is-pulled-left" exact ><b-icon pack="fas" icon="caret-left"></b-icon><span>{{$t('request.stages.back')}}</span></nuxt-link>
        <button @click.prevent="focusFirstErrorOrAdvance(localePath({ name: 'request-stage', params: {stage: 'voting-information'} }))" class="button is-primary is-medium is-pulled-right" exact ><span> {{$t('request.stages.next')}} </span><b-icon pack="fas" icon="caret-right"></b-icon></button>
    </section>

    </form>
  </section>

<!-- voting information -->
  <section v-if="stage.slug === 'voting-information'">
    <form id="voting-information" key="voting-information">

      <!-- <vot-adr
        :label="$t('request.vAdr.label')"
        :validations=$v.vAdr
        ref="vAdr"
        @input="delayTouch($v.vAdr)"
        :toolTipTitle="$t('request.vAdr.tooltipTitle')">
        <div slot="instructions">
          <p v-html="$options.filters.markdown($t('request.vAdr.instructions'))"></p>
        </div>
        <div slot="tooltip">
          <p v-html="$options.filters.markdown($t('request.vAdr.tooltip'))"></p>
        </div>
      </vot-adr> -->

      <voting-address
        :label="$t('request.votAdr.label')"
        :validations=$v.votAdr
        ref="votAdr"
        @input="delayTouch($v.votAdr)"

        :toolTipTitle="$t('request.votAdr.tooltipTitle')">
        <div slot="instructions">
          <p v-html="$options.filters.markdown($t('request.votAdr.instructions'))"></p>
        </div>
        <div slot="tooltip">
          <p v-html="$options.filters.markdown($t('request.votAdr.tooltip'))"></p>
        </div>
      </voting-address>

      <jurisdiction v-if="votAdr && votAdr.S"
        :label="$t('request.jurisdiction.label')"
        :toolTipTitle="$t('request.jurisdiction.tooltipTitle')"
        :placeholder="$t('request.jurisdiction.placeholder')"
        :key="votAdr.S"
        ref="jurisdiction"

        @input="delayTouch($v.jurisdiction)"
        :validations="($v.jurisdiction)"
        :state="this.votAdr.S">
        <div slot="instructions">
          <p>{{$t('request.jurisdiction.instructions')}}</p>
        </div>
        <div slot="tooltip">
          <p v-html="$options.filters.markdown($t('request.jurisdiction.tooltip'))"></p>
        </div>
      </jurisdiction>

    <voter-class v-model="voterClass"
      :allowsNeverResided="stateRules ? stateRules.allowsNeverResided : false"
      :validations="($v.voterClass)"
      ref="voterClass"
      :state="votAdr && votAdr.S ? this.votAdr.S : null"
      @input="delayTouch($v.voterClass)"
      :toolTipTitle="$t('request.voterClass.tooltipTitle')">
      <div slot="tooltip">
        <p v-html="$options.filters.markdown($t('request.voterClass.tooltip'))"></p>
      </div>
    </voter-class>

      <!-- isRegistered -->
    <is-registered
      v-if="votAdr && jurisdiction && jurisdiction.j && jurisdiction.t"
      :label="$t('request.isRegistered.label', {jurisdiction: jurisdiction.t === 'All' ? jurisdiction.s : `${jurisdiction.j} ${jurisdiction.j.includes(jurisdiction.t) ? '' : jurisdiction.t}`})"
      :validations="($v.isRegistered)"
      @input="delayTouch($v.isRegistered)"
      ref="isRegistered"
      v-model="isRegistered">
    </is-registered>

    <!-- recBallot -->
    <receive-ballot v-model="recBallot"
      v-if="votAdr && votAdr.S"
      :label="$t('request.receiveBallot.label')"
      :validations="$v.recBallot"
      @input="delayTouch($v.recBallot)"
      ref="recBallot"
      :ballotReceiptOptions="stateRules ? stateRules.ballotReceiptOptions : ['Mail']"
      :toolTipTitle="$t('request.receiveBallot.tooltipTitle')">
      <div slot="tooltip">
        <p v-html="$options.filters.markdown($t('request.receiveBallot.tooltip'))"></p>
      </div>
    </receive-ballot>

    <!-- <phone-input key="fax"
      ref="fax"
      :label="$t('request.fax.label')"
      v-if="recBallot === 'fax' || (fax && fax.rawInput)"
      @input="delayTouch($v.fax)"
      :required="recBallot === 'fax'"
      :accepts="['phone']"
      @keydown.native.enter.prevent="focusNextButton(3)"
      v-model="fax"></phone-input> -->
    <tel-two
      v-if="recBallot === 'fax' || fax"
      ref="fax"
      key="fax"
      fieldName="fax"
      :v="$v.fax"
      @delayTouch="delayTouch($v.fax)"></tel-two>

    <!-- altEmail -->
    <email-input v-if="recBallot === 'email' && (email === null || skippedEmail || $v.email.$error)"
      ref="email"
      key="email"
      @input="skippedEmail = true"
      fieldName="email"
      :v="$v.email"
      @delayTouch="delayTouch($v.email)"></email-input>

    <email-input v-if="recBallot === 'email' || altEmail"
      ref="altEmail"
      key="altEmail"
      fieldName="altEmail"
      :v="$v.altEmail"
      @delayTouch="delayTouch($v.altEmail)"></email-input>

    <!-- <phone-input v-if="recBallot === 'email' && (email === null || skippedEmail || $v.email.$error)"
      key="email"
      ref="email"
      @input="skippedEmail = true"
      :label="$t('request.email.label')"
      :required="recBallot === 'email'"
      :accepts="['email']"
      v-model="email">
    </phone-input>

    <phone-input key="altEmail"
      v-if="recBallot === 'email' || altEmail"
      ref="altEmail"
      :label="$t('request.altEmail.label')"
      :required="false"
      :accepts="['email']"
      v-model="altEmail">
    </phone-input> -->

      <!-- fwdAdr -->
      <address-five
        v-if="recBallot === 'mail' || (fwdAdr && (fwdAdr.alt1 || fwdAdr.A))"
        ref="fwdAdr"
        key="fwdAdr"
        fieldName="fwdAdr"
        :v="$v.fwdAdr"
        @delayTouch="(val) => delayTouch($v.fwdAdr[val])"></address-five>
      <!-- <address-input
        :label="$t('request.fwdAdr.label')"
        key="forwardingAddress"
        ref="fwdAdr"
        v-if="recBallot === 'mail' || (fwdAdr && fwdAdr.alt1)"
        v-model="fwdAdr"
        @input="delayTouch($v.fwdAdr)"
        :validations=$v.fwdAdr
        :tooltipTitle="$t('request.fwdAdr.tooltipTitle')">
        <div slot="instructions">
          <p>{{$t('request.fwdAdr.instructions')}}</p>
        </div>
        <div slot="tooltip">
          <p v-html="$options.filters.markdown($t('request.fwdAdr.tooltip'))"></p>
        </div>
      </address-input> -->

    <scroll-up :key="$route.params.stage"></scroll-up>

    <section >
        <nuxt-link ref="next1" :to="localePath({ name: 'request-stage', params: { stage: 'your-information'} })" class="button is-light is-medium is-pulled-left" exact ><b-icon pack="fas" icon="caret-left"></b-icon><span>{{$t('request.stages.back')}}</span></nuxt-link>
        <button ref="next3" @click.prevent="focusFirstErrorOrAdvance(localePath({ name: 'request-stage', params: { stage: 'id-and-contact-information'} }))" class="button is-primary is-medium is-pulled-right" exact ><span> {{$t('request.stages.next')}} </span><b-icon pack="fas" icon="caret-right"></b-icon></button>
    </section>

  </form>
  </section>

  <section v-if="stage.slug === 'id-and-contact-information'">
    <form id="id-and-contact-information" key="id-and-contact-information">
<!-- identity and Contact information -->
      <!-- dob -->

      <date-of-birth v-model="dob"
        :tooltipTitle="$t('request.dob.tooltipTitle')"
        @input="delayTouch($v.dob)"
        ref="dob"
        :validations="$v.dob">
        <div slot="tooltip">
          <p v-html="$options.filters.markdown($t('request.dob.tooltip'))"></p>
        </div>
      </date-of-birth>

      <!-- gender -->
      <gender
        :label="$t('request.sex.label')"
        ref="sex"
        :state="votAdr.S"
        :tooltipTitle="$t('request.sex.tooltipTitle')"
        v-model="sex"
        :validations="$v.sex">
        <div slot="tooltip">
          <p v-html="$options.filters.markdown($t('request.sex.tooltip'))"></p>
        </div>
      </gender>

      <!-- party -->
      <party
        :label="$t('request.party.label')"
        v-model="party"
        :join="joinDa"
        :state="votAdr.S"
        @joinDA="val => joinDa = val"
        :tooltipTitle="$t('request.party.tooltipTitle')"
        :joinTooltipTitle="$t('request.joinDa.tooltipTitle')"
        :joinLabel="$t('request.joinDa.label')"
        :message="$v.party.$error ? Object.keys($v.party.$params).map(x => x) : '' "
        :type="($v.party.$error ? 'is-danger': '')">
        <div slot="tooltip">
          <p v-html="$options.filters.markdown($t('request.party.tooltip'))"></p>
        </div>
        <div slot="joinTooltip">
          <p v-html="$options.filters.markdown($t('request.joinDa.tooltip'))"></p>
        </div>
      </party>

      <state-special
        :label="$t('request.stateSpecial.label', {state: stateRules && stateRules.state ? stateRules.state: 'State'})"
        v-model="stateSpecial"
        :state="votAdr && votAdr.S ? votAdr.S : ''"
        :isFWAB="isFWAB"
        :isIndNoParty="party && (party.toLowerCase() === 'republican' || party.toLowerCase() === 'rep' || party.toLowerCase() === 'democrat' || party.toLowerCase() === 'dem') ? false : true"
        :isReturnUncertain="Boolean(voterClass === 'uncertainReturn')"
        :isRegistering="Boolean(isRegistered === 'notRegistered' || isRegistered === 'unsure')">
      </state-special>

      <!-- identification -->

      <id-input
        v-if="stateRules"
        :label="$t('request.id.label')"
        :idOptions="idOptions"
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
        </div>
      </id-input>

      <!-- fwabRequest -->
      <!-- <b-field :type="($v.fwabRequest.$error ? 'is-danger': '')"
        :message="$v.fwabRequest.$error ? Object.keys($v.fwabRequest.$params).map(x => x) : '' "
        label="Do you want to register and request a ballot for all elections you are eligile to vote in?"
        v-if="isFwab">
        <b-input v-model="fwabRequest" @input="$v.fwabRequest.$touch()"></b-input>
      </b-field> -->

      <scroll-up :key="$route.params.stage"></scroll-up>
    <section >
      <nuxt-link :to="localePath({ name: 'request-stage', params: { stage: 'voting-information'} })" class="button is-light is-medium is-pulled-left" exact ><b-icon pack="fas" icon="caret-left"></b-icon><span>{{$t('request.stages.back')}}</span></nuxt-link>
      <button @click.prevent="focusFirstErrorOrAdvance(localePath({ name: 'request-review' }))" class="button is-primary is-medium is-pulled-right" exact ><span> {{$t('request.stages.next')}} </span><b-icon pack="fas" icon="caret-right"></b-icon></button>
    </section>
  </form>
  </section>
</section>
</div>
</template>

<script>
import { required, requiredIf, maxLength, helpers, email } from 'vuelidate/lib/validators'
import AddressInput from '~/components/AddressInput'
import Jurisdiction from '~/components/Jurisdiction'
import VotingAddress from '~/components/VotingAddress'
// import VotAdr from '~/components/VotAdr'
import VoterClass from '~/components/VoterClass'
import IsRegistered from '~/components/IsRegistered'
import ReceiveBallot from '~/components/ReceiveBallot'
import PhoneInput from '~/components/PhoneInput'
import PhoneTwo from '~/components/PhoneTwo'
import PhoneThree from '~/components/PhoneThree'
import PhoneFour from '~/components/PhoneFour'
// import TelInput from '~/components/TelInput'
// import BirthDate from '~/components/BirthDate'
import DateOfBirth from '~/components/DateOfBirth'
import Party from '~/components/Party'
import PreviousName from '~/components/PreviousName'
import Gender from '~/components/Gender'
import StateSpecial from '~/components/StateSpecial'
import ScrollUp from '~/components/ScrollUp'
import EmailInput from '~/components/EmailInput'
import TelTwo from '~/components/TelTwo'
import AddressFive from '~/components/AddressFive'
// import Identification from '~/components/Identification'
import IdInput from '~/components/IdInput'
import AdrInput from '~/components/AdrInput'
import snarkdown from 'snarkdown'
import { mapGetters } from 'vuex'

const optionalEmail = (value) => !helpers.req(value) || email(value)
const usZip = helpers.regex('usZip', /^(\d{5})(?:[ -](\d{4}))?$/)
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
  // watchQuery: ['query'],
  // async fetch ({ app, store, query }) {
  //   if (query.state === 'ca') {
  //     let state = await app.$content('/leos').get(query.state)
  //     // console.log(state.body)
  //   }
  // },
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
      // localDob: null,
      // localDate: null,
      fwabRequest: '',
      isFwab: false,
      isOpen: false,
      phoneTwo: '',
      phoneFour: '',
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
    // VotAdr,
    Jurisdiction,
    VoterClass,
    IsRegistered,
    ReceiveBallot,
    // TelInput,
    // BirthDate,
    DateOfBirth,
    Party,
    // JoinDemocratsabroad,
    PreviousName,
    Gender,
    StateSpecial,
    ScrollUp,
    // Identification,
    IdInput,
    PhoneInput,
    PhoneTwo,
    PhoneThree,
    PhoneFour,
    AdrInput,
    EmailInput,
    TelTwo,
    AddressFive
  },
  provide () {
    return {
      validations: this.$v,
      dTouch: this.delayTouch
    }
    // const validations = {}
    // Object.keys(this.$v).forEach(key => {
    //   Object.defineProperty(validations, key, {
    //     enumerable: true,
    //     get: () => this.$v[key]
    //   })
    // })
    // Object.defineProperty(validations, 'delayTouch', {
    //   enumerable: true,
    //   get: () => this.delayTouch
    // })
    // return { validations }
  },
  computed: {
    phoneThree: {
      get () { return this.$store.state.data.phone || '' },
      set (val) { this.$store.dispatch('data/updatePhone', val) }
    },
    idOptions () {
      let opts = this.stateRules && this.stateRules.id && this.stateRules.id.length > 0 ? this.stateRules.id : null
      if (this.votAdr.S === 'OK' && this.recBallot === 'email') {
        return ['SSN', 'SSN4']
      } else return opts
    },
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
      if (this.votAdr && this.votAdr.S) {
        return this.allStateRules.find(x => x.iso.toLowerCase() === this.votAdr.S.toLowerCase())
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
      get () { return this.getCurrent.dob || null },
      set (val) { this.$store.commit('requests/update', { dob: val }) }
    },
    date: {
      get () { return this.requests[this.currentRequest] ? this.requests[this.currentRequest].date : null },
      set (value) { this.$store.commit('requests/update', { date: value }) }
    },
    tel: {
      get () { return this.requests[this.currentRequest] ? this.requests[this.currentRequest].tel : '' },
      set (value) { this.$store.commit('requests/update', { tel: value }) }
    },
    votAdr: {
      get () { return this.requests[this.currentRequest] ? this.requests[this.currentRequest].votAdr : null },
      set (value) { this.$store.commit('requests/update', {votAdr: value}) }
    },
    // vAdr: {
    //   get () { return this.requests[this.currentRequest] ? this.requests[this.currentRequest].vAdr : null },
    //   set (value) { this.$store.commit('requests/update', {vAdr: value}) }
    // },
    // jurisdiction () { return this.leo && this.leo.n ? this.leo.n : '' },
    jurisdiction () { return this.requests[this.currentRequest] ? this.requests[this.currentRequest].leo : null },
    abrAdr: {
      get () {
        if ((!this.requests[this.currentRequest] || !this.requests[this.currentRequest].abrAdr) && this.user && this.user.country) {
          return {countryiso: this.user.country}
        } else return this.requests[this.currentRequest] && this.requests[this.currentRequest].abrAdr ? this.requests[this.currentRequest].abrAdr : null
      },
      set (value) {
        // if (value.countryiso && /US|AS|VI|PR|GU/.test(value.countryiso)) {
        //   // this.$store.commit('requests/update', { abrAdr: Object.assign({}, value, {countryiso: 'APO'}) })
        //   this.alertAbrAdr(value)
        // } else {
        this.$store.commit('requests/update', {abrAdr: value})
        // }
      }
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
      get () { return this.currentRequestObject ? this.currentRequestObject.party || null : null },
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
    },
    ...mapGetters('data', ['isValidNumber']),
    ...mapGetters('requests', ['getCurrent'])
  },
  filters: {
    markdown: function (md) {
      return snarkdown(md)
    }
  },
  methods: {
    focusNextButton (stage) {
      if (typeof this.$refs[`next${stage}`].focus === 'function') {
        this.$refs[`next${stage}`].focus()
      } else this.$refs[`next${stage}`].$el.focus()
    },
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
          // this.$refs.tel.check()
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
          this.$v.votAdr.A.$touch()
          this.$v.votAdr.C.$touch()
          // this.$v.vAdr.$touch()
          this.$v.jurisdiction.$touch()
          this.$v.voterClass.$touch()
          this.$v.isRegistered.$touch()
          this.$v.recBallot.$touch()
          this.$v.email.$touch()
          this.$v.fax.$touch()
          // if (this.recBallot === 'fax') { this.$refs.fax.$v.value.$touch() }
          this.$v.altEmail.$touch()
          this.$v.fwdAdr.$touch()
          break
        case 'id-and-contact-information':
          this.$v.sex.$touch()
          // console.log(this.$v.sex)
          this.$v.dob.$touch()
          this.$v.identification.$touch()
          break
      }

      switch (true) {
        case this.stage.slug === 'your-information' && this.$v.firstName.$error:
          // this.$store.dispatch('requests/recordAnalytics', { event: 'Form Error', attributes: { field: 'firstName' } })
          this.$refs.firstName.$el.scrollIntoView()
          // console.log(this.$refs.firstName)
          this.$refs.firstName.focus()
          break
        case this.stage.slug === 'your-information' && this.$v.lastName.$error:
          this.$refs.lastName.$el.scrollIntoView()
          this.$refs.lastName.focus()
          // this.$store.dispatch('requests/recordAnalytics', { event: 'Form Error', attributes: { field: 'lastName' } })
          break
        case this.stage.slug === 'your-information' && this.$v.email.$error:
          // this.$refs.email.check()
          // this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'email'}})
          this.$refs.email.$el.scrollIntoView()
          this.$refs.email.$el.querySelector('input').focus()
          break
        // case this.stage.slug === 'your-information' && this.$v.abrAdr.country && this.$v.abrAdr.country.$error:
        //   this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'abrAdr.country'}})
        //   this.$refs.abrAdr.$refs.country.$el.scrollIntoView()
        //   this.$refs.abrAdr.$refs.country.focus()
        //   break
        case this.stage.slug === 'your-information' && this.$v.abrAdr.A && this.$v.abrAdr.A.$error && !this.abrAdr.usesAlternateFormat:
          this.$refs.abrAdr.$el.scrollIntoView()
          // console.log(this.$refs.abrAdr.$refs)
          this.$refs.abrAdr.$refs.A[0].focus()
          // this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'abrAdr.A'}})
          break
        case this.stage.slug === 'your-information' && this.$v.abrAdr.D && this.$v.abrAdr.D.$error && !this.abrAdr.usesAlternateFormat:
          this.$refs.abrAdr.$refs.D[0].$el.scrollIntoView()
          this.$refs.abrAdr.$refs.D[0].focus()
          // this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'abrAdr.D'}})
          break
        case this.stage.slug === 'your-information' && this.$v.abrAdr.C && this.$v.abrAdr.C.$error && !this.abrAdr.usesAlternateFormat:
          // this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'abrAdr.C'}})
          this.$refs.abrAdr.$refs.C[0].$el.scrollIntoView()
          this.$refs.abrAdr.$refs.C[0].focus()
          break
        case this.stage.slug === 'your-information' && this.$v.abrAdr.S && this.$v.abrAdr.S.$error && !this.abrAdr.usesAlternateFormat:
          this.$refs.abrAdr.$refs.S[0].$el.scrollIntoView()
          this.$refs.abrAdr.$refs.S[0].focus()
          // this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'abrAdr.S'}})
          break
        case this.stage.slug === 'your-information' && this.$v.abrAdr.X && this.$v.abrAdr.X.$error && !this.abrAdr.usesAlternateFormat:
          // this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'abrAdr.X'}})
          this.$refs.abrAdr.$refs.X[0].$el.scrollIntoView()
          this.$refs.abrAdr.$refs.X[0].focus()
          break
        case this.stage.slug === 'your-information' && this.$v.abrAdr.Z && this.$v.abrAdr.Z.$error && !this.abrAdr.usesAlternateFormat:
          // this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'abrAdr.Z'}})
          this.$refs.abrAdr.$refs.Z[0].$el.scrollIntoView()
          this.$refs.abrAdr.$refs.Z[0].focus()
          break
        case this.stage.slug === 'your-information' && this.$v.tel.$error:
          this.$refs.tel.$el.scrollIntoView()
          this.$refs.tel.$el.querySelector('input').focus()
          // this.$store.dispatch('requests/recordAnalytics', { event: 'Form Error', attributes: { field: 'tel' } })
          break
        case this.stage.slug === 'voting-information' && this.$v.votAdr.A.$error:
          // this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'votAdr.A'}})
          this.$refs.votAdr.$el.scrollIntoView()
          this.$refs.votAdr.$refs.A.focus()
          break
        case this.stage.slug === 'voting-information' && this.$v.votAdr.C.$error:
          this.$refs.votAdr.$el.scrollIntoView()
          this.$refs.votAdr.$refs.C.focus()
          // this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'votAdr.C'}})
          break
        case this.stage.slug === 'voting-information' && this.$v.votAdr.S.$error:
          this.$refs.votAdr.$refs.S.$el.scrollIntoView()
          this.$refs.votAdr.$refs.S.focus()
          // this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'votAdr.S'}})
          break
        case this.stage.slug === 'voting-information' && this.$v.votAdr.Z.$error:
          this.$refs.votAdr.$refs.Z.$el.scrollIntoView()
          this.$refs.votAdr.$refs.Z.focus()
          // this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'votAdr.Z'}})
          break
        // case this.stage.slug === 'voting-information' && this.$v.vAdr.A.$error:
        //   this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'vAdr.A'}})
        //   this.$refs.vAdr.$refs.A.$el.scrollIntoView()
        //   this.$refs.vAdr.$refs.A.focus()
        //   break
        // case this.stage.slug === 'voting-information' && this.$v.vAdr.C.$error:
        //   this.$refs.vAdr.$refs.C.$el.scrollIntoView()
        //   this.$refs.vAdr.$refs.C.focus()
        //   this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'vAdr.C'}})
        //   break
        // case this.stage.slug === 'voting-information' && this.$v.vAdr.S.$error:
        //   this.$refs.vAdr.$refs.S.$el.scrollIntoView()
        //   this.$refs.vAdr.$refs.S.focus()
        //   this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'vAdr.S'}})
        //   break
        // case this.stage.slug === 'voting-information' && this.$v.vAdr.Z.$error:
        //   this.$refs.vAdr.$refs.Z.$el.scrollIntoView()
        //   this.$refs.vAdr.$refs.Z.focus()
        //   this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'vAdr.Z'}})
        //   break
        case this.stage.slug === 'voting-information' && this.$v.jurisdiction.$error:
          this.$refs.jurisdiction.$refs.jurisdiction.$el.scrollIntoView()
          this.$refs.jurisdiction.$refs.jurisdiction.focus()
          // this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'jurisdiction'}})
          break
        case this.stage.slug === 'voting-information' && this.$v.fax.$error:
          this.$refs.fax.$el.scrollIntoView()
          this.$refs.fax.$el.querySelector('input').focus()
          // this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'fax'}})
          break
        case this.stage.slug === 'voting-information' && this.$v.voterClass.$error:
          this.$refs.voterClass.$el.scrollIntoView()
          // this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'voterClass'}})
          break
        case this.stage.slug === 'voting-information' && this.$v.isRegistered.$error:
          this.$refs.isRegistered.$el.scrollIntoView()
          // this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'isRegistered'}})
          break
        case this.stage.slug === 'voting-information' && this.$v.recBallot.$error:
          this.$refs.recBallot.$el.scrollIntoView()
          // this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'recBallot'}})
          break
        case this.stage.slug === 'voting-information' && this.$v.email.$error && this.recBallot === 'email':
          // this.$refs.email.check()
          this.$refs.email.$el.scrollIntoView()
          this.$refs.email.$el.querySelector('input').focus()
          // this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'email'}})
          break
        case this.stage.slug === 'voting-information' && this.$v.altEmail.$error && this.$refs.altEmail:
          this.$refs.altEmail.$refs.input.$el.scrollIntoView()
          this.$refs.altEmail.$refs.input.focus()
          // this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'altEmail'}})
          break
        case this.stage.slug === 'voting-information' && this.$v.fwdAdr.$error && this.$refs.fwdAdr:
          this.$refs.fwdAdr.$el.scrollIntoView()
          this.$refs.fwdAdr.$el.querySelector('input').focus()
          // this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'fwdAdr  '}})
          break
        case this.stage.slug === 'id-and-contact-information' && this.$v.dob.$error:
          this.$refs.dob.$el.scrollIntoView()
          this.$refs.dob.$el.querySelector('input').focus()
          // this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'dob'}})
          break
        case this.stage.slug === 'id-and-contact-information' && this.$v.sex.$error:
          this.$refs.sex.$el.scrollIntoView()
          // this.$refs.sex.$refs.sex.focus()
          // this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'sex'}})
          break
        case this.stage.slug === 'id-and-contact-information' && this.$v.identification.ssn.$error:
          if (this.$refs.id.$refs.ssn) this.$refs.id.$refs.ssn.focus()
          // this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'identification.ssn'}})
          break
        case this.stage.slug === 'id-and-contact-information' && this.$v.identification.ssn4.$error:
          if (this.$refs.id.$refs.ssn4) this.$refs.id.$refs.ssn4.focus()
          // this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'identification.ssn'}})
          break
        case this.stage.slug === 'id-and-contact-information' && this.$v.identification.stateId.$error:
          // this.$store.dispatch('requests/recordAnalytics', {event: 'Form Error', attributes: {field: 'identification.stateId'}})
          this.$refs.id.$refs.StateId.focus()
          break
        default:
          // console.log('nextPage', nextPage)
          this.$router.push(nextPage)
          // this.$store.dispatch('requests/recordAnalytics', {event: 'completed: ' + this.stage.slug})
          // this.$store.dispatch('requests/updateRequest', {status: 'completed: ' + this.stage.slug})
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
        required: requiredIf(function (model) {
          return this.recBallot === 'email'
        }),
        email: optionalEmail
      },
      firstName: {
        required,
        maxLength: maxLength(50)
      },
      middleName: {
        maxLength: maxLength(50)
      },
      lastName: {
        required,
        maxLength: maxLength(50)
      },
      previousName: {
        previousName: {
          maxLength: maxLength(50)
        }
      },
      suffix: {
        maxLength: maxLength(16)
      },
      abrAdr: {
        country: { },
        A: { required: requiredIf((model) => this.$refs.abrAdr && this.$refs.abrAdr && this.$refs.abrAdr.countryData ? this.$refs.abrAdr.countryData.require.toUpperCase().includes('A') : false) },
        B: { required: requiredIf((model) => this.$refs.abrAdr && this.$refs.abrAdr && this.$refs.abrAdr.countryData ? this.$refs.abrAdr.countryData.require.toUpperCase().includes('B') : false) },
        D: { required: requiredIf((model) => this.$refs.abrAdr && this.$refs.abrAdr && this.$refs.abrAdr.countryData ? this.$refs.abrAdr.countryData.require.toUpperCase().includes('D') : false) },
        C: { required: requiredIf((model) => this.$refs.abrAdr && this.$refs.abrAdr && this.$refs.abrAdr.countryData ? this.$refs.abrAdr.countryData.require.toUpperCase().includes('C') : false) },
        S: { required: requiredIf((model) => this.$refs.abrAdr && this.$refs.abrAdr && this.$refs.abrAdr.countryData ? this.$refs.abrAdr.countryData.require.toUpperCase().includes('S') : false) },
        X: { required: requiredIf((model) => this.$refs.abrAdr && this.$refs.abrAdr && this.$refs.abrAdr.countryData ? this.$refs.abrAdr.countryData.require.toUpperCase().includes('X') : false) },
        Z: { required: requiredIf((model) => this.$refs.abrAdr && this.$refs.abrAdr && this.$refs.abrAdr.countryData ? this.$refs.abrAdr.countryData.require.toUpperCase().includes('Z') : false) },
        countryiso: { required },
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
        A: { required },
        C: { required },
        S: { required },
        Z: {
          required,
          usZip
        }
      },
      // vAdr: {
      //   A: { required },
      //   C: { required },
      //   S: { required },
      //   Z: {
      //     required,
      //     usZip
      //   },
      //   Y: {}
      // },
      jurisdiction: { required },
      recBallot: {
        required
      },
      dob: {
        required,
        tooOld () { return new Date(1900, 0, 1) < new Date(this.dob) },
        tooYoung () {
          if (this.dob) {
            let year = parseInt(this.dob.substr(0, 4))
            let month = parseInt(this.dob.substr(5, 2))
            let day = parseInt(this.dob.substr(8, 2))
            return (year < 2000 || (year === 2000 && month < 11) || (year === 2000 && month === 11 && day <= 6))
          } else {
            return true
          }
          // return new Date(2000, 10, 8) > new Date(this.dob)
        }
      },
      fax: {
        required: requiredIf((model) => this.recBallot === 'fax'),
        validPhone () { return this.fax ? this.isValidNumber(this.fax) : true }
      },
      tel: {
        validPhone () {
          // if (this.$refs && this.$refs.tel) {
          //   return this.$refs.tel.validatePhone
          // } else return this.tel && this.tel.rawInput ? this.tel.isValidPhone : true
          return this.tel ? this.isValidNumber(this.tel) : true
        }
      },
      phoneThree: {
        required
      },
      altEmail: {
        email
      },
      fwabRequest: {
      },
      party: {
      },
      sex: {
        required: requiredIf((model) => {
          return this.votAdr && this.votAdr.S && this.votAdr.S.toLowerCase() === 'id'
        })
      },
      isRegistered: {
        required
      },
      identification: {
        ssn: {
          requiredIf: requiredIf((model) => {
            if (!this.stateRules || !this.stateRules.id || (Array.isArray(this.stateRules.id) && this.stateRules.id.length === 0) || (this.ssn4 && this.ssn4.length === 4)) {
              return false
            }
            return Boolean(this.stateRules.id.includes('SSN') && !this.identification.ssn4 && !this.identification.stateId && !this.identification.noId)
          }),
          correctLength () {
            if (this.identification && this.identification.ssn && this.stateRules && this.stateRules.id && this.stateRules.id.length > 0) {
              if (this.stateRules.id.includes('SSN')) {
                return this.identification.ssn && this.identification.ssn.replace(/\D/g, '').length === 9
              }
            } else {
              return true
            }
          }
        },
        ssn4: {
          requiredIf: requiredIf((model) => {
            if (!this.stateRules || !this.stateRules.id || (Array.isArray(this.stateRules.id) && this.stateRules.id.length === 0)) {
              return false
            }
            return Boolean(this.stateRules.id.includes('SSN4') && !this.identification.ssn && !this.identification.stateId && !this.identification.noId)
          }),
          correctLength () {
            if (this.identification && this.identification.ssn4 && this.stateRules && this.stateRules.id && this.stateRules.id.length > 0) {
              if (this.stateRules.id.includes('SSN4')) {
                return this.identification.ssn4 && this.identification.ssn4.replace(/\D/g, '').length === 4
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
            return Boolean(needsStateId && !this.identification.ssn && !this.identification.ssn4 && !this.identification.noId)
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
        A: { required: requiredIf((model) => this.fwdAdr && this.fwdAdr.A && this.$refs.fwdAdr && this.$refs.fwdAdr && this.$refs.fwdAdr.countryData ? this.$refs.fwdAdr.countryData.require.toUpperCase().includes('A') : false) },
        B: { required: requiredIf((model) => this.fwdAdr && this.fwdAdr.A && this.$refs.fwdAdr && this.$refs.fwdAdr && this.$refs.fwdAdr.countryData ? this.$refs.fwdAdr.countryData.require.toUpperCase().includes('B') : false) },
        D: { required: requiredIf((model) => this.fwdAdr && this.fwdAdr.A && this.$refs.fwdAdr && this.$refs.fwdAdr && this.$refs.fwdAdr.countryData ? this.$refs.fwdAdr.countryData.require.toUpperCase().includes('D') : false) },
        C: { required: requiredIf((model) => this.fwdAdr && this.fwdAdr.A && this.$refs.fwdAdr && this.$refs.fwdAdr && this.$refs.fwdAdr.countryData ? this.$refs.fwdAdr.countryData.require.toUpperCase().includes('C') : false) },
        S: { required: requiredIf((model) => this.fwdAdr && this.fwdAdr.A && this.$refs.fwdAdr && this.$refs.fwdAdr && this.$refs.fwdAdr.countryData ? this.$refs.fwdAdr.countryData.require.toUpperCase().includes('S') : false) },
        X: { required: requiredIf((model) => this.fwdAdr && this.fwdAdr.A && this.$refs.fwdAdr && this.$refs.fwdAdr && this.$refs.fwdAdr.countryData ? this.$refs.fwdAdr.countryData.require.toUpperCase().includes('X') : false) },
        Z: { required: requiredIf((model) => this.fwdAdr && this.fwdAdr.A && this.$refs.fwdAdr && this.$refs.fwdAdr && this.$refs.fwdAdr.countryData ? this.$refs.fwdAdr.countryData.require.toUpperCase().includes('Z') : false) },
        // A: { },
        // B: { },
        // D: { },
        // C: { },
        // S: { },
        // X: { },
        // Z: { },
        countryiso: {},
        alt1: {},
        alt2: {},
        alt3: {},
        alt4: {},
        alt5: {},
        usesAlternateFormat: {}
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
