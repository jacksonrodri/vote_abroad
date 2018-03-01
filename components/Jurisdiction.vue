<template>
  <div class="field">
    Jurisdiction: {{leos.length}} leos found
  </div>
</template>

<script>
const leos = (state) => import(
  /* webpackChunkName: "leodata" */ `@/data/${state}-leos.json`
)

export default {
  props: [
    'state'
  ],
  async created () {
    this.leos = await leos(this.state)
  },
  data () {
    return {
      leos: []
    }
  }
}
</script>
