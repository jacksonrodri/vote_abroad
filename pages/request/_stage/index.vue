<template>
<div class="column is-10-touch is-8-desktop is-7-widescreen is-6-fullhd">
<section class="section">
    <h1 class="has-text-centered title is-3">Step {{ stage.order }} of 3</h1>
    <h3 class="has-text-centered subtitle is-4">{{ stage.name }}</h3>
<!-- your information -->
  <section v-if="stage.slug === 'your-information'">
      <!-- firstName -->
      <b-field :type="($v.firstName.$error ? 'is-danger': '')" :message="$v.firstName.$error ? Object.keys($v.firstName.$params).map(x => x) : '' " :label="$t('request.firstName')">
        <b-input v-model="firstName" @input="$v.firstName.$touch()"></b-input>
      </b-field>

      <!-- middleName -->
      <b-field :type="($v.middleName.$error ? 'is-danger': '')" :message="$v.middleName.$error ? Object.keys($v.middleName.$params).map(x => x) : '' " :label="$t('request.middleName')">
        <b-input v-model="middleName" @input="$v.middleName.$touch()"></b-input>
      </b-field>

      <!-- lastName -->
      <b-field :type="($v.lastName.$error ? 'is-danger': '')" :message="$v.lastName.$error ? Object.keys($v.lastName.$params).map(x => x) : '' " :label="$t('request.lastName')">
        <b-input v-model="lastName" @input="$v.lastName.$touch()"></b-input>
      </b-field>

      <!-- suffix -->
      <b-field :type="($v.suffix.$error ? 'is-danger': '')" :message="$v.suffix.$error ? Object.keys($v.suffix.$params).map(x => x) : '' " :label="$t('request.suffix')">
        <b-input v-model="suffix" @input="$v.suffix.$touch()"></b-input>
      </b-field>

      <previous-name v-model="previousName"
        :type="($v.previousName.$error ? 'is-danger': '')"
        :message="$v.previousName.$error ? Object.keys($v.previousName.$params).map(x => x) : '' "
        :label="$t('request.previousName')"
        :instructions="$t('request.previousNameInstructions')"
        @input="$v.previousName.$touch()">
      </previous-name>

      <!-- phone Number -->
      <tel-input
        key="tel"
        :label="$t('request.tel')"
        :type="($v.tel.$error ? 'is-danger': '')"
        :message="$v.tel.$error ? Object.keys($v.tel.$params).map(x => x) : '' "
        v-model="tel"></tel-input>

        <!-- emailAddress -->
      <b-field
      :type="($v.email.$error ? 'is-danger': '')"
      :message="$v.email.$error ? Object.keys($v.email.$params).map(x => x) : '' "
      label="Your Current Email Address">
        <b-input v-model="email" @input="$v.email.$touch()"></b-input>
      </b-field>

      <!-- countryName -->

      <address-input
        :label="$t('request.addressAbroad')"
        key="overseas"
        v-model="abrAdr"
        toolTipTitle="Where are you now?">
        <div slot="instructions">
          <p>Please add your international Address</p>
        </div>
        <div slot="tooltip">
          You must provide your current residence address outside the US for informational purposes. Please provide your address outside the US  even if you request your blank ballot be sent to you by email/online or fax.
        </div>
      </address-input>
      <scroll-up :key="$route.params.stage"></scroll-up>
    <section >
      <div class="control buttons is-right">
        <nuxt-link :to="localePath({ name: 'index' })" class="button is-light is-medium" exact ><b-icon pack="fas" icon="caret-left"></b-icon><span>Back</span></nuxt-link>
        <nuxt-link :to="localePath({ name: 'request-stage', params: { stage: 'voting-information'} })" class="button is-primary is-medium" exact ><span> Next </span><b-icon pack="fas" icon="caret-right"></b-icon></nuxt-link>
      </div>
    </section>
  </section>

<!-- voting information -->
  <section v-if="stage.slug === 'voting-information'">

    <us-address
        :label="$t('request.votingAddress')"
        toolTipTitle="Your last US Address"
        v-model="votAdr">
        <div slot="instructions">
          <p>{{ $t('request.votingAddressInstructions') }}</p>
        </div>
        <div slot="tooltip">
          <p>Use the residence address of the last place you lived in the US. If you have never resided in the US, use the residence address of the last place your US parent(s) lived in the US. If your US parents last lived in the US in different locations, you may choose which one to use as your voting address.</p>
        </div>
      </us-address>

    <!-- <us-address-input
      :label="$t('request.votingAddress')"
      usOnly
      toolTipTitle="Your last US Address"
      v-model="votAdr">
      <div slot="instructions">
        <p>{{ $t('request.votingAddressInstructions') }}</p>
      </div>
      <div slot="tooltip">
        <p>Use the residence address of the last place you lived in the US. If you have never resided in the US, use the residence address of the last place your US parent(s) lived in the US. If your US parents last lived in the US in different locations, you may choose which one to use as your voting address.</p>
      </div>

    </us-address-input> -->

    <br/><br/>

    <voter-class v-model="voterClass"
      :allowsNeverResided="stateRules ? stateRules.allowsNeverResided : false"
      toolTipTitle="Intend to return vs. Return is uncertain">
      <div slot="tooltip">
        <p>Voters may choose ‘intend to return’ if they intend to return to the state in which they are registering to vote. An ‘intention’ is sufficient, you don’t need to have a fixed date of return or firm plans. Registering as “intend to return” should make you eligible to vote in State and Local races. However, it may also make you liable for state income taxes</p>
        <p>Voters may choose ‘return is uncertain’ if they do not have a current intention to return to the state in which they are registering to vote. Voters are entitled to receive a ballot for Federal offices and may, depending on their state, also receive a ballot for State and Local offices.</p>
      </div>
    </voter-class>

    <br/><br/>

      <!-- isRegistered -->
    <is-registered
      v-if="votAdr && votAdr.leo && votAdr.leo.jurisdiction && votAdr.leo.jurisdictionType"
      :label="`Are you already registered to vote in ${votAdr.leo.jurisdictionType === 'All' ? votAdr.leo.state : votAdr.leo.jurisdiction + ' ' + votAdr.leo.jurisdictionType}?`"
      v-model="isRegistered">
    </is-registered>

    <br/>

    <!-- recBallot -->
    <receive-ballot v-model="recBallot"
      v-if="votAdr && votAdr.regionCode"
      label="How would you like to receive your ballot?"
      :ballotReceiptOptions="stateRules ? stateRules.ballotReceiptOptions : ['Mail']"
      toolTipTitle="What is the best choice?">
      <div slot="tooltip">
        <p>You may request to receive your blank ballot by email/online, fax or mail. We encourage voters to request their blank ballot be sent by email/online or fax to avoid the delay associated with mail  and the possibility the ballot will be lost in transit.</p>
      </div>
    </receive-ballot>

    <br/>

    <tel-input
      key="fax"
      label="Enter the Fax Number you would like your ballot sent to."
      :type="($v.fax.$error ? 'is-danger': '')"
      :message="$v.fax.$error ? Object.keys($v.fax.$params).map(x => x) : '' "
      v-if="recBallot === 'fax'"
      @input="$v.fax.$touch()"
      v-model="fax">
    </tel-input>

    <!-- altEmail -->
    <b-field
      :type="($v.altEmail.$error ? 'is-danger': '')"
      :message="$v.altEmail.$error ? Object.keys($v.altEmail.$params).map(x => x) : '' "
      v-if="recBallot === 'email'"
      label="Add a second email here if you have one to ensure ballot delivery">
      <b-input v-model="altEmail" @input="$v.altEmail.$touch()"></b-input>
    </b-field>

      <!-- fwdAdr -->
      <forwarding-address v-model="fwdAdr"
        :label="$t('request.forwardingAddressInstructions')"
        toolTipTitle="Optional"
        v-if="recBallot === 'mail'">
        <div slot="tooltip">
          <p>This is optional. Please provide a forwarding address only if you request your blank ballot be sent to you by mail and you do not want it mailed to your current residence address outside the US. If you are uncertain what your mailing address will be when ballots are due to be sent out, you may have your blank ballot sent to a reliable third-party, such as a University student office or postal box.</p>
        </div>
      </forwarding-address>

    <scroll-up :key="$route.params.stage"></scroll-up>

    <section >
      <div class="control buttons is-right">
        <nuxt-link :to="localePath({ name: 'request-stage', params: { stage: 'your-information'} })" class="button is-light is-medium" exact ><b-icon pack="fas" icon="caret-left"></b-icon><span>Back</span></nuxt-link>
        <nuxt-link :to="localePath({ name: 'request-stage', params: { stage: 'id-and-contact-information'} })" class="button is-primary is-medium" exact ><span> Next </span><b-icon pack="fas" icon="caret-right"></b-icon></nuxt-link>
      </div>
    </section>
  </section>

  <section v-if="stage.slug === 'id-and-contact-information'">
<!-- identity and Contact information -->
      <!-- dob -->
      <b-field label="Date of Birth" :message="$v.dob.$error ? Object.keys($v.dob.$params).map(x => x) : '' ">
        <b-datepicker
          :value="localDob || lcldob"
          @input="value =>{ this.updateDob(value) }"
          placeholder="Type or select your birth date"
          :date-formatter="(date) => date.toLocaleDateString()"
          :min-date="minDate"
          :max-date="maxDate"
          icon="calendar"
          icon-pack="fa"
          :readonly="false">
        </b-datepicker>
      </b-field>

      <!-- new Date(Date.UTC(new Date(value).getFullYear(), new Date(value).getMonth(), new Date(value).getDate())).toISOString().substr(0, 10)
          :date-formatter="(date) => date.toLocaleDateString()"
          :date-parser="(date) => new Date(parseInt(date.substr(0,4)), parseInt(date.substr(5,2)) - 1, parseInt(date.substr(8,2)))"-->

      <gender
        label="Gender"
        toolTipTitle="Why is this required?"
        v-model="sex">
        <div slot="tooltip">
          <p>This is only required for Idaho voters.</p>
        </div>
      </gender>

      <!-- ssn -->
      <b-field :type="($v.ssn.$error ? 'is-danger': '')" :message="$v.ssn.$error ? Object.keys($v.ssn.$params).map(x => x) : '' " label="The last 4 digits of your Social Security Number">
        <b-input v-model="ssn" @input="$v.ssn.$touch()"></b-input>
      </b-field>

      <!-- stateId -->
      <b-field :type="($v.stateId.$error ? 'is-danger': '')" :message="$v.stateId.$error ? Object.keys($v.stateId.$params).map(x => x) : '' " label="Driver's license or   state ID #">
        <b-input v-model="stateId" @input="$v.stateId.$touch()"></b-input>
      </b-field>

      <!-- fwabRequest -->
      <b-field :type="($v.fwabRequest.$error ? 'is-danger': '')"
        :message="$v.fwabRequest.$error ? Object.keys($v.fwabRequest.$params).map(x => x) : '' "
        label="Do you want to register and request a ballot for all elections you are eligile to vote in?"
        v-if="isFwab">
        <b-input v-model="fwabRequest" @input="$v.fwabRequest.$touch()"></b-input>
      </b-field>

      <party-input
        label="Your political party"
        v-model="party"
        toolTipTitle="What is this?"
        :message="$v.party.$error ? Object.keys($v.party.$params).map(x => x) : '' "
        :type="($v.party.$error ? 'is-danger': '')">
        <div slot="tooltip">
          <p>Many states require voters to designate a political party to be eligible to vote in primary elections. Choosing a political party is optional.</p>
        </div>
      </party-input>

      <state-special
        label="State Specific Rules"
        v-model="stateSpecial"
        :state="votAdr && votAdr.regionCode ? votAdr.regionCode : ''"
        :isFWAB="isFWAB"
        :isIndNoParty="party && (party.toLowerCase() === 'republican' || party.toLowerCase() === 'rep' || party.toLowerCase() === 'democrat' || party.toLowerCase() === 'dem') ? false : true"
        :isReturnUncertain="Boolean(voterClass === 'uncertainReturn')"
        :isRegistering="Boolean(isRegistered === 'notRegistered' || isRegistered === 'unsure')">
      </state-special>

      <!-- addlInfo -->
      <b-field :type="($v.addlInfo.$error ? 'is-danger': '')" :message="$v.addlInfo.$error ? Object.keys($v.addlInfo.$params).map(x => x) : '' " label="Add any additional information here to help your election official find your records.">
        <b-input maxlength="258" type="textarea" v-model="addlInfo" @input="$v.addlInfo.$touch()"></b-input>
      </b-field>

      <!-- date -->
      <b-field label="Date" :message="$v.dob.$error ? Object.keys($v.dob.$params).map(x => x) : '' ">
        <b-datepicker
          :value="localDate || lcldate"
          @input="value =>{ this.updateDate(value) }"
          placeholder="Type or select today's date"
          icon="calendar"
          :date-formatter="(date) => date.toLocaleDateString()"
          icon-pack="fa"
          position="is-top-right"
          :readonly="false">
        </b-datepicker>


          <!-- :date-parser="(date) => new Date(parseInt(date.substr(0,4)), parseInt(date.substr(5,2)) - 1, parseInt(date.substr(8,2)))" -->

      </b-field>
      <scroll-up :key="$route.params.stage"></scroll-up>
    <section >
      <div class="control buttons is-right">
        <nuxt-link :to="localePath({ name: 'request-stage', params: { stage: 'voting-information'} })" class="button is-light is-medium" exact ><b-icon pack="fas" icon="caret-left"></b-icon><span>Back</span></nuxt-link>
        <nuxt-link :to="localePath({ name: 'request-stage', params: { stage: 'review'} })" class="button is-primary is-medium" exact ><span> Generate &amp; review your form </span><b-icon pack="fas" icon="caret-right"></b-icon></nuxt-link>
      </div>
    </section>
  </section>
</section>
</div>
</template>

<script>
import { required, requiredIf, email } from 'vuelidate/lib/validators'
import AddressInput from '~/components/AddressInput'
// import UsAddressInput from '~/components/UsAddressInput'
import UsAddress from '~/components/USAddress'
import VoterClass from '~/components/VoterClass'
import IsRegistered from '~/components/IsRegistered'
import ReceiveBallot from '~/components/ReceiveBallot'
import TelInput from '~/components/TelInput'
import ForwardingAddress from '~/components/ForwardingAddress'
import PartyInput from '~/components/PartyInput'
import PreviousName from '~/components/PreviousName'
import Gender from '~/components/Gender'
import StateSpecial from '~/components/StateSpecial'
import ScrollUp from '~/components/ScrollUp'

export default {
  transition: 'test',
  scrollToTop: true,
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
      id: '',
      createdAt: '',
      updatedAt: '',
      createdBy: '',
      emailOrPhone: '',
      leoAdr: {},
      localDob: null,
      localDate: null,
      fwabRequest: '',
      isFwab: false,
      isOpen: false
    }
  },
  components: {
    AddressInput,
    UsAddress,
    VoterClass,
    IsRegistered,
    ReceiveBallot,
    TelInput,
    ForwardingAddress,
    PartyInput,
    PreviousName,
    Gender,
    StateSpecial,
    ScrollUp
  },
  watch: {
    dob: function (newVal, oldVal) {
      if (!this.localDob && newVal) {
        console.log('dob from vuex-persist', new Date(new Date(newVal).getUTCFullYear(), new Date(newVal).getUTCMonth(), new Date(newVal).getUTCDate()))
        this.localDob = new Date(new Date(newVal).getUTCFullYear(), new Date(newVal).getUTCMonth(), new Date(newVal).getUTCDate())
      } else if (newVal !== oldVal) {
        this.localDob = new Date(new Date(newVal).getUTCFullYear(), new Date(newVal).getUTCMonth(), new Date(newVal).getUTCDate())
      }
    },
    date: function (newVal, oldVal) {
      if (!this.localDate && newVal) {
        console.log('date from vuex-persist', new Date(new Date(newVal).getUTCFullYear(), new Date(newVal).getUTCMonth(), new Date(newVal).getUTCDate()))
        this.localDate = new Date(new Date(newVal).getUTCFullYear(), new Date(newVal).getUTCMonth(), new Date(newVal).getUTCDate())
      } else if (newVal !== oldVal) {
        this.localDate = new Date(new Date(newVal).getUTCFullYear(), new Date(newVal).getUTCMonth(), new Date(newVal).getUTCDate())
      }
    }
  },
  computed: {
    lcldob () {
      return this.dob ? new Date(parseInt(this.dob.substr(0, 4)), parseInt(this.dob.substr(5, 2)) - 1, parseInt(this.dob.substr(8, 2))) : null
    },
    lcldate () {
      return this.date ? new Date(parseInt(this.date.substr(0, 4)), parseInt(this.date.substr(5, 2)) - 1, parseInt(this.date.substr(8, 2))) : null
    },
    stateRules () {
      if (this.votAdr && this.votAdr.regionCode) {
        return this.allStateRules.find(x => x.iso.toLowerCase() === this.votAdr.regionCode.toLowerCase())
      } else {
        return undefined
      }
    },
    maxDate () {
      return new Date(2000, 10, 6)
    },
    minDate () {
      return new Date(1870, 0, 1)
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
      get () { return this.requests[this.currentRequest] ? this.requests[this.currentRequest].email : null },
      set (value) { this.$store.commit('requests/update', { email: value }) }
    },
    firstName: {
      get () { return this.requests[this.currentRequest] ? this.requests[this.currentRequest].firstName : null },
      set (value) { this.$store.commit('requests/update', { firstName: value }) }
    },
    middleName: {
      get () { return this.requests[this.currentRequest] ? this.requests[this.currentRequest].middleName : null },
      set (value) { this.$store.commit('requests/update', { middleName: value }) }
    },
    lastName: {
      get () { return this.requests[this.currentRequest] ? this.requests[this.currentRequest].lastName : null },
      set (value) { this.$store.commit('requests/update', { lastName: value }) }
    },
    previousName: {
      get () { return this.requests[this.currentRequest] ? this.requests[this.currentRequest].previousName : {usesPreviousName: false, previousName: ''} },
      set (value) { this.$store.commit('requests/update', { previousName: value }) }
    },
    // usesPreviousName: {
    //   get () { return this.requests[this.currentRequest] ? this.requests[this.currentRequest].usesPreviousName : false },
    //   set (value) { this.$store.commit('requests/update', { usesPreviousName: value }) }
    // },
    suffix: {
      get () { return this.requests[this.currentRequest] ? this.requests[this.currentRequest].suffix : null },
      set (value) { this.$store.commit('requests/update', { suffix: value }) }
    },
    dob: {
      get () { return this.requests[this.currentRequest] ? this.requests[this.currentRequest].dob : null },
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
    abrAdr: {
      get () { return this.requests[this.currentRequest] ? this.requests[this.currentRequest].abrAdr : null },
      set (value) { this.$store.commit('requests/update', {abrAdr: value}) }
    },
    voterClass: {
      get () { return this.requests[this.currentRequest] ? this.requests[this.currentRequest].voterClass : null },
      set (value) { this.$store.commit('requests/update', {voterClass: value}) }
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
      get () { return this.requests[this.currentRequest] ? this.requests[this.currentRequest].party : null },
      set (value) { this.$store.commit('requests/update', {party: value}) }
    },
    fax: {
      get () { return this.requests[this.currentRequest] ? this.requests[this.currentRequest].fax : null },
      set (value) { this.$store.commit('requests/update', {fax: value}) }
    },
    altEmail: {
      get () { return this.requests[this.currentRequest] ? this.requests[this.currentRequest].altEmail : null },
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
    isFWAB: {
      get () { return this.requests[this.currentRequest] ? this.requests[this.currentRequest].isFWAB : false },
      set (value) { this.$store.commit('requests/update', {isFWAB: value}) }
    }
  },
  methods: {
    focusName () {
      this.$refs.userinput.focus()
    },
    updateDob (value) {
      let bday = new Date(Date.UTC(new Date(value).getFullYear(), new Date(value).getMonth(), new Date(value).getDate())).toISOString().substr(0, 10)
      this.$store.commit('requests/update', { dob: bday })
    },
    updateDate (value) {
      this.localDate = value
      let signDate = new Date(Date.UTC(new Date(value).getFullYear(), new Date(value).getMonth(), new Date(value).getDate())).toISOString().substr(0, 10)
      this.$store.commit('requests/update', { date: signDate })
    }
  },
  mounted () {
    console.log('mounted')
  },
  validations () {
    return {
      email: {
        required: requiredIf(function () {
          return this.recBallot === 'email'
        }),
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
      voterClass: {
        required
      },
      votAdr: {
        apt: {
          required
        },
        street: {
          required
        },
        city: {
          required
        },
        state: {
          required
        },
        zip: {
          required
        }
      },
      leoAdr: {
        required
      },
      recBallot: {
        required
      },
      dob: {
        required
      },
      fax: {
        required
      },
      tel: {
        required
      },
      altEmail: {
      },
      fwabRequest: {
        required
      },
      party: {
        required
      },
      sex: {
        required
      },
      ssn: {
        required
      },
      stateId: {
        required
      },
      fwdAdr: {
        required
      },
      addlInfo: {
        required
      },
      date: ''
    }
  }
}
</script>
