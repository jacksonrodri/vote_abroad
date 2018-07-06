<template>
  <div class="field">
    <button class="button" @click.prevent="testAsync">test async</button>
    <div v-if="usData">
    <span class="is-flex"><label @click.prevent="$refs.A.focus()" class="label" style="cursor: pointer;">{{ label }} </label><span v-if="toolTipTitle" @click.prevent="isOpen = !isOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span></span>
    <slot name="instructions"></slot>
    <b-message v-if="toolTipTitle" :title="toolTipTitle" type="is-info" has-icon :active.sync="isOpen">
      <slot name="tooltip"></slot>
    </b-message>
    <b-field
      :message="validations.A.$error ? Object.keys(validations.A.$params).map(x => $t(`request.vAdr.messages.A-${x}`)) : '' "
      :type="(validations.A.$error ? 'is-danger': '')">
      <b-autocomplete ref="A"
        :placeholder="$t('request.vAdr.A')"
        :data="data"
        field="structured_formatting.main_text"
        v-model="A"
        name="street-address"
        autocomplete="section-abroad shipping street-address"
        :loading="isFetching"
        @keyup.native="suppressDropdown = false"
        @input="getAsyncData"
        @select="option => fillData(option)">
        <template slot-scope="props">{{ props.option.description }}</template>
        <template slot="empty">No results found</template>
      </b-autocomplete>
    </b-field>
    <b-field>
      <b-input
        :placeholder="$t('request.vAdr.B')"
        autocomplete="section-voting shipping address-line2"
        name="Apartment"
        v-model="B"></b-input>
    </b-field>
    <div class="field is-horizontal">
      <div class="field-body">
        <b-field
          :message="validations.C.$error ? Object.keys(validations.C.$params).map(x => $t(`request.vAdr.messages.C-${x}`)) : '' "
          :type="(validations.C.$error ? 'is-danger': '')">
          <b-autocomplete ref="C"
            :placeholder="$t('request.vAdr.C')"
            :data="data"
            expanded
            field="structured_formatting.main_text"
            v-model="C"
            name="city"
            autocomplete="section-voting shipping address-level2"
            :loading="isFetchingCity"
            @keyup.native="suppressDropdown = false"
            @input="getAsyncDataCity"
            @select="option => fillDataCity(option)">
            <template slot-scope="props">{{ props.option.description.replace(', USA', '') }} </template>
            <template slot="empty">No results found</template>
          </b-autocomplete>
        </b-field>
        <b-field
          :message="validations.S.$error ? Object.keys(validations.S.$params).map(x => $t(`request.vAdr.messages.S-${x}`)) : '' "
          :type="(validations.S.$error ? 'is-danger': '')">
          <b-select v-model="S"
            ref="S"
            name="S"
            autocomplete="section-voting shipping address-level1"
            expanded
            :placeholder="$t('request.vAdr.S')">
            <option
              v-for="state in states"
              :value="state.iso"
              :key="state.iso">
              {{ state.name }}
            </option>
          </b-select>
        </b-field>
        <b-field
          :message="validations.Z.$error ? Object.keys(validations.Z.$params).map(x => $t(`request.vAdr.messages.Z-${x}`)) : '' "
          :type="(validations.Z.$error ? 'is-danger': '')">
          <b-input
            :placeholder="$t('request.vAdr.Z')"
            ref="Z"
            name="Z"
            autocomplete="section-voting shipping postal-code"
            expanded
            v-model="Z"></b-input>
        </b-field>
      </div>
    </div>
    <b-field :label="$t('request.vAdr.Y')">
      <b-input ref="Y"
        :placeholder="$t('request.vAdr.Y')"
        name="Y"
        :disabled="S === 'DC' || S === 'PR' || S === 'VI' || S === 'AS' || S === 'GU'"
        v-model="Y"></b-input>
    </b-field>
    </div>
  </div>
</template>

<script>
import { placesAutocomplete } from '~/utils/helpers.js'

export default {
  props: [
    'value',
    'label',
    'toolTipTitle',
    'validations'
  ],
  data () {
    return {
      usData: null,
      counties: null,
      isOpen: false,
      data: [],
      isFetching: false,
      isFetchingCity: false
    }
  },
  computed: {
    states () {
      return !this.usData || !this.usData.US ? [] : this.usData.US.sub_names.split('~')
        .map((state, index) => ({
          name: state,
          iso: this.usData.US.sub_keys.split(/~/)[index],
          zipExample: this.usData.US.sub_zipexs.split(/~/)[index],
          zipRegex: this.usData.US.sub_zips.split(/~/)[index],
          counties: !this.counties && this.counties[state] ? [] : this.counties[state]
        }))
    },
    A: {
      get () { return this.value && this.value.A ? this.value.A : '' },
      set (val) { this.$emit('input', { ...this.value, A: val }) }
    },
    B: {
      get () { return this.value && this.value.B ? this.value.B : '' },
      set (val) { this.$emit('input', { ...this.value, B: val }) }
    },
    C: {
      get () { return this.value && this.value.C ? this.value.C : '' },
      set (val) { this.$emit('input', { ...this.value, C: val }) }
    },
    S: {
      get () { return this.value && this.value.S ? this.value.S : null },
      set (val) { this.$emit('input', { ...this.value, S: val }) }
    },
    Z: {
      get () { return this.value && this.value.Z ? this.value.Z : '' },
      set (val) { this.$emit('input', { ...this.value, Z: val }) }
    },
    Y: {
      get () { return this.value && this.value.Y ? this.value.Y : '' },
      set (val) { this.$emit('input', { ...this.value, Y: val }) }
    }
  },
  beforeMount: function () {
    if (process.browser) {
      import('~/data/counties/counties.json').then(data => { this.counties = data })
      import('~/static/postal/us.json').then(data => { this.usData = data })
    }
    // else this.usData = { test: 'ok' }
  },
  methods: {
    testAsync () {
      placesAutocomplete.call(this)
    },
    getAsyncData (val) {
      console.log(val)
    },
    getAsyncDataCity (val) {
      console.log(val)
    }
  }

}
</script>

<style>

</style>
