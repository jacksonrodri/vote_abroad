<template>
  <div>
      <b-field label="Are you a civilian or military voter?">
        <b-field grouped group-multiline>
          <p class="control">
            <button @click="setVal('civilianType')" :class="[baseClass, {'is-success': isCivilianType}]">
              <span v-show="isCivilianType" class="icon is-small">
                <i class="fas fa-check"></i>
              </span>
              <span>
                Civilian
              </span>
            </button>
          </p>
          <p class="control">
            <button @click="setVal('militaryType')" :class="[baseClass, {'is-success': isMilitaryType}]">
              <span v-show="isMilitaryType" class="icon is-small">
                <i class="fas fa-check"></i>
              </span>
              <span>
                Military
              </span>
            </button>
          </p>
        </b-field>
      </b-field>

      <br/>

      <div class="field">
        <span class="is-flex">
          <label class="label">
            {{ isMilitaryType ? 'What type of military voter are you?' : 'Are you abroad temporarily or indefinitely?' }}
          </label>
          <span @click="isOpen = !isOpen" class="icon has-text-info" style="cursor: pointer;">
            <i class="fas fa-info-circle"></i>
          </span>
        </span>
      <!-- <b-field disabled :label="isMilitaryType ? 'What type of military voter are you?' : 'Which best describes you?'"> -->
        <b-field grouped group-multiline>
          <p class="control" v-show="isMilitaryType">
            <button @click="setVal('military')" :class="[baseClass, {'is-success': isMilitary}]">
              <span v-show="isMilitary" class="icon is-small">
                <i class="fas fa-check"></i>
              </span>
              <span>
                Active Duty Military
              </span>
            </button>
          </p>
          <p class="control" v-show="isMilitaryType">
            <button @click="setVal('milSpouse')" :class="[baseClass, {'is-success': isMilSpouse}]">
              <span v-show="isMilSpouse" class="icon is-small">
                <i class="fas fa-check"></i>
              </span>
              <span>
                Eligible Military Spouse or Dependent
              </span>
            </button>
          </p>
          <p class="control" v-show="isMilitaryType">
            <button @click="setVal('natGuard')" :class="[baseClass, {'is-success': isNatGuard}]">
              <span v-show="isNatGuard" class="icon is-small">
                <i class="fas fa-check"></i>
              </span>
              <span>
                National Guard
              </span>
            </button>
          </p>
          <p class="control" v-show="!isMilitaryType">
            <button @click="setVal('uncertainReturn')" :class="[baseClass, {'is-success': isUncertainReturn}]">
              <span v-show="isUncertainReturn" class="icon is-small">
                <i class="fas fa-check"></i>
              </span>
              <span>
                My Return is Uncertain
              </span>
            </button>
          </p>
          <p class="control" v-show="!isMilitaryType">
            <button @click="setVal('intendToReturn')" :class="[baseClass, {'is-success': isIntendToReturn}]">
              <span v-show="isIntendToReturn" class="icon is-small">
                <i class="fas fa-check"></i>
              </span>
              <span>
                I Intend to Return
              </span>
            </button>
          </p>
          <p class="control" v-show="!isMilitaryType">
            <button @click="setVal('neverResided')" :class="[baseClass, {'is-success': isNeverResided}]">
              <span v-show="isNeverResided" class="icon is-small">
                <i class="fas fa-check"></i>
              </span>
              <span>
                Never Resided
              </span>
            </button>
          </p>
        </b-field>
        <b-message :title="toolTipTitle" type="is-info" has-icon :active.sync="isOpen">
          <slot name="tooltip"></slot>
        </b-message>
      </div>
    <!-- </section> -->
  </div>
</template>

<script>
export default {
  name: 'Voter-Class',
  props: [
    'label',
    'value',
    'toolTipTitle'
  ],
  data () {
    return {
      milOrCiv: '',
      baseClass: {
        'is-medium': true,
        'is-outlined': true,
        button: true
      },
      isOpen: false
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

