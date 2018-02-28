<template>
<div class="field">
  <label class="label">Would you like to become a member of Democrats Abroad?</label>
  <div class="field">
    <b-checkbox id="joinDA" v-model="thisValue" ref="joinDA">Join Democrats Abroad</b-checkbox>
  </div>
</div>

</template>

<script>
export default {
  props: ['value'],
  computed: {
    thisValue: {
      get () { return this.value },
      set () {
        console.log(this.$refs.joinDA)
        this.$emit('input', this.$refs.joinDA.newValue)
      }
    }
  }
  // methods: {
  //   updateVal () {
  //     this.$emit('input', +this.$refs.joinDA['native-value'])
  //   }
  // }
}
</script>
