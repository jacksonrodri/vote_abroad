<template>
  <div class="field">
    <basic-label :fieldName="fieldName" @toggleInfo="toggleInfo"></basic-label>
    <b-field :type="fieldType" :message="fieldMessages">
      <b-input
        key="input"
        :ref="fieldName"
        :id="fieldName"
        :placeholder="$t(`request.${fieldName}.placeholder`)"
        :maxlength="6"
        :minlength="6"
        :loading="loading"
        @input="val => $emit('input', val)"
        @keyup.native.enter="$emit('pressEnter')"></b-input>
    </b-field>
  </div>
</template>

<script>
import fieldMixin from '~/mixins/fieldMixin.js'
export default {
  name: 'CodeInput',
  mixins: [fieldMixin],
  props: ['loading'],
  data () {
    return {
      code: ''
    }
  }
}
</script>

<style>

</style>
