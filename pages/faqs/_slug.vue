<template>
<div class="columns is-centered">
  <div class="column is-10 is-8-desktop is-7-widescreen is-6-fullhd is-paddingless">
    <div>
      <ContentContainer>
        <div slot="lead" class="article-lead">
          <h1 class="title is-4">{{ page.title }}</h1>
        </div>
        <section slot="content" class="content">
          <nuxtent-body class="content" :body="page.body" />
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
    page: await app.$content(`${app.i18n.locale}/faqs`).get(`${app.i18n.locale !== app.i18n.defaultLocale ? app.i18n.locale + '/' : ''}faqs/${route.params.slug}`)
  }),
  components: {
    ContentContainer
  }
}
</script>
