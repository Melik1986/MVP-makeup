<template>
  <img
    :src="src"
    :alt="alt"
    :loading="loading"
    :decoding="decoding"
    :fetchpriority="fetchPriority"
    :class="imageClass"
    @load="handleLoad"
    @error="handleError"
  />
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    required: true
  },
  loading: {
    type: String,
    default: 'lazy',
    validator: value => ['lazy', 'eager'].includes(value)
  },
  decoding: {
    type: String,
    default: 'async',
    validator: value => ['async', 'sync', 'auto'].includes(value)
  },
  fetchPriority: {
    type: String,
    default: 'auto',
    validator: value => ['high', 'low', 'auto'].includes(value)
  },
  variant: {
    type: String,
    default: 'default'
  }
})

const isLoaded = ref(false)
const hasError = ref(false)

const imageClass = computed(() => ({
  [`image--${props.variant}`]: true,
  'image--loaded': isLoaded.value,
  'image--error': hasError.value
}))

const handleLoad = () => {
  isLoaded.value = true
}

const handleError = () => {
  hasError.value = true
}
</script>

<style scoped lang="scss">
.image {
  display: block;
  max-width: 100%;
  height: auto;
  transition: opacity 0.3s ease;

  &--error {
    opacity: 0.5;
  }
}
</style>
