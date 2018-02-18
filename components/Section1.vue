<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">Name / Voter Type</p>
    </header>
    <section class="modal-card-body">
        <b-radio v-model="voterClass"
          size="is-small"
          native-value="military">
            I am on activated duty in the Uniformed Services or Merchant Marine
        </b-radio><br/>
        <b-radio v-model="voterClass"
          size="is-small"
          native-value="milSpouse">
            I am an eligible spouse or dependent.
        </b-radio><br/>
        <b-radio v-model="voterClass"
          size="is-small"
          native-value="natGuard">
            I am an activated National Guard member on State orders.
        </b-radio><br/>
        <b-radio v-model="voterClass"
          size="is-small"
          native-value="intendToReturn">
            I am a U.S. citizen living outside the country and I intend to return.
        </b-radio><br/>
        <b-radio v-model="voterClass"
          size="is-small"
          native-value="uncertainReturn">
            I am a U.S. citizen living outside the country and my return is uncertain.
        </b-radio><br/>
        <b-radio v-model="voterClass"
          size="is-small"
          native-value="neverResided">
            I am a U.S. citizen living outside the country, and I have never lived in the United States.
        </b-radio>
      <b-field label="Last name">
        <b-input v-model="lastName"></b-input>
      </b-field>
      <b-field label="First name">
        <b-input v-model="firstName"></b-input>
      </b-field>
      <b-field label="Middle Name">
        <b-input v-model="middleName"></b-input>
      </b-field>
      <b-field label="Suffix (Jr., II)">
        <b-input v-model="suffix"></b-input>
      </b-field>
      <b-field label="Previous Names">
        <b-input v-model="previousNames"></b-input>
      </b-field>
      <div class="block">
        <label class="label" for="sex">Sex</label>
        <b-radio name="sex" v-model="sex"
            native-value="female">
            Female
        </b-radio>
        <b-radio name="sex" v-model="sex"
            native-value="male">
            Male
        </b-radio>
      </div>
      <b-field label="Social Security Number">
        <b-input v-model="ssn"></b-input>
      </b-field>
      <b-field label="Driver's license or State ID#">
        <b-input v-model="stateId"></b-input>
      </b-field>
    </section>
    <footer class="modal-card-foot">
      <button class="button" type="button" @click="$parent.close()">Close</button>
      <button class="button is-primary">Login</button>
    </footer>
  </div>
</template>

<script>
export default {
  data () {
    return {
      voterClass: '',
      lastName: '',
      firstName: '',
      middleName: '',
      suffix: '',
      previousNames: '',
      sex: '',
      dob: '',
      ssn: '',
      stateId: ''
    }
  }
}
</script>
