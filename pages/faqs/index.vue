<template>
<div class="hero-body">
<div class="columns is-centered">
  <div class="column is-10 is-8-desktop is-7-widescreen is-6-fullhd is-paddingless">
    <h1 class="title">FAQs</h1>
    <div class="columns is-multiline">
      <div v-for="(category, index) in categories" :key="index" class="column is-6">
        <nav class="panel">
          <p class="panel-heading">{{category.category}}</p>
          <nuxt-link v-for="faq in category.faqs" :key="faq.title" :to="faq.permalink" class="panel-block">
            <span class="panel-icon">
              <i class="far fa-question-circle"></i>
            </span>
            {{faq.title}}
          </nuxt-link>
        </nav>
        <!-- <h2 class="title is-4">{{category.category}}</h2>
        <ul>
          <li v-for="(faq, index) in category.faqs" :key="faq.title">
            <nuxt-link :to="faq.permalink">{{faq.title}}</nuxt-link>
          </li>
        </ul> -->
      </div>
    </div>
  </div>
</div>
</div>
</template>

<script>
export default {
  asyncData: async ({ app, route }) => ({
    faqs: await app.$content(app.i18n.locale + '/faqs').getAll()
  }),
  computed: {
    try: function () {
      return this.faqs
        .map(x => x.categories.map(y => y.category)[0])
        .map(cat => ({
          category: cat,
          faqs: this.faqs.filter(x => x.categories.map(x => x.category).reduce((acc, cur) => cur === cat ? true : acc, false))
        }))
    },
    categories: function () {
      return [...new Set(this.faqs.map(x => x.categories).reduce((acc, cur) => acc.concat(cur), []).map(x => x.category))]
        .map(subject => ({
          category: subject,
          faqs: this.faqs.filter(x => x.categories.map(x => x.category).indexOf(subject) > -1)
        }))
        .sort((a, b) => a.faqs.length > b.faqs.length ? 1 : -1)
    }
  }
}
</script>

<style>

</style>
