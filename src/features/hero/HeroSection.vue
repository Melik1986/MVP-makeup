<template>
  <section ref="heroRef" class="hero">
    <div class="hero__background">
      <div class="hero__gradient"></div>
    </div>

    <Container class="hero__container">
      <div class="hero__content">
        <!-- Info tags -->
        <div class="hero__tags">
          <div ref="startDateRef" class="hero__tag hero__tag--start">
            <div class="hero__tag-content">
              <Text variant="subtitle">Старт обучения</Text>
              <Text variant="body" tag="div" class="hero__tag-value">14 МАРТА</Text>
            </div>
          </div>
          <div ref="formatRef" class="hero__tag hero__tag--format">
            <div class="hero__tag-content">
              <Text variant="subtitle">Формат курса</Text>
              <Text variant="body" tag="div" class="hero__tag-value">ONLINE</Text>
            </div>
          </div>
        </div>

        <!-- Main headline -->
        <div class="hero__headline">
          <div ref="headlineTopRef" class="hero__headline-top">
            <div class="hero__headline-top-wrapper">
              <Text variant="subtitle">НАУЧИСЬ ВОСТРЕБОВАННОЙ ПРОФЕССИИ</Text>
            </div>
          </div>

          <div class="hero__title-block">
            <div ref="titleLeftRef" class="hero__title-left">
              <div class="hero__duration-wrapper">
                <Text variant="body" tag="div" class="hero__duration">за два месяца</Text>
              </div>
              <div class="hero__mentorship">
                <div ref="mentorshipRef" class="hero__mentorship-wrapper">
                  <Text variant="small">Легендарное закрытое наставничество от</Text>
                  <div ref="signatureRef" class="hero__signature">Ольга Павилина</div>
                </div>
              </div>
            </div>

            <div class="hero__title-center">
              <div ref="modelRef" class="hero__model">
                <div class="hero__model-container">
                  <img
                    ref="modelBackRef"
                    src="/model-behin.png"
                    alt="Модель сзади"
                    class="hero__model-image"
                    loading="eager"
                    decoding="async"
                    fetchpriority="high"
                  />
                  <img
                    ref="modelSideRef"
                    src="/model-from.png"
                    alt="Модель сбоку"
                    class="hero__model-image"
                    loading="eager"
                    decoding="async"
                    fetchpriority="high"
                  />
                  <img
                    ref="modelFrontRef"
                    src="/model-front.png"
                    alt="Модель спереди"
                    class="hero__model-image"
                    loading="eager"
                    decoding="async"
                    fetchpriority="high"
                  />
                </div>
              </div>

              <div ref="titleTextRef" class="hero__title-text">
                <div class="hero__title-row">
                  <div ref="charVRef" class="hero__title-char-container">
                    <span>В</span>
                  </div>
                  <div ref="charIRef" class="hero__title-char-container">
                    <span>И</span>
                  </div>
                  <div ref="charZRef" class="hero__title-char-container">
                    <span>З</span>
                  </div>
                  <div ref="charARef1" class="hero__title-char-container">
                    <span>А</span>
                  </div>
                  <div ref="charZhRef" class="hero__title-char-container">
                    <span>Ж</span>
                  </div>
                  <div ref="charIRef2" class="hero__title-char-container">
                    <span>И</span>
                  </div>
                  <div ref="charSRef" class="hero__title-char-container">
                    <span>С</span>
                  </div>
                  <div ref="charTRef" class="hero__title-char-container">
                    <span>Т</span>
                  </div>
                </div>
              </div>
            </div>

            <div ref="titleRightRef" class="hero__title-right">
              <div class="hero__level-wrapper">
                <Text variant="body" tag="div" class="hero__level">с нуля до профи</Text>
              </div>
              <div class="hero__earnings">
                <div ref="earningsRef" class="hero__earnings-wrapper">
                  <Text variant="small"
                    >Зарабатывай от 50000 руб уже через 2 месяца работая в своем удобном
                    графике</Text
                  >
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

import Button from '@shared/ui/Button.vue'
import Container from '@shared/ui/Container.vue'
import Text from '@shared/ui/Text.vue'

import { useHeroAnimation } from './composables/useHeroAnimation'

const emit = defineEmits(['booking-click'])

const heroRef = ref(null)
const startDateRef = ref(null)
const formatRef = ref(null)
const headlineTopRef = ref(null)
const titleLeftRef = ref(null)
const titleRightRef = ref(null)
const mentorshipRef = ref(null)
const earningsRef = ref(null)
const signatureRef = ref(null)
const modelRef = ref(null)
const modelBackRef = ref(null)
const modelSideRef = ref(null)
const modelFrontRef = ref(null)
const titleTextRef = ref(null)
const ctaRef = ref(null)
const charVRef = ref(null)
const charIRef = ref(null)
const charZRef = ref(null)
const charARef1 = ref(null)
const charZhRef = ref(null)
const charIRef2 = ref(null)
const charSRef = ref(null)
const charTRef = ref(null)

const handleBookingClick = () => {
  emit('booking-click')
}

onMounted(async () => {
  await nextTick()
  useHeroAnimation({
    heroRef,
    startDateRef,
    formatRef,
    headlineTopRef,
    titleLeftRef,
    titleRightRef,
    mentorshipRef,
    earningsRef,
    signatureRef,
    modelRef,
    modelBackRef,
    modelSideRef,
    modelFrontRef,
    titleTextRef,
    ctaRef,
    chars: {
      charVRef,
      charIRef,
      charZRef,
      charARef1,
      charZhRef,
      charIRef2,
      charSRef,
      charTRef
    }
  })
})
</script>

<style scoped lang="scss">
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding-top: 80px;
}

.hero__background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

.hero__gradient {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    180deg,
    $color-bg-hero-gradient-start 0%,
    $color-bg-hero-gradient-end 100%
  );
}

.hero__container {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
}

.hero__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 80px);
  position: relative;
  padding-bottom: 3rem;
}

.hero__tags {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: $container-max-width;
  padding: 0 $spacing-4;
  margin: 0 auto;

  @media (max-width: $breakpoint-md) {
    position: relative;
    flex-direction: column;
    gap: $spacing-2;
    margin-bottom: $spacing-4;
  }
}

.hero__tag {
  overflow: hidden;
  display: flex;
}

.hero__tag-content {
  display: flex;
  flex-direction: column;
  gap: $spacing-1;
}

.hero__tag-value {
  color: $color-neutral-white;
  font-weight: $font-weight-bold;
  font-size: $font-size-lg;
}

.hero__headline {
  width: 100%;
  text-align: center;
  margin: $spacing-8 0;
}

.hero__headline-top {
  margin-bottom: $spacing-4;
  overflow: hidden;
  display: flex;
}

.hero__headline-top-wrapper {
  overflow: hidden;
  display: flex;
}

.hero__duration-wrapper,
.hero__level-wrapper {
  overflow: hidden;
  display: flex;
}

.hero__title-block {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: $spacing-4;
  align-items: center;
  position: relative;

  @media (max-width: $breakpoint-lg) {
    grid-template-columns: 1fr;
    gap: $spacing-6;
  }

  @media (max-width: $breakpoint-md) {
    gap: $spacing-4;
  }
}

.hero__title-center {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero__model {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 400px;

  @media (max-width: $breakpoint-md) {
    max-width: 300px;
  }

  @media (max-width: $breakpoint-sm) {
    max-width: 250px;
  }
}

.hero__model-container {
  position: relative;
  width: 100%;
  height: auto;
  min-height: 400px;

  @media (max-width: $breakpoint-md) {
    min-height: 300px;
  }

  @media (max-width: $breakpoint-sm) {
    min-height: 250px;
  }
}

.hero__model-image {
  position: absolute;
  top: 0;
  width: 100%;
  height: auto;
  object-fit: contain;
  visibility: hidden;
}

.hero__title-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  white-space: nowrap;
}

.hero__title-row {
  display: inline-flex;
  gap: 0;
}

.hero__title-char-container {
  overflow: hidden;
  display: inline-block;
}

.hero__title-char {
  font-size: $font-size-hero;
  font-weight: $font-weight-light;
  line-height: $line-height-tight;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: $color-neutral-white;
  opacity: 0.9;
  text-shadow: $shadow-text-hero;
  display: inline-block;
  transform: translate3d(0, 0, 0);

  @media (max-width: $breakpoint-lg) {
    font-size: 80px;
  }

  @media (max-width: $breakpoint-md) {
    font-size: 48px;
  }

  @media (max-width: $breakpoint-sm) {
    font-size: 36px;
  }
}

.hero__title-char-container span {
  display: inline-block;
  transform: translate3d(0, 0, 0);
  font-size: $font-size-hero;
  font-weight: $font-weight-light;
  line-height: $line-height-tight;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: $color-neutral-white;
  opacity: 0.9;
  text-shadow: $shadow-text-hero;

  @media (max-width: $breakpoint-lg) {
    font-size: 80px;
  }

  @media (max-width: $breakpoint-md) {
    font-size: 48px;
  }

  @media (max-width: $breakpoint-sm) {
    font-size: 36px;
  }
}

.hero__title-left,
.hero__title-right {
  display: flex;
  flex-direction: column;
  gap: $spacing-3;
  text-align: center;

  @media (max-width: $breakpoint-lg) {
    text-align: center;
  }
}

.hero__duration,
.hero__level {
  color: $color-neutral-white;
  font-weight: $font-weight-bold;
  font-size: $font-size-xl;
}

.hero__mentorship,
.hero__earnings {
  max-width: 250px;
  margin: 0 auto;
  overflow: visible;
  display: flex;

  @media (max-width: $breakpoint-lg) {
    max-width: 100%;
  }
}

.hero__mentorship-wrapper,
.hero__earnings-wrapper {
  color: $color-neutral-white;
  opacity: 0.9;
  display: flex;
  flex-direction: column;
}

.hero__signature {
  font-family: $font-family-script;
  font-size: $font-size-2xl;
  color: $color-neutral-white;
  opacity: 0.8;
  transform: rotate(-15deg);
  margin-top: $spacing-2;
}

.hero__cta {
  margin-top: $spacing-8;
  z-index: 3;
}
</style>
