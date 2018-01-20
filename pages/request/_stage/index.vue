<template>
<section class="box">
  {{ stage }}
  <section v-if="stage === 'your-information'" class="section">
    <h3 class="subtitle is-5">Your Information</h3>
    <h1 class="title">Step 1 of 3</h1>
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
      <b-field :type="($v.firstName.$error ? 'is-danger': '')" :message="$v.firstName.$error ? Object.keys($v.firstName.$params).map(x => x) : '' " label="First Name">
        <b-input v-model="firstName" @input="$v.firstName.$touch()"></b-input>
      </b-field>

      <!-- middleName -->
      <b-field :type="($v.middleName.$error ? 'is-danger': '')" :message="$v.middleName.$error ? Object.keys($v.middleName.$params).map(x => x) : '' " label="middleName">
        <b-input v-model="middleName" @input="$v.middleName.$touch()"></b-input>
      </b-field>

      <!-- lastName -->
      <b-field :type="($v.lastName.$error ? 'is-danger': '')" :message="$v.lastName.$error ? Object.keys($v.lastName.$params).map(x => x) : '' " label="lastName">
        <b-input v-model="lastName" @input="$v.lastName.$touch()"></b-input>
      </b-field>

      <!-- suffix -->
      <b-field :type="($v.suffix.$error ? 'is-danger': '')" :message="$v.suffix.$error ? Object.keys($v.suffix.$params).map(x => x) : '' " label="suffix">
        <b-input v-model="suffix" @input="$v.suffix.$touch()"></b-input>
      </b-field>

      <b-field class="field">
        <b-switch v-model="usesPreviousName" >Have you previously registered to vote using a different name?</b-switch>
      </b-field>

      <!-- previousName -->
      <b-field v-show="usesPreviousName" :type="($v.previousName.$error ? 'is-danger': '')" :message="$v.previousName.$error ? Object.keys($v.previousName.$params).map(x => x) : '' " label="previousName">
        <b-input v-model="previousName" @input="$v.previousName.$touch()"></b-input>
      </b-field>

      <!-- countryName -->
      <address-input
        label="Your address abroad"
        v-model="abrAdr2">
        <div slot="instructions">
          <p>Please add your international Address</p>
        </div>

      </address-input>
      <!-- <b-field label="Country">
            <b-autocomplete
                v-model="abrAdr.countryName"
                placeholder="e.g. Canada"
                keep-first
                :data="filteredCountries"
                field="label"
                icon-pack="flag"
                size="is-medium"
                :icon="`icon flag-icon-${countryCode ? countryCode.toLowerCase() : 'un'}`"
                @select="option => selected = option">
              <template slot-scope="props">
                <span :class="`flag-icon flag-icon-${props.option.iso.toLowerCase()}`"></span>{{ props.option.label }}
              </template>
            </b-autocomplete>
        </b-field> -->
      <!-- <b-field :type="($v.abrAdr.countryName.$error ? 'is-danger': '')" :message="$v.abrAdr.countryName.$error ? Object.keys($v.abrAdr.countryName.$params).map(x => x) : '' " label="countryName">
        <b-input v-model="abrAdr.countryName" @input="$v.abrAdr.countryName.$touch()"></b-input>
      </b-field> -->

      <!-- extendedAddress -->
      <!-- <b-field :type="($v.abrAdr.extendedAddress.$error ? 'is-danger': '')" :message="$v.abrAdr.extendedAddress.$error ? Object.keys($v.abrAdr.extendedAddress.$params).map(x => x) : '' " :label="countryList.filter(x => x.iso === countryCode).length === 1 ? countryList.filter(x => x.iso === countryCode)[0].fields[1].premise.label : 'Address 2'">
        <b-input v-model="abrAdr.extendedAddress" @input="$v.abrAdr.extendedAddress.$touch()"></b-input>
      </b-field> -->

      <!-- streetAddress -->
      <!-- <b-field :type="($v.abrAdr.streetAddress.$error ? 'is-danger': '')" :message="$v.abrAdr.streetAddress.$error ? Object.keys($v.abrAdr.streetAddress.$params).map(x => x) : '' " :label="countryList.filter(x => x.iso === countryCode).length === 1 ? countryList.filter(x => x.iso === countryCode)[0].fields[0].thoroughfare.label : 'Address 1'">
        <b-input v-model="abrAdr.streetAddress" @input="$v.abrAdr.streetAddress.$touch()"></b-input>
      </b-field> -->

      <!-- locality -->
      <!-- <b-field :type="($v.abrAdr.locality.$error ? 'is-danger': '')" :message="$v.abrAdr.locality.$error ? Object.keys($v.abrAdr.locality.$params).map(x => x) : '' " label="locality">
        <b-input v-model="abrAdr.locality" @input="$v.abrAdr.locality.$touch()"></b-input>
      </b-field> -->

      <!-- region -->
      <!-- <b-field :type="($v.abrAdr.region.$error ? 'is-danger': '')" :message="$v.abrAdr.region.$error ? Object.keys($v.abrAdr.region.$params).map(x => x) : '' " label="region">
        <b-input v-model="abrAdr.region" @input="$v.abrAdr.region.$touch()"></b-input>
      </b-field> -->

      <!-- postalCode -->
      <!-- <b-field :type="($v.abrAdr.postalCode.$error ? 'is-danger': '')" :message="$v.abrAdr.postalCode.$error ? Object.keys($v.abrAdr.postalCode.$params).map(x => x) : '' " label="postalCode">
        <b-input v-model="abrAdr.postalCode" @input="$v.abrAdr.postalCode.$touch()"></b-input>
      </b-field> -->

      <!-- alternateFormat -->
      <b-field :type="($v.abrAdr.alternateFormat.$error ? 'is-danger': '')" :message="$v.abrAdr.alternateFormat.$error ? Object.keys($v.abrAdr.alternateFormat.$params).map(x => x) : '' " label="alternateFormat">
        <b-input type="textarea" v-model="abrAdr.alternateFormat" @input="$v.abrAdr.alternateFormat.$touch()"></b-input>
      </b-field>

      <b-field class="field">
        <b-switch v-model="abrAdr.usesAlternateFormat" >Use an Alternate format</b-switch>
      </b-field>
      <div class="control buttons">
        <nuxt-link :to="localePath({ name: 'index' })" class="button is-info is-large" exact >Cancel</nuxt-link>
        <nuxt-link :to="localePath({ name: 'request-stage', params: { stage: 'voting-information'} })" class="button is-primary is-large" exact >Next</nuxt-link>
        <!-- <button class="button is-info is-large">Cancel</button>
        <button class="button is-primary is-large">Next</button> -->
      </div>

<!-- voting information -->
  </section>
  <section v-if="stage === 'voting-information'" class="section">
    <h1 class="title">Step 2 of 3</h1>

      <h1 class="subtitle is-5">I am a U.S. citizen living outside the country, and: </h1>

      <b-field>
        <b-radio-button v-model="voterClass.militaryOrCivilian" native-value="military" type="is-primary" size="is-medium">
          <span>I am in the military. (or other uniformed services)</span>
        </b-radio-button>
        <b-radio-button v-model="voterClass.militaryOrCivilian" native-value="civilian" type="is-primary" size="is-medium">
          <span>I am a civilian (non military)</span>
        </b-radio-button>
      </b-field>

      <h1 v-show="voterClass.militaryOrCivilian !== 'military'" class="subtitle is-5">and I: </h1>
      <h1 v-show="voterClass.militaryOrCivilian === 'military'" class="subtitle is-5">and I am: </h1>

      <b-field v-show="voterClass.militaryOrCivilian === 'military'">
        <b-radio-button v-model="voterClass.militaryType" native-value="military" type="is-primary" size="is-medium" :disabled="voterClass.militaryOrCivilian !== 'military'">
          <span>in the Uniformed Services or Merchant Marine</span>
        </b-radio-button>
        <b-radio-button v-model="voterClass.militaryType" native-value="milSpouse" type="is-primary" size="is-medium" :disabled="voterClass.militaryOrCivilian !== 'military'">
          <span>an eligible spouse or dependent</span>
        </b-radio-button>
        <b-radio-button v-model="voterClass.militaryType" native-value="natGuard" type="is-primary" size="is-medium" :disabled="voterClass.militaryOrCivilian !== 'military'">
          <span>an activated National Guard member</span>
        </b-radio-button>
      </b-field>

      <b-field v-show="voterClass.militaryOrCivilian !== 'military'">
        <b-radio-button v-model="voterClass.overseasStatus" native-value="intendToReturn" type="is-primary" size="is-medium" :disabled="voterClass.militaryOrCivilian !== 'civilian'">
          <span>I intend to return</span>
        </b-radio-button>
        <b-radio-button v-model="voterClass.overseasStatus" native-value="uncertainReturn" type="is-primary" size="is-medium" :disabled="voterClass.militaryOrCivilian !== 'civilian'">
          <span>my return is uncertain</span>
        </b-radio-button>
        <b-radio-button v-model="voterClass.overseasStatus" native-value="neverResided" type="is-primary" size="is-medium" :disabled="voterClass.militaryOrCivilian !== 'civilian'">
          <span>I have never lived in the United States</span>
        </b-radio-button>
      </b-field>

      <!-- votAdr.apt -->
      <!-- <b-field :type="($v.votAdr.apt.$error ? 'is-danger': '')" :message="$v.votAdr.apt.$error ? Object.keys($v.votAdr.apt.$params).map(x => x) : '' " label="votAdr.apt">
        <b-input v-model="votAdr.apt" @input="$v.votAdr.apt.$touch()"></b-input>
      </b-field> -->

      <!-- votAdr.street -->
      <!-- <b-field :type="($v.votAdr.street.$error ? 'is-danger': '')" :message="$v.votAdr.street.$error ? Object.keys($v.votAdr.street.$params).map(x => x) : '' " label="votAdr.street">
        <b-input v-model="votAdr.street" @input="$v.votAdr.street.$touch()"></b-input>
      </b-field> -->

      <!-- votAdr.city -->
      <!-- <b-field :type="($v.votAdr.city.$error ? 'is-danger': '')" :message="$v.votAdr.city.$error ? Object.keys($v.votAdr.city.$params).map(x => x) : '' " label="votAdr.city">
        <b-input v-model="votAdr.city" @input="$v.votAdr.city.$touch()"></b-input>
      </b-field> -->

      <!-- votAdr.state -->
      <!-- <b-field :type="($v.votAdr.state.$error ? 'is-danger': '')" :message="$v.votAdr.state.$error ? Object.keys($v.votAdr.state.$params).map(x => x) : '' " label="votAdr.state">
        <b-input v-model="votAdr.state" @input="$v.votAdr.state.$touch()"></b-input>
      </b-field> -->

      <!-- votAdr.zip -->
      <!-- <b-field :type="($v.votAdr.zip.$error ? 'is-danger': '')" :message="$v.votAdr.zip.$error ? Object.keys($v.votAdr.zip.$params).map(x => x) : '' " label="votAdr.zip">
        <b-input v-model="votAdr.zip" @input="$v.votAdr.zip.$touch()"></b-input>
      </b-field> -->
      <address-input
        label="Your US voting Address"
        usOnly
        v-model="abrAdr2">
        <div slot="instructions">
          <p>Please add your US Voting Address</p>
        </div>

      </address-input>

      <!-- <jurisdiction></jurisdiction> -->
      <!-- votAdr.county -->
      <b-field :type="($v.votAdr.county.$error ? 'is-danger': '')" :message="$v.votAdr.county.$error ? Object.keys($v.votAdr.county.$params).map(x => x) : '' " label="votAdr.county">
        <b-input v-model="votAdr.county" @input="$v.votAdr.county.$touch()"></b-input>
      </b-field>

      <!-- leoAdr -->
      <b-field label="Jurisdiction">
        <b-select placeholder="choose your jurisdiction" v-model="leoAdr">
          <option v-for="option in jurisdictions" :value="option.leo.adr" :key="option.id">
            {{ option.jurisdictionName }}
          </option>
        </b-select>
      </b-field>

      <p>Local Election Official Address: {{leoAdr}}</p>

      <h3 class="subtitle is-5">How would you like to receieve your ballot?</h3>

      <!-- recBallot -->
      <b-field>
        <b-radio-button v-model="recBallot" native-value="email" type="is-primary" size="is-medium">
          <span>Email or online</span>
        </b-radio-button>
        <b-radio-button v-model="recBallot" native-value="mail" type="is-primary" size="is-medium">
          <span>Mail</span>
        </b-radio-button>
        <b-radio-button v-model="recBallot" native-value="fax" type="is-primary" size="is-medium">
          <span>Fax</span>
        </b-radio-button>
      </b-field>
  </section>

  <section v-if="stage === 'id-and-contact-information'" class="section">

<!-- identity and Contact information -->
<h1 class="title">Step 3 of 3</h1>
      <!-- dob -->
      <b-field :type="($v.dob.$error ? 'is-danger': '')" :message="$v.dob.$error ? Object.keys($v.dob.$params).map(x => x) : '' " label="dob">
        <b-input v-model="dob" @input="$v.dob.$touch()"></b-input>
      </b-field>

      <!-- fax -->
      <b-field :type="($v.fax.$error ? 'is-danger': '')" :message="$v.fax.$error ? Object.keys($v.fax.$params).map(x => x) : '' " label="fax">
        <b-input v-model="fax" @input="$v.fax.$touch()" type="phone"></b-input>
      </b-field>

      <!-- tel -->
      <b-field :type="($v.tel.$error ? 'is-danger': '')" :message="$v.tel.$error ? Object.keys($v.tel.$params).map(x => x) : '' " label="tel">
        <b-input v-model="tel" @input="$v.tel.$touch()"></b-input>
      </b-field>

      <!-- altEmail -->
      <b-field :type="($v.altEmail.$error ? 'is-danger': '')" :message="$v.altEmail.$error ? Object.keys($v.altEmail.$params).map(x => x) : '' " label="altEmail">
        <b-input v-model="altEmail" @input="$v.altEmail.$touch()"></b-input>
      </b-field>

      <!-- fwabRequest -->
      <b-field :type="($v.fwabRequest.$error ? 'is-danger': '')" :message="$v.fwabRequest.$error ? Object.keys($v.fwabRequest.$params).map(x => x) : '' " label="fwabRequest">
        <b-input v-model="fwabRequest" @input="$v.fwabRequest.$touch()"></b-input>
      </b-field>

      <!-- party -->
      <b-field :type="($v.party.$error ? 'is-danger': '')" :message="$v.party.$error ? Object.keys($v.party.$params).map(x => x) : '' " label="party">
        <b-input v-model="party" @input="$v.party.$touch()"></b-input>
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
      <b-field :type="($v.ssn.$error ? 'is-danger': '')" :message="$v.ssn.$error ? Object.keys($v.ssn.$params).map(x => x) : '' " label="ssn">
        <b-input v-model="ssn" @input="$v.ssn.$touch()"></b-input>
      </b-field>

      <!-- stateId -->
      <b-field :type="($v.stateId.$error ? 'is-danger': '')" :message="$v.stateId.$error ? Object.keys($v.stateId.$params).map(x => x) : '' " label="stateId">
        <b-input v-model="stateId" @input="$v.stateId.$touch()"></b-input>
      </b-field>

      <!-- fwdAdr -->
      <b-field :type="($v.fwdAdr.$error ? 'is-danger': '')" :message="$v.fwdAdr.$error ? Object.keys($v.fwdAdr.$params).map(x => x) : '' " label="fwdAdr">
        <b-input v-model="fwdAdr" @input="$v.fwdAdr.$touch()"></b-input>
      </b-field>

      <!-- adlInfo -->
      <b-field :type="($v.adlInfo.$error ? 'is-danger': '')" :message="$v.adlInfo.$error ? Object.keys($v.adlInfo.$params).map(x => x) : '' " label="adlInfo">
        <b-input maxlength="200" type="textarea" v-model="adlInfo" @input="$v.adlInfo.$touch()"></b-input>
      </b-field>

      <b-field>
        <b-input
          placeholder="Last 4 digits of your Social Security Number"
          size="is-large">
        </b-input>
      </b-field>

      <!-- date -->
      <b-field label="Date">
        <b-datepicker placeholder="Type or select a date..." icon="calendar-today" :readonly="false">
        </b-datepicker>
      </b-field>

      <div class="control buttons">
        <button class="button is-primary is-large">Request a ballot now!</button>
        <button class="button is-info is-large">or start without an account</button>
      </div>
  </section>
</section>
</template>

<script>
import { required, requiredIf, requiredUnless, numeric, alphaNum, email } from 'vuelidate/lib/validators'
// minLength, maxLength,
import countries from '~/assets/countryaddresses'
import AddressInput from '~/components/AddressInput'
// import Jurisdiction from '~/components/Jurisdiction'

export default {
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
      // firstName: '',
      // middleName: '',
      // lastName: '',
      usesPreviousName: false,
      // previousName: '',
      // suffix: '',
      emailOrPhone: '',
      // email: '',
      // tel: '',
      abrAdr2: {},
      abrAdr: {
        extendedAddress: '',
        streetAddress: '',
        locality: '',
        region: '',
        postalCode: '',
        countryName: '',
        alternateFormat: '',
        usesAlternateFormat: false
      },
      voterClass: {
        militaryOrCivilian: '',
        militaryType: '', // Active Duty in Uniformed Services, Eligible Spouse or Nat Guard on state orders
        overseasStatus: '' // IntendToReturn, ReturnUncertain, NeverResided
      },
      votAdr: {
        apt: '',
        street: '',
        city: '',
        county: '',
        state: '',
        zip: '',
        alternateFormat: '',
        useAlternateFormat: false
      },
      leoAdr: {},
      recBallot: '',
      dob: '',
      fax: '',
      altEmail: '',
      fwabRequest: '',
      party: '',
      sex: '',
      ssn: '',
      stateId: '',
      fwdAdr: '',
      adlInfo: '',
      date: '',
      jurisdictions: [
        { id: 'NC-Wake',
          jurisdictionName: 'Wake',
          jurisdictionType: 'County',
          leo: {
            name: 'someone nice',
            tel: '(919)975-5155',
            email: 'email@address.com',
            adr: {
              street: '711 something street',
              city: 'Raleigh',
              state: 'NC',
              zip: '27603'
            }
          }
        }
      ]
    }
  },
  components: {
    AddressInput
  },
  computed: {
    countryList () {
      return countries()
    },
    countryCode () {
      let country = this.countryList.filter(x => x.label === this.abrAdr.countryName)[0] || {iso: 'un'}
      return country.iso
    },
    filteredCountries () {
      if (this.abrAdr.countryName && this.abrAdr.countryName.length > 1) {
        return this.countryList.filter((option) => {
          return option.label
            .toString()
            .toLowerCase()
            .indexOf(this.abrAdr.countryName.toLowerCase()) >= 0 || option.iso
            .toString()
            .toLowerCase()
            .indexOf(this.abrAdr.countryName.toLowerCase()) >= 0
        })
      } else {
        return this.countryList
      }
    },
    stage () {
      return this.$route.params.stage
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
    suffix: {
      get () { return this.requests[this.currentRequest] ? this.requests[this.currentRequest].suffix : null },
      set (value) { this.$store.commit('requests/update', { suffix: value }) }
    },
    tel: {
      get () { return this.requests[this.currentRequest] ? this.requests[this.currentRequest].tel : null },
      set (value) { this.$store.commit('requests/update', { tel: value }) }
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
      abrAdr: {
        extendedAddress: {
          alphaNum
        },
        streetAddress: {
          required: requiredUnless(function () { return this.$data.abrAdr.usesAlternateFormat })
        },
        locality: {
          required: requiredUnless(function () { return this.$data.abrAdr.usesAlternateFormat })
        },
        region: {
          required: requiredUnless(function () { return this.$data.abrAdr.usesAlternateFormat })
        },
        postalCode: {
          required: requiredUnless(function () { return this.$data.abrAdr.usesAlternateFormat })
        },
        countryName: {
          required
        },
        alternateFormat: {
          required: requiredIf(function () { return this.$data.abrAdr.usesAlternateFormat })
        },
        usesAlternateFormat: {
          required
        }
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
        county: {
          required
        },
        state: {
          required
        },
        zip: {
          required
        },
        useAlternateFormat: {
          required
        },
        alternateFormat: {
          required: requiredIf(function () { return this.$data.votAdr.useAlternateFormat })
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
      adlInfo: {
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
