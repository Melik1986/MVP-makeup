<template>
  <div class="text-reveal">
    <div 
      v-for="(word, index) in words" 
      :key="index" 
      class="text-reveal__mask"
    >
      <span class="text-reveal__word" :class="wordClass">
        {{ word }}&nbsp;
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  wordClass: {
    type: String,
    default: ''
  }
})

const words = computed(() => {
  return props.text ? props.text.split(' ') : []
})
</script>

<style scoped lang="scss">
.text-reveal {
  display: flex;
  flex-wrap: wrap;
  
  &__mask {
    overflow: hidden;
    padding-bottom: 0.1em;
    margin-bottom: -0.1em;
  }

  &__word {
    display: inline-block;
    will-change: transform;
    transform: translateY(110%); /* Default hidden state for reveal */
  }
}
</style>
