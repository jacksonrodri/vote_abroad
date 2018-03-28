<template>
  <h1 class="title">Voting from abroad in your State</h1>
</template>
<script>
export default {
  asyncData: async ({ app }) => ({
    page: await app.$content(`${app.i18n.locale}/pages`).get(`${app.i18n.locale !== app.i18n.defaultLocale ? app.i18n.locale + '/' : ''}states`)
  })
}
</script>
