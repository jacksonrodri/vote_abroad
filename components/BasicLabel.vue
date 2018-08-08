<template>
  <label :for="fieldName" class="label">
    {{$t(`request.${fieldName}.label`)}}
    <a v-if="$te(`request.${fieldName}.tooltip`)" @click="$emit('toggleInfo')" class="button is-white is-small">
      <span>
        <b-icon
          type="is-info"
          icon="info-circle"></b-icon>
      </span>
    </a>
  </label>
</template>

<script>
export default {
  props: {
    fieldName: {
      type: String,
      required: true
    }
  }

}
</script>

<style>

</style>
