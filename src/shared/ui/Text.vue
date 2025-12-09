<template>
  <component :is="tag" :class="textClass">
    <slot />
  </component>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  tag: {
    type: String,
    default: 'p',
    validator: value => ['p', 'span', 'div'].includes(value)
  },
  variant: {
    type: String,
    default: 'body',
    validator: value => ['body', 'subtitle', 'small'].includes(value)
  }
})

const textClass = computed(() => ({
  [`text--${props.variant}`]: true
}))
</script>

<style scoped lang="scss">
.text {
  font-family: $font-family-primary;
  margin: 0;
  padding: 0;
}

.text--body {
  font-size: $font-size-base;
  line-height: $line-height-normal;
  color: $color-neutral-gray-800;
}

.text--subtitle {
  font-size: $font-size-sm;
  font-weight: $font-weight-light;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: $color-neutral-gray-200;
}

.text--small {
  font-size: $font-size-sm;
  line-height: $line-height-normal;
  color: $color-neutral-gray-800;
}
</style>
