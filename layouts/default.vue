<template>
<div>
<div :class="['hero', 'is-fullheight', 'bg', {'bg-image': isBgImage}]">
    <div class="hero-head">
      <header :class="`navbar ${isBgImage ? 'is-vfa' : 'is-light'}`">
        <div class="container">
          <div class="navbar-brand">
            <nuxt-link to="/" class="navbar-item logo" exact>
            </nuxt-link>
            <span :class="[{'is-active': isMobileMenuActive}, 'navbar-burger', 'burger']" @click="isMobileMenuActive = !isMobileMenuActive">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </div>
          <div id="navbarMenuHeroC" :class="[{'is-active': isMobileMenuActive}, 'navbar-menu', 'is-paddingless']">
            <div class="navbar-end">
              <div class="navbar-item" style="order:2;">
                <nuxt-link :to="switchLocalePath('es')" class="button is-info is-outlined is-small" v-show="$i18n.locale === 'en'">Español</nuxt-link>
                <nuxt-link :to="switchLocalePath('en')" class="button is-info is-outlined is-small" v-show="$i18n.locale === 'es'">English</nuxt-link>
              </div>
              <!-- <button v-if="isAuthenticated" @click="logout()" class="navbar-item">Log out</button> -->
              <a class="navbar-item"
                  v-if="isAuthenticated"
                  @click="$store.dispatch('userauth/logout')">
                  <b-icon
                    pack="fas"
                    icon="sign-out-alt"
                    size="is-small">
                  </b-icon>
                  &nbsp;Logout
              </a>
              <a class="navbar-item"
                  v-else
                  @click="isLoginModalActive = true">
                  <b-icon
                    pack="fas"
                    icon="user"
                    size="is-small">
                  </b-icon>
                  &nbsp;Login
              </a>
              <div class="navbar-item has-dropdown is-hoverable" style="order:-1;">
                <a class="navbar-link">
                  Upcoming Elections
                </a>

                <div class="navbar-dropdown">
                  <nuxt-link v-for="(election, index) in upcomingElections" :key="`${election.state} ${election.electionType}`" :to="localePath({ name: 'elections-state', params: { state: election.state } })" :class="`navbar-item ${index > 3 ? 'is-hidden-touch' : ''}`">
                    <div class="calendar">
                      <header class="calendar-month">{{new Date(election.date).toLocaleDateString('en-US', {month: 'short'}) }}</header>
                      <div class="calendar-date">
                        {{ new Date(election.date).toLocaleDateString('en-US', {day: 'numeric'}) }}
                      </div>
                    </div>
                     <span class="is-size-5"><span class="has-text-weight-semibold">{{ election.state }}</span> - {{ $t(`elections.electionTypes['${election.electionType}']`) }}</span>
                  </nuxt-link>
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
<b-modal :active.sync="isLoginModalActive" has-modal-card>
  <login></login>
</b-modal>
</div>
</template>

<script>
import PhoneEmail from '~/components/PhoneEmail.vue'
import Login from '~/components/Login.vue'

export default {
  data () {
    return {
      isMobileMenuActive: false,
      isLoginModalActive: false
    }
  },
  components: {
    PhoneEmail,
    Login
  },
  computed: {
    upcomingElections: function () { return this.$store.state.upcomingElections },
    isBgImage: function () {
      return Boolean(this.$route.name.indexOf('index') > -1 || this.$route.name.indexOf('home') > -1)
    },
    isAuthenticated: function () { return this.$store.getters['userauth/isAuthenticated'] }
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

.navbar-item.logo.is-active
    background-color: transparent!important;

.tabs:not(:last-child)
  margin-bottom: 0;

.bg-image
  background: #fff url(/votefromabroad-bg.jpg) no-repeat center top;
  // min-height: 611px;
  // height: 970px;
  background-size: cover;


.bg
  background-color: #fff;

// .calendar
//   border-width: .5px;
//   border-color: grey;
//   display: inline-block;
//   border-style: outset;
//   margin: 1px 8px -6px -10px;
//   box-shadow: 2px 2px #888888;

// .calendar-month
//   background-color: red;
//   color: white;
//   font-weight: bold;
//   font-size: .75rem;
//   line-height: .7rem;
//   padding: .1rem .2rem;
//   text-align: center;

// .calendar-date
//   font-weight: bold;
//   font-size: 1.8rem;
//   text-align: center;
//   line-height: 1.5em;
//   padding: 3px;
</style>

