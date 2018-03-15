<template>
<div class="columns is-centered">
<div class="column is-8">
  <div class="columns is-centered is-multiline">
    <div class="column is-10 is-8-desktop is-7-widescreen is-6-fullhd is-paddingless">
      <div>
        <ContentContainer>
          <div slot="lead" class="article-lead">
            <h1 class="title">{{ page.title }}</h1>
          </div>
          <section slot="content" class="content">
            <div v-html="page.body"></div>
          </section>
          <div slot="closer" class="article-closer"><img v-if="page.image" :src="`/img/articles/${page.image}`" class="article-image"/>
            <p v-if="page.quote" class="article-quote">{{ page.quote }}</p>
          </div>
        </ContentContainer>
      </div>
    </div>
  </div>
</div>
</div>
</template>

<script>
import ContentContainer from '~/components/ContentContainer'
export default {
  asyncData: async ({ app, route }) => ({
    page: await app.$content('/en/faqs/faqs').get(route.params.slug)
  }),
  components: {
    ContentContainer
  }
}
</script>
