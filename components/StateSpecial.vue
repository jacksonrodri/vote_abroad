<template>
  <div><br/>
  <!-- AK -->
    <div v-if="state === 'AK'">
      <span class="is-flex"><label class="label">{{ label }}</label><span @click="isOpen = !isOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span></span>
      <b-message title="Why am I being asked this?" type="is-info" has-icon :active.sync="isOpen">
        Only Alaska voters need to answer this question as per state law.
      </b-message>
      Alaska requires that you provide proof of Alaska residency.
      <b-field label="What proof will you provide? (You must also attach a photocopy with your submission)">
        <b-input  @input="setVal(val)"></b-input>
      </b-field>
      <div v-if="isFWAB">
        one witness Signature
      </div>
    </div>
  <!-- AZ -->
    <div v-if="state === 'AZ' && isRegistering">
      <span class="is-flex"><label class="label">{{ label }}</label><span @click="isOpen = !isOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span></span>
      <b-message title="Why am I being asked this?" type="is-info" has-icon :active.sync="isOpen">
        Only Arizona voters need to answer this question as per state law.
      </b-message>
      If you are using this form to register to vote, you must provide proof of citizenship.
      <b-field label="What proof will you provide? (You must also attach a photocopy with your submission)">
        <b-input  @input="setVal(val)"></b-input>
      </b-field>
    </div>
  <!-- OK -->
    <div v-if="state === 'OK' && isIndNoParty">
      <span class="is-flex"><label class="label">{{ label }}</label><span @click="isOpen = !isOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span></span>
      <b-message title="Why am I being asked this?" type="is-info" has-icon :active.sync="isOpen">
        Only Oklahoma voters need to answer this question as per state law.
      </b-message>
      If your political party affiliation is listed as Independent/No Party, you may be able to request a ballot for a recognized political party's primary election. For specific information about recognized political parties in Oklahoma, please visit [http://www.elections.ok.gov](http://www.elections.ok.gov).
      <b-field label="Which Party Primary ballot are you requesting">
        <b-input @input="setVal(val)"></b-input>
      </b-field>
    </div>
  <!-- PR -->
    <div v-if="state === 'PR'">
      <span class="is-flex"><label class="label">{{ label }}</label><span @click="isOpen = !isOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span></span>
      <b-message title="Why am I being asked this?" type="is-info" has-icon :active.sync="isOpen">
        Only Puerto Rico voters need to answer this question as per territory law.
      </b-message>
      Puerto Rico requires that you provide your father's and mother's first names.
      <b-field>
        <b-input @input="val => setVal(val)" label="Father's and Mother's first names"></b-input>
      </b-field>
    </div>
  <!-- SC -->
    <div v-if="state === 'SC'">
      <span class="is-flex"><label class="label">{{ label }}</label><span @click="isOpen = !isOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span></span>
      <b-message title="Why am I being asked this?" type="is-info" has-icon :active.sync="isOpen">
        Only South Carolina voters need to answer this question as per state law.
      </b-message>
      **You must provide your race.** <br> **You must provide your previous location of registration, if in another state.**
      <b-field label="Race">
        <b-input v-model="scRace" @input="setVal(scVal)"></b-input>
      </b-field>
      <b-field label="Your previous state of registration (if any)">
        <b-input v-model="scPrev" @input="setVal(scVal)"></b-input>
      </b-field>
    </div>
  <!-- VA -->
    <div v-if="state === 'VA' && isReturnUncertain">
      <span class="is-flex"><label class="label">{{ label }}</label><span @click="isOpen = !isOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span></span>
      <b-message title="Why am I being asked this?" type="is-info" has-icon :active.sync="isOpen">
        Only Virginia voters need to answer this question as per state law.
      </b-message>
      **Overseas citizens whose return is not certain: Provide the name of your employer or the name of your spouse's or parent/guardian's employer. If you do not provide this, you will receive a ballot for federal offices only.**
      <b-field label="Name of your employer or the name of your spouse's or parent's employer">
        <b-input  @input="setVal(val)"></b-input>
      </b-field>
    </div>
  <!-- VT -->
    <div v-if="state === 'VT'  && isRegistering">
      <span class="is-flex"><label class="label">{{ label }}</label><span @click="isOpen = !isOpen" class="icon has-text-info" style="cursor: pointer;"><i class="fas fa-info-circle"></i></span></span>
      <b-message title="Why am I being asked this?" type="is-info" has-icon :active.sync="isOpen">
        Only Vermont voters need to answer this question as per state law.
      </b-message>
      **If you have never registered before in Vermont, you must take a self-administered oath or it may be administered by anyone over the age of 18. The Vermont voter's oath is:** <br> *"You solemnly swear (or affirm) that whenever you give your vote or suffrage, touching any matter that concerns the State of Vermont, you will do it so as in your conscience you shall judge will most conduce to the best good of the same, as established by the Constitution, without fear or favor of any person."* <br> Once you have read the Voter's Oath, use the space provided in Section 6 to write the following: *
      <b-field label="I swear or affirm that I have taken the VT Voter's Oath.">
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
