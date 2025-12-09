<template>
  <div class="container" :class="containerClass">
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'default',
    validator: value => ['default', 'full'].includes(value)
  }
})

const containerClass = computed(() => ({
  'container--full': props.size === 'full'
}))
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  max-width: $container-max-width;
  margin: 0 auto;
  padding: 0 $spacing-4;

  @media (max-width: $breakpoint-md) {
    padding: 0 $spacing-2;
  }
}

.container--full {
  max-width: 100%;
}
</style>
