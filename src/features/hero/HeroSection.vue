<template>
  <section ref="heroRef" class="hero">
    <div class="hero__background">
      <div class="hero__gradient"></div>
    </div>
    <div class="hero__bokeh" aria-hidden="true"></div>

    <Container class="hero__container">
      <div class="hero__content">
        <!-- Info tags -->
        <div class="hero__tags">
          <div class="hero__tag hero__tag--start">
            <div class="hero__tag-content">
              <Text variant="subtitle">Старт обучения</Text>
              <Text variant="body" tag="div" class="hero__tag-value">14 МАРТА</Text>
            </div>
          </div>
          <div class="hero__tag hero__tag--format">
            <div class="hero__tag-content">
              <Text variant="subtitle">Формат курса</Text>
              <Text variant="body" tag="div" class="hero__tag-value">ONLINE</Text>
            </div>
          </div>
        </div>

        <!-- Main headline -->
        <div class="hero__headline">
          <div class="hero__headline-top">
            <div class="hero__headline-top-wrapper">
              <Text variant="subtitle">НАУЧИСЬ ВОСТРЕБОВАННОЙ ПРОФЕССИИ</Text>
            </div>
          </div>

          <div class="hero__title-block">
            <div class="hero__title-left">
              <div class="hero__duration-wrapper">
                <Text variant="body" tag="div" class="hero__duration">за два месяца</Text>
              </div>
              <div class="hero__mentorship">
                <div class="hero__mentorship-wrapper">
                  <TextReveal
                    text="Легендарное закрытое наставничество от"
                    word-class="hero__text-small"
                  />
                  <!-- eslint-disable-next-line vue/no-v-html -->
                  <div class="hero__signature" v-html="signatureSvg"></div>
                </div>
              </div>
            </div>

            <div class="hero__title-center">
              <div class="hero__model">
                <div class="hero__model-container">
                  <img
                    src="/models/model-behin.png"
                    alt="Модель сзади"
                    class="hero__model-image hero__model-back"
                    loading="eager"
                    decoding="async"
                    fetchpriority="high"
                  />
                  <img
                    src="/models/model-from.png"
                    alt="Модель сбоку"
                    class="hero__model-image hero__model-side"
                    loading="eager"
                    decoding="async"
                    fetchpriority="high"
                  />
                  <img
                    src="/models/model-front.png"
                    alt="Модель спереди"
                    class="hero__model-image hero__model-front"
                    loading="eager"
                    decoding="async"
                    fetchpriority="high"
                  />
                </div>
              </div>

              <div class="hero__title-text">
                <Heading :level="1" variant="hero" class="hero__title-row">
                  <div class="hero__title-char-container hero__char--v">
                    <span>В</span>
                  </div>
                  <div class="hero__title-char-container hero__char--i">
                    <span>И</span>
                  </div>
                  <div class="hero__title-char-container hero__char--z">
                    <span>З</span>
                  </div>
                  <div class="hero__title-char-container hero__char--a1">
                    <span>А</span>
                  </div>
                  <div class="hero__title-char-container hero__char--zh">
                    <span>Ж</span>
                  </div>
                  <div class="hero__title-char-container hero__char--i2">
                    <span>И</span>
                  </div>
                  <div class="hero__title-char-container hero__char--s">
                    <span>С</span>
                  </div>
                  <div class="hero__title-char-container hero__char--t">
                    <span>Т</span>
                  </div>
                </Heading>
              </div>
            </div>

            <div class="hero__title-right">
              <div class="hero__level-wrapper">
                <Text variant="body" tag="div" class="hero__level">с нуля до профи</Text>
              </div>
              <div class="hero__earnings">
                <div class="hero__earnings-wrapper">
                  <TextReveal
                    text="Зарабатывай от 50000 руб уже через 2 месяца работая в своем удобном графике"
                    word-class="hero__text-small"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- CTA Button -->
        <div ref="ctaRef" class="hero__cta">
          <Button variant="primary" size="lg" @click="handleBookingClick">
            ЗАБРОНИРОВАТЬ МЕСТО
          </Button>
        </div>
      </div>
    </Container>
  </section>
</template>

<script setup>
import { nextTick, onMounted, ref } from 'vue'

import signatureSvg from '@shared/assets/icons/Olga_Pavilina.svg?raw'
import { useMagnetic } from '@shared/composables/useMagnetic'
import TextReveal from '@shared/ui/animation/TextReveal.vue'
import Button from '@shared/ui/Button.vue'
import Container from '@shared/ui/Container.vue'
import Heading from '@shared/ui/Heading.vue'
import Text from '@shared/ui/Text.vue'

import { useHeroAnimation } from './composables/useHeroAnimation'

const heroRef = ref(null)
const ctaRef = ref(null)
const { initAnimation, injectHeroPortal } = useHeroAnimation(heroRef)

useMagnetic(ctaRef)

const emit = defineEmits(['booking-click'])

const handleBookingClick = () => {
  emit('booking-click')
}

defineExpose({
  initAnimation,
  injectHeroPortal
})

onMounted(async () => {
  await nextTick()
})
</script>

<style scoped lang="scss">
// Styles moved to src/shared/styles/features/_hero.scss
</style>
