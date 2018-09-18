<template>
  <div class="columns is-centered">
    <div class="column is-10 is-8-desktop is-7-widescreen is-6-fullhd is-paddingless">
      <div class="article-lead">
        <h1 class="article-title">{{ page.title }}</h1>
      </div>
      <nuxtent-body class="content" :body="page.body" />
    </div>
  </div>
</template>

<script>
export default {
  asyncData: async ({ app, route }) => ({
    pages: {
      en: await app.$content(`en/pages`).get(`${route.params.page}`),
      es: await app.$content(`es/pages`).get(`es/${route.params.page}`)
    }
  }),
  computed: {
    page () { return this.pages[this.$i18n.locale] }
  }
}
</script>
