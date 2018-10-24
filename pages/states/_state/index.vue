<template>
  <section class="section">
    <div class="columns is-centered">
      <div class="column is-10 is-8-desktop is-7-widescreen is-6-fullhd is-paddingless">
        <nav class="breadcrumb" aria-label="breadcrumbs">
          <ul>
            <li><nuxt-link :to="localePath('index')">{{$t('home')}}</nuxt-link></li>
            <li><nuxt-link :to="localePath('states')">{{$t('menu.stateGuide')}}</nuxt-link></li>
            <li class="is-active"><a href="#" aria-current="page">{{ $t(`states.${state.iso}`) }}</a></li>
          </ul>
        </nav>
        <h1 class="title">
          {{ $t(`states.${state.iso}`) }}
        </h1>
        <nuxtent-body class="content" :body="state.body" />
        <i-18n path="states.stateBody" tag="p" v-if="$te('states.stateBody') && $i18n.locale !== 'en'">
          <nuxt-link :to="localePath('index')" class="has-text-primary">{{$t('states.clickHere')}}</nuxt-link>
        </i-18n>
        <br/>
          <h1 class="title is-4">{{$t('states.stateTitle', {state: $t(`states.${state.iso}`)})}}</h1>
          <b-table hoverable :data="upcomingElections">
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
              <b-table-column v-for="(rule, key) in props.row.rules" :key="key" :label=" localizeIfAvailable(key) ">
                <ul>
                  <li v-for="(deadline, index) in rule"
                    :key="index.toString() + deadline.rule + deadline.voterType"
                    v-if="deadline.rule !== 'Not Required'">
                    <strong>{{ typeof deadline.voterType === 'string' ? localizeIfAvailable(deadline.voterType) : localizeIfAvailable('All Voters') }}</strong><br/><span class="tag is-success">{{ localizeIfAvailable(deadline.rule) }}</span><br/>{{ new Date(deadline.date).toLocaleDateString(dateFormat, {year: 'numeric', month: 'short', day: 'numeric'}) }}
                    <hr v-if="index < rule.length - 1">
                  </li>
                  <li v-else><strong>{{ localizeIfAvailable(deadline.rule) }}</strong></li>
                </ul>
              </b-table-column>
            </template>
          </b-table>
          <h2 class="title is-5">{{$t('states.electionOfficials')}}</h2>
          <b-field>
          <b-autocomplete
            v-model="typedLeo"
            open-on-focus
            keep-first
            expanded
            ref="jurisdiction"
            :data="filteredLeos"
            field="n"
            :placeholder="$t('request.jurisdiction.instructions')"
            @select="option => currentLeo = option">
            <template slot-scope="props"><strong>{{props.option.j}} {{props.option.j.toLowerCase().indexOf(props.option.t.toLowerCase()) > -1 ? '' : props.option.t}}</strong> - <small>{{decodeHtmlEntity(props.option.n)}}&nbsp;</small><span v-if="props.option.suggested" class="tag is-info">{{$t('request.jurisdiction.suggested')}}</span></template>
            </b-autocomplete>
            <p class="control">
                <button class="button is-grey is-inverted is-outlined"
                  @click.prevent="$refs.jurisdiction.focus()">
                  <b-icon icon="chevron-down"></b-icon>
                </button>
            </p>
          </b-field>
          <div class="box" v-if="currentLeo">
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
          <h2 class="title is-5">Additional Resources</h2>
          <p>
            <a
              v-if="state.amIRegistered"
              class="button is-primary"
              target="blank"
              :href="state.amIRegistered">
              Am I Registered?
            </a>
            <br>
            <a
              v-if="state.whereIsMyBallot"
              class="button is-primary"
              target="blank"
              :href="state.whereIsMyBallot">
              Where Is My Ballot?
            </a>
            <br>
            <a
              v-if="state.sampleBallot"
              class="button is-primary"
              target="blank"
              :href="state.sampleBallot">
              Sample Ballot
            </a>
            <br>
            <a
              v-if="state.uocavaVoters"
              class="button is-primary"
              target="blank"
              :href="state.uocavaVoters">
              State Page For Military And Overseas Voters
            </a>
          </p>
          <!-- <a :href="state."></a> -->
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
    dateFormat () {
      return this.$i18n.locale === 'en' ? 'en-US' : 'es-ES'
    },
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
    localizeIfAvailable (str) {
      if (typeof str !== 'string') {
        return str
      }
      let newStr = str
      if (str.includes('*')) {
        newStr = str.replace(/\*/g, '')
      }
      return this.$te(`election.${this.camelize(newStr)}`)
        // ? this.$t(`election.${this.camelize(newStr)}`) + str.replace(/[^*]/g, '')
        ? this.$t(`election.${this.camelize(newStr)}`)
        : this.$te(`election.${newStr.toLowerCase().replace(/\s/gi, '')}`)
          ? this.$t(`election.${newStr.toLowerCase().replace(/\s/gi, '')}`)
          : newStr
    },
    camelize (str) {
      return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
        if (+match === 0) return '' // or if (/\s+/.test(match)) for white spaces
        return index === 0 ? match.toLowerCase() : match.toUpperCase()
      })
    },
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
