<template>
<!-- <div class="hero-body"> -->
  <div class="columns is-centered">
    <div class="column is-10 is-8-desktop is-7-widescreen is-6-fullhd is-paddingless">
      <div class="article-lead">
        <h1 class="article-title">{{ page.title }}</h1>
      </div>
      <!-- <section class="article-body">
        <div v-html="page.body"></div>
      </section> -->
      <nuxtent-body class="content" :body="page.body" />
    </div>
  </div>
<!-- </div> -->
</template>

<script>
export default {
  asyncData: async ({ app, route }) => ({
    page: await app.$content(`${app.i18n.locale}/pages`).get(`${app.i18n.locale !== app.i18n.defaultLocale ? app.i18n.locale + '/' : ''}${route.params.page}`)
  })
}
</script>
