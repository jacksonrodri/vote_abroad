<template>
<section>
  <b-notification
    type="is-white"
    :closable="false">
    <h1 class="title is-3 is-hidden-mobile is-spaced has-text-danger">
      <span class="has-text-weight-semibold">Login</span>
    </h1>
    <phone-email
      size="is-medium"
      v-model="phoneOrEmail">
    </phone-email>
    <div class="buttons is-right is-marginless">
      <button @click="authStart('/request/your-information')" class="button is-large is-danger">Log in</button>
      <!-- <nuxt-link :to="localePath({ name: 'request-stage', params: { stage: 'your-information'} })" class="button is-large is-danger" exact >start</nuxt-link> -->
    </div>
    <div class="buttons is-right">
        <button class="button is-text has-text-black is-paddingless">Cancel</button>
    </div>
  </b-notification>
</section>
</template>

<script>
import PhoneEmail from '~/components/PhoneEmail.vue'
import { mapActions } from 'vuex'

export default {
  components: {
    PhoneEmail
  },
  data () {
    return {
      phoneOrEmail: {}
    }
  },
  methods: {
    ...mapActions('userauth', [
      'sendEmailCode',
      'sendEmailLink',
      'sendEmailLink',
      'promptCode',
      'authStart'
    ])
  }
}
</script>

