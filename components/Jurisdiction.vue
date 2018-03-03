<template>
  <div class="field">
    <span class="is-flex"><label class="label">{{ label }}</label><span @click="isOpen = !isOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span></span>
    <slot name="instructions"></slot>
    <!-- Jurisdiction: {{leos.length}} leos found -->
    <!-- <button class="button">Wake County</button> -->
    <b-field>
      <b-autocomplete
        :value="typedJurisdiction || jurisdiction || ''"
        open-on-focus
        keep-first
        expanded
        ref="jurisdiction"
        :data="filteredLeos"
        field="n"
        placeholder="Start typing to find your jurisdiction"
        @select="option => updateLeo(option)">
        <template slot-scope="props"><strong>{{props.option.j}} {{props.option.j.toLowerCase().indexOf(props.option.t.toLowerCase()) > -1 ? '' : props.option.t}}</strong> - <small>{{props.option.n}}</small></template>
        </b-autocomplete>
        <p class="control">
            <button class="button is-grey is-inverted is-outlined"
              @click="$refs.jurisdiction.focus()">
              <b-icon icon="chevron-down"></b-icon>
            </button>
        </p>
      </b-field>
  <b-message :title="toolTipTitle" type="is-info" has-icon :active.sync="isOpen">
    <slot name="tooltip"></slot>
  </b-message>
  </div>
</template>

<script>

export default {
  name: 'Jurisdiction',
  props: [
    'value',
    'state',
    'type',
    'label',
    'message',
    'toolTipTitle'
  ],
  async created () {
    this.leos = await (
      await import(
        /* webpackChunkName: "leodata" */ `@/data/${this.state}-leos.json`
      )
    )
  },
  data () {
    return {
      leos: [],
      typedJurisdiction: '',
      isOpen: false
    }
  },
  computed: {
    votAdr () { return this.$store.getters['requests/getCurrent'].votAdr },
    jurisdiction () { return this.votAdr.leo && this.votAdr.leo.n ? this.votAdr.leo.n : '' },
    street: {
      get () { return this.votAdr.thoroughfare || '' },
      set (value) { this.updateAddress('thoroughfare', value) }
    },
    prioritizedLeos () {
      if (this.votAdr.county) {
        let county = this.votAdr.county.toLowerCase().replace('county', '').trim()
        return this.leos.slice()
          .sort((a, b) => a.n - b.n)
          .sort((a, b) => {
            if (
              a.n.toLowerCase().indexOf(county) > -1 &&
              b.n.toLowerCase().indexOf(county) > -1
            ) {
              return 1
            } else if (a.n.toLowerCase().indexOf(county) > -1) {
              return -1
            } else if (b.n.toLowerCase().indexOf(county) > -1) {
              return 1
            } else {
              return 0
            }
          })
      } else {
        return this.leos
      }
    },
    filteredLeos () {
      if (!this.typedJurisdiction) {
        return this.prioritizedLeos
      }
      return this.prioritizedLeos.filter(leo => leo.n.toLowerCase().indexOf(this.typedJurisdiction.toLowerCase()) > -1)
    }
  },
  methods: {
    updateLeo: function (value) {
      this.$store.commit('requests/update', {votAdr: Object.assign({}, this.votAdr, {leo: value})})
    }
  }
}
</script>
