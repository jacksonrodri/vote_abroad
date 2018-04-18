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
                  <span>{{ $t('menu.logout')}}</span>
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
                  {{$t('menu.upcomingElections')}}
                </a>

                <div class="navbar-dropdown">
                  <nuxt-link v-for="(election, index) in upcomingElections" :key="`${election.state} ${election.electionType}`" :to="localePath({ name: 'elections-state', params: { state: election.state } })" :class="`navbar-item ${index > 3 ? 'is-hidden-touch' : ''}`">
                    <div class="calendar">
                      <header class="calendar-month">{{new Date(election.date).toLocaleDateString('en-US', {month: 'short'}) }}</header>
                      <div class="calendar-date">
                        {{ new Date(election.date).toLocaleDateString('en-US', {day: 'numeric'}) }}
                      </div>
                    </div>
                     <span class="is-size-6"><span class="has-text-weight-semibold">{{ election.state }}</span> - {{ election.electionType}}</span>
                     <!-- </span> - {{ $t(`elections.electionTypes['${election.electionType}']`) }}</span> -->
                  </nuxt-link>
                  <!-- <hr class="navbar-divider">
                  <nuxt-link :to="localePath({ name: 'elections' })" class="navbar-item" exact >... All upcoming elections</nuxt-link> -->
                </div>
              </div>
              <div class="navbar-item has-dropdown is-hoverable" style="order:-1;">
                <a class="navbar-link">
                  {{$t('menu.help')}}
                </a>

                <div class="navbar-dropdown is-right">
                  <nuxt-link :to="localePath({ name: 'faqs-slug', params: { slug: faq.slug } })" v-for="(faq, index) in topFaqs" :key="index" class="navbar-item">
                    <span class="panel-icon">
                      <i class="far fa-question-circle"></i>
                    </span>
                    {{faq.title}}
                  </nuxt-link>
                  <!-- <a class="navbar-item">
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
                  </a> -->
                  <hr class="navbar-divider">
                  <nuxt-link to="/FAQs" class="navbar-item">More FAQ's</nuxt-link>
                  <!-- <a class="navbar-item">
                    More FAQ's
                  </a> -->
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
            <li :class="{'is-active': $route.path === localePath({ name: 'faqs-slug', params: { slug: 'how-do-i-vote-as-a-us-citizen-living-abroad' } })}">
              <nuxt-link :to="localePath({ name: 'faqs-slug', params: { slug: 'how-do-i-vote-as-a-us-citizen-living-abroad' } })">
                <!-- How to<span class="is-hidden-touch">&nbsp;Vote From Abroad</span> -->
                {{$t('menu.howto')}}
              </nuxt-link>
              <!-- <a>How to<span class="is-hidden-touch">&nbsp;Vote From Abroad</span></a> -->
            </li>
            <li :class="{'is-active': $route.path === localePath('faqs')}">
              <nuxt-link :to="localePath('faqs')">
                {{$t('menu.helpfaq')}}
                <!-- <span class="is-hidden-touch">Voter Help Desk/</span>FAQ -->
              </nuxt-link>
            </li>
            <li :class="{'is-active': $route.path === localePath({ name: 'page', params: {page: 'about-us'}})}">
              <nuxt-link :to="localePath({ name: 'page', params: {page: 'about-us'}})">
                {{$t('menu.about')}}
                <!-- About Us -->
              </nuxt-link>
              <!-- <a>About Us</a> -->
            </li>
            <li :class="{'is-active': $route.path === localePath('states')}">
              <nuxt-link :to="localePath('states')">
                {{$t('menu.stateGuide')}}
                <!-- State Voting Guide -->
              </nuxt-link>
              <!-- <a>Election Official Directory</a> -->
            </li>
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
          <nuxt-link to="/privacy" class="link has-text-vfalight">{{$t('menu.privacy')}}</nuxt-link>
        </p>
        <p v-html="$t('menu.disclaimer')" class="level-item has-text-centered is-size-7 has-text-vfalight">
          <!-- {{$t('menu.disclaimer')}} -->
        </p>
        <p class="level-item has-text-centered">
          <nuxt-link to="/terms-of-use" class="link has-text-vfalight">{{$t('menu.terms')}}</nuxt-link>
        </p>
      </nav>
    </div>
  </div>
</section>
<!-- <b-modal :active.sync="isLoginModalActive" has-modal-card>
  <login></login>
</b-modal> -->
</div>
</template>

<script>
import PhoneEmail from '~/components/PhoneEmail.vue'
// import Login from '~/components/Login.vue'

export default {
  data () {
    return {
      isMobileMenuActive: false,
      device: {},
      // isLoginModalActive: false,
      topFaqs: [
        {
          title: 'I can\'t remember my last US address, how do I find it?',
          slug: '14-i-can-t-remember-my-last-us-address-how-do-i-find-it'
        },
        {
          title: 'I live outside the US, am I eligible to vote in US elections?',
          slug: 'i-live-outside-the-us-am-i-eligible-to-vote-in-us-elections'
        },
        {
          title: 'Can I register to vote in a different state?',
          slug: '16-can-i-register-to-vote-in-a-different-state'
        },
        {
          title: 'Why should I send in the form to request my ballot every calendar year?',
          slug: '6-why-should-i-send-in-the-form-to-request-my-ballot-every-calendar-year'
        },
        {
          title: 'Can I vote in midterm elections?',
          slug: 'can-i-vote-in-midterm-elections'
        }
      ]
    }
  },
  components: {
    PhoneEmail
    // Login
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
  },
  async mounted () {
    function checkDeviceSupport (callback) {
      if (!canEnumerate) {
        return
      }
      if (!navigator.enumerateDevices && window.MediaStreamTrack && window.MediaStreamTrack.getSources) {
        navigator.enumerateDevices = window.MediaStreamTrack.getSources.bind(window.MediaStreamTrack)
      }
      if (!navigator.enumerateDevices && navigator.enumerateDevices) {
        navigator.enumerateDevices = navigator.enumerateDevices.bind(navigator)
      }
      if (!navigator.enumerateDevices) {
        if (callback) {
          callback()
        }
        return
      }
      MediaDevices = []
      navigator.enumerateDevices(function (devices) {
        devices.forEach(function (_device) {
          var device = {}
          for (var d in _device) {
            device[d] = _device[d]
          }
          if (device.kind === 'audio') {
            device.kind = 'audioinput'
          }
          if (device.kind === 'video') {
            device.kind = 'videoinput'
          }
          var skip
          MediaDevices.forEach(function (d) {
            if (d.id === device.id && d.kind === device.kind) {
              skip = true
            }
          })
          if (skip) {
            return
          }
          if (!device.deviceId) {
            device.deviceId = device.id
          }
          if (!device.id) {
            device.id = device.deviceId
          }
          if (!device.label) {
            device.label = 'Please invoke getUserMedia once.'
            if (!isHTTPs) {
              device.label = 'HTTPs is required to get label of this ' + device.kind + ' device.'
            }
          } else {
            if (device.kind === 'videoinput' && !isWebcamAlreadyCaptured) {
              isWebcamAlreadyCaptured = true
            }
            if (device.kind === 'audioinput' && !isMicrophoneAlreadyCaptured) {
              isMicrophoneAlreadyCaptured = true
            }
          }
          if (device.kind === 'audioinput') {
            hasMicrophone = true
          }
          if (device.kind === 'audiooutput') {
            hasSpeakers = true
          }
          if (device.kind === 'videoinput') {
            hasWebcam = true
          }
          MediaDevices.push(device)
        })
        if (callback) {
          callback()
        }
      })
    }
    if (process.browser) {
      if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        // Firefox 38+ seems having support of enumerateDevicesx
        navigator.enumerateDevices = function (callback) {
          navigator.mediaDevices.enumerateDevices().then(callback)
        }
      }
      var MediaDevices = []
      var isHTTPs = location.protocol === 'https:'
      var canEnumerate = false

      if (typeof MediaStreamTrack !== 'undefined' && 'getSources' in MediaStreamTrack) {
        canEnumerate = true
      } else if (navigator.mediaDevices && !!navigator.mediaDevices.enumerateDevices) {
        canEnumerate = true
      }
      var hasMicrophone = false
      var hasSpeakers = false
      var hasWebcam = false

      var isMicrophoneAlreadyCaptured = false
      var isWebcamAlreadyCaptured = false
      checkDeviceSupport(() => {
        this.$store.commit('userauth/updateDevice', {
          'hasWebCam': hasWebcam,
          'hasMicrophone': hasMicrophone,
          'hasSpeakers': hasSpeakers,
          'isMicrophoneAlreadyCaptured': isMicrophoneAlreadyCaptured,
          'isWebcamAlreadyCaptured': isWebcamAlreadyCaptured
        })
      })
      navigator.mediaDevices.ondevicechange = () => {
        checkDeviceSupport((event) => {
          console.log('device change event', event)
          this.$store.commit('userauth/updateDevice', {
            'hasWebCam': hasWebcam,
            'hasMicrophone': hasMicrophone,
            'hasSpeakers': hasSpeakers,
            'isMicrophoneAlreadyCaptured': isMicrophoneAlreadyCaptured,
            'isWebcamAlreadyCaptured': isWebcamAlreadyCaptured
          })
        })
      }
      await import('current-device').then(({default: device}) => {
        console.log(device)
        this.$store.commit('userauth/updateDevice', {
          type: device.type,
          os: device.os,
          orientation: device.orientation
        })
        // window.addEventListener('orientationchange', () => {
        //   this.$store.commit('userauth/updateDevice', {
        //     orientation: device.orientation
        //   })
        // })
        window.onresize = () => {
          console.log(device)
          this.$store.commit('userauth/updateDevice', {
            type: device.type,
            os: device.os,
            orientation: device.orientation
          })
        }
      })
      // console.log(device.default.tablet())
      window.onNuxtReady((app) => {
        this.$intercom.boot()
        // this.$intercom.show()
      })
    }
  }
}
</script>
