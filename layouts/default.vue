<template>
<div>
<div :class="['hero', 'is-fullheight', 'bg', {'bg-image': isBgImage}]">
    <div class="hero-head">
      <header :class="`navbar ${isBgImage ? 'is-vfa' : 'is-light'}`">
        <div class="container">
          <div class="navbar-brand">
            <span class="burger is-hidden-desktop"></span>
            <nuxt-link to="/" class="navbar-item logo" exact>
            </nuxt-link>
            <span :class="[{'is-active': isMobileMenuActive}, 'navbar-burger', 'burger']" @click="isMobileMenuActive = !isMobileMenuActive">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </div>
          <div id="navbarMenuHeroC" :class="[{'is-active': isMobileMenuActive},'navbar-menu', 'is-paddingless']">
            <div class="navbar-end">
              <span class="navbar-tabs">
                <a v-if="isAuthenticated"
                  class="navbar-item is-expanded has-text-centered"
                  @click="$store.dispatch('userauth/logout')">
                  <b-icon
                    pack="fas"
                    icon="sign-out-alt"
                    size="is-small">
                  </b-icon>
                  &nbsp;Logout
                </a>
                <!-- <a v-else
                  class="navbar-item is-expanded has-text-centered"
                  @click="isLoginModalActive = true">
                  <b-icon
                    pack="fas"
                    icon="user"
                    size="is-small">
                  </b-icon>
                  &nbsp;Login
                </a> -->
                <nuxt-link v-for="(locale, index) in $i18n.locales"
                  :key="index"
                  :exact="true"
                  :class="['navbar-item', 'is-tab', {'is-active': locale.code === $i18n.locale}]"
                  :to="switchLocalePath(locale.code)"><span class="is-hidden-desktop">{{ locale.name }}</span><span class="is-hidden-touch">{{ locale.code.toUpperCase() }}</span>
                </nuxt-link>
              </span>
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
      <!-- nav level -->
      <!-- <nav class="level is-mobile is-hidden-desktop is-vfa">
        <div class="level-left">
        </div>
        <div class="level-right">
          <a class="level-item has-text-white"
            v-if="isAuthenticated"
            @click="$store.dispatch('userauth/logout')">
            <b-icon
              pack="fas"
              icon="sign-out-alt"
              size="is-small">
            </b-icon>
            &nbsp;Logout
          </a>
          <a class="level-item has-text-white"
            v-else
            @click="isLoginModalActive = true">
            <b-icon
              pack="fas"
              icon="user"
              size="is-small">
            </b-icon>
            &nbsp;Login
          </a>
          <div class="level-item"><span>&nbsp;</span></div>
          <div class="level-item">
            <nuxt-link :to="switchLocalePath('es')" class="button is-info is-outlined is-small" v-show="$i18n.locale === 'en'">Español</nuxt-link>
            <nuxt-link :to="switchLocalePath('en')" class="button is-info is-outlined is-small" v-show="$i18n.locale === 'es'">English</nuxt-link>
          </div>
          <div class="level-item"><span>&nbsp;</span></div>
        </div>
      </nav> -->
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
      return this.$route.name && this.$route.name.indexOf('index') > -1
    },
    test: function () {
      return this.$route.name
    },
    isAuthenticated: function () { return this.$store.getters['userauth/isAuthenticated'] }
  }
}
</script>
