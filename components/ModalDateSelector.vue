<template>
  <form action="">
      <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
          <p class="modal-card-title">{{$t('request.dob.disambiguationTitle')}}</p>
        </header>
        <section class="modal-card-body">
          <i18n tag="span" path="request.dob.disambiguationMessage">
            <span class="is-italic">"{{ input }}"</span>
          </i18n>
          <!-- You typed <span class="is-italic">"{{ input }}"</span>. Which of the following did you mean? -->
          <b-field v-for="(date, i) in dateChoices" :key="i">
            <a @click="() => {$emit('selectDate', date); $parent.close()}" class="button is-primary is-fullwidth">
              {{ date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric'}) }}
            </a>
          </b-field>
        </section>
        <footer class="modal-card-foot">
          <a class="button" type="button" @click="$emit('selectDate', null); $parent.close()">{{$t('request.dob.cancel')}}</a>
        </footer>
      </div>
    </form>
</template>

<script>
export default {
  props: ['dateChoices', 'input']
}
</script>
