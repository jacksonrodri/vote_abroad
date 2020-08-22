<template>
  <section class="hero-body">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-9 is-12-touch">
          <banner
            :show="banner.show"
            @close="closeBanner"
          />
          <auth-user-login></auth-user-login>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import AuthUserLogin from '~/components/AuthUserLogin'
import Banner from '~/components/Banner'

export default {
  layout: 'default',
  // middleware: 'account',
  // head: {
  //   script: [
  //     { src: 'https://identity.netlify.com/v1/netlify-identity-widget.js' }
  //   ]
  // },
  components: {
    AuthUserLogin,
    Banner
  },
  data () {
    return {
      banner: {
        show: true
      }
    }
  },
  methods: {
    closeBanner () {
      this.$set(this.banner, 'show', false)
    }
  },
  // mounted () {
  //   if (process.browser) {
  //     window.onNuxtReady((app) => {
  //       if (window.netlifyIdentity) {
  //         window.netlifyIdentity.on('init', user => {
  //           if (!user) {
  //             window.netlifyIdentity.on('login', () => {
  //               document.location.href = '/admin/'
  //             })
  //           }
  //         })
  //       }
  //     })
  //   }
  // },
  transition: 'test'
}
</script>
