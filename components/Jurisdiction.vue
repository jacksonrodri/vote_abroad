<template>
  <div class="field">
    Jurisdiction: {{leos.length}} leos found
    <button class="button">Wake County</button>
    <b-autocomplete
      v-model="typedJurisdiction"
      open-on-focus
      :data="filteredLeos"
      field="n"
      placeholder="Start typing to find your jurisdiction">
      <template slot-scope="props"><strong>{{props.option.j}} {{props.option.j.toLowerCase().indexOf(props.option.t.toLowerCase()) > -1 ? '' : props.option.t}}</strong> - <small>{{props.option.n}}</small></template>
      </b-autocomplete>
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
      leos: [],
      typedJurisdiction: ''
    }
  },
  computed: {
    votAdr () { return this.$store.getters['requests/getCurrent'].votAdr },
    filteredLeos () {
      if (!this.typedJurisdiction) {
        return this.leos
      }
      return this.leos.filter(leo => leo.n.toLowerCase().indexOf(this.typedJurisdiction.toLowerCase()) > -1)
    }
  }
}
</script>
