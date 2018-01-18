<template>
  <section>
    <div class="hero is-medium">
      <div class="hero-body">
        <div class="columns is-centered">
          <div class="column is-8">
            <b-notification
              type="is-semitransparent"
              :closable="false">
              <h1 class="title is-1 has-text-danger">
                <span class="has-text-weight-bold">Vote from abroad</span>
              </h1>
              <h1 class="title is-1 has-text-danger has-text-weight-normal">
                Request a ballot <span class="has-text-weight-bold">now!</span>
              </h1>
              <phone-email></phone-email>
              <div class="buttons is-right is-marginless">
                  <button class="button is-large is-danger">Start</button>
              </div>
              <div class="buttons is-right">
                  <button class="button is-text is-paddingless">or start an anonymous session</button>
              </div>
            </b-notification>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import PhoneEmail from '~/components/PhoneEmail.vue'

export default {
  layout: 'vfa',
  components: {
    PhoneEmail
  }
}
</script>
