<template>
  <section class="section" v-show="showError">
    <h1 class="title">
      {{ isChunkLoadingFailed ? 'Page Failed to Load' : error.statusCode }}
    </h1>
    <h2 class="subtitle">
      {{ isChunkLoadingFailed ? 'The page has just been updated and will be reloaded. If it is not automatically reloaded, please click refresh in your browser to manually reload.' : error.message }}
    </h2>
    <nuxt-link class="button is-primary" to="/" v-if="error.statusCode === 404">
      Back to main page
    </nuxt-link>
  </section>
</template>

<script>
export default {
  props: ['error'],
  layout: 'default',
  mounted () {
    if (this.error == null) {
    }
    if (this.error.statusCode === 404) {
    }
    // webpack error
    if (this.error.statusCode === 500 && /^Loading chunk (\d)+ failed\./.test(this.error.message)) {
      this.isChunkLoadingFailed = true
      setTimeout(() => {
        location.replace(location.href)
      }, 3000)
    }
    this.showError = true
  },
  data () {
    return {
      showError: false,
      isChunkLoadingFailed: false
    }
  },
  computed: {
    statusCode () {
      return (this.error && this.error.statusCode) || 500
    },
    message () {
      return this.error.message
    }
  }

}
</script>

<style>

</style>
