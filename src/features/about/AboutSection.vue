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

  // 1. Image Fade In + Up (Setup)
  if (image) {
    gsap.set(image, { opacity: 0, y: 50 })
  }

  // Helper for Fashion Reveal (Masked Lines)
  const setupReveal = (elements: Element | Element[] | NodeListOf<Element>) => {
    if (!elements) return
    const split = new SplitText(elements, { type: 'lines', linesClass: 'line-mask' })
    split.lines.forEach(line => {
      const content = line.innerHTML
      line.innerHTML = `<div class="line-inner" style="display: block; transform: translate(0, 100%); will-change: transform;">${content}</div>`
      line.style.overflow = 'hidden'
    })
    return split
  }

  // 2. Setup Title
  if (title) setupReveal(title)

  // 3. Setup Paragraphs
  if (paragraphs.length) setupReveal(paragraphs)

  // 4. Setup List Items (Treat as lines)
  if (listItems.length) {
    // List items are already "lines", just wrap content
    listItems.forEach(item => {
      const text = item.querySelector('.about__list-item-text')
      if (text) {
        const content = text.innerHTML
        text.innerHTML = `<div class="line-inner" style="display: block; transform: translate(0, 100%); will-change: transform;">${content}</div>`
        ;(text as HTMLElement).style.overflow = 'hidden'
        ;(text as HTMLElement).style.display = 'block'
      }
    })
  }
})

// Expose animation method if needed, or use ScrollTrigger inside
</script>

<style scoped lang="scss">
// Styles moved to src/shared/styles/features/_about.scss
</style>
