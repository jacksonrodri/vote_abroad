<template>
<div>
  <section class="hero is-transparent is-fullheight">
    <!-- Hero head: will stick at the top -->
    <div class="hero-head vfa">
      <nav class="navbar is-transparent">
        <div class="container">
          <div class="navbar-brand">
            <nuxt-link to="/" class="navbar-item" exact>
            <!-- :to="localePath('index')" -->
              <img class="nav-logo" src="/vfa-white.svg" alt="VoteFromAbroad.org Absentee Ballots for US Citizens Abroad">
            </nuxt-link>
            <!-- <div class="navbar-item is-expanded has-text-right is-hidden-desktop is-block-touch" >
              <nuxt-link :to="switchLocalePath('es')" class="button is-danger is-outlined is-small" v-show="$i18n.locale === 'en'">Español</nuxt-link>
              <nuxt-link :to="switchLocalePath('en')" class="button is-danger is-outlined is-small" v-show="$i18n.locale === 'es'">English</nuxt-link>
            </div> -->
            <span :class="`navbar-burger burger ${navOpened ? 'is-active' : ''}`" @click="toggleNav()" data-target="navbarMenuHeroC">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </div>
          <div id="navbarMenuHeroC" :class="`navbar-menu ${navOpened ? 'is-active' : ''}`">
            <div class="navbar-end">
              <div class="navbar-item">
                <button class="button" @click="logout">Logout</button>
              </div>
              <!-- <div class="navbar-item is-hidden-touch">
                <nuxt-link :to="switchLocalePath('es')" class="button is-small is-danger is-outlined" v-show="$i18n.locale === 'en'">Español</nuxt-link>
                <nuxt-link :to="switchLocalePath('en')" class="button is-small is-danger is-outlined" v-show="$i18n.locale === 'es'">English</nuxt-link>
              </div> -->
            </div>
          </div>
        </div>
      </nav>
      <nav class="navbar is-transparent">
        <div class="container">
          <div id="navbarMenuHeroC" :class="`navbar-menu ${navOpened ? 'is-active' : ''}`">
            <div class="navbar-end">
              <div class="navbar-item has-dropdown is-hoverable">
                <nuxt-link :to="localePath({ name: 'elections'})" class="navbar-link has-text-white">Upcoming Elections</nuxt-link>
                <!-- <a class="navbar-link">
                  Upcoming Elections
                </a> -->
                <div class="navbar-dropdown is-boxed">
                  <nuxt-link v-for="(election, index) in upcomingElections" :key="`${election.state} ${election.electionType}`" :to="localePath({ name: 'elections-state', params: { state: election.state } })" :class="`navbar-item ${index > 3 ? 'is-hidden-touch' : ''}`">{{ new Date(election.date).toLocaleDateString('en-US', {year: 'numeric', month: 'short', day: 'numeric'}) }} - {{ election.state }} {{ $t(`elections.electionTypes['${election.electionType}']`) }}</nuxt-link>
                  <nuxt-link :to="localePath({ name: 'elections' })" class="navbar-item" exact >... All upcoming elections</nuxt-link>
                </div>
              </div>
              <div class="navbar-item is-vfa has-dropdown is-hoverable">
                <a class="navbar-link has-text-white">
                  FAQ's
                </a>
                <div class="navbar-dropdown is-boxed">
                  <a class="navbar-item">
                    Can I choose the state where I vote?
                  </a>
                  <a class="navbar-item">
                    I can't remember or find my exact street address - what do I do?
                  </a>
                  <a class="navbar-item">
                    Why do I need an exact address?
                  </a>
                  <a class="navbar-item">
                    How do I request my ballot?
                  </a>
                  <a class="navbar-item">
                    When will you send my ballot?
                  </a>
                </div>
              </div>
              <div class="navbar-item">
                <div class="field is-grouped">
                  <nuxt-link :to="switchLocalePath('en')" class="navbar-item is-tab has-text-white" :class="$i18n.locale=='en'?'is-active':''" exact>EN</nuxt-link>
                  <nuxt-link :to="switchLocalePath('es')" class="navbar-item is-tab has-text-white" :class="$i18n.locale=='es'?'is-active':''" exact>ES</nuxt-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
    <div class="bg">
    <nuxt/>
    </div>
    <!-- Hero footer: will stick at the bottom -->
    <div class="hero-foot">
      <nav class="tabs is-boxed is-fullwidth">
        <div class="container">
          <ul>
            <li><a class="has-text-grey">How to Vote From Abroad</a></li>
            <li><a class="has-text-grey">Voter Help Desk/FAQ</a></li>
            <li><a class="has-text-grey">About Us</a></li>
            <li><a class="has-text-grey">Privacy</a></li>
            <li><a class="has-text-grey">Contact</a></li>
            <li><a class="has-text-grey">Terms of Use</a></li>
          </ul>
        </div>
      </nav>
    </div>
  </section>
<footer class="footer level navbar is-vfa">
  <div class="level-item container">
    <div class="content has-text-centered">
      <p class="has-text-grey">
        Public Service provided by <strong class="has-text-grey"> Democratic Party Committee Abroad</strong> <a href="https://democratsabroad.org" class="has-text-grey">(DemocratsAbroad.org) </a><br/>This communication is not authorized by any candidate or candidate's committee.
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
    logout () {
      this.$store.dispatch('userauth/logout')
    },
    ...mapMutations([
      'toggleNav'
    ])
  }
}
</script>

<style>
.hero-foot {
  background-color: #243a89;
}
.nav-logo {
  max-height: 5rem!important;
}
.vfa {
  background-color: #243a89;
}
.bg {
  background: #fff url(/votefromabroad-bg.jpg) no-repeat center top;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}

</style>
