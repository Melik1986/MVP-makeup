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
.audience-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  background: transparent;
}

.audience-card__image-wrapper {
  width: 120px;
  height: 120px;
  margin-bottom: $spacing-3;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: $shadow-floating-object;
}

.audience-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.audience-card__title {
  font-size: $font-size-base;
  font-weight: $font-weight-bold;
  margin-bottom: $spacing-2;
  text-transform: uppercase;
  color: $color-neutral-gray-800;
}

.audience-card__divider {
  height: 1px;
  width: 40px;
  background: $color-neutral-gray-800;
  margin: $spacing-2 0;
}

.audience-card__description {
  margin-bottom: $spacing-3;
  color: $color-neutral-gray-800;
}

.audience-card__result {
  color: $color-neutral-gray-800;
  font-weight: $font-weight-medium;
}
</style>
