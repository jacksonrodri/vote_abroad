<template>
<div>
  <section class="hero is-white is-bold is-fullheight">
    <!-- Hero head: will stick at the top -->
    <div class="hero-head">
      <header class="navbar">
        <div class="container">
          <div class="navbar-brand">
            <a class="navbar-item">
              <img src="/icon.svg" alt="Logo"> <h2 class="subtitle is-4">&nbsp;&nbsp;&nbsp;VoteFromAbroad</h2>
            </a>
            <div class="navbar-item is-expanded has-text-right is-hidden-desktop is-block-touch" >
              <!-- <a class="button is-info is-outlined is-small" v-show="$i18n.locale === 'en'" href="https://bulma.io">Español
              </a> -->
              <nuxt-link :to="switchLocalePath('es')" class="button is-info is-outlined is-small" v-show="$i18n.locale === 'en'">Español</nuxt-link>
              <nuxt-link :to="switchLocalePath('en')" class="button is-info is-outlined is-small" v-show="$i18n.locale === 'es'">English</nuxt-link>
            </div>
            <span :class="`navbar-burger burger ${navOpened ? 'is-active' : ''}`" @click="toggleNav()" data-target="navbarMenuHeroC">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </div>
          <div id="navbarMenuHeroC" :class="`navbar-menu ${navOpened ? 'is-active' : ''}`">
            <div class="navbar-end">
              <div class="navbar-item has-dropdown is-hoverable">
                <nuxt-link :to="localePath({ name: 'elections-state'})" class="navbar-link">Upcoming Elections</nuxt-link>
                <!-- <a class="navbar-link" href="#">
                  Upcoming Elections
                </a> -->
                <div class="navbar-dropdown is-boxed">
                  <nuxt-link v-for="(election, index) in upcomingElections" :key="`${election.state} ${election.electionType}`" :to="localePath({ name: 'elections-state', params: { state: election.state } })" :class="`navbar-item ${index > 3 ? 'is-hidden-touch' : ''}`">{{ new Date(election.date).toLocaleDateString('en-US', {year: 'numeric', month: 'short', day: 'numeric'}) }} - {{ election.state }} {{ $t(`elections.electionTypes['${election.electionType}']`) }}</nuxt-link>
                  <nuxt-link :to="localePath({ name: 'elections-state' })" class="navbar-item" exact >... All upcoming elections</nuxt-link>
                </div>
              </div>
              <div class="navbar-item has-dropdown is-hoverable">
                <a class="navbar-link" href="#">
                  FAQ's
                </a>
                <div class="navbar-dropdown is-boxed">
                  <a class="navbar-item" href="#">
                    Can I choose the state where I vote?
                  </a>
                  <a class="navbar-item" href="#">
                    I can't remember or find my exact street address - what do I do?
                  </a>
                  <a class="navbar-item" href="#">
                    Why do I need an exact address?
                  </a>
                  <a class="navbar-item" href="#">
                    How do I request my ballot?
                  </a>
                  <a class="navbar-item" href="#">
                    When will you send my ballot?
                  </a>
                </div>
              </div>
              <div class="navbar-item is-hidden-touch">
                <nuxt-link :to="switchLocalePath('es')" class="button is-small is-info is-outlined" v-show="$i18n.locale === 'en'">Español</nuxt-link>
                <nuxt-link :to="switchLocalePath('en')" class="button is-small is-info is-outlined" v-show="$i18n.locale === 'es'">English</nuxt-link>
              </div>
              <!-- <div class="navbar-item">
                <div class="field is-grouped">
                  <nuxt-link :to="switchLocalePath('en')" class="navbar-item is-tab" :class="$i18n.locale=='en'?'is-active':''" exact>EN</nuxt-link>
                  <nuxt-link :to="switchLocalePath('es')" class="navbar-item is-tab" :class="$i18n.locale=='es'?'is-active':''" exact>ES</nuxt-link>
                </div>
              </div> -->
            </div>
          </div>
        </div>
      </header>
    </div>

    <nuxt/>

    <!-- Hero footer: will stick at the bottom -->
    <div class="hero-foot">
      <nav class="tabs is-boxed is-fullwidth">
        <div class="container">
          <ul>
            <li><a>How to Vote From Abroad</a></li>
            <li><a>Voter Help Desk/FAQ</a></li>
            <li><a>About Us</a></li>
            <li><a>Privacy</a></li>
            <li><a>Contact</a></li>
            <li><a>Terms of Use</a></li>
          </ul>
        </div>
      </nav>
    </div>
  </section>
<footer class="footer level navbar is-grey">
  <div class="level-item container">
    <div class="content has-text-centered">
      <p>
        Public Service provided by <strong> Democratic Party Committee Abroad</strong> <a href="https://democratsabroad.org">(DemocratsAbroad.org) </a><br/>This communication is not authorized by any candidate or candidate's committee.
      </p>
    </div>
  </div>
</footer>
</div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  computed: {
    upcomingElections () { return this.$store.state.upcomingElections },
    navOpened () { return this.$store.state.isMenuOpen }
  },
  methods: {
    ...mapMutations([
      'toggleNav'
    ])
  }
}
</script>

