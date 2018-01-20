<template>
  <section class="container">
    <div class="columns is-centered">
      <div class="column is-8">
        <h1>Leos</h1>
        <ul>
          <ul v-for="(leo, jurisdiction) in stateLeos" :key="jurisdiction">
            <li>{{ jurisdiction }}</li>
            <li>{{ leo.emailAddress }}</li>
          </ul>
        </ul>
        <h1 class="title">
          Vote From Abroad
        </h1>
        <h2 class="subtitle">
        </h2>
      </div>
    </div>
  </section>
</template>

<script>

export default {
  async asyncData ({ app, route }) {
    return {
      leos: (await app.$content('/leos').getAll())[0].body
    }
  },
  computed: {
    stateLeos () {
      return this.leos[this.$route.params.state.toUpperCase()]
    }
  },
  head: {
    title: 'Vote From Abroad - Absentee ballots for Americans Abroad.'
  }
}
</script>

<style>

</style>
