<template>
  <div class="field">
    <basic-label
      :label="label"
      :fieldName="fieldName"
      @toggleInfo="toggleInfo"></basic-label>
    <b-field :type="fieldType" :message="fieldMessages">
      <b-input
        key="input"
        icon="lock"
        :ref="fieldName"
        :id="fieldName"
        :placeholder="loading ? 'sending code' : $t(`request.${fieldName}.placeholder`)"
        :maxlength="6"
        :minlength="6"
        size="is-medium"
        max=999999
        pattern="[0-9]{6}"
        type="tel"
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
  },
  computed: {
    email () { return this.$store.state.userauth.user.emailAddress || '' },
    phone () { return this.$store.state.userauth.user.mobileIntFormat || '' },
    label () { return this.phone ? this.$t(`request.codeInput.label-sms`, {phone: this.phone}) : this.$t(`request.codeInput.label-email`, {email: this.email}) }
  }
}
</script>

<style>

</style>
