<template>
<div>
  <!-- <h1 class="title">Voting from abroad in your State</h1> -->
  <h1 class="title">
    {{ page.title }}
  </h1>
  <nuxtent-body class="content" :body="page.body" />
</div>
</template>
<script>
export default {
  asyncData: async ({ app }) => ({
    page: await app.$content(`${app.i18n.locale}/pages`).get(`${app.i18n.locale !== app.i18n.defaultLocale ? app.i18n.locale + '/' : ''}states`)
  })
}
</script>
