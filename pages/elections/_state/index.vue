<template>
  <section class="section">
    <div class="columns is-centered">
      <div class="column is-8">
        <nav class="breadcrumb" aria-label="breadcrumbs">
          <ul>
            <li><nuxt-link :to="localePath('index')">{{$t('home')}}</nuxt-link></li>
            <li><nuxt-link :to="localePath('states')">{{$t('election.elections')}}</nuxt-link></li>
            <li class="is-active"><a href="#" aria-current="page">{{ $t(`states.${$route.params.state.toUpperCase()}`) }}</a></li>
          </ul>
        </nav>
          <h1 class="title is-3">{{$t('election.title', {state: $t(`states.${$route.params.state.toUpperCase()}`) })}}</h1>
          <b-table
            hoverable
            :data="elections">
            <!-- detailed> -->
            <template slot-scope="props">
              <b-table-column :label="$t('election.electionDay')">
                <h1 class="title is-5">{{ localizeIfAvailable(props.row.electionType) }}</h1>
              </b-table-column>
              <b-table-column>
                <div class="calendar">
                  <header class="calendar-month">{{new Date(props.row.date).toLocaleDateString(dateFormat, {month: 'short'}) }}</header>
                  <div class="calendar-date">
                    {{ new Date(props.row.date).toLocaleDateString(dateFormat, {day: 'numeric'}) }}
                  </div>
                </div>
              </b-table-column>
              <b-table-column v-for="(rule, key) in props.row.rules" :key="key" :label="localizeIfAvailable(key)">
                <ul>
                  <li v-for="(deadline, index) in rule"
                    :key="index.toString() + deadline.rule + deadline.voterType"
                    v-if="deadline.rule !== 'Not Required'">
                    <strong>{{ typeof deadline.voterType === 'string' ? localizeIfAvailable(deadline.voterType) : $t('election.allVoters') }}</strong><br/><span class="tag is-success">{{ localizeIfAvailable(deadline.rule) }}</span><br/>{{ new Date(deadline.date).toLocaleDateString(dateFormat, {year: 'numeric', month: 'short', day: 'numeric'}) }}
                    <hr v-if="index < rule.length - 1">
                  </li>
                  <li v-else><strong>{{ localizeIfAvailable(deadline.rule) }}</strong></li>
                </ul>
              </b-table-column>
            </template>
            <template slot="detail" slot-scope="props">
              <p
                class="help"
                v-if="props.row.note">{{ $t(`request.deadlineLanguage.notes.${note}`) }}</p>
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
  computed: {
    dateFormat () {
      return this.$i18n.locale === 'en' ? 'en-US' : 'es-ES'
    }
  },
  methods: {
    localizeIfAvailable (str) {
      return this.$te(`election.${this.camelize(str)}`)
        ? this.$t(`election.${this.camelize(str)}`)
        : this.$te(`election.${str.toLowerCase().replace(/\s/gi, '')}`)
          ? this.$t(`election.${str.toLowerCase().replace(/\s/gi, '')}`)
          : str
    },
    camelize (str) {
      return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
        if (+match === 0) return '' // or if (/\s+/.test(match)) for white spaces
        return index === 0 ? match.toLowerCase() : match.toUpperCase()
      })
    }
  },
  transition: 'test'
}
</script>

<style>

</style>
