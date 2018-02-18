<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">6. Additional Information</p>
    </header>
    <section class="modal-card-body">
      <label for="additionalInfo" class="label">What additional information must you provide?</label>
      <b-field>
        <b-input type="text"></b-input>
      </b-field>
      <b-field>
        <b-input type="text"></b-input>
      </b-field>
      <b-field>
        <b-input type="text"></b-input>
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
      line1: '',
      line2: '',
      line3: ''
    }
  }
}
</script>
