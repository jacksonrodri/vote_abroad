<template>
  <section class="section">
    <div class="columns is-centered">
      <div class="column is-10 is-8-desktop is-7-widescreen is-6-fullhd is-paddingless">
        <h1 class="title">
          {{ state.title }}
        </h1>
        <nuxtent-body class="content" :body="state.body" />
          <!-- <ul v-for="election in elections" :key="`${election.state} ${election.electionType}`">
            <li>{{ election.state }} - {{election.electionType }}</li>
            <li>{{ election.date }}</li>
          </ul> -->
          <!-- <h1 class="title is-4">Find your local Election Official ({{state.title}})</h1>
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
          <h1 class="title is-4">Elections Deadlines for {{state.title}} Voters Abroad</h1>
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
          <h2 class="title is-5">Election Officials</h2>
          <b-field>
          <b-autocomplete
            v-model="typedLeo"
            open-on-focus
            keep-first
            expanded
            ref="jurisdiction"
            :data="filteredLeos"
            field="n"
            placeholder="Jurisdiction"
            @select="option => currentLeo = option">
            <template slot-scope="props"><strong>{{props.option.j}} {{props.option.j.toLowerCase().indexOf(props.option.t.toLowerCase()) > -1 ? '' : props.option.t}}</strong> - <small>{{decodeHtmlEntity(props.option.n)}}&nbsp;</small><span v-if="props.option.suggested" class="tag is-info">Suggested</span></template>
            </b-autocomplete>
            <p class="control">
                <button class="button is-grey is-inverted is-outlined"
                  @click.prevent="$refs.jurisdiction.focus()">
                  <b-icon icon="chevron-down"></b-icon>
                </button>
            </p>
          </b-field>
          <div class="box">
            <p>
            <span class="title is-5" v-if="currentLeo && currentLeo.n"><strong>{{ currentLeo.n }}</strong><br/><br/></span>
            <span v-if="currentLeo && currentLeo.a1"><strong>{{ currentLeo.a1 }}</strong><br/></span>
            <span v-if="currentLeo && currentLeo.a2"><strong>{{ currentLeo.a2 }}</strong><br/></span>
            <span v-if="currentLeo && currentLeo.a3"><strong>{{ currentLeo.a3 }}</strong><br/></span>
            <span><strong>{{ currentLeo ? currentLeo.c : '' }}, </strong>
            <strong>{{ currentLeo ? currentLeo.s : '' }} </strong>
            <strong>{{ currentLeo ? currentLeo.z : '' }}</strong><br/></span>
            <span class="has-text-right"><strong>United States of America</strong><br/><br/></span></p>
            <p>
            <span v-if="currentLeo && currentLeo.e" v-html="md(`**${$t('dashboard.email')}:** [${ currentLeo.e }](mailto:${ currentLeo.e })`)"></span>
            </p>
            <p>
            <span v-if="currentLeo && currentLeo.p" v-html="md(`**${$t('dashboard.phone')}:** [${ '+1' + currentLeo.p }](tel:${ ('+1' + currentLeo.p).replace(/[()]/g, '-').replace(/ /g, '') })`)"><br/><br/></span>
            </p>
            <p>
            <span v-if="currentLeo && currentLeo.f" v-html="md(`**${$t('dashboard.fax')}:** [${ '+1' + currentLeo.f }](tel:${ ('+1' + currentLeo.f).replace(/[()]/g, '-').replace(/ /g, '')  })`)"></span>
            </p>
          </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios'
import snarkdown from 'snarkdown'

export default {
  async asyncData ({ app, params }) {
    let stateLeos = (process.static && process.server)
      ? await import(`~/static/leos/${params.state.toUpperCase()}-leos.json`)
      : (await axios.get(`${process.env.url}/leos/${params.state.toUpperCase()}-leos.json`)).data
    return {
      elections: (await app.$content('/elections').get('elections')).body.filter(election => election.state && params.state && election.state.toLowerCase() === params.state.toLowerCase()),
      state: (await app.$content('/rls').get(`states/${params.state.toLowerCase()}`)),
      stateLeos
      // (await axios.get(`${process.env.url}/leos/${params.state.toUpperCase()}-leos.json`)).data
    }
  },
  head: {
    title: 'Vote From Abroad - Absentee ballots for Americans Abroad.'
  },
  layout: 'default',
  data () {
    return {
      typedLeo: '',
      currentLeo: null
    }
  },
  computed: {
    filteredLeos () {
      return this.stateLeos.filter(leo => leo.n.toLowerCase().includes(this.typedLeo.toLowerCase()) || leo.j.toLowerCase().includes(this.typedLeo.toLowerCase()))
    },
    upcomingElections () {
      return this.elections
        .filter(x => new Date(x.date).getTime() > Date.now())
        .sort(function (a, b) {
          var dateA = new Date(a.date).getTime()
          var dateB = new Date(b.date).getTime()
          return dateA - dateB
        })
    }
  },
  methods: {
    decodeHtmlEntity (str) {
      str = str.replace(/&apos;/g, "'").replace(/&quot;/g, '"').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&')
      return str.replace(/&#(\d+);/g, function (match, dec) {
        return String.fromCharCode(dec)
      })
    },
    md (md) { return snarkdown(md) }
  }
}
</script>

<style>

</style>
