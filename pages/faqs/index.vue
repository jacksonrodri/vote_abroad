<template>
<div class="hero-body">
<div class="columns is-centered">
  <div class="column is-8">
    <h1 class="title">FAQs</h1>
    <div class="columns is-multiline">
      <div v-for="(category, index) in categories" :key="index" class="column is-6">
        <h2 class="title is-4">{{category.category}}</h2>
        <ul>
          <li v-for="faq in category.faqs" :key="faq.title">
            <nuxt-link :to="faq.permalink">{{faq.title}}</nuxt-link>
          </li>
        </ul>
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
    }
  }
}
</script>

<style>

</style>
