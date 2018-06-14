<template>
  <div class="field">
    <!-- <div v-if="isSingleLeoState">
      <span class="is-flex"><label class="label">{{ label }}</label><span @click.prevent="isOpen = !isOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span></span> -->
      <!-- <slot name="instructions"></slot> -->
      <!-- <p></p>
      <b-field>
        <b-input disabled :value="jurisdiction"></b-input>
      </b-field>
    </div> -->
    <!-- <div v-else> -->
      <span class="is-flex"><label class="label">{{ label }}</label><span @click.prevent="isOpen = !isOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span></span>
      <slot name="instructions"></slot>
      <!-- Jurisdiction: {{leos.length}} leos found -->
      <!-- <button class="button">Wake County</button> -->
      <b-field
        :type="validations.$error ? 'is-danger' : ''"
        :message="validations.$error ? Object.keys(validations.$params).map(x => $t(`request.jurisdiction.messages.${x}`)) : '' ">
            <!-- v-model="typedJurisdiction" -->
        <b-field>
          <b-autocomplete
            :value="typedJurisdiction || jurisdiction || ''"
            open-on-focus
            keep-first
            expanded
            @input="(val) => {this.typedJurisdiction = val; this.updated()}"
            ref="jurisdiction"
            :data="filteredLeos"
            field="n"
            :placeholder="placeholder"
            @select="option => updateLeo(option)">
            <template slot-scope="props"><strong>{{props.option.j}} {{props.option.j.toLowerCase().indexOf(props.option.t.toLowerCase()) > -1 ? '' : props.option.t}}</strong> - <small>{{props.option.n}}&nbsp;</small><span v-if="props.option.suggested" class="tag is-info">Suggested</span></template>
            </b-autocomplete>
            <p class="control">
                <button class="button is-grey is-inverted is-outlined"
                  @click.prevent="$refs.jurisdiction.focus()">
                  <b-icon icon="chevron-down"></b-icon>
                </button>
            </p>
          </b-field>
        </b-field>
      <b-message :title="toolTipTitle" type="is-info" has-icon :active.sync="isOpen">
        <slot name="tooltip"></slot>
      </b-message>
    </div>
  <!-- </div> -->
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
    'validations',
    'toolTipTitle',
    'placeholder'
  ],
  async mounted () {
    switch (this.state) {
      case 'AL':
        this.leos = await import(/* webpackChunkName: "leodataAL" */ `@/data/AL-leos.json`)
        break
      case 'AK':
        this.leos = await import(/* webpackChunkName: "leodataAK" */ `@/data/AK-leos.json`)
        break
      case 'AS':
        this.leos = await import(/* webpackChunkName: "leodataAS" */ `@/data/AS-leos.json`)
        break
      case 'AZ':
        this.leos = await import(/* webpackChunkName: "leodataAZ" */ `@/data/AZ-leos.json`)
        break
      case 'AR':
        this.leos = await import(/* webpackChunkName: "leodataAR" */ `@/data/AR-leos.json`)
        break
      case 'CA':
        this.leos = await import(/* webpackChunkName: "leodataCA" */ `@/data/CA-leos.json`)
        break
      case 'CO':
        this.leos = await import(/* webpackChunkName: "leodataCO" */ `@/data/CO-leos.json`)
        break
      case 'CT':
        this.leos = await import(/* webpackChunkName: "leodataCT" */ `@/data/CT-leos.json`)
        break
      case 'DE':
        this.leos = await import(/* webpackChunkName: "leodataDE" */ `@/data/DE-leos.json`)
        break
      case 'DC':
        this.leos = await import(/* webpackChunkName: "leodataDC" */ `@/data/DC-leos.json`)
        break
      case 'FL':
        this.leos = await import(/* webpackChunkName: "leodataFL" */ `@/data/FL-leos.json`)
        break
      case 'GA':
        this.leos = await import(/* webpackChunkName: "leodataGA" */ `@/data/GA-leos.json`)
        break
      case 'GU':
        this.leos = await import(/* webpackChunkName: "leodataGU" */ `@/data/GU-leos.json`)
        break
      case 'HI':
        this.leos = await import(/* webpackChunkName: "leodataHI" */ `@/data/HI-leos.json`)
        break
      case 'ID':
        this.leos = await import(/* webpackChunkName: "leodataID" */ `@/data/ID-leos.json`)
        break
      case 'IL':
        this.leos = await import(/* webpackChunkName: "leodataIL" */ `@/data/IL-leos.json`)
        break
      case 'IN':
        this.leos = await import(/* webpackChunkName: "leodataIN" */ `@/data/IN-leos.json`)
        break
      case 'IA':
        this.leos = await import(/* webpackChunkName: "leodataIA" */ `@/data/IA-leos.json`)
        break
      case 'KS':
        this.leos = await import(/* webpackChunkName: "leodataKS" */ `@/data/KS-leos.json`)
        break
      case 'KY':
        this.leos = await import(/* webpackChunkName: "leodataKY" */ `@/data/KY-leos.json`)
        break
      case 'LA':
        this.leos = await import(/* webpackChunkName: "leodataLA" */ `@/data/LA-leos.json`)
        break
      case 'ME':
        this.leos = await import(/* webpackChunkName: "leodataME" */ `@/data/ME-leos.json`)
        break
      case 'MD':
        this.leos = await import(/* webpackChunkName: "leodataMD" */ `@/data/MD-leos.json`)
        break
      case 'MA':
        this.leos = await import(/* webpackChunkName: "leodataMA" */ `@/data/MA-leos.json`)
        break
      case 'MI':
        this.leos = await import(/* webpackChunkName: "leodataMI" */ `@/data/MI-leos.json`)
        break
      case 'MN':
        this.leos = await import(/* webpackChunkName: "leodataMN" */ `@/data/MN-leos.json`)
        break
      case 'MS':
        this.leos = await import(/* webpackChunkName: "leodataMS" */ `@/data/MS-leos.json`)
        break
      case 'MO':
        this.leos = await import(/* webpackChunkName: "leodataMO" */ `@/data/MO-leos.json`)
        break
      case 'MT':
        this.leos = await import(/* webpackChunkName: "leodataMT" */ `@/data/MT-leos.json`)
        break
      case 'NE':
        this.leos = await import(/* webpackChunkName: "leodataNE" */ `@/data/NE-leos.json`)
        break
      case 'NV':
        this.leos = await import(/* webpackChunkName: "leodataNV" */ `@/data/NV-leos.json`)
        break
      case 'NH':
        this.leos = await import(/* webpackChunkName: "leodataNH" */ `@/data/NH-leos.json`)
        break
      case 'NJ':
        this.leos = await import(/* webpackChunkName: "leodataNJ" */ `@/data/NJ-leos.json`)
        break
      case 'NM':
        this.leos = await import(/* webpackChunkName: "leodataNM" */ `@/data/NM-leos.json`)
        break
      case 'NY':
        this.leos = await import(/* webpackChunkName: "leodataNY" */ `@/data/NY-leos.json`)
        break
      case 'NC':
        this.leos = await import(/* webpackChunkName: "leodataNC" */ `@/data/NC-leos.json`)
        break
      case 'ND':
        this.leos = await import(/* webpackChunkName: "leodataND" */ `@/data/ND-leos.json`)
        break
      case 'OH':
        this.leos = await import(/* webpackChunkName: "leodataOH" */ `@/data/OH-leos.json`)
        break
      case 'OK':
        this.leos = await import(/* webpackChunkName: "leodataOK" */ `@/data/OK-leos.json`)
        break
      case 'OR':
        this.leos = await import(/* webpackChunkName: "leodataOR" */ `@/data/OR-leos.json`)
        break
      case 'PA':
        this.leos = await import(/* webpackChunkName: "leodataPA" */ `@/data/PA-leos.json`)
        break
      case 'PR':
        this.leos = await import(/* webpackChunkName: "leodataPR" */ `@/data/PR-leos.json`)
        break
      case 'RI':
        this.leos = await import(/* webpackChunkName: "leodataRI" */ `@/data/RI-leos.json`)
        break
      case 'SC':
        this.leos = await import(/* webpackChunkName: "leodataSC" */ `@/data/SC-leos.json`)
        break
      case 'SD':
        this.leos = await import(/* webpackChunkName: "leodataSD" */ `@/data/SD-leos.json`)
        break
      case 'TN':
        this.leos = await import(/* webpackChunkName: "leodataTN" */ `@/data/TN-leos.json`)
        break
      case 'TX':
        this.leos = await import(/* webpackChunkName: "leodataTX" */ `@/data/TX-leos.json`)
        break
      case 'UT':
        this.leos = await import(/* webpackChunkName: "leodataUT" */ `@/data/UT-leos.json`)
        break
      case 'VT':
        this.leos = await import(/* webpackChunkName: "leodataVT" */ `@/data/VT-leos.json`)
        break
      case 'VI':
        this.leos = await import(/* webpackChunkName: "leodataVI" */ `@/data/VI-leos.json`)
        break
      case 'VA':
        this.leos = await import(/* webpackChunkName: "leodataVA" */ `@/data/VA-leos.json`)
        break
      case 'WA':
        this.leos = await import(/* webpackChunkName: "leodataWA" */ `@/data/WA-leos.json`)
        break
      case 'WV':
        this.leos = await import(/* webpackChunkName: "leodataWV" */ `@/data/WV-leos.json`)
        break
      case 'WI':
        this.leos = await import(/* webpackChunkName: "leodataWI" */ `@/data/WI-leos.json`)
        break
      case 'WY':
        this.leos = await import(/* webpackChunkName: "leodataWY" */ `@/data/WY-leos.json`)
        break
    }
    // this.leos = await (
    //   await import(
    //     /* webpackChunkName: "leodata" */ `@/data/${this.state}-leos.json`
    //   )
    // )
    if (this.leos.length === 1) {
      this.isSingleLeoState = true
      this.updateLeo(this.leos[0])
    } else {
      this.isSingleLeoState = false
    }
  },
  data () {
    return {
      leos: [],
      isSingleLeoState: false,
      typedJurisdiction: '',
      isOpen: false
    }
  },
  computed: {
    votAdr () { return this.$store.getters['requests/getCurrent'].votAdr },
    leo () { return this.$store.getters['requests/getCurrent'].leo },
    jurisdiction () { return this.leo && this.leo.n ? this.leo.n : '' },
    leoTypes () { return [...new Set(this.leos.map(x => x.t))] },
    // isSingleLeoState () { return this.leos.length === 1 },
    street: {
      get () { return this.votAdr.thoroughfare || '' },
      set (value) { this.updateAddress('thoroughfare', value) }
    },
    myLeos () {
      let villageLeos = []
      let townLeos = []
      let cityLeos = []
      let countyLeos = []
      this.leos.forEach(x => {
        switch (x.t.toLowerCase()) {
          case 'all':
            break
          case 'village':
            if (this.votAdr.locality && (x.n.toLowerCase().indexOf(this.votAdr.locality.toLowerCase().replace('village', '').trim()) > -1 || x.j.toLowerCase().indexOf(this.votAdr.locality.toLowerCase().replace('village', '').trim()) > -1)) {
              villageLeos.push(x)
            }
            break
          case 'town':
          case 'township':
            if (this.votAdr.locality && (x.n.toLowerCase().indexOf(this.votAdr.locality.toLowerCase().replace('township', '').replace('town', '').trim()) > -1 || x.j.toLowerCase().indexOf(this.votAdr.locality.toLowerCase().replace('township', '').replace('town', '').trim()) > -1)) {
              townLeos.push(x)
            }
            break
          case 'parish':
          case 'borough':
          case 'city':
            if (this.votAdr.locality && (x.n.toLowerCase().indexOf(this.votAdr.locality.toLowerCase().replace('parish', '').replace('borough', '').replace('city', '').trim()) > -1 || x.j.toLowerCase().indexOf(this.votAdr.locality.toLowerCase().replace('parish', '').replace('borough', '').replace('city', '').trim()) > -1)) {
              cityLeos.push(x)
            }
            break
          case 'county':
          case 'island':
            if (this.votAdr.county && (x.n.toLowerCase().indexOf(this.votAdr.county.toLowerCase().replace('county', '').replace('island', '').trim()) > -1 || x.j.toLowerCase().indexOf(this.votAdr.county.toLowerCase().replace('county', '').replace('island', '').trim()) > -1)) {
              countyLeos.push(x)
            }
            break
          default:
            break
        }
      })
      // this.leos.forEach(x => {
      //   switch (x.toLowerCase()) {
      //     case 'county':
      //     case 'island':
      //       if (this.votAdr.county) {
      //         arr.push(this.leos.filter(x => x.n.indexOf(this.votAdr.county) > -1))
      //       }
      //       break
      //     case 'town':
      //     case 'village':
      //     case 'city':
      //     case 'parish':
      //     case 'township':
      //     case 'borough':
      //       if (this.votAdr.locality) {
      //         arr.unshift(this.leos.filter(x => x.n.indexOf(this.votAdr.locality) > -1)[0])
      //       }
      //       break
      //     default:
      //       console.log('other jurisdiction type: ', x)
      //   }
      // })
      // console.log('types', arr)
      return [].concat(villageLeos, townLeos, cityLeos, countyLeos).map(leo => { leo.suggested = true; return leo })
    },
    prioritizedLeos () {
      return [].concat(this.myLeos, this.leos)
      // if (this.votAdr.county) {
      //   let county = this.votAdr.county.toLowerCase().replace('county', '').trim()
      //   return this.leos.slice()
      //     .sort((a, b) => a.n - b.n)
      //     .sort((a, b) => {
      //       if (
      //         a.n.toLowerCase().indexOf(county) > -1 &&
      //         b.n.toLowerCase().indexOf(county) > -1
      //       ) {
      //         return 1
      //       } else if (a.n.toLowerCase().indexOf(county) > -1) {
      //         return -1
      //       } else if (b.n.toLowerCase().indexOf(county) > -1) {
      //         return 1
      //       } else {
      //         return 0
      //       }
      //     })
      // } else {
      //   return this.leos
      // }
    },
    filteredLeos () {
      if (!this.typedJurisdiction) {
        return this.prioritizedLeos
      }
      return this.leos.filter(leo => leo.n.toLowerCase().indexOf(this.typedJurisdiction.toLowerCase()) > -1 || leo.j.toLowerCase().indexOf(this.typedJurisdiction.toLowerCase()) > -1)
      // return this.prioritizedLeos.filter(leo => leo.n.toLowerCase().indexOf(this.typedJurisdiction.toLowerCase()) > -1 || leo.j.toLowerCase().indexOf(this.typedJurisdiction.toLowerCase()) > -1)
    }
  },
  methods: {
    updateLeo: function (value) {
      let leo = {}
      if (value) {
        Object.keys(value).forEach(x => {
          if (value[x]) leo[x] = value[x]
        })
      }
      delete leo.suggested
      this.$store.commit('requests/update', {leo: leo})
    },
    updated: function () {
      this.$emit('input')
    }
  }
}
</script>
