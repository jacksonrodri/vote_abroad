<template>
<div class="hero-body">
<div class="columns is-centered">
  <div class="column is-10 is-8-desktop is-7-widescreen is-6-fullhd is-paddingless">
    <nav class="breadcrumb" aria-label="breadcrumbs">
      <ul>
        <li><nuxt-link :to="localePath('index')">{{$t('home')}}</nuxt-link></li>
        <li class="is-active"><a href="#" aria-current="page">{{$t('menu.helpfaq')}}</a></li>
      </ul>
    </nav>
    <h1 class="title">{{$t('faq.title')}}</h1>
    <p class="subtitle is-4">
      {{$t('faq.intro')}}
    </p>
    <i18n tag="h3" path="faq.intro2" class="subtitle is-4">
      <a place="emailLink" class="has-text-primary" href="mailto:helpdesk@votefromabroad.org">helpdesk@votefromabroad.org</a>
      <a place="intercom" class="has-text-primary" @click="launchIntercom">{{$t('faq.voterHelpDesk')}}</a>
      <a place="zoomLink" class="has-text-primary" target="_blank" href="https://qrco.de/bbh0zg">
        Global Voter Assistance (Live via Zoom).
      </a>
    </i18n>
    <div class="columns is-multiline">
      <div v-for="(category, index) in categories" :key="index" class="column is-6">
        <nav class="panel">
          <p class="panel-heading">{{$t(`faq.${category.category}`)}}</p>
          <nuxt-link v-for="faq in category.faqs" :key="faq.title" :to="localePath({path: faq.permalink})" class="panel-block">
            <span class="panel-icon">
              <i class="fas fa-question-circle"></i>
            </span>
            {{faq.question || faq.title}}
          </nuxt-link>
        </nav>
      </div>
    </div>
  </div>
</div>
</div>
</template>

<script>
export default {
  asyncData: async ({ app, route }) => ({
    faqs: {
      es: await app.$content('es/faqs').getAll(),
      en: await app.$content('en/faqs').getAll()
    }
  }),
  computed: {
    lang () {
      return this.$i18n.locale
    },
    categories: function () {
      const faqs = this.faqs[this.$i18n.locale].map(({category, ...faq}) => ({...faq, category: category.split('_')[0]}))
      return [...new Set(faqs.map(({category}) => category))].map(category => ({
        category,
        faqs: faqs.filter(({category: c}) => c === category)
      }))
    }
  },
  methods: {
    launchIntercom () {
      this.$intercom.show()
    }
  }
}
</script>

<style>

</style>
