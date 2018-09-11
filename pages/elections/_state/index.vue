<template>
  <section class="section">
    <div class="columns is-centered">
      <div class="column is-8">
          <h1 class="title is-3">{{$t('election.title', {state: $route.params.state.toUpperCase()})}}</h1>
          <b-table hoverable :data="elections">
            <template slot-scope="props">
              <b-table-column :label="$t('election.electionDay')">
                <h1 class="title is-5">{{ props.row.electionType }}</h1>
              </b-table-column>
              <b-table-column>
                <div class="calendar">
                  <header class="calendar-month">{{new Date(props.row.date).toLocaleDateString('en-US', {month: 'short', timeZone: 'UTC'}) }}</header>
                  <div class="calendar-date">
                    {{ new Date(props.row.date).toLocaleDateString('en-US', {day: 'numeric', timeZone: 'UTC'}) }}
                  </div>
                </div>
              </b-table-column>
              <b-table-column v-for="(rule, key) in props.row.rules" :key="key" :label="key">
                <ul>
                  <li v-for="(deadline, index) in rule"
                    :key="index.toString() + deadline.rule + deadline.voterType"
                    v-if="deadline.rule !== 'Not Required'">
                    <strong>{{ typeof deadline.voterType === 'string' ? deadline.voterType : $t('election.allVoters') }}</strong><br/><span class="tag is-success">{{ deadline.rule }}</span><br/>{{ new Date(deadline.date).toDateString() }}
                    <hr v-if="index < rule.length - 1">
                  </li>
                  <li v-else><strong>{{ deadline.rule }}</strong></li>
                </ul>
              </b-table-column>
            </template>
          </b-table>
        <!-- </section> -->
      </div>
    </div>
  </section>
</template>

<script>

export default {
  async asyncData ({ app, route }) {
    return {
      elections: (await app.$content('/elections').get('elections')).body.filter(election => election.state.toLowerCase() === route.params.state.toLowerCase())
      // states: (await app.$content('/state-rules').get(route.params.state))
    }
  },
  head: {
    title: 'Vote From Abroad - Absentee ballots for Americans Abroad.'
  },
  transition: 'test'
}
</script>

<style>

</style>
