<template>
  <div class="box">
    <h3 class="title is-4">Voter Todo List:</h3>
    <voter-todo v-for="stage in stages" :value="stage" :key="stage"></voter-todo>
  </div>
  <!-- <div class="columns">
    <div class="column is-8">
      <h1 class="title is-4">{{$t(`dashboard.${currentStage}.title`)}}</h1>
    </div>
    <div class="column is-4"></div>
  </div> -->
</template>

<script>
import VoterTodo from '~/components/VoterTodo'
export default {
  components: {
    VoterTodo
  },
  props: [
    'value'
  ],
  data () {
    return {
      stages: [
        'fill',
        'send',
        'receive',
        'vote'
      ]
    }
  },
  computed: {
    currentStageIndex: function () {
      return this.value && this.stages.indexOf(this.value) > -1 ? this.stages.indexOf(this.value) : 0
    },
    currentStage: function () {
      return this.stages[this.currentStageIndex]
    }
  },
  methods: {
    nextStage: function () {
      this.emit('update', this.stages[this.currentStageIndex + 1])
    },
    previousStage: function () {
      this.emit('update', this.stages[this.currentStageIndex + 1])
    }
  }
}
</script>

<style>

</style>
