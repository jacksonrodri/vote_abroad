<template>
<div class="columns is-centered is-multiline">
<div class="column is-10 is-8-desktop is-7-widescreen is-6-fullhd is-paddingless">
  <!-- <h1 class="title">Voting from abroad in your State</h1> -->
  <h1 class="title">
    {{ page.title }}
  </h1>
  <nuxtent-body class="content" :body="page.body" />
  <b-field label="Select the last State you resided in.">
    <b-select placeholder="Select your state"
      v-model="selectedState"
      @input="$router.push(localePath({ name: 'election-officials-state', params: {state: selectedState} }))">
      <option
        v-for="state in states"
        :value="state.iso"
        :key="state.iso">
        {{ state.title }}
      </option>
    </b-select>
  </b-field>
</div>
</div>
</template>
<script>
export default {
  asyncData: async ({ app }) => ({
    page: await app.$content(`${app.i18n.locale}/pages`).get(`${app.i18n.locale !== app.i18n.defaultLocale ? app.i18n.locale + '/' : ''}election-officials`),
    states: (await app.$content('/rls').getAll())
      .sort((a, b) => {
        if (a.title.toUpperCase() < b.title.toUpperCase()) { return -1 }
        if (a.title.toUpperCase() > b.title.toUpperCase()) { return 1 }
        return 0
      })
  }),
  data () {
    return {
      selectedState: ''
    }
  }
}
</script>
