<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">Contact Information</p>
    </header>
    <section class="modal-card-body">
      <b-field label="email">
        <b-input placeholder="Email" type="text"></b-input>
      </b-field>
      <b-field label="Alternate email">
        <b-input placeholder="Alternate Email" type="text"></b-input>
      </b-field>
      <b-field label="Current Phone Number">
        <b-input placeholder="Phone" type="text"></b-input>
      </b-field>
      <b-field label="Current Fax Number">
        <b-input placeholder="Fax" type="text"></b-input>
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
      email: '',
      altEmail: '',
      phone: '',
      fax: ''
    }
  }
}
</script>
