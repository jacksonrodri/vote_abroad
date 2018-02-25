<template>
  <div><br/>
  <!-- AK -->
    <div v-if="state === 'AK'">
      <span class="is-flex"><label class="label">{{ label }}</label><span @click="isOpen = !isOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span></span>
      <b-message title="Why am I being asked this?" type="is-info" has-icon :active.sync="isOpen">
        <vue-markdown>{{$t('request.akRules.tooltip')}}</vue-markdown>
      </b-message>
      {{$t('request.akRules.resInstructions')}}
      <b-field :label="$t('request.akRules.label')">
        <b-input  @input="setVal(val)"></b-input>
      </b-field>
      <div v-if="isFWAB">
        {{$t('request.akRules.fwabWitness')}}
      </div>
    </div>
  <!-- AZ -->
    <div v-if="state === 'AZ' && isRegistering">
      <span class="is-flex"><label class="label">{{ label }}</label><span @click="isOpen = !isOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span></span>
      <b-message title="Why am I being asked this?" type="is-info" has-icon :active.sync="isOpen">
        <vue-markdown>{{$t('request.azRules.tooltip')}}</vue-markdown>
      </b-message>
      {{$t('request.azRules.citInstructions')}}
      <b-field :label="$t('request.azRules.label')">
        <b-input  @input="setVal(val)"></b-input>
      </b-field>
    </div>
  <!-- OK -->
    <div v-if="state === 'OK' && isIndNoParty">
      <span class="is-flex"><label class="label">{{ label }}</label><span @click="isOpen = !isOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span></span>
      <b-message title="Why am I being asked this?" type="is-info" has-icon :active.sync="isOpen">
        <vue-markdown>{{$t('request.okRules.tooltip')}}</vue-markdown>
      </b-message>
      {{$t('request.okRules.primaryInstructions')}}
      <b-field :label="$t('request.okRules.label')">
        <b-input @input="setVal(val)"></b-input>
      </b-field>
    </div>
  <!-- PR -->
    <div v-if="state === 'PR'">
      <span class="is-flex"><label class="label">{{ label }}</label><span @click="isOpen = !isOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span></span>
      <b-message title="Why am I being asked this?" type="is-info" has-icon :active.sync="isOpen">
        <vue-markdown>{{$t('request.prRules.tooltip')}}</vue-markdown>
      </b-message>
      {{ $t('request.prRules.parentsInstructions')}}
      <b-field>
        <b-input @input="val => setVal(val)" :label="$t('request.prRules.parentsInstructions')"></b-input>
      </b-field>
    </div>
  <!-- SC -->
    <div v-if="state === 'SC'">
      <span class="is-flex"><label class="label">{{ label }}</label><span @click="isOpen = !isOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span></span>
      <b-message title="Why am I being asked this?" type="is-info" has-icon :active.sync="isOpen">
        <vue-markdown>{{$t('request.scRules.tooltip')}}</vue-markdown>
      </b-message>
      {{$t('request.scRules.raceInstructions')}}
      <b-field :label="$t('request.scRules.label')">
        <b-input v-model="scRace" @input="setVal(scVal)"></b-input>
      </b-field>
      <!-- Your previous state of registration (if any) -->
      {{$t('request.scRules.prevRegInstructions')}}
      <b-field :label="$t('request.scRules.prevRegLabel')">
        <b-input v-model="scPrev" @input="setVal(scVal)"></b-input>
      </b-field>
    </div>
  <!-- VA -->
    <div v-if="state === 'VA' && isReturnUncertain">
      <span class="is-flex"><label class="label">{{ label }}</label><span @click="isOpen = !isOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span></span>
      <b-message title="Why am I being asked this?" type="is-info" has-icon :active.sync="isOpen">
        <vue-markdown>{{$t('request.vaRules.tooltip')}}</vue-markdown>
      </b-message>
      {{$t('request.vaRules.employerInstructions')}}
      <b-field :label="$t('request.vaRules.label')">
        <b-input  @input="setVal(val)"></b-input>
      </b-field>
    </div>
  <!-- VT -->
    <div v-if="state === 'VT'  && isRegistering">
      <span class="is-flex"><label class="label">{{ label }}</label><span @click="isOpen = !isOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span></span>
      <b-message title="Why am I being asked this?" type="is-info" has-icon :active.sync="isOpen">
        <vue-markdown>{{$t('request.vtRules.tooltip')}}</vue-markdown>
      </b-message>
      {{$t('request.vtRules.oathInstructions')}}
      <b-field :label="$t('request.vtRules.label')">
        <b-input @input="setVal(val)"></b-input>
      </b-field>
    </div>
  </div>
</template>

<script>
export default {
  name: 'State-Special',
  props: {
    label: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    state: {
      type: String,
      default: ''
    },
    isFWAB: {
      type: Boolean,
      default: false
    },
    isIndNoParty: {
      type: Boolean,
      default: false
    },
    isReturnUncertain: {
      type: Boolean,
      default: false
    },
    isRegistering: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    scVal () {
      // return this.scRace ? `Race ${this.scRace}` : '' + this.scRace && this.scPrev ? ', ' : '' + this.scPrev ? `I was formerly registered in ${this.scPrev}` : ''
      return `${this.scRace ? 'Race:' + ' ' : ''}${this.scRace + ' -- ' || ''}${this.scPrev ? 'I was formerly registered in:' : ''} ${this.scPrev || ''}`
    }
  },
  data () {
    return {
      scRace: '',
      scPrev: '',
      isOpen: false
    }
  },
  methods: {
    setVal: function (val) {
      this.$emit('input', val)
    }
  }
}
</script>
