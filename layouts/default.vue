<template>
<div>
  <div v-if="!offline">
  <div :class="['hero', 'is-fullheight', 'bg', {'bg-image': isBgImage}]">
      <div class="hero-head">
        <header :class="`navbar ${isBgImage ? 'is-vfa' : 'is-light'}`">
          <div class="container">
            <div class="navbar-brand">
              <span class="burger is-hidden-desktop"></span>
              <nuxt-link :to="localePath('index')" class="navbar-item logo" :title="$t('homepage.homeTitle')" exact>
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
                        <i class="fas fa-question-circle"></i>
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
                    <nuxt-link :to="localePath({ name: 'faqs' })" class="navbar-item">{{$t('menu.moreFAQs')}}</nuxt-link>
                    <!-- <a class="navbar-item">
                      More FAQ's
                    </a> -->
                    <hr class="navbar-divider">
                    <a @click="showIntercom" class="navbar-item">{{$t('menu.contactHelp')}}</a>
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
            <nuxt-link :to="localePath({ name: 'page', params: {page: 'privacy'}})" class="link has-text-vfalight">{{$t('menu.privacy')}}</nuxt-link>
            <!-- <nuxt-link :to="`/${$i18n.locale !== 'en' ? $i18n.locale + '/' : ''}privacy`" class="link has-text-vfalight">{{$t('menu.privacy')}}</nuxt-link> -->
          </p>
          <p v-html="$t('menu.disclaimer')" class="level-item has-text-centered is-size-7 has-text-vfalight">
            <!-- {{$t('menu.disclaimer')}} -->
          </p>
          <p class="level-item has-text-centered">
            <!-- <nuxt-link :to="`/${$i18n.locale !== 'en' ? $i18n.locale + '/' : ''}terms-of-use`" class="link has-text-vfalight">{{$t('menu.terms')}}</nuxt-link> -->
            <nuxt-link :to="localePath({ name: 'page', params: {page: 'terms-of-use'}})" class="link has-text-vfalight">{{$t('menu.terms')}}</nuxt-link>
          </p>
        </nav>
      </div>
    </div>
  </section>
</div>
  <div class="hero is-fullheight" v-else>
    <div class="hero-body">
      <div class="container">
        <h1 class="title has-text-danger">
          {{$t('menu.offlineTitle')}}
        </h1>
        <h2 class="subtitle">
          {{$t('menu.offlineSubtitle')}}
        </h2>
      </div>
    </div>
  </div>
</div>
</template>

<script>
function detectIE () {
  var ua = window.navigator.userAgent
  var msie = ua.indexOf('MSIE ')
  if (msie > 0) { return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10) } // IE 10 or older => return version number
  var trident = ua.indexOf('Trident/')
  if (trident > 0) { var rv = ua.indexOf('rv:'); return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10) }// IE 11 => return version number
  return false
}

export default {
  data () {
    return {
      isMobileMenuActive: false,
      device: {},
      // isLoginModalActive: false,
      topFaqs: [
        {
          title: 'I can\'t remember my last US address, how do I find it?',
          slug: '1'
        },
        {
          title: 'I live outside the US, am I eligible to vote in US elections?',
          slug: '2'
        },
        {
          title: 'Can I register to vote in a different state?',
          slug: '3'
        },
        {
          title: 'Why should I send in the form to request my ballot every calendar year?',
          slug: '5'
        },
        {
          title: 'Can I vote in midterm elections?',
          slug: '6'
        }
      ]
    }
  },
  computed: {
    offline () {
      return process.env.offline && process.env.offline !== 'false'
    },
    upcomingElections: function () { return this.$store.state.upcomingElections },
    isBgImage: function () {
      return this.$route.name && (this.$route.name.includes('index') || this.$route.name.includes('authenticating'))
    },
    test: function () {
      return this.$route.name
    },
    isAuthenticated: function () { return this.$store.getters['userauth/isAuthenticated'] }
  },
  methods: {
    showIntercom () {
      // console.log(this.$intercom)
      this.$intercom.show()
    }
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
      // console.log('process.browser')
      window.onNuxtReady((app) => {
        // console.log('booting intercom', app)
        let isIE = detectIE()
        this.$store.commit('userauth/updateDevice', {isIE})
        app.$intercom.boot()
        // this.$intercom.show()
      })
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

      // check if device allows capture via the file input field
      var i = document.createElement('input')
      i.setAttribute('capture', true)
      var inputCaptureSupported = !!i['capture']
      checkDeviceSupport(() => {
        this.$store.commit('userauth/updateDevice', {
          'hasWebCam': hasWebcam,
          'hasMicrophone': hasMicrophone,
          'hasSpeakers': hasSpeakers,
          'isMicrophoneAlreadyCaptured': isMicrophoneAlreadyCaptured,
          'isWebcamAlreadyCaptured': isWebcamAlreadyCaptured,
          'inputCaptureSupported': inputCaptureSupported
        })
      })
      if (navigator.mediaDevices) {
        navigator.mediaDevices.ondevicechange = () => {
          checkDeviceSupport((event) => {
            // console.log('device change event', event)
            this.$store.commit('userauth/updateDevice', {
              'hasWebCam': hasWebcam,
              'hasMicrophone': hasMicrophone,
              'hasSpeakers': hasSpeakers,
              'isMicrophoneAlreadyCaptured': isMicrophoneAlreadyCaptured,
              'isWebcamAlreadyCaptured': isWebcamAlreadyCaptured
            })
          })
        }
      }
      await import('current-device').then(({default: device}) => {
        // console.log(device)
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
          this.$store.commit('userauth/updateDevice', {
            orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
          })
        }
      })
    }
  }
}
</script>
