<template>
  <div>
    <the-mask :mask="['### ### ##', 'XXX']" v-model="userInput" type="text" masked="false" placeholder="test your mask here"></the-mask>
  </div>
</template>

<script>
import {TheMask} from 'vue-the-mask'
export default {
  components: {TheMask},
  data () {
    return {
      userInput: '',
      emailChars: {
        E: {
          pattern: /[^\s]/
        }
      }
    }
  },
  computed: {
    maskArr () {
      return /@/.test(this.userInput) ? ['E'.repeat(65)] : ['### ### ###', 'E'.repeat(65)]
    }
  }
}
</script>

<style>

</style>
