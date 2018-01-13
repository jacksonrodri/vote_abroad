<template>
  <section class="container">
    <div class="columns is-centered">
      <div class="column is-8">
        <h1 class="title">
          {{ state.title }}
        </h1>
          <ul v-for="election in elections" :key="`${election.state} ${election.electionType}`">
            <li>{{ election.state }} - {{election.electionType }}</li>
            <li>{{ election.date }}</li>
          </ul>
      </div>
    </div>
  </section>
</template>

<script>

export default {
  async asyncData ({ app, params }) {
    return {
      elections: (await app.$content('/elections').get('elections')).body.filter(election => election.state.toLowerCase() === params.state.toLowerCase()),
      state: (await app.$content('/state-rules').get(`states/${params.state}`)).body
    }
  },
  head: {
    title: 'Vote From Abroad - Absentee ballots for Americans Abroad.'
  }
}
</script>

<style>

</style>
