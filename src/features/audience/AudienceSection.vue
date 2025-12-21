<template>
  <Section ref="sectionRef" padding="lg" background="white">
    <div class="audience-section">
      <div ref="headerRef" class="audience-section__header">
        <div class="u-overflow-hidden">
          <Heading :level="2" variant="section"> ДЛЯ КОГО ЭТОТ КУРС? </Heading>
        </div>
        <div class="u-overflow-hidden">
          <Text variant="subtitle" class="audience-section__subtitle">
            Техники + продвижение + психология
          </Text>
        </div>
      </div>

      <div class="audience-section__content">
        <div ref="decorLeftRef" class="audience-section__decorative-left">
          <img
            src="/decor/cosmetic-tube.png"
            alt="Косметика"
            class="audience-section__decoration"
            loading="lazy"
            decoding="async"
            fetchpriority="low"
          />
        </div>

        <div class="audience-section__cards">
          <AudienceCard
            v-for="(card, index) in audienceCards"
            :key="index"
            :ref="
              el => {
                if (el) cardRefs[index] = el
              }
            "
            :title="card.title"
            :description="card.description"
            :result="card.result"
            :image="card.image"
            class="audience-section__card"
          />
        </div>

        <div ref="decorRightRef" class="audience-section__decorative-right">
          <img
            src="/decor/makeup-brush.png"
            alt="Кисть"
            class="audience-section__decoration"
            loading="lazy"
            decoding="async"
            fetchpriority="low"
          />
        </div>
      </div>

      <div ref="ctaRef" class="audience-section__cta">
        <Button variant="primary" size="md" @click="emit('yes-click')"> Да, это про меня </Button>
        <Button variant="primary" size="lg" @click="emit('booking-click')">
          ЗАБРОНИРОВАТЬ МЕСТО
        </Button>
      </div>
    </div>
  </Section>
</template>

<script setup>
import { ref } from 'vue'

import AudienceCard from '@entities/audience/AudienceCard.vue'
import Button from '@shared/ui/Button.vue'
import Heading from '@shared/ui/Heading.vue'
import Section from '@shared/ui/Section.vue'
import Text from '@shared/ui/Text.vue'

import { useAudienceAnimation } from './composables/useAudienceAnimation'
import { audienceCards } from './config/audience'

const emit = defineEmits(['yes-click', 'booking-click'])

const sectionRef = ref(null)
const headerRef = ref(null)
const decorLeftRef = ref(null)
const decorRightRef = ref(null)
const cardRefs = ref([])
const ctaRef = ref(null)

useAudienceAnimation(sectionRef, headerRef, decorLeftRef, decorRightRef, cardRefs, ctaRef)
</script>

<style scoped lang="scss">
// Styles moved to src/shared/styles/features/_audience.scss
</style>
