<template>
  <section class="section">
    <div class="columns is-centered">
      <div class="column is-10 is-8-desktop is-7-widescreen is-6-fullhd is-paddingless">
        <h1 class="title">
          {{ state.state }}
        </h1>
        <nuxtent-body class="content" :body="state.body" />
          <!-- <ul v-for="election in elections" :key="`${election.state} ${election.electionType}`">
            <li>{{ election.state }} - {{election.electionType }}</li>
            <li>{{ election.date }}</li>
          </ul> -->
          <!-- <h1 class="title is-4">Find your local Election Official ({{state.state}})</h1>
          <b-autocomplete
            :value="typedJurisdiction || jurisdiction || ''"
            open-on-focus
            keep-first
            expanded
            @input="updated"
            ref="jurisdiction"
            :data="filteredLeos"
            field="n"
            placeholder="Start typing to find your jurisdiction"
            @select="option => updateLeo(option)">
            <template slot-scope="props"><strong>{{props.option.j}} {{props.option.j.toLowerCase().indexOf(props.option.t.toLowerCase()) > -1 ? '' : props.option.t}}</strong> - <small>{{props.option.n}}</small></template>
          </b-autocomplete> -->
          <h1 class="title is-4">Elections Deadlines for {{state.state}} Voters Abroad</h1>
          <b-table hoverable :data="upcomingElections">
            <template slot-scope="props">
              <b-table-column label="Election Day">
                <h1 class="title is-5">{{ props.row.electionType }}</h1>
              </b-table-column>
              <b-table-column>
                <div class="calendar">
                  <header class="calendar-month">{{new Date(props.row.date).toLocaleDateString('en-US', {month: 'short'}) }}</header>
                  <div class="calendar-date">
                    {{ new Date(props.row.date).toLocaleDateString('en-US', {day: 'numeric'}) }}
                  </div>
                </div>
              </b-table-column>
              <b-table-column v-for="(rule, key) in props.row.rules" :key="key" :label="key">
                <ul>
                  <li v-for="(deadline, index) in rule"
                    :key="index.toString() + deadline.rule + deadline.voterType"
                    v-if="deadline.rule !== 'Not Required'">
                    <strong>{{ typeof deadline.voterType === 'string' ? deadline.voterType : 'All Voters' }}</strong><br/><span class="tag is-success">{{ deadline.rule }}</span><br/>{{ new Date(deadline.date).toDateString() }}
                    <hr v-if="index < rule.length - 1">
                  </li>
                  <li v-else><strong>{{ deadline.rule }}</strong></li>
                </ul>
              </b-table-column>
            </template>
          </b-table>
      </div>
    </div>
  </section>
</template>

<script>

export default {
  async asyncData ({ app, params }) {
    return {
      elections: (await app.$content('/elections').get('elections')).body.filter(election => election.state && params.state && election.state.toLowerCase() === params.state.toLowerCase()),
      state: (await app.$content('/rls').get(`states/${params.state.toLowerCase()}`))
    }
  },
  head: {
    title: 'Vote From Abroad - Absentee ballots for Americans Abroad.'
  },
  layout: 'default',
  computed: {
    upcomingElections () {
      return this.elections
        .filter(x => new Date(x.date).getTime() > Date.now())
        .sort(function (a, b) {
          var dateA = new Date(a.date).getTime()
          var dateB = new Date(b.date).getTime()
          return dateA - dateB
        })
    }
  }
}
</script>

<style>

</style>
