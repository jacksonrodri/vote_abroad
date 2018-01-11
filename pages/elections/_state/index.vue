<template>
  <section class="container">
    <div class="columns is-centered">
      <div class="column is-8">
        <h1 class="title">
          {{ $route.params.state }} Elections
        </h1>
        <ul>
          <ul v-for="election in elections" :key="`${election.state} ${election.electionType}`">
            <li>{{ election.state }} - {{election.electionType }}</li>
            <li>{{ election.date }}</li>
          </ul>
        </ul>
      </div>
    </div>
  </section>
</template>

<script>

export default {
  async asyncData ({ app, route }) {
    return {
      elections: (await app.$content('/elections').get('elections')).body.filter(election => election.state === route.params.state)
    }
  },
  head: {
    title: 'Vote From Abroad - Absentee ballots for Americans Abroad.'
  }
}
</script>

<style>

</style>
