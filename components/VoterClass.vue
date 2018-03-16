<template>
  <div class="field">
      <b-field :label="$t('request.voterClass.civilianOrMilitary')"
        type='is-danger'
        :message="!isCivilianType && !isMilitaryType  && validations.$error ? $t(`request.voterClass.messages.typeRequired`) : ''">
        <b-field grouped group-multiline>
          <p class="control">
            <button @click="setVal('civilianType')" :class="[baseClass, {'is-success': isCivilianType}]">
              <span v-show="isCivilianType" class="icon is-small">
                <i class="fas fa-check"></i>
              </span>
              <span>
                {{$t('request.voterClass.civilianType')}}
              </span>
            </button>
          </p>
          <p class="control">
            <button @click="setVal('militaryType')" :class="[baseClass, {'is-success': isMilitaryType}]">
              <span v-show="isMilitaryType" class="icon is-small">
                <i class="fas fa-check"></i>
              </span>
              <span>
                {{$t('request.voterClass.militaryType')}}
              </span>
            </button>
          </p>
        </b-field>
      </b-field>

      <div class="field">
        <span class="is-flex">
          <label class="label">
            {{ isMilitaryType ? $t('request.voterClass.whatMilType') : $t('request.voterClass.whatCivType') }}
          </label>
          <span @click="isOpen = !isOpen" class="icon has-text-info" style="cursor: pointer;">
            <i class="fas fa-info-circle"></i>
          </span>
        </span>
        <p v-if="isCivilianType  && validations.$error" class="help is-danger">{{ $t(`request.voterClass.messages.civilianRequired`) }}</p>
        <p v-if="isMilitaryType  && validations.$error" class="help is-danger">{{ $t(`request.voterClass.messages.militaryRequired`) }}</p>
      <!-- <b-field disabled :label="isMilitaryType ? 'What type of military voter are you?' : 'Which best describes you?'"> -->
        <b-field grouped group-multiline>
          <p class="control" v-show="isMilitaryType">
            <button @click="setVal('military')" :class="[baseClass, {'is-success': isMilitary}]">
              <span v-show="isMilitary" class="icon is-small">
                <i class="fas fa-check"></i>
              </span>
              <span>
                {{$t('request.voterClass.military')}}
              </span>
            </button>
          </p>
          <p class="control" v-show="isMilitaryType">
            <button @click="setVal('milSpouse')" :class="[baseClass, {'is-success': isMilSpouse}]">
              <span v-show="isMilSpouse" class="icon is-small">
                <i class="fas fa-check"></i>
              </span>
              <span>
                {{$t('request.voterClass.milSpouse')}}
              </span>
            </button>
          </p>
          <p class="control" v-show="isMilitaryType">
            <button @click="setVal('natGuard')" :class="[baseClass, {'is-success': isNatGuard}]">
              <span v-show="isNatGuard" class="icon is-small">
                <i class="fas fa-check"></i>
              </span>
              <span>
                {{$t('request.voterClass.natGuard')}}
              </span>
            </button>
          </p>
          <p class="control" v-show="!isMilitaryType">
            <button @click="setVal('uncertainReturn')" :class="[baseClass, {'is-success': isUncertainReturn}]">
              <span v-show="isUncertainReturn" class="icon is-small">
                <i class="fas fa-check"></i>
              </span>
              <span>
                {{$t('request.voterClass.uncertainReturn')}}
              </span>
            </button>
          </p>
          <p class="control" v-show="!isMilitaryType">
            <button @click="setVal('intendToReturn')" :class="[baseClass, {'is-success': isIntendToReturn}]">
              <span v-show="isIntendToReturn" class="icon is-small">
                <i class="fas fa-check"></i>
              </span>
              <span>
                {{$t('request.voterClass.intendToReturn')}}
              </span>
            </button>
          </p>
          <p class="control" v-show="!isMilitaryType" v-if="allowsNeverResided">
            <button @click="setVal('neverResided')" :class="[baseClass, {'is-success': isNeverResided}]">
              <span v-show="isNeverResided" class="icon is-small">
                <i class="fas fa-check"></i>
              </span>
              <span>
                {{$t('request.voterClass.neverResided')}}
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
    'toolTipTitle',
    'allowsNeverResided',
    'validations'
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
    isNeverResided: function () {
      return this.allowsNeverResided ? this.value === 'neverResided' : ''
    }
  }
}
</script>

