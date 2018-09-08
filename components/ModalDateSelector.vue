<template>
  <form action="">
      <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
          <p class="modal-card-title">Which did you mean?</p>
        </header>
        <section class="modal-card-body">
          You typed <span class="is-italic">"{{ input }}"</span>. Which of the following did you mean?
          <b-field v-for="(date, i) in dateChoices" :key="i">
            <button @click.prevent="() => {$emit('selectDate', date); $parent.close()}" class="button is-primary is-fullwidth">
              {{ date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}
            </button>
          </b-field>
        </section>
        <footer class="modal-card-foot">
          <button class="button" type="button" @click.prevent="$emit('selectDate', null); $parent.close()">Cancel</button>
        </footer>
      </div>
    </form>
</template>

<script>
export default {
  props: ['dateChoices', 'input']
}
</script>
