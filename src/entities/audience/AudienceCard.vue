<template>
  <div class="audience-card">
    <div class="audience-card__image-wrapper">
      <img
        :src="image"
        :alt="title"
        class="audience-card__image"
        loading="lazy"
        decoding="async"
        fetchpriority="low"
      />
    </div>
    <Heading :level="3" variant="default" class="audience-card__title">
      {{ title }}
    </Heading>
    <div class="audience-card__divider"></div>
    <Text variant="body" class="audience-card__description">
      {{ description }}
    </Text>
    <Text variant="small" class="audience-card__result">
      {{ result }}
    </Text>
  </div>
</template>

<script setup>
import Heading from '@shared/ui/Heading.vue'
import Text from '@shared/ui/Text.vue'

defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  result: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  }
})
</script>

<style scoped lang="scss">
// Styles moved to src/shared/styles/entities/_audience-card.scss
</style>
