<template>
  <component :is="tag" :class="headingClass">
    <slot />
  </component>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  level: {
    type: Number,
    default: 1,
    validator: value => [1, 2, 3, 4, 5, 6].includes(value)
  },
  variant: {
    type: String,
    default: 'default',
    validator: value => ['default', 'hero', 'section'].includes(value)
  }
})

const tag = computed(() => `h${props.level}`)

const headingClass = computed(() => ({
  [`heading--${props.variant}`]: true
}))
</script>

<style scoped lang="scss">
.heading {
  font-family: $font-family-primary;
  margin: 0;
  padding: 0;
}

.heading--hero {
  font-size: $font-size-hero;
  font-weight: $font-weight-light;
  line-height: $line-height-tight;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: $color-neutral-white;
  opacity: 0.9;
  text-shadow: $shadow-text-hero;
  word-break: break-word;

  @media (max-width: $breakpoint-lg) {
    font-size: 80px;
  }

  @media (max-width: $breakpoint-md) {
    font-size: 48px;
  }

  @media (max-width: $breakpoint-sm) {
    font-size: 32px;
    letter-spacing: 0.03em;
  }
}

.heading--section {
  font-size: $font-size-2xl;
  font-weight: $font-weight-regular;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: $color-neutral-gray-800;
  text-align: center;
  margin-bottom: $spacing-4;

  @media (max-width: $breakpoint-md) {
    font-size: $font-size-xl;
  }
}

.heading--default {
  font-size: $font-size-2xl;
  font-weight: $font-weight-bold;
  line-height: $line-height-tight;
  color: $color-neutral-gray-800;
}
</style>
