<template>
<section class="section">
    <h1 class="has-text-centered title is-3">Step {{ stage.order }} of 3</h1>
    <h3 class="has-text-centered subtitle is-4">{{ stage.name }}</h3>
  <section v-if="stage.slug === 'your-information'">
    <!-- <b-field label="Email">
      <b-input v-model="email"></b-input>
    </b-field>
    <b-field label="First Name">
      <b-input v-model="firstName"></b-input>
    </b-field><b-field label="Middle Name">
      <b-input v-model="middleName"></b-input>
    </b-field><b-field label="Last Name">
      <b-input v-model="lastName"></b-input>
    </b-field> -->
    <!-- <h3 class="title is-4" v-if="!isAuthenticated">
      Enter your email or mobile phone number to start your ballot request with a secure account.
    </h3> -->

      <!-- email -->
      <!-- <b-field grouped v-if="!isAuthenticated" >
        <b-field label="Email or mobile phone number" expanded>
          <b-field :type="($v.email.$error ? 'is-danger': '')" :message="$v.email.$error ? Object.keys($v.email.$params).map(x => x) : '' ">
            <b-input size="is-large" expanded v-model="emailOrPhone" placeholder="email or phone number" @input="emailOrPhoneLink" @keyup.enter.native="sendCode()" :disabled="this.pendingVerification"></b-input>
            <p class="control"><button @click="sendCode()" class="button is-info is-large" :disabled="this['pendingVerification']">Submit</button></p>
            <b-input v-show="type === 'code'" v-model="code" size="is-large" placeholder="code" ></b-input>
            <p v-show="type === 'code'" class="control"><button @click="passwordlessVerify({connection: 'email', email: email, verificationCode: code})" class="button is-info is-large" :disabled="!this.code" >Start</button></p>
          </b-field>
        </b-field>
      </b-field>
      <h3 v-else class="subtitle">You are logged in as {{user ? user.emailAddress : 'user'}} <button @click="logout()" class="button">Logout</button></h3>
      email: {{ email }}
      tel: {{ tel }} -->
<!-- your information -->
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

      <!-- <b-field class="field">
        <b-switch v-model="usesPreviousName" >Have you previously registered to vote using a different name?</b-switch>
      </b-field> -->

      <b-field>
        <b-field
          :label="$t('request.previousNameInstructions')">
          <b-radio-button v-model="usesPreviousName"
            :native-value="!usesPreviousName"
            :type="usesPreviousName ? 'is-danger' : 'is-success'">
            <b-icon :icon="!usesPreviousName ? 'check' : 'times'"></b-icon>
            <span>{{ !usesPreviousName ? 'Yes' : 'No'}}</span>
          </b-radio-button>
        </b-field>
      </b-field>

      <!-- previousName -->
      <b-field v-show="usesPreviousName" :type="($v.previousName.$error ? 'is-danger': '')" :message="$v.previousName.$error ? Object.keys($v.previousName.$params).map(x => x) : '' " :label="$t('request.previousName')">
        <b-input v-model="previousName" @input="$v.previousName.$touch()"></b-input>
      </b-field>

      <!-- countryName -->

      <address-input
        :label="$t('request.addressAbroad')"
        key="overseas"
        v-model="abrAdr">
        <div slot="instructions">
          <p>Please add your international Address</p>
        </div>

      </address-input>

      <div class="control buttons is-right">
        <nuxt-link :to="localePath({ name: 'index' })" class="button is-light is-medium" exact >Cancel</nuxt-link>
        <nuxt-link :to="localePath({ name: 'request-stage', params: { stage: 'voting-information'} })" class="button is-success is-medium" exact ><b-icon pack="fa" icon="check"></b-icon> <span> Next </span></nuxt-link>
      </div>

<!-- voting information -->
  </section>
  <section v-if="stage.slug === 'voting-information'">

    <voter-class v-model="voterClass"></voter-class>

    <us-address-input
      label="Your US voting Address"
      usOnly
      v-model="votAdr">
      <div slot="instructions">
        <p>Please add your US Voting Address</p>
      </div>

    </us-address-input>

      <h3 v-if="votAdr && votAdr.leo && votAdr.leo.jurisdiction && votAdr.leo.jurisdictionType" class="subtitle is-5">Are you already registered to vote in {{ `${votAdr.leo.jurisdiction } ${votAdr.leo.jurisdictionType}` }}?</h3>
      <!-- isRegistered -->
      <is-registered v-model="isRegistered"></is-registered>

      <h3 class="subtitle is-5">How would you like to receieve your ballot?</h3>

      <!-- recBallot -->
      <receive-ballot v-model="recBallot" v-if="votAdr && votAdr.regionCode"></receive-ballot>
      <div class="control buttons is-right">
        <nuxt-link :to="localePath({ name: 'request-stage', params: { stage: 'your-information'} })" class="button is-light is-medium" exact >Back</nuxt-link>
        <nuxt-link :to="localePath({ name: 'request-stage', params: { stage: 'id-and-contact-information'} })" class="button is-success is-medium" exact ><b-icon pack="fa" icon="check"></b-icon> <span> Next </span></nuxt-link>
      </div>
  </section>

  <section v-if="stage.slug === 'id-and-contact-information'">
<!-- identity and Contact information -->
      <!-- dob -->
      <b-field label="Date of Birth" :message="$v.dob.$error ? Object.keys($v.dob.$params).map(x => x) : '' ">
        <b-datepicker
          :value="localDob"
          @input="value =>{ localDob = value, this.updateDob(value) }"
          placeholder="Type or select your birth date"
          icon="calendar"
          icon-pack="fa"
          :readonly="false">
        </b-datepicker>
      </b-field>

      <!-- sex -->
      <b-field label="Sex"></b-field>
      <b-field>
        <b-radio-button v-model="sex" native-value="male" type="is-primary" size="is-medium">
          <span>Male</span>
        </b-radio-button>
        <b-radio-button v-model="sex" native-value="female" type="is-primary" size="is-medium">
          <span>Female</span>
        </b-radio-button>
      </b-field>

      <!-- ssn -->
      <b-field :type="($v.ssn.$error ? 'is-danger': '')" :message="$v.ssn.$error ? Object.keys($v.ssn.$params).map(x => x) : '' " label="The last 4 digits of your Social Security Number">
        <b-input v-model="ssn" @input="$v.ssn.$touch()"></b-input>
      </b-field>

      <!-- stateId -->
      <b-field :type="($v.stateId.$error ? 'is-danger': '')" :message="$v.stateId.$error ? Object.keys($v.stateId.$params).map(x => x) : '' " label="Driver's license or   state ID #">
        <b-input v-model="stateId" @input="$v.stateId.$touch()"></b-input>
      </b-field>

      <!-- fax -->
      <b-field
        :type="($v.fax.$error ? 'is-danger': '')"
        :message="$v.fax.$error ? Object.keys($v.fax.$params).map(x => x) : '' "
        v-if="recBallot === 'fax'"
        label="Fax Number">
        <b-input v-model="fax" @input="$v.fax.$touch()" type="phone"></b-input>
      </b-field>

      <!-- tel -->
      <b-field :type="($v.tel.$error ? 'is-danger': '')" :message="$v.tel.$error ? Object.keys($v.tel.$params).map(x => x) : '' " label="Telephone number">
        <b-input v-model="tel" @input="$v.tel.$touch()"></b-input>
      </b-field>

      <!-- altEmail -->
      <b-field
        :type="($v.altEmail.$error ? 'is-danger': '')"
        :message="$v.altEmail.$error ? Object.keys($v.altEmail.$params).map(x => x) : '' "
        v-if="recBallot === 'email'"
        label="Alternate Email">
        <b-input v-model="altEmail" @input="$v.altEmail.$touch()"></b-input>
      </b-field>

      <!-- fwabRequest -->
      <b-field :type="($v.fwabRequest.$error ? 'is-danger': '')" :message="$v.fwabRequest.$error ? Object.keys($v.fwabRequest.$params).map(x => x) : '' " label="Do you want to register and request a ballot for all elections you are eligile to vote in?">
        <b-input v-model="fwabRequest" @input="$v.fwabRequest.$touch()"></b-input>
      </b-field>

      <!-- party -->
      <b-field :type="($v.party.$error ? 'is-danger': '')" :message="$v.party.$error ? Object.keys($v.party.$params).map(x => x) : '' " label="What is your political party?">
        <b-input v-model="party" @input="$v.party.$touch()"></b-input>
      </b-field>

      <!-- fwdAdr -->
      <!-- <b-field :type="($v.fwdAdr.$error ? 'is-danger': '')" :message="$v.fwdAdr.$error ? Object.keys($v.fwdAdr.$params).map(x => x) : '' " label="If you receive mail at a different address enter it here.">
        <b-input v-model="fwdAdr" @input="$v.fwdAdr.$touch()"></b-input>
      </b-field> -->
      <address-input
        :label="$t('request.addressAbroad')"
        key="forwardingAddress"
        v-model="fwdAdr">
        <div slot="instructions">
          <p>If you would like your ballot sent to a different address, input it here.</p>
        </div>

      </address-input>

      <!-- addlInfo -->
      <b-field :type="($v.addlInfo.$error ? 'is-danger': '')" :message="$v.addlInfo.$error ? Object.keys($v.addlInfo.$params).map(x => x) : '' " label="Add any additional information here to help your election official find your records.">
        <b-input maxlength="258" type="textarea" v-model="addlInfo" @input="$v.addlInfo.$touch()"></b-input>
      </b-field>

      <!-- date -->
      <b-field label="Date" :message="$v.dob.$error ? Object.keys($v.dob.$params).map(x => x) : '' ">
        <b-datepicker
          :value="localDate"
          @input="value =>{ localDate = value, this.updateDate(value) }"
          placeholder="Type or select today's date"
          icon="calendar"
          icon-pack="fa"
          position="is-top-right"
          :readonly="false">
        </b-datepicker>
      </b-field>

      <div class="control buttons is-right">
        <nuxt-link :to="localePath({ name: 'request-stage', params: { stage: 'voting-information'} })" class="button is-light is-medium" exact >Back</nuxt-link>
        <nuxt-link :to="localePath({ name: 'request-stage', params: { stage: 'canvas'} })" class="button is-success is-medium" exact ><b-icon pack="fa" icon="check"></b-icon><span> Next </span></nuxt-link>
      </div>
  </section>
</section>
</template>

<script>
import { required, requiredIf, numeric, email } from 'vuelidate/lib/validators'
import AddressInput from '~/components/AddressInput'
import UsAddressInput from '~/components/UsAddressInput'
import VoterClass from '~/components/VoterClass'
import IsRegistered from '~/components/IsRegistered'
import ReceiveBallot from '~/components/ReceiveBallot'

export default {
  transition: 'test',
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
      date: ''
    }
  },
  components: {
    AddressInput,
    UsAddressInput,
    VoterClass,
    IsRegistered,
    ReceiveBallot
  },
  watch: {
    dob: function (newVal, oldVal) {
      if (!this.localDob && newVal) {
        console.log('date from vuex-persist', new Date(newVal))
        this.localDob = new Date(newVal)
      }
    }
  },
  computed: {
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
      get () { return this.requests[this.currentRequest] ? this.requests[this.currentRequest].previousName : null },
      set (value) { this.$store.commit('requests/update', { previousName: value }) }
    },
    usesPreviousName: {
      get () { return this.requests[this.currentRequest] ? this.requests[this.currentRequest].usesPreviousName : false },
      set (value) { this.$store.commit('requests/update', { usesPreviousName: value }) }
    },
    suffix: {
      get () { return this.requests[this.currentRequest] ? this.requests[this.currentRequest].suffix : null },
      set (value) { this.$store.commit('requests/update', { suffix: value }) }
    },
    dob: {
      get () { return this.requests[this.currentRequest] ? this.requests[this.currentRequest].dob : null },
      set (value) { this.$store.commit('requests/update', { dob: value }) }
    },
    tel: {
      get () { return this.requests[this.currentRequest] ? this.requests[this.currentRequest].tel : null },
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
    }
  },
  methods: {
    updateDob (value) {
      let bday = new Date(Date.UTC(new Date(value).getFullYear(), new Date(value).getMonth(), new Date(value).getDate())).toISOString().substr(0, 10)
      this.$store.commit('requests/update', { dob: bday })
    },
    updateDate (value) {
      let signDate = new Date(Date.UTC(new Date(value).getFullYear(), new Date(value).getMonth(), new Date(value).getDate())).toISOString().substr(0, 10)
      this.$store.commit('requests/update', { date: signDate })
    }
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
      tel: {
        numeric
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

<style lang="sass" scoped>
$flag-icon-css-path: '../../../node_modules/flag-icon-css/flags'
@import '../../../node_modules/flag-icon-css/sass/flag-icon.scss'

.flag-icon
  width: 3.8em;
  height: 100%;
  line-height: inherit;
</style>
