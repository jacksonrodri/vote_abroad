<template>
  <section>
    <!-- county -->
    <b-autocomplete
      :data="data"
      v-model="icounty">
    </b-autocomplete>
  </section>
</template>

<script>
export default {
  props: [
    'value',
    'county',
    'address'
  ],
  data () {
    return {
      data: [],
      icounty: '',
      idivisions: []
    }
  }
}
</script>
