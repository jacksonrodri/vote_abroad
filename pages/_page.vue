<template>
<div class="hero-body">
  <div class="columns is-centered">
    <div class="column is-8">
      <ContentContainer>
        <div slot="lead" class="article-lead">
          <h1 class="article-title">{{ page.title }}</h1>
        </div>
        <section slot="content" class="article-body">
          <div v-html="page.body"></div>
        </section>
        <div slot="closer" class="article-closer"><img v-if="page.image" :src="`/img/articles/${page.image}`" class="article-image"/>
          <p v-if="page.quote" class="article-quote">{{ page.quote }}</p>
        </div>
      </ContentContainer>
    </div>
  </div>
</div>
</template>

<script>
import ContentContainer from '~/components/ContentContainer'
export default {
  asyncData: async ({ app, route }) => ({
    page: await app.$content(`${app.i18n.locale}/pages`).get(`${app.i18n.locale !== app.i18n.defaultLocale ? app.i18n.locale + '/' : ''}pages/${route.params.page}`)
  }),
  components: {
    ContentContainer
  }
}
</script>
