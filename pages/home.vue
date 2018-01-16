<template>
  <section class="section">
    <div class="hero is-medium">
      <div class="hero-body">
        <div class="columns is-centered">
          <div class="column is-10">
            <h1 class="title is-1 has-text-danger">
              Vote from abroad
            </h1>
            <h1 class="title is-1 has-text-danger">
              Request a ballot now!
            </h1>
            <phone-email></phone-email>
            <h1 class="title is-1 has-text-danger">
              <button class="button is-large is-danger">Start</button>
            </h1>
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
