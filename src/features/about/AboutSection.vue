<template>
  <section ref="aboutRef" class="about">
    <Container class="about__container">
      <div class="about__content">
        <div class="about__image-wrapper">
          <Image
            src="/model-from.png"
            alt="Об авторе"
            class="about__image"
            :width="500"
            :height="700"
          />
        </div>
        <div class="about__text-wrapper">
          <Heading variant="h2" class="about__title">ОБО МНЕ</Heading>
          <div class="about__description">
            <Text variant="body" class="about__paragraph">
              Я — ваш проводник в мир профессионального визажа. Моя миссия — раскрыть ваш потенциал
              и научить создавать красоту, которая вдохновляет.
            </Text>
            <ul class="about__list">
              <li class="about__list-item">
                <Text variant="body" class="about__list-item-text"
                  >10 лет опыта в индустрии красоты</Text
                >
              </li>
              <li class="about__list-item">
                <Text variant="body" class="about__list-item-text"
                  >Основатель студии премиум-класса</Text
                >
              </li>
              <li class="about__list-item">
                <Text variant="body" class="about__list-item-text"
                  >Более 5000 довольных клиентов</Text
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Container>
  </section>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'
import { onMounted, ref } from 'vue'

import { ScrollTrigger } from '@shared/libs/gsap/ScrollTrigger'
import { SplitText } from '@shared/libs/gsap/SplitText'
import Container from '@shared/ui/Container.vue'
import Heading from '@shared/ui/Heading.vue'
import Image from '@shared/ui/Image.vue'
import Text from '@shared/ui/Text.vue'

gsap.registerPlugin(SplitText, ScrollTrigger)

const aboutRef = ref<HTMLElement | null>(null)

onMounted(async () => {
  if (!aboutRef.value) return

  // Import CustomEase for premium easing
  const { CustomEase } = await import('@shared/libs/gsap/CustomEase')
  gsap.registerPlugin(CustomEase)

  const title = aboutRef.value.querySelector('.about__title')
  const paragraphs = aboutRef.value.querySelectorAll('.about__paragraph')
  const listItems = aboutRef.value.querySelectorAll('.about__list-item')
  const image = aboutRef.value.querySelector('.about__image')

  // 1. Image Fade In + Up
  if (image) {
    gsap.set(image, { opacity: 0, y: 50 })
  }

  // 2. Title SplitText Stagger
  if (title) {
    const split = new SplitText(title, { type: 'chars, lines' })
    // Initial state
    gsap.set(split.chars, { opacity: 0, y: 50 })
  }

  // 3. Paragraphs Reveal with SplitText
  if (paragraphs.length) {
    // const splitParagraphs = new SplitText(paragraphs, { type: 'lines' }) // SplitText might be too heavy/complex to sync blindly.
    // Let's stick to simple element animation for sync safety or ensure split happens.
    // Actually, splitting is fine, but we need to ensure useHeroAnimation finds the split elements.
    // For simplicity and robustness in this "portal" transition, let's just hide the paragraphs themselves.
    gsap.set(paragraphs, { opacity: 0, y: 20 })
  }

  // 4. List Items Reveal with SplitText
  if (listItems.length) {
    gsap.set(listItems, { opacity: 0, x: -20 })
  }
})

// Expose animation method if needed, or use ScrollTrigger inside
</script>

<style scoped lang="scss">
// Styles moved to src/shared/styles/features/_about.scss
</style>
