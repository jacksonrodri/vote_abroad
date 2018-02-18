<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">3. Current Address</p>
    </header>
    <section class="modal-card-body">
      <b-tabs type="is-toggle" expanded>
        <b-tab-item label="Your mailing address">
          <b-field>
            <b-input placeholder="Line 1" type="text"></b-input>
          </b-field>
          <b-field>
            <b-input placeholder="Line 2" type="text"></b-input>
          </b-field>
          <b-field>
            <b-input placeholder="Line 3" type="text"></b-input>
          </b-field>
          <b-field>
            <b-input placeholder="Line 4" type="text"></b-input>
          </b-field>
          <b-field>
            <b-input placeholder="Line 5" type="text"></b-input>
          </b-field>
        </b-tab-item>
        <b-tab-item label="Your mail forwarding address">
          <b-field>
            <b-input placeholder="Line 1" type="text"></b-input>
          </b-field>
          <b-field>
            <b-input placeholder="Line 2" type="text"></b-input>
          </b-field>
          <b-field>
            <b-input placeholder="Line 3" type="text"></b-input>
          </b-field>
          <b-field>
            <b-input placeholder="Line 4" type="text"></b-input>
          </b-field>
          <b-field>
            <b-input placeholder="Line 5" type="text"></b-input>
          </b-field>
        </b-tab-item>
      </b-tabs>
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
