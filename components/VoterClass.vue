<template>
  <div>
    <h1 class="subtitle is-4">Are you a civilian or military voter?</h1>
    <section class="section">
      <b-field grouped group-multiline position="is-centered">
        <p class="control">
          <button @click="setVal('civilianType')" :class="[baseClass, {'is-primary': isCivilianType}]">
            <span v-show="isCivilianType" class="icon is-small">
              <i class="fas fa-check"></i>
            </span>
            <span>
              Civilian
            </span>
          </button>
        </p>
        <p class="control">
          <button @click="setVal('militaryType')" :class="[baseClass, {'is-primary': isMilitaryType}]">
            <span v-show="isMilitaryType" class="icon is-small">
              <i class="fas fa-check"></i>
            </span>
            <span>
              Military
            </span>
          </button>
        </p>
      </b-field>
      <b-field grouped group-multiline position="is-centered">
        <p class="control" v-show="isMilitaryType">
          <button @click="setVal('military')" :class="[baseClass, {'is-primary': isMilitary}]">
            <span v-show="isMilitary" class="icon is-small">
              <i class="fas fa-check"></i>
            </span>
            <span>
              Active Duty Military
            </span>
          </button>
        </p>
        <p class="control" v-show="isMilitaryType">
          <button @click="setVal('milSpouse')" :class="[baseClass, {'is-primary': isMilSpouse}]">
            <span v-show="isMilSpouse" class="icon is-small">
              <i class="fas fa-check"></i>
            </span>
            <span>
              Eligible Military Spouse or Dependent
            </span>
          </button>
        </p>
        <p class="control" v-show="isMilitaryType">
          <button @click="setVal('natGuard')" :class="[baseClass, {'is-primary': isNatGuard}]">
            <span v-show="isNatGuard" class="icon is-small">
              <i class="fas fa-check"></i>
            </span>
            <span>
              National Guard
            </span>
          </button>
        </p>
        <p class="control" v-show="isCivilianType">
          <button @click="setVal('uncertainReturn')" :class="[baseClass, {'is-primary': isUncertainReturn}]">
            <span v-show="isUncertainReturn" class="icon is-small">
              <i class="fas fa-check"></i>
            </span>
            <span>
              My Return is Uncertain
            </span>
          </button>
        </p>
        <p class="control" v-show="isCivilianType">
          <button @click="setVal('intendToReturn')" :class="[baseClass, {'is-primary': isIntendToReturn}]">
            <span v-show="isIntendToReturn" class="icon is-small">
              <i class="fas fa-check"></i>
            </span>
            <span>
              I Intend to Return
            </span>
          </button>
        </p>
        <p class="control" v-show="isCivilianType">
          <button @click="setVal('neverResided')" :class="[baseClass, {'is-primary': isNeverResided}]">
            <span v-show="isNeverResided" class="icon is-small">
              <i class="fas fa-check"></i>
            </span>
            <span>
              Never Resided
            </span>
          </button>
        </p>
      </b-field>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Voter-Class',
  props: [
    'label',
    'value'
  ],
  data () {
    return {
      milOrCiv: '',
      baseClass: {
        'is-medium': true,
        button: true
      }
    }
  },
  methods: {
    setVal: function (val) {
      console.log('val', val)
      if (val === 'civilianType' || val === 'militaryType') {
        this.milOrCiv = val
        this.$emit('input', '')
      } else {
        this.$emit('input', val)
      }
    }
  },
  computed: {
    isMilitaryType: function () { return this.isMilitary || this.isMilSpouse || this.isNatGuard || this.milOrCiv === 'militaryType' },
    isCivilianType: function () { return this.isUncertainReturn || this.isIntendToReturn || this.isNeverResided || this.milOrCiv === 'civilianType' },
    isMilitary: function () { return this.value === 'military' },
    isMilSpouse: function () { return this.value === 'milSpouse' },
    isNatGuard: function () { return this.value === 'natGuard' },
    isUncertainReturn: function () { return this.value === 'uncertainReturn' },
    isIntendToReturn: function () { return this.value === 'intendToReturn' },
    isNeverResided: function () { return this.value === 'neverResided' }
  }
}
</script>

