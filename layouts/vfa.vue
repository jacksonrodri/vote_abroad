<template>
<div>
<div class="hero is-fullheight bg">
    <div class="hero-head">
      <header class="navbar is-vfa">
        <div class="container">
          <div class="navbar-brand">
            <a class="navbar-item logo">
              <!-- <img src="/vfa_blue.svg" alt="VoteFromAbroad.org -- Absentee ballots for US Citizens Abroad"> -->
            </a>
            <div class="navbar-item is-hidden-desktop">
              <nuxt-link :to="switchLocalePath('es')" class="button is-info is-outlined is-small" v-show="$i18n.locale === 'en'">Español</nuxt-link>
              <nuxt-link :to="switchLocalePath('en')" class="button is-info is-outlined is-small" v-show="$i18n.locale === 'es'">English</nuxt-link>
            </div>
            <span :class="[{'is-active': isActive}, 'navbar-burger', 'burger']" @click="isActive = !isActive">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </div>
          <div id="navbarMenuHeroC" :class="[{'is-active': isActive}, 'navbar-menu', 'is-paddingless']">
            <div class="navbar-end">
              <a class="navbar-item">Login</a>
              <div class="navbar-item has-dropdown is-hoverable" style="order:-1;">
                <a class="navbar-link">
                  Upcoming Elections
                </a>

                <div class="navbar-dropdown">
                  <nuxt-link v-for="(election, index) in upcomingElections" :key="`${election.state} ${election.electionType}`" :to="localePath({ name: 'elections-state', params: { state: election.state } })" :class="`navbar-item ${index > 3 ? 'is-hidden-touch' : ''}`">{{ new Date(election.date).toLocaleDateString('en-US', {year: 'numeric', month: 'short', day: 'numeric'}) }} - {{ election.state }} {{ $t(`elections.electionTypes['${election.electionType}']`) }}</nuxt-link>
                  <hr class="navbar-divider">
                  <nuxt-link :to="localePath({ name: 'elections' })" class="navbar-item" exact >... All upcoming elections</nuxt-link>
                </div>
              </div>
              <div class="navbar-item has-dropdown is-hoverable" style="order:-1;">
                <a class="navbar-link">
                  Help
                </a>

                <div class="navbar-dropdown">
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
                  <hr class="navbar-divider">
                  <a class="navbar-item">
                    More FAQ's
                  </a>
                  <hr class="navbar-divider">
                  <a class="navbar-item">Contact the helpdesk</a>
                </div>
              </div>
              <!-- <b-dropdown hoverable class="navbar-item has-dropdown is-hidden-mobile">
                <a class="navbar-item navbar-link" slot="trigger">
                  <span>FAQs</span>
                  <b-icon icon="menu-down"></b-icon>
                </a>
                <b-dropdown-item>Action</b-dropdown-item>
                <b-dropdown-item>Another action</b-dropdown-item>
                <b-dropdown-item>Something else</b-dropdown-item>
              </b-dropdown>
              <b-dropdown hoverable class="navbar-item has-dropdown">
                <a class="navbar-item navbar-link" slot="trigger">
                  <span><span class="is-hidden-mobile">Upcoming </span>Elections</span>
                  <b-icon icon="menu-down"></b-icon>
                </a>

                <b-dropdown-item>Action</b-dropdown-item>
                <b-dropdown-item>Another action</b-dropdown-item>
                <b-dropdown-item>Something else</b-dropdown-item>
              </b-dropdown>
              <b-dropdown hoverable position="is-bottom-left" class="navbar-item has-dropdown">
                <a class="navbar-item navbar-link" slot="trigger">
                  <span>Login</span>
                  <b-icon icon="menu-down"></b-icon>
                </a>
                <b-dropdown-item custom paddingless>
                  <form action="">
                    <div class="modal-card" style="width:300px;">
                      <section class="modal-card-body">
                        <phone-email></phone-email>
                        <b-checkbox>Remember me</b-checkbox>
                      </section>
                      <footer class="modal-card-foot">
                        <button class="button is-vfa">Login</button>
                      </footer>
                    </div>
                  </form>
                </b-dropdown-item>
              </b-dropdown> -->
              <div class="navbar-item is-hidden-touch">
                <nuxt-link :to="switchLocalePath('es')" class="button is-info is-outlined is-small" v-show="$i18n.locale === 'en'">Español</nuxt-link>
                <nuxt-link :to="switchLocalePath('en')" class="button is-info is-outlined is-small" v-show="$i18n.locale === 'es'">English</nuxt-link>
              </div>
            </div>
          </div>
        </div>
      </header>
      </div>
    <nuxt/>
    <div class="hero-foot">
      <nav class="tabs is-boxed is-fullwidth">
        <div class="container">
          <ul>
            <li class="is-active"><a>How to<span class="is-hidden-touch">&nbsp;Vote From Abroad</span></a></li>
            <li><a><span class="is-hidden-touch">Voter Help Desk/</span>FAQ</a></li>
            <li><a>About Us</a></li>
            <li><a>Election Official Directory</a></li>
          </ul>
        </div>
      </nav>
    </div>
</div>
<section class="hero is-vfa">
  <div class="hero-body">
    <div class="container">
      <nav class="level">
        <p class="level-item has-text-centered">
          <a class="link is-info">Privacy</a>
        </p>
        <p class="level-item has-text-centered is-size-7">
          Public Service provided by Democratic Party Committee Abroad (DemocratsAbroad.org).<br/>
This communication is not authorized by any candidate or candidate's committee.
        </p>
        <p class="level-item has-text-centered">
          <a class="link is-info">Terms of Use</a>
        </p>
      </nav>
    </div>
  </div>
</section>
</div>
</template>

<script>
import PhoneEmail from '~/components/PhoneEmail.vue'

export default {
  data () {
    return {
      isActive: false
    }
  },
  components: {
    PhoneEmail
  },
  computed: {
    upcomingElections () { return this.$store.state.upcomingElections }
  }
}
</script>

<style lang="sass" scoped>
// .navbar-item img
//     max-height: 3rem
// .logo
//   max-height: 8rem;
//   > img
//     max-height: 6rem;
//     margin: 1rem;
//     max-width: 90vw;
// .navbar
//     background-color: hsl(227, 59%, 22%);

// .navbar-item
//   display: inline-flex;
//   flex-grow: 1;
//   flex-shrink: 1;

// .navbar-end
//   flex-grow: 0;
//   flex-shrink: 1;
//   display: flex;

// .navbar-link
//   padding-right: 1em;

.navbar-item.logo
  background-image: url(/vfa_blue.svg);
  // background-color: hsl(227, 59%, 22%);
  background-size: contain;
  background-position: 50%;
  background-repeat: no-repeat;
  width: 40vw;
  height: 5rem;
  margin: 10px;
  padding: 0 20px;
  flex-grow: 1;
  &:hover
    background-image: url(/vfa_white.svg);
    background-color: hsl(227, 59%, 22%);

.tabs:not(:last-child)
  margin-bottom: 0;

.bg
  background: #fff url(/votefromabroad-bg.jpg) no-repeat center top;
  // min-height: 611px;
  // height: 970px;
  background-size: cover;
</style>

