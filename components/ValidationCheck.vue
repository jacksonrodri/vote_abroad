<template>
  <div class="is-clearfix">
    <b-collapse :open="false">
      <p class="is-size-6 box is-paddingless is-shadowless is-pulled-right" slot="trigger">Validations</p>
        <div class="box">
          <h3 class="subtitle is-6">{{ title }}</h3>
          <pre>
            {{ validationObj }}
          </pre>
        </div>
    </b-collapse>
  </div>
</template>

<script>
export default {
  props: [
    'title',
    'validationObj'
  ]
}
</script>
