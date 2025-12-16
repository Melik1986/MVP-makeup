<template>
  <section :class="sectionClass">
    <Container :size="containerSize">
      <slot />
    </Container>
  </section>
</template>

<script setup>
import { computed } from 'vue'

import Container from './Container.vue'

const props = defineProps({
  padding: {
    type: String,
    default: 'default',
    validator: value => ['none', 'sm', 'default', 'lg'].includes(value)
  },
  background: {
    type: String,
    default: 'white',
    validator: value => ['white', 'gray', 'transparent'].includes(value)
  },
  containerSize: {
    type: String,
    default: 'default'
  }
})

const sectionClass = computed(() => ({
  [`section--padding-${props.padding}`]: true,
  [`section--bg-${props.background}`]: true
}))
</script>

<style scoped lang="scss">
.section {
  width: 100%;
}

.section--padding-none {
  padding: 0;
  padding-top: $spacing-4;
}

.section--padding-sm {
  @include responsive-padding($spacing-6 0, $spacing-4 0, $spacing-6 0);
}

.section--padding-default {
  @include responsive-padding($spacing-4 0, $spacing-6 0, $spacing-8 0);
}

.section--padding-lg {
  @include section-spacing;
}

.section--bg-white {
  background-color: $color-bg-surface;
}

.section--bg-gray {
  background-color: $color-neutral-gray-50;
}

.section--bg-transparent {
  background-color: transparent;
}
</style>
