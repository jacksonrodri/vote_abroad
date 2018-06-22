<template>
  <section class="container">
    <div class="columns is-centered">
      <div class="column is-8">
        <h1>Leos</h1>
        <ul>
          <ul v-for="leo in stateLeos" :key="leo.j">
            <li>{{ leo.j }}</li>
            <li>{{ leo.e }}</li>
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
      // leos: (await app.$content('/leos').getAll())[0].body
      stateLeos: (await app.$content('/leos').get(route.params.state)).body
    }
  },
  // computed: {
  //   stateLeos () {
  //     return this.$route.params.state ? this.leos[this.$route.params.state.toUpperCase()] : this.leos.NC
  //   }
  // },
  head: {
    title: 'Vote From Abroad - Absentee ballots for Americans Abroad.'
  }
}
</script>

<style>

</style>
