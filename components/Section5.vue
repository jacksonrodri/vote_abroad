<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">5. Voting Preference</p>
    </header>
    <section class="modal-card-body">
      <div class="block">
        <label class="label" for="votingPref">Voting Preference</label>
        <b-radio name="votingPref" v-model="votingPref"
            native-value="mail">
            Mail
        </b-radio>
        <b-radio name="votingPref" v-model="votingPref"
            native-value="email">
            Email or online
        </b-radio>
        <b-radio name="votingPref" v-model="votingPref"
            native-value="fax">
            Fax
        </b-radio>
      </div>
      <b-field label="Political Party">
        <b-input placeholder="eg. Democrat, Republican, Independent, No Party" type="text"></b-input>
      </b-field>
    </section>
    <footer class="modal-card-foot">
      <button class="button" type="button" @click="$parent.close()">Close</button>
      <button class="button is-primary">Save</button>
    </footer>
  </div>
</template>

<script>
export default {
  data () {
    return {
      votingPref: '',
      party: ''
    }
  }
}
</script>
