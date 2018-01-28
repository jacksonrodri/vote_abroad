<template>
  <section class="section columns is-centered">
    <div class="column is-three-fifths">
      <form-sign-and-date/>
      <div class="field is-grouped is-grouped-right">
        <div class="control">
          <nuxt-link :to="localePath({path: '/request/identification'})" class="button is-secondary">Previous</nuxt-link>
        </div>
        <div class="control">
          <nuxt-link :to="localePath({path: '/request/send-in'})" class="button is-primary">Next</nuxt-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import FormSignAndDate from '~/components/FormSignAndDate'

export default {
  components: {
    FormSignAndDate
  }
}
</script>
